import { Button, Result } from "antd";
/*使用了 Ant Design 的 Result 组件来展示错误信息，并提供了返回首页的按钮。
以下是代码的详细解析：*/

/**
 * 无权限访问的页面
 */

const Forbidden = () => {
  return (
    <Result
      status={403}
      title="403"
      subTitle="Sorry！没有权限访问！"
      extra={
        <Button type="primary" href="/">
          返回首页
        </Button>
      }
    />
  );
};

/*Result 组件
这是 Ant Design 提供的一个结果展示组件，常用于展示状态页面，如成功、失败、无权限等。
status: 定义结果状态，支持 403、404、500 等预设值。
title: 状态标题，可以是数字、字符串或 JSX 元素。
subTitle: 状态的补充描述，通常用于说明具体情况。
extra: 额外的操作区域，可放置按钮或其他操作元素。
Button 组件
type: 设置按钮样式，这里使用了 primary 表示主要按钮。
href: 按钮的跳转链接，当点击按钮时，跳转到指定页面。
*/

export default Forbidden;
