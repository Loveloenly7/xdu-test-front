// import { Editor } from "@bytemd/react";
// import gfm from "@bytemd/plugin-gfm";
// // gfm 插件：提供 GitHub Flavored Markdown（GFM）支持，允许用户使用 GitHub 风格的扩展语法（如任务列表、表格等）
//
// import highlight from "@bytemd/plugin-highlight";
// // highlight 插件：提供代码高亮功能，支持多种语言的语法高亮。
// import "github-markdown-css/github-markdown-light.css";
// //  GitHub 风格的 CSS，允许预览区域中的 Markdown 内容呈现出类似 GitHub 风格的样式。
// import "bytemd/dist/index.css";
// // ByteMD 的默认样式
// import "highlight.js/styles/vs.css";
// // highlight.js/styles/vs.css: 使用 highlight.js 提供的 VS 样式的代码高亮。
// import "./index.css";
// // 自定义CSS
//
// //todo 通用的MD编辑器组件
//
// interface Props {
//   value?: string;
//   onChange?: (v: string) => void;
//   placeholder?: string;
// }
// /*value（可选）：Markdown 编辑器的初始值（即默认文本）。
// onChange（可选）：当编辑器的内容发生变化时，回调的函数，传入新的 Markdown 内容。
// placeholder（可选）：输入框的占位符文本。*/
//
// const plugins = [gfm(), highlight()];
// /*plugins 数组包含了编辑器支持的插件
// ，当前包括 gfm()（GitHub 风格的 Markdown）和 highlight()（代码高亮插件）。*/
//
// /**
//  * Markdown 编辑器
//  * @param props
//  * @constructor
//  */
// const MdEditor = (props: Props) => {
//   //传入属性
//   const { value = "", onChange, placeholder } = props;
//   //初始属性进行解构
//   //可以在这里写MD组件的初始应该包含什么
//
//   return (
//     <div className="md-editor">
//       <Editor
//         value={value || ""}
//         {/*将 props.value 传递给 Editor，如果没有传递 value，则使用空字符串作为默认值。*/}
//         placeholder={placeholder}
//         {/*placeholder={placeholder}：将 props.placeholder 传递给 Editor，作为输入框的占位符。*/}
//         mode="split"
//         {/*mode="split"：编辑器和预览分屏显示，左侧为 Markdown 编辑区，右侧为 Markdown 渲染后的预览区。
//         todo 要更改分屏效果！*/}
//         plugins={plugins}
//         {/*插件传递给编辑器，启用 GFM 和代码高亮功能。*/}
//         onChange={onChange}
//       {/*  onChange={onChange}：每当编辑器内容发生变化时，触发 onChange 回调，传递新的 Markdown 内容。*/}
//       {/*    todo 我想知道的是 如何传递MD里面的数据的呢。。？*/}
//       />
//     </div>
//   );
// };
//
// export default MdEditor;

//todo 换了个md 解决了 全局显示的bug

import React from "react";
import MDEditor from "@uiw/react-md-editor";
import "github-markdown-css/github-markdown-light.css"; // GitHub 风格的 CSS
import "highlight.js/styles/vs.css"; // highlight.js 样式

import "./index.css"; // 自定义CSS

interface Props {
  value?: string;
  onChange?: (v: string) => void;
  placeholder?: string;
}

/**
 * Markdown 编辑器
 * @param props
 * @constructor
 */
const MdEditor = (props: Props) => {
  const { value = "", onChange, placeholder } = props;

  return (
    <div className="md-editor">
      <MDEditor
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        height={400} // 设置高度
        preview="live" // 预览模式
        visibleDragbar={false} // 禁用拖拽
      />
    </div>
  );
};

export default MdEditor;
