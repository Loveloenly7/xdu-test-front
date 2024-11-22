"use client";
import {
  List,
  Comment,
  Avatar,
  Input,
  Button,
  message,
  Popconfirm,
} from "antd";
import { useEffect, useState } from "react";
import { LikeOutlined, LikeFilled } from "@ant-design/icons";
import {
  getCommentsByQuestionId,
  postComment,
  deleteComment,
  likeComment,
} from "@/api/commentController";

// todo 还没写 评论区组件 加到题目详情页面

const { TextArea } = Input;

interface Props {
  questionId: string; // 当前问题ID
  currentUserId: string; // 当前用户ID
}

const CommentSection: React.FC<Props> = ({ questionId, currentUserId }) => {
  const [comments, setComments] = useState<Comment[]>([]); // 评论列表
  const [newComment, setNewComment] = useState<string>(""); // 新评论内容
  const [replyTarget, setReplyTarget] = useState<Comment | null>(null); // 回复目标评论

  useEffect(() => {
    loadComments();
  }, []);

  // 加载评论列表
  const loadComments = async () => {
    try {
      const res = await getCommentsByQuestionId(questionId);
      if (res.success) {
        setComments(res.data.comments);
      } else {
        message.error("加载评论失败！");
      }
    } catch (error) {
      message.error("加载评论出错！");
    }
  };

  // 提交评论或回复
  const handleCommentSubmit = async () => {
    if (!newComment.trim()) {
      message.warning("请输入评论内容！");
      return;
    }

    try {
      const res = await postComment({
        questionId,
        content: newComment,
        parentId: replyTarget?.id,
      });
      if (res.success) {
        message.success("评论成功！");
        setComments((prev) =>
          replyTarget
            ? prev.map((comment) =>
                comment.id === replyTarget.id
                  ? {
                      ...comment,
                      replies: [...(comment.replies || []), res.data.comment],
                    }
                  : comment,
              )
            : [res.data.comment, ...prev],
        );
        setNewComment("");
        setReplyTarget(null);
      } else {
        message.error("评论失败！");
      }
    } catch (error) {
      message.error("提交评论出错！");
    }
  };

  // 删除评论
  const handleDelete = async (commentId: string) => {
    try {
      const res = await deleteComment({ commentId });
      if (res.success) {
        message.success("删除成功！");
        setComments((prev) => removeComment(prev, commentId));
      } else {
        message.error("删除失败！");
      }
    } catch (error) {
      message.error("删除评论出错！");
    }
  };

  // 点赞功能
  const handleLike = async (commentId: string) => {
    try {
      const res = await likeComment({ commentId });
      if (res.success) {
        setComments((prev) =>
          updateLike(prev, commentId, res.data.hasLiked, res.data.likes),
        );
      } else {
        message.error("点赞失败！");
      }
    } catch (error) {
      message.error("点赞出错！");
    }
  };

  // 递归移除评论
  const removeComment = (comments: Comment[], commentId: string): Comment[] =>
    comments
      .filter((comment) => comment.id !== commentId)
      .map((comment) => ({
        ...comment,
        replies: comment.replies
          ? removeComment(comment.replies, commentId)
          : undefined,
      }));

  // 更新点赞状态
  const updateLike = (
    comments: Comment[],
    commentId: string,
    hasLiked: boolean,
    likes: number,
  ): Comment[] =>
    comments.map((comment) => ({
      ...comment,
      hasLiked: comment.id === commentId ? hasLiked : comment.hasLiked,
      likes: comment.id === commentId ? likes : comment.likes,
      replies: comment.replies
        ? updateLike(comment.replies, commentId, hasLiked, likes)
        : comment.replies,
    }));

  // 渲染评论
  const renderComments = (comments: Comment[]) =>
    comments.map((comment) => (
      <Comment
        key={comment.id}
        author={comment.username}
        avatar={<Avatar src={comment.avatar} />}
        content={comment.content}
        datetime={comment.datetime}
        actions={[
          <span onClick={() => handleLike(comment.id)}>
            {comment.hasLiked ? <LikeFilled /> : <LikeOutlined />}{" "}
            {comment.likes}
          </span>,
          <span onClick={() => setReplyTarget(comment)}>回复</span>,
          comment.userId === currentUserId && (
            <Popconfirm
              title="确定删除该评论吗？"
              onConfirm={() => handleDelete(comment.id)}
            >
              <span>删除</span>
            </Popconfirm>
          ),
        ]}
      >
        {comment.replies && renderComments(comment.replies)}
      </Comment>
    ));

  return (
    <div style={{ marginTop: 24 }}>
      <h3>评论区</h3>
      {/* 评论输入框 */}
      <div style={{ marginBottom: 16 }}>
        <TextArea
          rows={4}
          placeholder={
            replyTarget ? `回复 @${replyTarget.username}` : "发表评论"
          }
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <Button
          type="primary"
          onClick={handleCommentSubmit}
          style={{ marginTop: 8 }}
        >
          发布
        </Button>
        {replyTarget && (
          <Button
            onClick={() => setReplyTarget(null)}
            style={{ marginLeft: 8 }}
          >
            取消回复
          </Button>
        )}
      </div>
      {/* 评论列表 */}
      <List>{renderComments(comments)}</List>
    </div>
  );
};

export default CommentSection;
