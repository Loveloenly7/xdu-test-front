import { addUserUsingPost } from "@/api/userController";
import { ProColumns, ProTable } from "@ant-design/pro-components";
import { message, Modal } from "antd";
import React from "react";
/*addUserUsingPost：这是一个导入的 API 请求函数，用于向服务器发送新用户的添加请求。
ProColumns 和 ProTable：这些是 Ant Design Pro 的组件，ProTable 是一个高度可定制的表格组件，而 ProColumns 定义了表格的列。
message 和 Modal：来自 Ant Design，用于展示消息提示和模态框组件。
React：作为基础库，提供了 React 相关的功能。*/

interface Props {
  visible: boolean;
  columns: ProColumns<API.User>[];
  onSubmit: (values: API.UserAddRequest) => void;
  onCancel: () => void;
}
/*CreateModal 组件的属性（props）接口 Props，包含了四个字段：

visible：控制模态框的显示与隐藏。
columns：传入表格列配置，用来在表单中渲染字段。
onSubmit：提交表单时的回调函数，接受表单数据。
onCancel：取消操作时的回调函数，关闭模态框。*/

/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: API.UserAddRequest) => {
  //异步的箭头函数 这算匿名吗
  const hide = message.loading("正在添加");
  //antd的组件 message！
  try {
    await addUserUsingPost(fields);
    hide();
    //后端方法 调用成功后隐藏
    message.success("创建成功");
    return true;
  } catch (error: any) {
    hide();
    message.error("创建失败，" + error.message);
    return false;
  }
};

/**
 * 创建弹窗
 * @param props
 * @constructor
 */
const CreateModal: React.FC<Props> = (props) => {
  //不不不 组件是一个常量在这！！
  //冒号表示 组件的类型是React.FC<Props>
  /*React.FC<Props>
这是 TypeScript 中对 CreateModal 函数组件的类型注解。
这里 React.FC<Props> 表示 CreateModal 组件是一个函数组件
FC 是 Functional Component 的缩写。
React 官方提供的一个泛型类型
，且它的 props 类型是 Props。*/

  /*React.FC<Props> 的作用：

React.FC 会给组件自动添加一些类型，包括：
默认给 children 添加 ReactNode 类型（表示组件可能接收任何类型的子节点）。
自动推断 props 的类型（这里是 Props）。*/
  //这里是组件本身 而不是一个函数。。
  //其实也可以理解为一个函数

  /*= (props) => {}
这一部分定义了 CreateModal 作为一个箭头函数（Arrow Function）。
这个箭头函数接收 props 作为参数，并且返回一个 JSX 元素。*/
  const { visible, columns, onSubmit, onCancel } = props;

  return (
    <Modal
      destroyOnClose
      {/*destroyOnClose：确保模态框关闭时销毁其内容，避免内存泄漏。*/}
      title={"创建"}
      open={visible}
      footer={null}
      {/*footer={null}：取消底部默认按钮，避免自动显示关闭和确定按钮。*/}
      onCancel={() => {
        onCancel?.();
      }}
    {/*  点击模态框的关闭按钮时，调用 onCancel 函数，关闭模态框。。。？*/}
    >
      <ProTable
        {/*  我们嵌套了一个 ProTable，用于显示用户的创建表单。*/}
        type="form"
        {/*type="form"：指定该表格作为表单使用，表格中的每一列会变成输入框。*/}
        columns={columns}
        onSubmit={async (values: API.UserAddRequest) => {
          const success = await handleAdd(values);
          if (success) {
            onSubmit?.(values);
          }
        }}
      />
    </Modal>
  );
};
export default CreateModal;
