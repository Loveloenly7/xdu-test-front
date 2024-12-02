// 'use client'
//
// //todo v1.0
//
// import React, {useState, useEffect, useRef} from 'react';
// import {Card, Input, Button, Avatar, Divider, Space, Pagination, message, Select, Modal} from 'antd';
// import {listCommentVoByPageUsingPost, addCommentUsingPost, deleteCommentUsingPost} from '@/api/commentController';
// import loginUser from "@/stores/loginUser";
// import {useSelector} from "react-redux";
// import {RootState} from "@/stores";
//
// const {TextArea} = Input;
//
//
// //qid从外面传进来 暂时不管。。
//
// //
// // const CommentPage = ({qId}) => {
// //
// //     const  questionId=parseInt(qId);
// const CommentPage = ({qId}) => {
//
//     qId=1;
//
//     const  questionId=parseInt(qId);
//
//     const [comments, setComments] = useState([]);
//     // 评论数据
//     const [newComment, setNewComment] = useState('');
//     // 新评论内容
//     const [currentPage, setCurrentPage] = useState(1);
//     // 当前页
//     const [totalComments, setTotalComments] = useState(0);
//     // 评论总数
//     const [sortOrder, setSortOrder] = useState('ascend');
//     // 排序方式
//     const pageSize = 10;
//     // 每页评论数
//     const commentEndRef = useRef(null);
//     // 用于跳转到最后一条评论
//
//     // 当前登录用户
//     const loginUser = useSelector((state: RootState) => state.loginUser);
//
//     const [replyModalVisible, setReplyModalVisible] = useState(false); // 控制弹窗显示
//     const [replyContent, setReplyContent] = useState(''); // 回复内容
//     const [replyTo, setReplyTo] = useState(null); // 当前正在回复的评论 ID
//
//
//     // 加载评论数据
//     const fetchComments = async (page = 1, order = 'ascend') => {
//         try {
//             const response = await listCommentVoByPageUsingPost({
//                 questionId:questionId,
//                 current: page,
//                 pageSize: pageSize,
//                 sortField: 'createTime',
//                 sortOrder: order
//             });
//
//             /*{
//   "current": 1,
//   "pageSize": 10,
//   "questionId": 1,
//   "sortField": "createTime",
//   "sortOrder": "ascend" 记得这里不要加逗号。。
// }*/
//
//             /*{
//   "current": 1,
//   "pageSize": 10,
//   "questionId": 1,
//   "sortField": "createTime",
//   "sortOrder": "descend"
// }*/
//             if (response.code === 0) {
//                 setComments(response.data.records);
//                 setTotalComments(response.data.total);
//             } else {
//                 message.error('加载评论失败');
//             }
//         } catch (error) {
//             message.error('加载评论失败');
//         }
//     };
//
//     //当前页面和 排序 发生改变的时候 重新执行查询。。。？
//     useEffect(() => {
//         fetchComments(currentPage, sortOrder);
//     }, [currentPage, sortOrder]);
//
//     // 添加评论
//     const handleAddComment = async () => {
//         if (!newComment.trim()) {
//             message.error('评论内容不能为空');
//             return;
//         }
//
//         try {
//             const response = await addCommentUsingPost({
//                 questionId: questionId,
//                 content: newComment,
//                 // parentId: null, // 新评论无父级 那就不传！
//             });
//             if (response.code === 0) {
//                 message.success('评论发布成功');
//                 setNewComment('');
//
//                 //todo 这里发布的时候真的会在最新一页？这里要改 删了都行。。
//                 fetchComments(totalComments / pageSize + 1, sortOrder); // 加载最新一页
//                 setTimeout(() => commentEndRef.current?.scrollIntoView({behavior: 'smooth'}), 500); // 滚动到新评论
//             } else {
//                 message.error(response.message || '发布评论失败');
//             }
//         } catch (error) {
//             message.error('发布评论失败');
//         }
//     };
//
//     // 添加回复
//     const handleAddReply = async (parentId, replyContent) => {
//         if (!newComment.trim()) {
//             message.error('回复内容不能为空');
//             return;
//         }
//
//         try {
//             const response = await addCommentUsingPost({
//                 questionId: questionId,
//                 content: `给${parentId}的回复：`+replyContent,
//                 parentId: parentId, // 新评论无父级 那就不传！
//             });
//             if (response.code === 0) {
//                 setReplyModalVisible(false);
//                 message.success('回复发布成功');
//                 // setNewComment('');
//
//                 //todo 这里发布的时候真的会在最新一页？这里要改 删了都行。。
//                 fetchComments(totalComments / pageSize + 1, sortOrder); // 加载最新一页
//                 setTimeout(() => commentEndRef.current?.scrollIntoView({behavior: 'smooth'}), 500); // 滚动到新评论
//             } else {
//                 message.error(response.message || '发布回复失败');
//             }
//         } catch (error) {
//             message.error('发布回复失败');
//         }
//     };
//
//     // 删除评论
//     const handleDeleteComment = async (id) => {
//         try {
//             const response = await deleteCommentUsingPost({id});
//             if (response.code === 0) {
//                 message.success('评论已删除');
//                 fetchComments(currentPage, sortOrder);
//             } else {
//                 message.error(response.message || '删除评论失败');
//             }
//         } catch (error) {
//             message.error('删除评论失败');
//         }
//     };
//
//     // 显示回复弹窗
//     const showReplyModal = (commentId) => {
//         setReplyTo(commentId);
//         setReplyContent('');
//         setReplyModalVisible(true);
//     };
//
//     return (
//         <Card style={{padding: 20, borderRadius: 8, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'}}>
//             {/* 添加评论区 */}
//             <div style={{marginBottom: 20}}>
//                 <TextArea
//                     rows={3}
//                     value={newComment}
//                     onChange={(e) => setNewComment(e.target.value)}
//                     placeholder="输入您的评论..."
//                     maxLength={200}
//                     showCount
//                 />
//                 <Button type="primary" onClick={handleAddComment} style={{marginTop: 8}}>
//                     发布评论
//                 </Button>
//             </div>
//
//             {/* 排序按钮 */}
//             <Select
//                 value={sortOrder}
//                 onChange={(value) => setSortOrder(value)}
//                 style={{width: 150, marginBottom: 16}}
//             >
//                 {/*todo 前后端的排序字段不是统一的。。*/}
//                 <Select.Option value="ascend">按时间正序</Select.Option>
//                 <Select.Option value="descend">按时间倒序</Select.Option>
//             </Select>
//
//             {/* 评论列表 */}
//             {comments.map((comment) => (
//                 <div key={comment.id} style={{marginBottom: 16}}>
//                     <div style={{display: 'flex', alignItems: 'center'}}>
//                         <Avatar src={comment.userAvatar || '/default-avatar.png'} size="large"
//                                 style={{marginRight: 8}}/>
//                         <div>
//                             <strong>{comment.userName}</strong>
//                             <p style={{margin: 0}}>
//                                 {comment.content.length > 200 ? (
//                                     <>
//                                         {comment.content.slice(0, 200)}...
//                                         <a style={{marginLeft: 4}} onClick={() => alert('展开评论内容')}>
//                                             展开
//                                         </a>
//                                     </>
//                                 ) : (
//                                     comment.content
//                                 )}
//                             </p>
//                         </div>
//                     </div>
//                     <Space style={{marginTop: 8, justifyContent: 'flex-end', display: 'flex'}}>
//                         {/*这里应该出来个弹窗的 然后传递属性什么的。？*/}
//                         <a onClick={() => showReplyModal(comment.id)}>回复</a>
//                         {(comment.userId==loginUser.userId) && (
//                             <a onClick={() => handleDeleteComment(comment.id)} style={{color: 'red'}}>
//                                 删除
//                             </a>
//                         )}
//                     </Space>
//                     <Divider/>
//                 </div>
//             ))}
//             <div ref={commentEndRef}></div>
//
//
//
//             {/* 分页 直接用了antd的分页组件。。？ */}
//             <Pagination
//                 current={currentPage}
//                 pageSize={pageSize}
//                 total={totalComments}
//                 onChange={(page) => setCurrentPage(page)}
//                 style={{textAlign: 'center', marginTop: 20}}
//             />
//
//             {/* 回复弹窗 */}
//             <Modal
//                 title="回复"
//                 visible={replyModalVisible}
//                 onOk={handleAddReply(replyTo,replyContent)}
//                 onCancel={() => setReplyModalVisible(false)}
//                 okText="提交"
//                 cancelText="取消"
//             >
//                 <TextArea
//                     rows={3}
//                     value={replyContent}
//                     onChange={(e) => setReplyContent(e.target.value)}
//                     placeholder="请输入回复内容..."
//                     maxLength={200}
//                     showCount
//                 />
//             </Modal>
//         </Card>
//     );
// };
//
// export default CommentPage;

//todo 评论区改装成组件还没做 基本功能已经实现

"use client";

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
} from "@/api/commentController";
import { useSelector } from "react-redux";
import { RootState } from "@/stores";

const { TextArea } = Input;

const CommentPage = ({ qId }) => {
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

  const loginUser = useSelector((state: RootState) => state.loginUser); // 当前登录用户

  console.log(loginUser);

  // 加载评论数据
  const fetchComments = async (page = 1, order = "ascend") => {
    try {
      const response = await listCommentVoByPageUsingPost({
        questionId,
        current: page,
        pageSize,
        sortField: "createTime",
        sortOrder: order,
      });

      if (response.code === 0) {
        setComments(response.data.records);
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
          maxLength={200}
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
      {comments.map((comment) => (
        <div key={comment.id} style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Avatar
              src={comment.userAvatar || "/default-avatar.png"}
              size="large"
              style={{ marginRight: 8 }}
            />
            <div>
              {/*todo 研究下这里的展开是怎么实现的 怎么实现才比较优雅*/}
              <strong>{comment.userId}</strong>
              <div>
                {comment.parentId ? (
                  <strong>
                    用户{comment.userId}对{comment.parentId}评论的回复
                  </strong>
                ) : null}
              </div>
              {/*<strong>{comment.parentId}</strong>*/}
              <p style={{ margin: 0 }}>
                {comment.content.length > 200 ? (
                  <>
                    {comment.content.slice(0, 200)}...
                    <a
                      style={{ marginLeft: 4 }}
                      onClick={() => alert("展开评论内容")}
                    >
                      展开
                    </a>
                  </>
                ) : (
                  comment.content
                )}
              </p>
            </div>
          </div>
          <Space
            style={{
              marginTop: 8,
              justifyContent: "flex-end",
              display: "flex",
            }}
          >
            <a onClick={() => showReplyModal(comment.id)}>回复</a>
            {/*这个删除的渲染出了问题。。日你妈怪球不得 别人是id不是userid卧槽。。*/}
            {/*在家一个二次确认*/}
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
          maxLength={200}
          showCount
        />
      </Modal>
    </Card>
  );
};

export default CommentPage;
