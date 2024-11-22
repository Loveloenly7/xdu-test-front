import { updateQuestionUsingPost } from "@/api/questionController";
import { ProColumns, ProTable } from "@ant-design/pro-components";
import { message, Modal } from "antd";
import React from "react";

interface Props {
  oldData?: API.Question;
  visible: boolean;
  columns: ProColumns<API.Question>[];
  onSubmit: (values: API.QuestionAddRequest) => void;
  onCancel: () => void;
}
/*类型说明
* Props

属性	类型	说明
oldData	API.Question	初始数据，用于填充表单默认值
visible	boolean	是否显示弹窗
columns	ProColumns<API.Question>[]	表单列配置，用于定义表单的字段和类型
onSubmit	(values) => void	表单提交后的回调
onCancel	() => void	关闭弹窗时的回调*/

/**
 * 修改题目信息 具体的后端方法执行
 *
 * @param fields
 */
const handleUpdate = async (fields: API.QuestionUpdateRequest) => {
  const hide = message.loading("正在更新"); // 显示加载中消息
  try {
    await updateQuestionUsingPost(fields); // 调用后端接口，提交更新数据
    hide(); // 隐藏加载中消息
    message.success("更新成功"); // 显示成功提示
    return true; // 返回成功状态
  } catch (error: any) {
    hide(); // 隐藏加载中消息
    message.error("更新失败，" + error.message); // 显示错误提示
    return false; // 返回失败状态
  }
};

/**
 * 更新弹窗 弹窗组件
 * @param props
 * @constructor
 */
const UpdateModal: React.FC<Props> = (props) => {
  const { oldData, visible, columns, onSubmit, onCancel } = props;

  if (!oldData?.id) {
    return <></>; // 如果没有传递有效数据，返回空内容
  }

  // 表单初始化值格式转换
  const initValues = { ...oldData };

  if (oldData.tags) {
    initValues.tags = JSON.parse(oldData.tags) || []; // 将 `tags` 转为数组格式
  }

  return (
    <Modal
      destroyOnClose
      title={"更新题目信息"}
      open={visible}
      footer={null} // 自定义表单的底部
      onCancel={() => {
        onCancel?.(); // 执行关闭弹窗的回调
      }}
    >
      {/*footer={null}：移除默认的确认和取消按钮，因为 ProTable 自带提交功能。
      destroyOnClose：关闭弹窗时销毁表单数据，避免残留数据影响下次使用。*/}
      <ProTable
        type="form" // 设置表单类型
        columns={columns} // 定义表单字段
        {/*  todo 表单字段在哪？*/}
        form={{
          initialValues: initValues, // 填充默认值 默认值是当前的数值
        }}
        onSubmit={async (values: API.QuestionAddRequest) => {
          const success = await handleUpdate({
            ...values,
            id: oldData?.id, // 传递旧数据的 ID 作为更新依据
          });
          if (success) {
            onSubmit?.(values); // 如果更新成功，执行提交回调
          }
        }}
      />
    </Modal>
  );
};
export default UpdateModal;
