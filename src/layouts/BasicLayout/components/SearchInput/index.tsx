import { Input } from "antd";
import { useRouter } from "next/navigation";
import "./index.css";
//搜索框需要一个路由跳转的hook。。？

interface Props {}
//没有要传入的东西吗

/**
 * 搜索条组件
 * @constructor
 */
const SearchInput = (props: Props) => {
  //todo 页面跳转的实现
  const router = useRouter();
  // router 通过 useRouter 获取 Next.js 路由对象。通过该对象可以实现页面跳转

  return (
    <div
      className="search-input"
      aria-hidden
      {/*aria-hidden：这个属性标记该元素对屏幕阅读器隐藏（一般用于不需要被读取的 UI 元素）
      就有些浏览器 的阅读器模式？*/}
      style={{
        display: "flex",
        alignItems: "center",
        marginInlineEnd: 24,
      }}
      {/*style：内联样式，使用 flex 布局，
      alignItems: "center" 使内容垂直居中，
      marginInlineEnd: 24 添加右边距。*/}
    >

        {/*第一个 style - 控制 div 容器的布局
style={{
  display: "flex",
  alignItems: "center",
  marginInlineEnd: 24,
}}
display: "flex"：
设置 div 容器为 flex 布局模式。flex 布局是一个非常强大的布局模型，它允许子元素在容器中灵活地排列。这里的 div 容器会使用 flex 来处理子元素的排列方式。
alignItems: "center"：
在 flex 布局中，alignItems 用来控制 垂直方向上的对齐方式。center 表示所有子元素（这里是 Input.Search）会在垂直方向上居中对齐。也就是说，搜索框将会垂直居中显示。
marginInlineEnd: 24：
marginInlineEnd 是一种逻辑的边距属性，表示右边距（在从左到右的语言中即为右边距）。这里的 24 表示在 div 容器的右边添加 24px 的空白区域，用来控制右侧的间距。*/}
      <Input.Search
        style={{
          borderRadius: 4,
          marginInlineEnd: 12,
        }}
        {/*style={{ borderRadius: 4, marginInlineEnd: 12 }}：
        设置搜索框的圆角（borderRadius: 4）和右边距（marginInlineEnd: 12）。*/}
        placeholder="搜索题目"
        //怎么换这里的提示词语？
        onSearch={(value) => {
          router.push(`/questions?q=${value}`);
        }}
        //在 onSearch 回调中，调用 router.push() 方法，
          // 通过路由跳转到 /questions 页面
          //应该是直接去了 题目的搜索页面
          // ，并将搜索关键字 q=${value} 作为查询参数附加到 URL 中，value 即用户输入的搜索词。

          {/*router.push() 方法用于编程式路由跳转。
通过 router.push 跳转到 /questions 页面，并附带 q 查询参数，
q 参数的值是用户在搜索框中输入的内容。
这意味着当用户搜索某个关键词时，页面会跳转到题目列表页面，
并根据查询参数 q 过滤题目。*/}
      />

        {/*borderRadius: 4：
设置 Input.Search 组件的边框圆角为 4px。这会使得搜索框的四个角变得圆润，呈现一个平滑的外观。
marginInlineEnd: 12：
marginInlineEnd 也是一种逻辑的边距属性，表示右边距。这里给 Input.Search 组件的右边添加了 12px 的间距，目的是确保搜索框和其后面的内容（如果有的话）之间有一定的空隙。*/}
    </div>
  );
};

export default SearchInput;
