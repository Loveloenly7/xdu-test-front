// "use client";
//
// import { Card } from "antd";
// // 展示题目加上答案内容 card。。。
//
// import Title from "antd/es/typography/Title";
//
// import TagList from "@/components/TagList";
// import MdViewer from "@/components/MdViewer";
// import useAddUserSignInRecord from "@/hooks/useAddUserSignInRecord";
// //todo useAddUserSignInRecord：自定义 Hook，用于用户签到逻辑。
// import "./index.css";
//
// interface Props {
//   question: API.QuestionVO;
// }
// /*question 是传入的题目数据，类型为 API.QuestionVO。
// 具体结构由 API 定义，
// 一般包括 title、tagList、content、answer 等字段。*/
//
// /**
//  * 题目卡片
//  * @param props
//  * @constructor
//  */
//
// const QuestionCard = (props: Props) => {
//   const { question } = props;
//
//   /*定义了 QuestionCard 函数组件，接收 Props 类型的参数。
// 使用对象解构提取 props 中的 question 数据。
// 调用 useAddUserSignInRecord 自定义 Hook，触发用户签到逻辑（副作用，比如向后端记录用户访问）。*/
//
//   // todo 签到逻辑触发！
//   //能不能设置一下时间呢 比如 至少浏览一分钟才会触发这个。。？
//   useAddUserSignInRecord();
//
//   return (
//     <div className="question-card">
//       <Card>
//         <Title level={1} style={{ fontSize: 24 }}>
//           {question.title}
//         </Title>
//         <TagList tagList={question.tagList} />
//         <div style={{ marginBottom: 16 }} />
//         {/*  增加了一下和下面的间距*/}
//         <MdViewer value={question.content} />
//         {/*    题目叙述在这里也用的Md。？*/}
//       </Card>
//       <div style={{ marginBottom: 16 }} />
//
//       <Card title="推荐答案">
//         <MdViewer value={question.answer} />
//       </Card>
//       {/*说白了两张卡片 一张题目 一张题解 然后绑定到一起 。。。*/}
//     </div>
//   );
// };
//
// export default QuestionCard

//实现了收藏 标记 的题目管理

"use client";
import React, { useEffect, useState } from "react";
import { Card, Button, message, Dropdown, Menu } from "antd";
import {
  ShareAltOutlined,
  HeartOutlined,
  HeartFilled,
  CheckCircleFilled,
  CheckCircleOutlined,
  FlagFilled,
  FlagOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { RootState } from "@/stores";
import {
  addFavoriteUsingPost,
  deleteFavoriteUsingPost,
  getFavoriteVoByIdUsingGet,
  listFavoriteVoByPageUsingPost,
  updateFavoriteUsingPost,
} from "@/api/favoriteController";
import Title from "antd/es/typography/Title";
import TagList from "@/components/TagList";
import MdViewer from "@/components/MdViewer";
import useAddUserSignInRecord from "@/hooks/useAddUserSignInRecord";

import "./index.css";

interface Props {
  question: API.QuestionVO;
}

const QuestionCard: React.FC<Props> = ({ question }) => {
  const loginUser = useSelector((state: RootState) => state.loginUser);
  const userId = loginUser.id;
  const [favorite, setFavorite] = useState<any>(null);

  useAddUserSignInRecord();

  const handleLoad = async () => {
    const response = await listFavoriteVoByPageUsingPost({
      current: 1,
      pageSize: 1,
      questionId: question.id,
      userId,
    });
    if (response.data.records.length > 0) setFavorite(response.data.records[0]);
  };

  useEffect(() => {
    handleLoad();
  }, []); // 页面加载时执行

  const handleFavorite = async (type: number | null) => {
    if (type === null) {
      // 取消收藏
      if (favorite) {
        await deleteFavoriteUsingPost({ id: favorite.id });
        setFavorite(null);
        message.success("已取消收藏");
      }
    } else if (favorite) {
      // 更新收藏类型
      await updateFavoriteUsingPost({ id: favorite.id, favoriteType: type });
      setFavorite({ ...favorite, favoriteType: type });
      message.success("收藏状态已更新");
    } else {
      // 添加收藏
      const response = await addFavoriteUsingPost({
        userId,
        questionId: question.id,
        favoriteType: type,
      });
      const newFavorite = await getFavoriteVoByIdUsingGet({
        id: response.data,
      });
      setFavorite(newFavorite.data);
      message.success("已添加收藏");
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    message.success("URL 已复制到剪贴板");
  };

  const handleMenuClick = ({ key }: { key: string }) => {
    const type = parseInt(key, 10);
    if (favorite?.favoriteType === type) {
      handleFavorite(null); // 取消当前标记
    } else {
      handleFavorite(type); // 更新标记
    }
  };

  const markMenu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item
        key="2"
        icon={
          favorite?.favoriteType === 2 ? (
            <CheckCircleFilled />
          ) : (
            <CheckCircleOutlined />
          )
        }
      >
        {favorite?.favoriteType !== 2 ? "标记为已掌握" : "取消标记"}
      </Menu.Item>
      <Menu.Item
        key="1"
        icon={favorite?.favoriteType === 1 ? <FlagFilled /> : <FlagOutlined />}
      >
        {favorite?.favoriteType !== 1 ? "标记为易错" : "取消标记"}
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="question-card">
      <Card
        style={{ borderRadius: 8, boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)" }}
        bodyStyle={{ paddingBottom: 80 }}
      >
        {/*<Title level={1} style={{ fontSize: 24 }}>*/}
        {/*    {question.title}*/}
        {/*</Title>*/}
        <div style={{ display: "flex", alignItems: "center" }}>
          <Title level={1} style={{ fontSize: 24, margin: 0 }}>
            {question.title}
          </Title>
          {/*成功让标题这里实现了图标的同步 我大概知道怎么做了。。*/}
          <div style={{ marginLeft: 8, fontSize: 20 }}>
            {favorite?.favoriteType === 2 ? (
              <CheckCircleFilled style={{ color: "#52c41a" }} />
            ) : favorite?.favoriteType === 1 ? (
              <FlagFilled style={{ color: "#fa1414" }} />
            ) : favorite?.favoriteType === 0 ? (
              <HeartFilled style={{ color: "#fa14b1" }} />
            ) : (
              <div />
            )}
          </div>
        </div>
        <TagList tagList={question.tagList} />
        <MdViewer value={question.content} />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "space-between",
            padding: "12px",
            background: "#f9f9f9",
            borderTop: "1px solid #e8e8e8",
          }}
        >
          <Button
            type="text"
            block
            icon={favorite ? <HeartFilled /> : <HeartOutlined />}
            onClick={() => handleFavorite(favorite ? null : 0)}
          >
            {favorite ? "取消收藏" : "收藏"}
          </Button>
          <Button
            type="text"
            block
            icon={<ShareAltOutlined />}
            onClick={handleShare}
          >
            分享
          </Button>
          <Dropdown overlay={markMenu} placement="topCenter" arrow>
            <Button type="text" block>
              标记
            </Button>
          </Dropdown>
        </div>
      </Card>
      <Card title="推荐答案">
        <MdViewer value={question.answer} />
      </Card>
    </div>
  );
};

export default QuestionCard;
