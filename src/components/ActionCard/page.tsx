//题目详情页面里面的组件

//收藏 分享 标记

import React, { useState } from "react";
import { Button, Dropdown, Menu, message, Tooltip } from "antd";
import { StarOutlined, StarFilled, ShareAltOutlined } from "@ant-design/icons";

interface ActionCardProps {
  questionId: string;
  onToggleFavorite: (id: string, isFavorited: boolean) => void; // 收藏方法
  onMarkQuestion: (id: string, status: string) => void; // 标记方法
}

const ActionCard: React.FC<ActionCardProps> = ({
  questionId,
  onToggleFavorite,
  onMarkQuestion,
}) => {
  const [isFavorited, setIsFavorited] = useState(false); // 收藏状态
  const [markStatus, setMarkStatus] = useState("未标记"); // 标记状态

  // 收藏按钮点击事件
  const handleFavoriteClick = () => {
    const newFavorited = !isFavorited;
    setIsFavorited(newFavorited);
    onToggleFavorite(questionId, newFavorited); // 调用后端方法
    message.success(newFavorited ? "已加入收藏夹！" : "已移出收藏夹！");
  };

  // 标记按钮选项
  const markMenu = (
    <Menu
      onClick={({ key }) => {
        setMarkStatus(key);
        onMarkQuestion(questionId, key); // 调用后端方法
        message.success(`已将题目标记为：${key}`);
      }}
      items={[
        { label: "需要再看看", key: "需要再看看" },
        { label: "我已掌握！", key: "我已掌握！" },
      ]}
    />
  );

  // 分享按钮点击事件
  const handleShareClick = () => {
    const currentURL = window.location.href; // 获取当前 URL
    navigator.clipboard.writeText(currentURL); // 复制到剪贴板
    message.success("该题目链接已复制！快去分享给小伙伴吧！");
  };

  return (
    <div className="action-card">
      <Tooltip title={isFavorited ? "取消收藏" : "加入收藏"}>
        <Button
          type="text"
          icon={
            isFavorited ? (
              <StarFilled style={{ color: "#faad14" }} />
            ) : (
              <StarOutlined />
            )
          }
          onClick={handleFavoriteClick}
        >
          收藏
        </Button>
      </Tooltip>

      <Dropdown overlay={markMenu} trigger={["click"]}>
        <Button>{markStatus}</Button>
      </Dropdown>

      <Tooltip title="分享题目">
        <Button
          type="text"
          icon={<ShareAltOutlined />}
          onClick={handleShareClick}
        >
          分享
        </Button>
      </Tooltip>
    </div>
  );
};

export default ActionCard;
