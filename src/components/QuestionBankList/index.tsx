"use client";
import { Avatar, Card, List, Typography } from "antd";
import Link from "next/link";
import "./index.css";
/*"use client";: 这是 Next.js 13 引入的一个指令，表明该文件是客户端组件，必须在客户端执行。
import { Avatar, Card, List, Typography } from "antd";: 从 Ant Design 导入了一些常用的 UI 组件，Avatar 用于头像显示，Card 用于卡片布局，List 用于列表展示，Typography 用于文本排版。
import Link from "next/link";: 引入了 Next.js 提供的 Link 组件，用于在 React 中进行页面跳转。
import "./index.css";: 引入自定义的 CSS 样式文件。*/

interface Props {
  questionBankList: API.QuestionBankVO[];
}
/*interface Props: 这是 TypeScript 的接口定义，定义了该组件的 props 类型。
questionBankList 是一个数组，
数组的元素类型为 API.QuestionBankVO，
假设 API.QuestionBankVO 是一个题库的对象类型。*/

/**
 * 题库列表组件
 * @param props
 * @constructor
 */
const QuestionBankList = (props: Props) => {
  const { questionBankList = [] } = props;
  /*解构 props，获取 questionBankList，如果没有传递该属性，则使用空数组 [] 作为默认值。*/

  const questionBankView = (questionBank: API.QuestionBankVO) => {
      //想想题库 单个题库的数据是怎么被传进来的
    /*questionBankView: 这是一个函数，
      用于渲染
      每一个
      题库项。*/
    return (
      <Card>
        {/*Card: 使用 Ant Design 的 Card 组件来展示题库内容。*/}
        <Link href={`/bank/${questionBank.id}`}>
          {/*Link 组件包裹住 Card，点击时跳转到 /bank/{questionBank.id} 页面。
            注意这里是link包裹card！*/}
          <Card.Meta
            avatar={<Avatar src={questionBank.picture} />}
            {/*avatar={<Avatar src={questionBank.picture} />}: 使用 Avatar 组件展示题库的头像，questionBank.picture 是头像的图片地址。*/}
            title={questionBank.title}
            description={
              /*todo 题库信息的简单描述
              *  description: 使用 Typography.Paragraph 来展示题库的描述，
              * type="secondary" 用来设置字体为次要颜色，
              * ellipsis={{ rows: 1 }} 用来限制描述文本最多显示一行，超出部分省略。*/
              <Typography.Paragraph
                type="secondary"
                ellipsis={{ rows: 1 }}
                style={{ marginBottom: 0 }}
              >
                {questionBank.description}
              </Typography.Paragraph>
            }
          />
        </Link>
      </Card>
    );
  };

  /*一个包含图片 包含单行信息的组件*/

  return (
    <div className="question-bank-list">
      <List
        grid={{
          gutter: 16,
          column: 4,
          xs: 1,
          sm: 2,
          md: 3,
          lg: 3,
        }}
        dataSource={questionBankList}
        {/*<List>: 使用 Ant Design 的 List 组件来展示一个列表。
grid: 配置了列表的网格布局，
gutter 设置了网格间距，column 设置列数，
xs, sm, md, lg 分别设置了不同屏幕尺寸下的列数。
dataSource={questionBankList}: 将传入的 questionBankList 作为列表数据源。*/}
        renderItem={(item) => <List.Item>{questionBankView(item)}</List.Item>}
        {/*箭头函数 表达式只有一个组件就是返回值！ 单个渲染*/}
      />
    </div>
  );
};

/*这个组件用于展示题库列表。它通过 Ant Design 的 List 组件展示每一个题库项，
每个题库项由 Card 组件呈现，包含一个头像、标题和描述
，点击标题可以跳转到该题库的详细页面。组件根据屏幕大小自适应布局，
使用了响应式设计来调整每行显示的列数。*/

export default QuestionBankList;
