"use client";

//todo 全新版本的评论区代码

import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  Input,
  Button,
  Avatar,
  Divider,
  Space,
  Pagination,
  message,
  Select,
  Modal,
} from "antd";
import {
  listCommentVoByPageUsingPost,
  addCommentUsingPost,
  deleteCommentUsingPost,
  getCommentVoByIdUsingGet,
} from "@/api/commentController";
import { useSelector } from "react-redux";
import { RootState } from "@/stores";
import { addMessageUsingPost } from "@/api/messageController";
import { getUserVoByIdUsingGet } from "@/api/userController";
import { getQuestionVoByIdUsingGet } from "@/api/questionController";

const { TextArea } = Input;

const CommentSection = ({ qId }) => {
  const questionId = parseInt(qId || "1"); // 默认 `qId` 为 1，避免未传值时报错
  const [comments, setComments] = useState([]); // 评论数据
  const [newComment, setNewComment] = useState(""); // 新评论内容
  const [currentPage, setCurrentPage] = useState(1); // 当前页码
  const [totalComments, setTotalComments] = useState(0); // 评论总数
  const [sortOrder, setSortOrder] = useState("ascend"); // 排序方式
  const pageSize = 10; // 每页评论数
  const commentEndRef = useRef(null); // 用于滚动到最后一条评论
  const [replyModalVisible, setReplyModalVisible] = useState(false); // 控制弹窗显示
  const [replyContent, setReplyContent] = useState(""); // 回复内容
  const [replyTo, setReplyTo] = useState(null); // 当前正在回复的评论 ID

  // 通过 `useState` 钩子为每条评论管理展开状态
  const [isParentCommentExpanded, setParentCommentExpanded] = useState(false);
  const [isCommentExpanded, setCommentExpanded] = useState(false);

  const loginUser = useSelector((state: RootState) => state.loginUser); // 当前登录用户

  // console.log(loginUser);

  // 加载评论数据
  // const fetchComments = async (page = 1, order = "ascend") => {
  //   try {
  //     const response = await listCommentVoByPageUsingPost({
  //       questionId,
  //       current: page,
  //       pageSize,
  //       sortField: "createTime",
  //       sortOrder: order,
  //     });
  //
  //     if (response.code === 0) {
  //       setComments(response.data.records);
  //       setTotalComments(response.data.total);
  //     } else {
  //       message.error(response.message || "加载评论失败");
  //     }
  //   } catch (error) {
  //     message.error("加载评论失败");
  //   }
  // };

  //拼接了user的
  // 加载评论数据
  // const fetchComments = async (page = 1, order = "ascend") => {
  //   try {
  //     // 获取评论数据
  //     const response = await listCommentVoByPageUsingPost({
  //       questionId,
  //       current: page,
  //       pageSize,
  //       sortField: "createTime",
  //       sortOrder: order,
  //     });
  //
  //     if (response.code === 0) {
  //       // 获取评论的记录
  //       const comments = response.data.records;
  //
  //       // 遍历评论数据，加载用户信息并拼接到评论对象中
  //       const enrichedComments = await Promise.all(
  //           comments.map(async (comment: any) => {
  //             try {
  //               // 根据用户ID获取用户信息
  //               const userResponse = await getUserVoByIdUsingGet({ id: comment.userId });
  //               if (userResponse.code === 0) {
  //                 // 将用户数据拼接到评论对象
  //                 return { ...comment, user: userResponse.data };
  //               }
  //             } catch (error) {
  //               console.error("获取用户信息失败", error);
  //             }
  //             return comment; // 如果用户信息加载失败，则返回原始评论
  //           })
  //       );
  //
  //       // console.log(enrichedComments);
  //
  //       // 设置评论和总数
  //       setComments(enrichedComments);
  //       setTotalComments(response.data.total);
  //     } else {
  //       message.error(response.message || "加载评论失败");
  //     }
  //   } catch (error) {
  //     message.error("加载评论失败");
  //   }
  // };

  //继续拼接！加上父评论和发布者

  // 加载评论数据
  const fetchComments = async (page = 1, order = "ascend") => {
    try {
      // 获取评论数据
      const response = await listCommentVoByPageUsingPost({
        questionId,
        current: page,
        pageSize,
        sortField: "createTime",
        sortOrder: order,
      });

      if (response.code === 0) {
        // 获取评论的记录
        const comments = response.data.records;

        // 遍历评论数据，加载父评论和用户信息并拼接到评论对象中
        const enrichedComments = await Promise.all(
          comments.map(async (comment: any) => {
            let enrichedComment = { ...comment }; // 初始化当前评论对象

            // 根据当前评论的 userId 获取用户信息 这里提前一点
            const userResponse = await getUserVoByIdUsingGet({
              id: comment.userId,
            });
            if (userResponse.code === 0) {
              enrichedComment.user = userResponse.data;
            }

            try {
              // 如果有 parentId，则获取父评论信息

              //问题出在有pid的这些
              if (comment.parentId) {
                const parentCommentResponse = await getCommentVoByIdUsingGet({
                  id: comment.parentId,
                });

                // console.log(parentCommentResponse);

                if (parentCommentResponse.code === 0) {
                  enrichedComment.parentComment = parentCommentResponse.data;

                  // 根据父评论的 userId 获取父评论的发布者信息
                  const parentUserResponse = await getUserVoByIdUsingGet({
                    id: parentCommentResponse.data.userId,
                  });
                  if (parentUserResponse.code === 0) {
                    enrichedComment.parentUser = parentUserResponse.data;
                  } else {
                    enrichedComment.parentUser = null; // 父评论的用户信息为空
                  }
                } else {
                  enrichedComment.parentComment = null; // 父评论不存在
                  enrichedComment.parentUser = null;
                }

                //相当于原来只有if没有else 现在有了。。。
              }
            } catch (error) {
              console.error(
                "加载评论附加信息失败 可能原评论已删除或原用户已注销",
                error,
              );
            }

            return enrichedComment;
          }),
        );

        console.log(enrichedComments);
        // 设置评论和总数
        setComments(enrichedComments);
        setTotalComments(response.data.total);
      } else {
        message.error(response.message || "加载评论失败");
      }
    } catch (error) {
      message.error("加载评论失败");
    }
  };

  useEffect(() => {
    fetchComments(currentPage, sortOrder);
  }, [currentPage, sortOrder]);

  // 添加评论
  const handleAddComment = async () => {
    if (!newComment.trim()) {
      message.error("评论内容不能为空");
      return;
    }

    try {
      const response = await addCommentUsingPost({
        questionId,
        content: newComment,
      });
      if (response.code === 0) {
        message.success("评论发布成功");
        setNewComment("");
        // fetchComments(1, sortOrder); // 重新加载第一页评论

        setSortOrder("descend");
        // fetchComments(totalComments / pageSize + 1, sortOrder); // 加载最新一页
        // setTimeout(() => commentEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 500); // 滚动到新回复
        // setTimeout(() => commentEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 500); // 滚动到新评论
      } else {
        message.error(response.message || "发布评论失败");
      }
    } catch (error) {
      message.error("发布评论失败");
    }
  };

  // 添加回复
  const handleAddReply = async () => {
    if (!replyContent.trim()) {
      message.error("回复内容不能为空");
      return;
    }

    try {
      const response = await addCommentUsingPost({
        questionId,
        content: replyContent,
        parentId: replyTo,
      });
      if (response.code === 0) {
        message.success("回复发布成功");
        setReplyModalVisible(false);

        //
        // fetchComments(lastPage, sortOrder); // 加载最新一页评论

        //为了一条回复又发了三个请求。。。
        const { data } = await getCommentVoByIdUsingGet({ id: replyTo });
        // const response1 = await getUserVoByIdUsingGet({id:data.userId});
        const response2 = await getQuestionVoByIdUsingGet({
          id: data.questionId,
        });

        //只需要回复的前15个字
        const shortenedReplyContent =
          replyContent.length > 15
            ? replyContent.substring(0, 15) + "..."
            : replyContent;
        //创建消息
        try {
          //todo 要不要设置一下 自己不能回复自己。？

          //我觉得可以 只是说 不会创建消息 自己回复自己不会创建消息。。。

          await addMessageUsingPost({
            //这个组装 我觉得可以 就是这个reply感觉还可以再减小。。。
            content: `你收到了来自用户${loginUser.userName}在题目${response2.data.title}评论区中的回复：${shortenedReplyContent}，点击前往对应的题目详情页面和他互动吧～「「「${questionId}」」」`,
            userId: data.userId,
          });
        } catch (e) {
          message.warning("消息创建失败");
        }

        // type MessageAddRequest = {
        //   content?: string;
        //   createTime?: string;
        //   id?: number;
        //   isRead?: number;
        //   type?: Record<string, any>;
        //   userId?: number;
        // };

        //解决方案：只显示上一页和下一页 笑死我了
        setSortOrder("descend");

        // fetchComments(totalComments / pageSize + 1, sortOrder); // 加载最新一页
        // setTimeout(() => commentEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 500); // 滚动到新回复
        // const lastPage = Math.ceil((totalComments + 1) / pageSize);

        // setCurrentPage(lastPage); // 设置 Pagination 当前页为最后一页
      } else {
        message.error(response.message || "发布回复失败");
      }
    } catch (error) {
      message.error("发布回复失败");
    }
  };

  // 删除评论
  // const handleDeleteComment = async (id) => {
  //     try {
  //         const response = await deleteCommentUsingPost({ id });
  //         if (response.code === 0) {
  //             message.success('评论已删除');
  //             fetchComments(currentPage, sortOrder);
  //         } else {
  //             message.error(response.message || '删除评论失败');
  //         }
  //     } catch (error) {
  //         message.error('删除评论失败');
  //     }
  // };

  //增加二次确认的删除
  // 删除评论的函数
  const handleDeleteComment = (id) => {
    //todo 二次确认的设计
    Modal.confirm({
      title: "确认删除该评论?",
      content: "删除后无法恢复该评论。",
      okText: "删除",
      okType: "danger",
      cancelText: "取消",
      onOk: async () => {
        try {
          const response = await deleteCommentUsingPost({ id });
          if (response.code === 0) {
            message.success("评论已删除");
            fetchComments(currentPage, sortOrder); // 删除后刷新评论列表
          } else {
            message.error(response.message || "删除评论失败");
          }
        } catch (error) {
          message.error("删除评论失败");
        }
      },
      onCancel: () => {
        // 取消时，不执行任何操作
        console.log("取消删除");
      },
    });
  };

  // 显示回复弹窗
  const showReplyModal = (commentId) => {
    setReplyTo(commentId);
    setReplyContent("");
    setReplyModalVisible(true);
  };

  return (
    <Card
      style={{
        padding: 20,
        borderRadius: 8,
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
      }}
    >
      {/* 添加评论区 */}
      <div style={{ marginBottom: 20 }}>
        <TextArea
          rows={3}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="输入您的评论..."
          maxLength={1000}
          showCount
        />
        <Button
          type="primary"
          onClick={handleAddComment}
          style={{ marginTop: 8 }}
        >
          发布评论
        </Button>
      </div>

      {/* 排序按钮 */}
      <Select
        value={sortOrder}
        onChange={(value) => setSortOrder(value)}
        style={{ width: 150, marginBottom: 16 }}
      >
        <Select.Option value="ascend">按时间正序</Select.Option>
        <Select.Option value="descend">按时间倒序</Select.Option>
      </Select>

      {/* 评论列表 */}

      {/*怎么渲染出来详细信息。。？ 这里我有一点解决方案在里面 comments每个元素都拼接上question和user的详细信息就可以了。。。
      但是这样是不是有点太浪费性能了。。？ 总之我觉得对前端的JSON来说 这好像没什么大不了的。。*/}

      {/*todo  评论渲染2.0让头像始终在左上角 */}
      {comments.map((comment) => (
        <div key={comment.id} style={{ marginBottom: 16 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "flex-start",
            }}
          >
            {/* 固定宽度区域放置头像 */}
            <div
              style={{
                flexShrink: 0,
                width: "60px",
                height: "60px",
                marginRight: 10,
              }}
            >
              <Avatar
                src={
                  comment?.user?.userAvatar ||
                  "https://xdumianshi-1304687224.cos.ap-shanghai.myqcloud.com/user_avatar/1863182698244030465/PIqH4Hik-kobe.jpeg"
                }
                size="large"
                style={{ width: "100%", height: "100%", objectFit: "cover" }} // 保证头像不变形
              />
            </div>

            {/* 评论内容区域 */}
            <div style={{ flexGrow: 1 }}>
              <strong>{comment?.user?.userName}</strong>

              {/* Parent Comment 展开逻辑 */}
              {comment.parentComment && comment.parentUser && (
                <p
                  style={{
                    margin: 0,
                    textIndent: "0.5em",
                    fontStyle: "italic",
                    fontFamily: "light",
                  }}
                >
                  {comment.parentComment.content.length > 200 &&
                  !isParentCommentExpanded ? (
                    <>
                      原评论：“{comment.parentUser.userName} ：
                      {comment.parentComment.content.slice(0, 200)}...”
                      <a
                        style={{ marginLeft: 4, cursor: "pointer" }}
                        onClick={() => setParentCommentExpanded(true)} // 展开当前评论
                      >
                        展开
                      </a>
                    </>
                  ) : (
                    <>
                      原评论：“{comment.parentUser.userName} ：
                      {comment.parentComment.content}”
                      {comment.parentComment.content.length > 200 && (
                        <a
                          style={{ marginLeft: 4, cursor: "pointer" }}
                          onClick={() => setParentCommentExpanded(false)} // 收起当前评论
                        >
                          收起
                        </a>
                      )}
                    </>
                  )}
                </p>
              )}

              {/* 当前评论内容 */}
              {comment.parentId && (
                <div
                  style={{
                    margin: 0,
                    fontSize: "12px",
                    textIndent: "1em",
                    color: "rgb(31,33,35)",
                  }}
                >
                  对
                  {comment.parentUser?.userName
                    ? comment.parentUser.userName
                    : "某条已删除的评论"}
                  的回复:
                </div>
              )}

              <p style={{ margin: 0, textIndent: "2em" }}>
                {comment.content.length > 200 && !isCommentExpanded ? (
                  <>
                    {comment.content.slice(0, 200)}...
                    <a
                      style={{ marginLeft: 4, cursor: "pointer" }}
                      onClick={() => setCommentExpanded(true)} // 展开当前评论
                    >
                      展开
                    </a>
                  </>
                ) : (
                  <>
                    {comment.content}
                    {comment.content.length > 200 && (
                      <a
                        style={{ marginLeft: 4, cursor: "pointer" }}
                        onClick={() => setCommentExpanded(false)} // 收起当前评论
                      >
                        收起
                      </a>
                    )}
                  </>
                )}
              </p>

              <Space
                style={{
                  marginTop: 8,
                  justifyContent: "flex-end",
                  display: "flex",
                }}
              >
                <a onClick={() => showReplyModal(comment.id)}>回复</a>
                {comment.userId == loginUser.id && (
                  <a
                    onClick={() => handleDeleteComment(comment.id)}
                    style={{ color: "red" }}
                  >
                    删除
                  </a>
                )}
              </Space>
              <Divider />
            </div>
          </div>
        </div>
      ))}

      <div ref={commentEndRef}></div>

      {/* 分页 */}
      {/*<Pagination*/}
      {/*    current={currentPage}*/}
      {/*    pageSize={pageSize}*/}
      {/*    total={totalComments}*/}
      {/*    onChange={(page) => setCurrentPage(page)}*/}
      {/*    style={{ textAlign: 'center', marginTop: 20 }}*/}
      {/*/>*/}
      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={totalComments}
        onChange={(page) => {
          setCurrentPage(page);
        }}
        itemRender={(page, type, originalElement) => {
          if (type === "prev") {
            return <a>上一页</a>;
          }
          if (type === "next") {
            return <a>下一页</a>;
          }
          return null; // 隐藏其他按钮
        }}
        style={{ textAlign: "center", marginTop: 20 }}
      />

      {/* 回复弹窗 */}
      <Modal
        title="回复"
        visible={replyModalVisible}
        onOk={handleAddReply}
        onCancel={() => setReplyModalVisible(false)}
        okText="提交"
        cancelText="取消"
      >
        <TextArea
          rows={3}
          value={replyContent}
          onChange={(e) => setReplyContent(e.target.value)}
          placeholder="请输入回复内容..."
          maxLength={500}
          showCount
        />
      </Modal>
    </Card>
  );
};

export default CommentSection;
