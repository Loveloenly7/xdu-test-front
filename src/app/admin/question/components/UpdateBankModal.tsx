import { Form, message, Modal, Select } from "antd";
import React, { useEffect, useState } from "react";
import {
  addQuestionBankQuestionUsingPost,
  listQuestionBankQuestionVoByPageUsingPost,
  removeQuestionBankQuestionUsingPost,
} from "@/api/questionBankQuestionController";
import { listQuestionBankVoByPageUsingPost } from "@/api/questionBankController";

//准备直接复用这个组件 更改题目所属的题库的组件
//todo 复用update 来写的 题目题库绑定关系组件

interface Props {
  questionId?: number;
  visible: boolean;
  onCancel: () => void;
}

/*Props

属性	类型	说明
questionId	number	当前题目 ID
visible	boolean	控制弹窗是否显示
onCancel	() => void	关闭弹窗时的回调*/

/**
 * 更新题目所属题库弹窗
 * @param props
 * @constructor
 */
const UpdateBankModal: React.FC<Props> = (props) => {
  const { questionId, visible, onCancel } = props;

  const [form] = Form.useForm();
  const [questionBankList, setQuestionBankList] = useState<
    API.QuestionBankVO[]
  >([]);
  /*form：Ant Design 的表单实例，用于控制表单数据。
questionBankList：存储题库列表。
todo 为什么 题库列表这里要用钩子？*/

  // 获取所属题库列表
  const getCurrentQuestionBankIdList = async () => {
    try {
      const res = await listQuestionBankQuestionVoByPageUsingPost({
        questionId,
        pageSize: 20,
      });
      const list = (res.data?.records ?? []).map((item) => item.questionBankId);
      console.log(list);
      form.setFieldValue("questionBankIdList" as any, list);
    } catch (e) {
      message.error("获取题目所属题库列表失败，" + e.message);
    }
  };

  useEffect(() => {
    if (questionId) {
      getCurrentQuestionBankIdList();
    }
  }, [questionId]);

  /*调用后端接口，获取当前题目所属的题库。
提取 questionBankId 列表，设置为表单字段的默认值。
调用时机：当 questionId 改变时，通过 useEffect 执行。
因为反复打开同一个*/

  // 获取题库列表
  const getQuestionBankList = async () => {
    // 题库数量不多，直接全量获取
    const pageSize = 200;

    try {
      const res = await listQuestionBankVoByPageUsingPost({
        pageSize,
        sortField: "createTime",
        sortOrder: "descend",
      });
      setQuestionBankList(res.data?.records ?? []);
    } catch (e) {
      message.error("获取题库列表失败，" + e.message);
    }
  };

  useEffect(() => {
    getQuestionBankList();
  }, []);

  /*逻辑：
调用后端接口，获取所有题库列表。
存储在 questionBankList 中，供选择框使用。
调用时机：组件加载时，通过 useEffect 执行。*/

  return (
    <Modal
      destroyOnClose
      title={"更新所属题库"}
      open={visible}
      footer={null}
      onCancel={() => {
        onCancel?.();
      }}
    >
      <Form form={form} style={{ marginTop: 24 }}>
        <Form.Item label="所属题库" name="questionBankIdList">
          <Select
            mode="multiple"
            // 设置为多选模式
            style={{ width: "100%" }}
            // 设置组件宽度为100%，
            // 占满父元素的宽度
            options={questionBankList.map((questionBank) => {
              return {
                label: questionBank.title,
                // 下拉选项的文本，显示题库的标题
                value: questionBank.id,
                // 下拉选项的值，题库的ID，用于后台交互
              };
            })}
            //内置方法 选择的时候调用
            onSelect={async (value) => {
              const hide = message.loading("正在更新");
              // 显示加载中的提示

              try {
                await addQuestionBankQuestionUsingPost({
                  questionId,
                  questionBankId: value,
                  // 在选择题库时，发送请求绑定题库
                });

                hide(); // 隐藏加载提示

                message.success("绑定题库成功"); // 显示绑定成功的提示信息
              } catch (error: any) {
                hide(); // 隐藏加载提示
                message.error("绑定题库失败，" + error.message); // 显示绑定失败的错误信息
              }
            }}
            //内置方法 取消选中的时候调用
            onDeselect={async (value) => {
              const hide = message.loading("正在更新"); // 显示加载中的提示

              try {
                await removeQuestionBankQuestionUsingPost({
                  questionId,
                  questionBankId: value,
                  // 在取消选择题库时，发送请求取消绑定
                });
                hide(); // 隐藏加载提示
                message.success("取消绑定题库成功"); // 显示取消成功的提示信息
              } catch (error: any) {
                hide(); // 隐藏加载提示
                message.error("取消绑定题库失败，" + error.message); // 显示取消失败的错误信息
              }
            }}
          />

          {/*关于这里的选择组件*/}
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default UpdateBankModal;
