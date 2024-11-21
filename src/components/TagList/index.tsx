import { Tag } from "antd";
import "./index.css";

interface Props {
  tagList?: string[];
}

/**
 * 标签列表组件
 * @param props
 * @constructor
 */
const TagList = (props: Props) => {
  //每个组件都要先解构吗？
  const { tagList = [] } = props;

  return (
    <div className="tag-list">
      {tagList.map((tag) => {
        // todo 遍历 返回了。。
        return <Tag key={tag}>{tag}</Tag>;
      })}
    </div>
  );
};

export default TagList;

/*单独封装为一个组件，便于复用（题目详情页也要用）。代码如下：*/
