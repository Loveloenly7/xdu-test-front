//todo 消息中心 显示评论
import React, { useEffect, useState } from "react";
import { List, Avatar, Pagination, message } from "antd";
import { getUserMessages } from "@/api/messageController"; // 假设后端接口

interface MessageItem {
  id: number;
  senderAvatar: string;
  senderName: string;
  content: string;
  relatedQuestionId: number;
}

const UserMessages: React.FC = () => {
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);

  const fetchMessages = async (page: number) => {
    try {
      const res = await getUserMessages({ page, pageSize: 10 });
      setMessages(res.data.records || []);
      setTotal(res.data.total || 0);
    } catch (e) {
      message.error("加载消息失败");
    }
  };

  useEffect(() => {
    fetchMessages(currentPage);
  }, [currentPage]);

  return (
    <div>
      <List
        itemLayout="horizontal"
        dataSource={messages}
        renderItem={(item) => (
          <List.Item
            onClick={() => {
              // 跳转到对应问题并滚动到评论区
              window.location.href = `/question/${item.relatedQuestionId}#comment`;
            }}
          >
            <List.Item.Meta
              avatar={<Avatar src={item.senderAvatar} />}
              title={item.senderName}
              description={
                item.content.length > 20
                  ? item.content.slice(0, 20) + "..."
                  : item.content
              }
            />
          </List.Item>
        )}
      />
      <Pagination
        current={currentPage}
        total={total}
        pageSize={10}
        onChange={(page) => setCurrentPage(page)}
        style={{ marginTop: 16, textAlign: "center" }}
      />
    </div>
  );
};

export default UserMessages;
