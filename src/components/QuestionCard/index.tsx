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
// export default QuestionCard;

//从样式上 增加了收藏 标记 分享这三个功能 数据流没跑通 因为后端的表大概率需要重新设计一下。。
"use client";
// import { Card } from "antd";
import Title from "antd/es/typography/Title";
import TagList from "@/components/TagList";
import MdViewer from "@/components/MdViewer";
import useAddUserSignInRecord from "@/hooks/useAddUserSignInRecord";
import "./index.css";

import React, { useState } from "react";
import { Card, Button, message, Dropdown, Menu } from "antd";
import {
  ShareAltOutlined,
  HeartOutlined,
  HeartFilled,
  CheckOutlined,
  FlagOutlined,
} from "@ant-design/icons";

interface Props {
  question: API.QuestionVO;
}

/**
 * 题目卡片
 * @param props
 * @constructor
 */
const QuestionCard = (props: Props) => {
  const { question } = props;
  /*我要在这个card里面 贴底部增加三个按钮 要求三个按钮一行排列
     采用Block类型的button 把贴近底部的地方占满，一个是收藏按钮
     点击后变为取消收藏的按钮 一个是分享按钮 点击后
     提示消息 “已经复制URL到剪贴板” 最后一个是标记按
    钮 光标放上去会有两个选择的按钮 一个是标记为已掌握 一个是标记为易错 */

  // 签到
  useAddUserSignInRecord();

  const [collected, setCollected] = useState(false); // 收藏状态

  // 收藏按钮点击事件
  const handleCollect = () => {
    setCollected(!collected);
    message.success(collected ? "已取消收藏" : "已收藏");
  };

  // 分享按钮点击事件
  const handleShare = () => {
    const url = window.location.href; // 当前页面的 URL
    navigator.clipboard.writeText(url); // 复制到剪贴板
    message.success("已经复制URL到剪贴板");
  };
  // 标记按钮菜单
  const markMenu = (
    <Menu>
      <Menu.Item key="1" icon={<CheckOutlined />}>
        标记为已掌握
      </Menu.Item>
      <Menu.Item key="2" icon={<FlagOutlined />}>
        标记为易错
      </Menu.Item>
    </Menu>
  );

  /*我决定把这个变成内嵌的*/
  //todo 读懂这里的设计思路
  return (
    <div className="question-card">
      <Card
        style={{ borderRadius: 8, boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)" }}
        bodyStyle={{ paddingBottom: 80 }} // 留出底部按钮的空间
      >
        {/*  /!* 卡片标题 *!/*/}
        {/*  <h1 style={{ fontSize: 24 }}>{question.title}</h1>*/}

        {/*  /!* 标签列表 *!/*/}
        {/*  <div style={{ marginBottom: 16 }}>*/}
        {/*      {question.tagList?.map((tag, index) => (*/}
        {/*          <span key={index} style={{ marginRight: 8, color: '#1890ff' }}>*/}
        {/*  {tag}*/}
        {/*</span>*/}
        {/*      ))}*/}
        {/*  </div>*/}

        {/*  /!* 内容区域 *!/*/}
        {/*  <div style={{ marginBottom: 16 }}>{question.content}</div>*/}
        <Title level={1} style={{ fontSize: 24 }}>
          {question.title}
        </Title>
        <TagList tagList={question.tagList} />
        <div style={{ marginBottom: 16 }} />
        <MdViewer value={question.content} />

        {/* 底部按钮 */}
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
          {/* 收藏按钮 */}
          <Button
            type="text"
            block
            icon={collected ? <HeartFilled /> : <HeartOutlined />}
            onClick={handleCollect}
          >
            {collected ? "取消收藏" : "收藏"}
          </Button>

          {/* 分享按钮 */}
          <Button
            type="text"
            block
            icon={<ShareAltOutlined />}
            onClick={handleShare}
          >
            分享
          </Button>

          {/* 标记按钮 */}
          <Dropdown overlay={markMenu} placement="topCenter" arrow>
            <Button type="text" block>
              标记
            </Button>
          </Dropdown>
        </div>
      </Card>
      {/*<Card>*/}
      {/*  <Title level={1} style={{ fontSize: 24 }}>*/}
      {/*    {question.title}*/}
      {/*  </Title>*/}
      {/*  <TagList tagList={question.tagList} />*/}
      {/*  <div style={{ marginBottom: 16 }} />*/}
      {/*  <MdViewer value={question.content} />*/}
      {/*</Card>*/}

      <div style={{ marginBottom: 16 }} />
      <Card title="推荐答案">
        <MdViewer value={question.answer} />
      </Card>
    </div>
  );
};

export default QuestionCard;
