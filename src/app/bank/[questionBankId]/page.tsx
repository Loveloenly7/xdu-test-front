"use server";
import { Avatar, Button, Card, message } from "antd";
import { getQuestionBankVoByIdUsingGet } from "@/api/questionBankController";
import Meta from "antd/es/card/Meta";
import Paragraph from "antd/es/typography/Paragraph";
import Title from "antd/es/typography/Title";
import QuestionList from "@/components/QuestionList";
import "./index.css";

/**
 * 题库详情页
 * @constructor
 */
export default async function BankPage({ params }) {
  /*BankPage 是一个异步的 React 组件，
  接收 params 作为 props，
  params 中包含 questionBankId（题库的 ID）。*/
  const { questionBankId } = params;
  let bank = undefined;

  try {
    const res = await getQuestionBankVoByIdUsingGet({
      id: questionBankId,
      needQueryQuestionList: true,
      // 可以自行扩展为分页实现
      pageSize: 200,
    });
    //todo 这里直接拿到了分页的上限
    bank = res.data;
  } catch (e) {
    console.error("获取题库详情失败，" + e.message);
  }

  // 错误处理
  if (!bank) {
    return <div>获取题库详情失败，请刷新重试</div>;
  }

  // 获取第一道题目，用于 “开始刷题” 按钮跳转
  let firstQuestionId;
  if (bank.questionPage?.records && bank.questionPage.records.length > 0) {
    // 如果题库中有题目，则从 bank.questionPage.records 中取出第一道题目的 ID。
    firstQuestionId = bank.questionPage.records[0].id;
  }

  //下面渲染可以用上面let的变量
  return (
    <div id="bankPage" className="max-width-content">
      <Card>
        <Meta
            {/*展示卡片中的元信息（Meta Information）。Meta 组件通常用来显示标题、描述、头像等基本信息。*/}
          avatar={<Avatar src={bank.picture} size={72} />}
          title={
            <Title level={3} style={{ marginBottom: 0 }}>
              {bank.title}
            </Title>
          }
          description={
            <>
              <Paragraph type="secondary">{bank.description}</Paragraph>
              {/*第二 灰色*/}
              <Button
                type="primary"
                shape="round"
                href={`/bank/${questionBankId}/question/${firstQuestionId}`}
                target="_blank"
                disabled={!firstQuestionId}
                {/*todo 题库没有题目
                按钮无法点击
                Button：一个“开始刷题”按钮，点击后跳转到第一个题目的页面
                。按钮通过 href 设置了链接，disabled={!firstQuestionId} 确保如果题库中没有题目，按钮将无法点击。*/}
              >
                开始刷题
              </Button>
            </>
          }

            {/*这里meta 给出来了四个标签页的属性
            头像 标题 描述 以及一个开始刷题的按钮*/}
        />
        {/*meta标签*/}
      </Card>
      <div style={{ marginBottom: 16 }} />
      <QuestionList
          {/*导入的组件 传入上面的参数 然后跟组件的逻辑去走就好*/}
        questionBankId={questionBankId}
        questionList={bank.questionPage?.records ?? []}
        cardTitle={`题目列表（${bank.questionPage?.total || 0}）`}
      />
    {/*  这里甚至还显示了 题目的总数 todo 题库详情显示了题目总数*/}
    </div>
  );
}
