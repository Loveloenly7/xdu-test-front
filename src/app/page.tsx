import Title from "antd/es/typography/Title";
// Ant Design 的标题组件，用于显示页面标题。
import { Divider, Flex, message } from "antd";
// Divider: 分割线, Flex: 布局组件, message: 消息提示组件。
import Link from "next/link";
// Next.js 提供的链接组件，用于页面导航。
import { listQuestionBankVoByPageUsingPost } from "@/api/questionBankController";
// 获取题库列表的 API。todo 热点题库
import { listQuestionVoByPageUsingPost } from "@/api/questionController";
// 获取题目列表的 API。todo 热点题目
import QuestionBankList from "@/components/QuestionBankList";
// 自定义组件，用于显示题库列表。
import QuestionList from "@/components/QuestionList";
// 自定义组件，用于显示题目列表。
import "./index.css";
// 样式文件，用于页面布局和样式。

// 本页面使用服务端渲染，禁用静态生成
export const dynamic = "force-dynamic";
// /*功能说明
//把主页强制弄成服务端渲染
// dynamic：Next.js 提供的属性，用于控制页面是否动态渲染。
// 设置为 'force-dynamic' 表示禁用静态生成 (SSG)，每次访问都会实时渲染页面。*/

/**
 * 主页
 * @constructor
 */
export default async function HomePage() {
  let questionBankList = [];
  let questionList = [];

  /*定义两个空数组 questionBankList 和 questionList，
  用来存储题库和题目的数据
  * */
  try {
    const res = await listQuestionBankVoByPageUsingPost({
      pageSize: 12,
      sortField: "createTime",
      sortOrder: "descend",
    });
    /*通过 API 获取题库列表，
    按创建时间倒序排列，todo 展示最新题目还是最热题目？
    每页获取 12 条数据。*/
    questionBankList = res.data.records ?? [];
  } catch (e) {
    message.error("获取题库列表失败，" + e.message);
  }

  try {
    const res = await listQuestionVoByPageUsingPost({
      pageSize: 12,
      sortField: "createTime",
      sortOrder: "descend",
    });
    questionList = res.data.records ?? [];
  } catch (e) {
    message.error("获取题目列表失败，" + e.message);
  }

  return (
    <div id="homePage" className="max-width-content">
      <Flex justify="space-between" align="center">
        {/* 使用 Ant Design 的 Flex 组件来实现弹性布局 */}
        <Title level={3}>最新题库</Title>
        {/* Title 是 Ant Design 的标题组件，这里用 level={3} 来设置标题的级别 */}
        <Link href={"/banks"}>查看更多</Link>
      </Flex>
      <QuestionBankList questionBankList={questionBankList} />
      <Divider />
      {/*Divider: 用来在不同内容之间插入分割线，通常用于视觉上区分不同的区块。*/}
      <Flex justify="space-between" align="center">
        <Title level={3}>最新题目</Title>
        <Link href={"/questions"}>查看更多</Link>
      </Flex>
      <QuestionList questionList={questionList} />
    </div>
  );
}
