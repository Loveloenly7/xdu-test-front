"use server";
import Title from "antd/es/typography/Title";
import { message } from "antd";
import { searchQuestionVoByPageUsingPost } from "@/api/questionController";
import QuestionTable from "@/components/QuestionTable";
import "./index.css";

/**
 * 题目列表页面
 * @constructor
 */
export default async function QuestionsPage({ searchParams }) {
  /*searchParams：
Next.js 的 searchParams 是 URL 查询参数的对象，例如：
/questions?q=example
searchParams 会解析为 { q: 'example' }。*/

  //对这个next里面真的学过！！！

  // 获取 url 的查询参数
  const { q: searchText } = searchParams;
  /*searchParams 解构赋值：
将 searchParams 对象中的 q 提取为 searchText，即搜索文本。
如果 URL 是 /questions?q=java，则 searchText 的值为 "java"。*/

  //todo 看看题目列表页面怎么分页的
  // 题目列表和总数
  let questionList = [];
  let total = 0;

  try {
    const res = await searchQuestionVoByPageUsingPost({
      searchText,
      pageSize: 12,
      sortField: "createTime",
      sortOrder: "descend",
    });
    // 调用后端 拿分页数据的方法
    questionList = res.data.records ?? [];
    total = res.data.total ?? 0;
    //拿到该页数据 以及一页的总数
  } catch (e) {
    message.error("获取题目列表失败，" + e.message);
  }

  //开始页面渲染
  return (
    <div id="questionsPage" className="max-width-content">
      <Title level={3}>题目大全</Title>
      <QuestionTable
          {/*渲染题目列表表格
          todo 渲染题目表格*/}
        defaultQuestionList={questionList}
        defaultTotal={total}
        defaultSearchParams={{
          title: searchText,
          //查询后的结果 作为表格的名字
          /*todo 贴合ES的分词搜索！*/
          //todo 在哪显示的？
        }}

          {/*传入的 props：
defaultQuestionList：题目列表数据。
defaultTotal：题目总数。
defaultSearchParams：默认搜索参数（传入 title）。*/}
          {/*QuestionsPage
  ├── 获取 URL 参数 `q`
  ├── 初始化 `questionList` 和 `total`
  ├── 调用 API 获取题目列表
  │     ├── 成功：解析数据到 `questionList` 和 `total`
  │     └── 失败：显示错误提示
  └── 渲染页面
        ├── 标题 "题目大全"
        └── QuestionTable 显示数据*/}
      />
    </div>
  );
}
