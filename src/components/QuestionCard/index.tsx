"use client";

import { Card } from "antd";
// 展示题目加上答案内容 card。。。

import Title from "antd/es/typography/Title";

import TagList from "@/components/TagList";
import MdViewer from "@/components/MdViewer";
import useAddUserSignInRecord from "@/hooks/useAddUserSignInRecord";
//todo useAddUserSignInRecord：自定义 Hook，用于用户签到逻辑。
import "./index.css";

interface Props {
  question: API.QuestionVO;
}
/*question 是传入的题目数据，类型为 API.QuestionVO。
具体结构由 API 定义，
一般包括 title、tagList、content、answer 等字段。*/

/**
 * 题目卡片
 * @param props
 * @constructor
 */

const QuestionCard = (props: Props) => {
  const { question } = props;

  /*定义了 QuestionCard 函数组件，接收 Props 类型的参数。
使用对象解构提取 props 中的 question 数据。
调用 useAddUserSignInRecord 自定义 Hook，触发用户签到逻辑（副作用，比如向后端记录用户访问）。*/

  // todo 签到逻辑触发！
  //能不能设置一下时间呢 比如 至少浏览一分钟才会触发这个。。？
  useAddUserSignInRecord();

  return (
    <div className="question-card">
      <Card>
        <Title level={1} style={{ fontSize: 24 }}>
          {question.title}
        </Title>
        <TagList tagList={question.tagList} />
        <div style={{ marginBottom: 16 }} />
        {/*  增加了一下和下面的间距*/}
        <MdViewer value={question.content} />
        {/*    题目叙述在这里也用的Md。？*/}
      </Card>
      <div style={{ marginBottom: 16 }} />

      <Card title="推荐答案">
        <MdViewer value={question.answer} />
      </Card>
      {/*说白了两张卡片 一张题目 一张题解 然后绑定到一起 。。。*/}
    </div>
  );
};

export default QuestionCard;
