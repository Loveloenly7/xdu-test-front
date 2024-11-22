"use server";
//todo 服务器端渲染
// 标记为服务端组件，表示此代码仅在服务器上运行
import { Flex, Menu, message } from "antd";
// 引入 Ant Design 的 Flex 布局、Menu 菜单和 message 消息组件
import { getQuestionBankVoByIdUsingGet } from "@/api/questionBankController";
// 引入获取题库信息的 API 请求方法
import Title from "antd/es/typography/Title";
// 引入 Ant Design 中的 Title 组件，用于显示标题
import { getQuestionVoByIdUsingGet } from "@/api/questionController";
// 引入获取题目详情的 API 请求方法
import Sider from "antd/es/layout/Sider";
// 引入 Ant Design 的 Sider 组件，通常用于页面的侧边栏
import { Content } from "antd/es/layout/layout";
// 引入 Content 组件，用于显示页面内容
import QuestionCard from "@/components/QuestionCard";
// 引入自定义组件 QuestionCard，用于展示题目信息
import Link from "next/link";
// 引入 Next.js 的 Link 组件，用于页面跳转
import "./index.css"; // 引入 CSS 样式文件

/**
 * 题库题目详情页
 * @constructor
 */
export default async function BankQuestionPage({ params }) {
  const { questionBankId, questionId } = params;
  /*这里使用了 Next.js 的服务器端渲染功能
  ，函数 BankQuestionPage 是一个异步函数，
  接收 params 参数，params 包含了 URL 中的动态参数（
  即题库ID和题目ID）。例如，当 URL 为 /bank/1/question/2 时
  ，questionBankId 为 1，questionId 为 2。

*/

  // 拿题库里的题目列表
  let bank = undefined;

  try {
    const res = await getQuestionBankVoByIdUsingGet({
      id: questionBankId,
      needQueryQuestionList: true,
      // todo 可以自行扩展为分页实现
      pageSize: 200,
    });
    //拿到全部的题目
    bank = res.data;
  } catch (e) {
    console.error("获取题库列表失败，" + e.message);
  }
  // 错误处理
  if (!bank) {
    return <div>获取题库详情失败，请刷新重试</div>;
  }

  // 获取题目详情
  let question = undefined;

  try {
    const res = await getQuestionVoByIdUsingGet({
      id: questionId,
    });
    question = res.data;
  } catch (e) {
    console.error("获取题目详情失败，" + e.message);
  }
  // 错误处理
  if (!question) {
    return <div>获取题目详情失败，请刷新重试</div>;
  }

  // 题目菜单列表
  //todo 详情页左侧的题目列表如何生成的
  const questionMenuItemList = (bank.questionPage?.records || [])
    // todo 这个常量依然保存的是一个数组 只是说map了一下 处理了每一项的渲染逻辑
    .map((q) => {
      //todo map方法依然会返回一个新数组！
      //map遍历集合 然后渲染 Link
      //每一个链接都是一个菜单项
      return {
        label: (
          //似乎label是 menu能够接受的数据格式
          <Link href={`/bank/${questionBankId}/question/${q.id}`}>
            {q.title}
          </Link>
        ),
        key: q.id,
        /*key: 对应菜单项的唯一标识。React 要求在渲染列表时，
        每个列表项都需要一个唯一的 key 属性，
        以便进行高效的更新和渲染。这里使用 q.id 作为每个菜单项的 key，确保每个题目在 Menu 中都有唯一标识。
        一句话 提高性能的哈希表*/
        //   todo 这个key拿来干嘛的。？
      };
    });
  /*整个语句的作用是：

从 bank.questionPage?.records 中获取题目列表（如果没有数据，则使用空数组）。
遍历题目列表，对于每个题目生成一个包含 label 和 key 的对象，label 是题目标题的链接，key 是题目的唯一标识。
最终返回一个包含所有菜单项的数组 questionMenuItemList，它将被传递给 Ant Design 的 Menu 组件来显示在侧边栏。
这段代码的核心是使用 map() 方法生成菜单项数据，并且通过模板字符串动态构造了每个菜单项的跳转链接。*/

  return (
    <div id="bankQuestionPage">
      <Flex gap={24}>
        {/*flex布局 一行两列 间隔24px*/}
        <Sider width={240} theme="light" style={{ padding: "24px 0" }}>
          {/*设置宽度为 240px，固定宽度防止和右侧内容冲突。*/}
          <Title level={4} style={{ padding: "0 20px" }}>
            {bank.title}
          </Title>
          <Menu items={questionMenuItemList} selectedKeys={[question.id]} />
          {/*在菜单中高亮当前题目，可以通过 Menu 组件的 selectedKeys 属性实现选中高亮。根据 questionId 进行匹配，
          选中高亮的实现*/}
          {/*  用menu显示了每一项*/}
        </Sider>
        {/*todo flex是怎么确定sider和flex的排列顺序的？*/}
        <Content>
          <QuestionCard question={question} />
          {/*  写好的 可以复用的题目展示卡片组件。。*/}

          {/*todo 评论区打算加到这里*/}
          <CommentSection questionId={question.id} />
        </Content>
      </Flex>
    </div>
  );
}
