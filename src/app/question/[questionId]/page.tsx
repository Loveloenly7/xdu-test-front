"use server";
import { message } from "antd";
import { getQuestionVoByIdUsingGet } from "@/api/questionController";
import QuestionCard from "@/components/QuestionCard";
import "./index.css";

import ActionCard from "@/components/ActionCard"; // 引入新的组件

//这里的标记 收藏 还有什么都弄好

// 引入新的组件

// 后端方法的占位
const toggleFavorite = async (id, isFavorited) => {
  console.log(`题目ID: ${id}，是否收藏: ${isFavorited}`);
  // 调用后端收藏接口
};

const markQuestion = async (id, status) => {
  console.log(`题目ID: ${id}，标记状态: ${status}`);
  // 调用后端标记接口
};

/**
 * 题目详情页
 * @constructor
 */
export default async function QuestionPage({ params }) {
  const { questionId } = params;

  // 获取题目详情
  let question = undefined;
  try {
    const res = await getQuestionVoByIdUsingGet({
      id: questionId,
    });
    question = res.data;
  } catch (e) {
    message.error("获取题目详情失败，" + e.message);
  }
  // 错误处理
  if (!question) {
    return <div>获取题目详情失败，请刷新重试</div>;
  }

  return (
    <div id="questionPage">
      <QuestionCard question={question} />
    </div>
    /*就只留下了题目详情的这个渲染界面*/
  );
}
