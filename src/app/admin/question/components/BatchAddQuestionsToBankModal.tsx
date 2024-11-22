import { Button, Form, message, Modal, Select } from "antd";
import React, { useEffect, useState } from "react";
import { listQuestionBankVoByPageUsingPost } from "@/api/questionBankController";
import { batchAddQuestionsToBankUsingPost } from "@/api/questionBankQuestionController";

interface Props {
  questionIdList?: number[];
  // 题目 ID 列表
  visible: boolean;
  // 控制弹窗显示
  onSubmit: () => void;
  // 提交成功后的回调
  onCancel: () => void;
  // 取消时的回调
}

/**
 * 批量向题库添加题目弹窗
 * @param props
 * @constructor
 */
const BatchAddQuestionsToBankModal: React.FC<Props> = (props) => {
  const { questionIdList = [], visible, onCancel, onSubmit } = props;

  const [form] = Form.useForm();
  const [questionBankList, setQuestionBankList] = useState<
    API.QuestionBankVO[]
  >([]);

  /*State 和 Form：
questionBankList：存储题库的列表，供用户选择。
使用 Form.useForm() 创建一个表单实例，用来管理表单的状态和提交。*/

  //冗余了 这个方法可以抽象 todo 抽象出来
  const getQuestionBankList = async () => {
    const pageSize = 200;
    try {
      const res = await listQuestionBankVoByPageUsingPost({
        pageSize,
        sortField: "createTime",
        sortOrder: "descend",
      });
      setQuestionBankList(res.data?.records ?? []);
      // 设置题库列表
    } catch (e) {
      message.error("获取题库列表失败，" + e.message);
      // 错误提示
    }
  };

  /**
   * 提交
   *
   * @param values
   */

  const doSubmit = async (values: API.QuestionBankQuestionBatchAddRequest) => {
    const hide = message.loading("正在操作");
    // 显示加载提示

    const questionBankId = values.questionBankId;

    if (!questionBankId) {
      return;
    }
    try {
      await batchAddQuestionsToBankUsingPost({
        questionBankId,
        questionIdList,
      });
      // 批量添加题目到题库

      hide();
      message.success("操作成功");
      // 成功提示
      onSubmit?.();
      // 调用父组件的回调
    } catch (error: any) {
      hide();
      message.error("操作失败，" + error.message);
      // 失败提示
    }
  };

  useEffect(() => {
    getQuestionBankList(); // 获取题库列表
  }, []); // 只在组件首次渲染时调用

  /*渲染逻辑
  弹窗内容：
使用 Modal 包裹表单，提供一个选择题库的下拉框 (Select) 供用户选择题库。
Select 中的选项来自 questionBankList，每个选项包含题库的 title 和 id。
表单提交时，调用 doSubmit 处理添加题目到题库的操作。*/

  return (
    <Modal
      destroyOnClose
      title={"批量向题库添加题目"}
      open={visible}
      footer={null}
      onCancel={() => {
        onCancel?.();
        // 点击关闭时触发 onCancel 回调
      }}
    >
      <Form form={form} style={{ marginTop: 24 }} onFinish={doSubmit}>
        <Form.Item label="选择题库" name="questionBankId">
          <Select
            style={{ width: "100%" }}
            options={questionBankList.map((questionBank) => {
              return {
                label: questionBank.title,
                // 显示题库名称
                value: questionBank.id,
                // 题库 ID
              };
            })}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );

  /*小结：
BatchAddQuestionsToBankModal 是一个批量将题目添加到题库的弹窗组件。
用户选择一个题库，并提交选择的题目 ID 列表，将题目添加到该题库中。
组件通过 ProTable 形式提供表单，表单提交时通过 doSubmit 处理批量添加题目的逻辑。*/
};
export default BatchAddQuestionsToBankModal;
