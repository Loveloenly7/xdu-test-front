import { Button, Form, message, Modal, Select } from "antd";
import React, { useEffect, useState } from "react";
import { listQuestionBankVoByPageUsingPost } from "@/api/questionBankController";
import { batchRemoveQuestionsFromBankUsingPost } from "@/api/questionBankQuestionController";

/*批量移除题目从题库的弹窗功能，
使用了 Ant Design 的 Modal、Form、Button、Select 等组件*/

/*导入 Ant Design 的组件：
Button（按钮）、Form（表单）、message（消息提示框）、
Modal（模态框）和 Select（下拉选择框）。
导入 API 请求函数 listQuestionBankVoByPageUsingPost（获取题库列表）
和 batchRemoveQuestionsFromBankUsingPost（批量移除题目）。*/

interface Props {
  questionIdList?: number[];
  // 题目 ID 列表，可选
  visible: boolean;
  // 控制弹窗的显示与隐藏
  onSubmit: () => void;
  // 提交操作后的回调函数
  onCancel: () => void;
  // 取消操作后的回调函数
}

//实际上这几个写完了之后
//todo 总结modal小组件的设计模版

/**
 * 批量从题库移除题目 弹窗
 * @param props
 * @constructor
 */
const BatchRemoveQuestionsToBankModal: React.FC<Props> = (props) => {
  const { questionIdList = [], visible, onCancel, onSubmit } = props;

  const [form] = Form.useForm();
  // 创建表单实例

  const [questionBankList, setQuestionBankList] = useState<
    API.QuestionBankVO[]
  >([]);
  // 题库列表的状态

  /**
   * 提交
   *
   * @param values
   */

  // 提交操作
  const doSubmit = async (
    values: API.QuestionBankQuestionBatchRemoveRequest,
  ) => {
    const hide = message.loading("正在操作");
    // 显示加载中的提示

    const questionBankId = values.questionBankId;
    // 获取选择的题库 ID

    if (!questionBankId) {
      return;
    }

    try {
      await batchRemoveQuestionsFromBankUsingPost({
        questionBankId, // 题库 ID
        questionIdList, // 要移除的题目 ID 列表
      });

      hide();
      // 隐藏加载提示
      message.success("操作成功");
      // 显示成功提示
      onSubmit?.();
      // 执行提交后的回调
    } catch (error: any) {
      hide();
      // 隐藏加载提示
      message.error("操作失败，" + error.message);
      // 显示失败提示
    }
  };

  // 获取题库列表
  const getQuestionBankList = async () => {
    const pageSize = 200;
    // 题库的数量不多，最多获取200个
    try {
      const res = await listQuestionBankVoByPageUsingPost({
        pageSize,
        sortField: "createTime",
        // 根据创建时间排序
        sortOrder: "descend",
        // 降序排列
      });
      setQuestionBankList(res.data?.records ?? []);
      // 设置题库列表
    } catch (e) {
      message.error("获取题库列表失败，" + e.message);
      // 显示错误提示
    }
  };

  useEffect(() => {
    getQuestionBankList();
    // 组件加载时获取题库列表
  }, []);

  return (
    <Modal
      destroyOnClose
      title={"批量从题库移除题目"}
      // 弹窗标题
      open={visible}
      // 弹窗显示状态
      footer={null}
      // 不使用默认的底部按钮
      onCancel={() => {
        onCancel?.();
        // 关闭弹窗时执行回调
      }}
    >
      <Form form={form} style={{ marginTop: 24 }} onFinish={doSubmit}>
        <Form.Item label="选择题库" name="questionBankId">
          <Select
            style={{ width: "100%" }}
            options={questionBankList.map((questionBank) => {
              return {
                label: questionBank.title,
                // 下拉框显示题库标题
                value: questionBank.id,
                // 下拉框值为题库 ID
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
  /*该组件展示了一个 批量从题库移除题目 的功能，允许用户选择一个题库并提交要移除的题目。
  弹窗中包括了一个下拉选择框 (Select) 供用户选择题库，并提供提交按钮来提交操作。
  在表单提交时，使用 batchRemoveQuestionsFromBankUsingPost API 移除题目，并显示操作状态的提示信息。
  useEffect 钩子用于组件加载时自动获取题库列表。
  */
};
export default BatchRemoveQuestionsToBankModal;
