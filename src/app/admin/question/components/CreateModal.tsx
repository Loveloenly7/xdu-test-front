import { addQuestionUsingPost } from "@/api/questionController";
import { ProColumns, ProTable } from "@ant-design/pro-components";
import { message, Modal } from "antd";
import React from "react";

/*创建题目的弹窗组件 CreateModal，用来在前端通过 ProTable 表单提交创建的题目信息*/

interface Props {
  visible: boolean;
  // 控制弹窗显示
  columns: ProColumns<API.Question>[];
  // 表单的列配置 有哪些字段是需要你填写的
  onSubmit: (values: API.QuestionAddRequest) => void;
  // 提交表单的回调
  onCancel: () => void;
  // 取消关闭弹窗的回调
}

/**
 * 添加节点的函数
 * @param fields
 */
const handleAdd = async (fields: API.QuestionAddRequest) => {
  const hide = message.loading("正在添加");
  try {
    await addQuestionUsingPost(fields);
    // 向后端发送请求添加题目
    hide();
    // 关闭加载提示
    message.success("创建成功");
    // 成功提示
    return true;
  } catch (error: any) {
    hide();
    // 关闭加载提示
    message.error("创建失败，" + error.message);
    // 失败提示
    return false;
  }
};

/**
 * 创建弹窗
 * @param props
 * @constructor
 */
const CreateModal: React.FC<Props> = (props) => {
  const { visible, columns, onSubmit, onCancel } = props;

  return (
    <Modal
      destroyOnClose
      // 关闭弹窗时销毁内容
      title={"创建"}
      // 弹窗标题
      open={visible}
      // 控制弹窗的显示状态
      footer={null}
      // 不显示默认的 footer
      onCancel={() => {
        onCancel?.();
        // 取消时调用 todo 父组件的 onCancel 回调
      }}
    >
      <ProTable
        type="form"
        // 表单类型的 ProTable
        columns={columns}
        // 传入表单字段的列配置
        onSubmit={async (values: API.QuestionAddRequest) => {
          const success = await handleAdd(values);
          // 提交表单并处理添加
          if (success) {
            onSubmit?.(values);
            // 如果添加成功，调用父组件的 onSubmit 回调
          }
        }}
      />
    </Modal>

    /*依然是 弹窗里面包一个表单*/

    /*小结：
  CreateModal 是一个弹窗组件，用于创建题目。
  ProTable 用于渲染表单，它的 columns 配置项由父组件传入。
  在用户提交表单时，数据通过 handleAdd 函数提交到后端。
  请求成功或失败后会分别显示提示消息。
  这样，用户就可以通过该弹窗创建新的题目，并将数据发送到后端。*/
  );
};
export default CreateModal;
