"use client";
import { Card, List } from "antd";
import TagList from "@/components/TagList";
import Link from "next/link";
import "./index.css";

interface Props {
  questionBankId?: number;
  questionList: API.QuestionVO[];
  cardTitle?: string;
}
/*interface Props: 定义了组件的 props 类型。这里有三个属性：
questionBankId?: 可选的
questionBankId，用于标识当前题库的 ID，如果有这个属性，题目链接会带上该 ID。
questionList: 必须传递的
属性，表示题目列表，类型是 API.QuestionVO[]，假设这是一个包含题目对象的数组。
cardTitle?: 可选的
 cardTitle，表示卡片的标题。*/

/**
 * 题目列表组件
 * @param props
 * @constructor
 */
const QuestionList = (props: Props) => {
  /*todo props的作用
   *  现在感觉可以理解为 一层封装 QuestionList: 这是一个函数组件，接收 Props 类型的 props 作为参数。
   * 类似于建造者模式*/
  const { questionList = [], cardTitle, questionBankId } = props;

  /* 解构 props，获取 questionList、cardTitle 和 questionBankId。
  其中 questionList 默认值为空数组 []，
  如果没有传递该属性，则使用空数组*/
  return (
    <Card className="question-list" title={cardTitle}>
      {/*<Card>: 使用 Ant Design 的 Card 组件包装整个题目列表，设置 className="question-list" 来应用自定义样式，title={cardTitle} 来显示卡片标题。*/}
      <List
        dataSource={questionList}
        renderItem={(item) => (
          /*renderItem 用来渲染每一项数据。item 是 questionList 中的一个题目对象。*/
          <List.Item extra={<TagList tagList={item.tagList} />}>
            {/*<List.Item>: 每个题目都会被包裹在一个 List.Item 组件中。*/}
            {/*extra={<TagList tagList={item.tagList} />}:
               extra 用来渲染额外的内容，
              TagList 组件会展示与该题目关联的标签。
              item.tagList 是题目对象中的标签数组。
              也就是 标签列表被额外渲染了*/}
            <List.Item.Meta
                {/*List.Item.Meta>: List.Item 的元数据部分，包含了题目的标题链接。*/}
              title={
                <Link
                  href={
                    questionBankId
                      ? `/bank/${questionBankId}/question/${item.id}`
                      : `/question/${item.id}`
                  }
                  {/*如果有 questionBankId，则跳转到 /bank/{questionBankId}/question/{item.id} 页面。
如果没有 questionBankId，则跳转到 /question/{item.id} 页面。
因为有些题目暂时还没分类吗？？
*/}
                >
                  {item.title}
                </Link>
              }
            />
          </List.Item>
        )}
      />
    </Card>
  );
};

export default QuestionList;

/*QuestionList 组件用于渲染一个题目列表。
每个题目会显示一个标题，标题是一个链接，
点击后会跳转到该题目的详细页面。每个题目还会显示与其关联的标签，
标签通过 TagList 组件来渲染。
整个列表被包裹在一个 Ant Design 的 Card 组件中
，卡片的标题可以通过 cardTitle 属性传入。
questionBankId 可选属性用于在链接中加上题库的 ID。*/
