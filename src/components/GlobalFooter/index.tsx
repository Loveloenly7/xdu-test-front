import React from "react";
import "./index.css";

/**
 * 全局底部栏组件
 * @constructor
 */

export default function GlobalFooter() {
  //当前年份
  const currentYear = new Date().getFullYear();

  //返回一个JSX
  //这就是这个组件的UI部分
  return (
    <div className="global-footer">
      {/*  添加classname 绑定样式*/}
      {/*  动态显示 今年的年份*/}
      <div>© {currentYear} XDU校招备考系统</div>
      {/*  使用 {} 包裹 JavaScript 表达式，可以在 JSX 中插入动态内容。*/}
      <div>
        <a href="https://github.com/Loveloenly7" target="_blank">
          作者：HW
        </a>
      </div>
    </div>
  );
}
