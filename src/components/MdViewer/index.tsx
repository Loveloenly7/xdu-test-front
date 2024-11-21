import { Viewer } from "@bytemd/react";
import gfm from "@bytemd/plugin-gfm";
import highlight from "@bytemd/plugin-highlight";
import "github-markdown-css/github-markdown-light.css";
import "bytemd/dist/index.css";
import "highlight.js/styles/vs.css";
import "./index.css";

//todo 通用组件 MD浏览器

interface Props {
  value?: string;
}

const plugins = [gfm(), highlight()];

/**
 * Markdown 浏览器
 * @param props
 * @constructor
 */
const MdViewer = (props: Props) => {
  //解构设置 设置初始的是什么
  const { value = "" } = props;

  return (
    <div className="md-viewer">
      <Viewer value={value} plugins={plugins} />
      {/*  要渲染的内容 以及插件*/}
    </div>
  );
};

export default MdViewer;
