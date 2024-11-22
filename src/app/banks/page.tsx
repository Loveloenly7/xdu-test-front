"use server";
import Title from "antd/es/typography/Title";
import { message } from "antd";
import { listQuestionBankVoByPageUsingPost } from "@/api/questionBankController";
import QuestionBankList from "@/components/QuestionBankList";
import "./index.css";

/**
 * 题库列表页面
 * @constructor
 */

/*整体功能
描述：一个用于展示题库列表的页面。
数据来源：通过调用后端 API 接口 listQuestionBankVoByPageUsingPost，获取题库数据。
功能特点：
异步加载数据。
处理接口调用失败的异常。
使用 antd 的 Title 和自定义的 QuestionBankList 组件显示题库。*/

export default async function BanksPage() {
  /*声明一个异步函数 BanksPage，作为默认导出的 React 组件。
异步函数原因：需要使用 await 调用 API 获取数据。*/
  let questionBankList = [];
  // 题库数量不多，直接全量获取
  const pageSize = 200;
  //todo 后续题库数量多了 这个页面考虑换成分页的
  //但是我觉得现阶段这个只针对计算机专业的面试 也就是小圈子里面用的东西 所以 无所谓暂时
  try {
    const res = await listQuestionBankVoByPageUsingPost({
      pageSize,
      sortField: "createTime",
      sortOrder: "descend",
    });
    /*使用 listQuestionBankVoByPageUsingPost 接口函数发起 POST 请求。
参数说明：
pageSize: 每页的记录数。
sortField: 按 createTime 字段排序。
sortOrder: 排序方式为降序（descend）。
todo 我想想这里的排列顺序*/
    questionBankList = res.data.records ?? [];
    /*es.data.records 中获取题库数据，
    如果没有数据则使用空数组（?? []）。*/
  } catch (e) {
    message.error("获取题库列表失败，" + e.message);
  }

  return (
    <div id="banksPage" className="max-width-content">
      {/*这里还通过全局CSS限制了宽度*/}
      <Title level={3}>全部题库</Title>
      <QuestionBankList questionBankList={questionBankList} />
    </div>
  );
}

/*BanksPage 函数
  ├── 初始化 questionBankList = []
  ├── 发起 API 请求 listQuestionBankVoByPageUsingPost()
  │     ├── 成功：提取数据到 questionBankList
  │     └── 失败：显示错误消息
  ├── 返回 JSX
        ├── 标题 "题库大全"
        └── QuestionBankList 组件显示数据*/
