"use client";

import CreateModal from "./components/CreateModal";
import UpdateModal from "./components/UpdateModal";

import {
  batchDeleteQuestionsUsingPost,
  deleteQuestionUsingPost,
  listQuestionByPageUsingPost,
} from "@/api/questionController";

import { PlusOutlined } from "@ant-design/icons";

import type { ActionType, ProColumns } from "@ant-design/pro-components";

import { PageContainer, ProTable } from "@ant-design/pro-components";

import { Button, message, Popconfirm, Space, Table, Typography } from "antd";

import React, { useRef, useState } from "react";

import TagList from "@/components/TagList";
//标签列表
import MdEditor from "@/components/MdEditor";

import UpdateBankModal from "@/app/admin/question/components/UpdateBankModal";

import BatchAddQuestionsToBankModal from "@/app/admin/question/components/BatchAddQuestionsToBankModal";

import BatchRemoveQuestionsFromBankModal from "@/app/admin/question/components/BatchRemoveQuestionsFromBankModal";

import "./index.css";

/**
 * 题目管理页面
 *
 * @constructor
 */
const QuestionAdminPage: React.FC = () => {
  // 是否显示新建窗口
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  // 是否显示更新窗口
  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false);
  // 是否显示更新所属题库窗口
  const [updateBankModalVisible, setUpdateBankModalVisible] =
    useState<boolean>(false);

  // 是否显示批量向题库添加题目弹窗
  const [
    batchAddQuestionsToBankModalVisible,
    setBatchAddQuestionsToBankModalVisible,
  ] = useState<boolean>(false);
  // 是否显示批量从题库移除题目弹窗
  const [
    batchRemoveQuestionsFromBankModalVisible,
    setBatchRemoveQuestionsFromBankModalVisible,
  ] = useState<boolean>(false);

  // 当前选中的题目 id 列表
  const [selectedQuestionIdList, setSelectedQuestionIdList] = useState<
    number[]
  >([]);

  //对什么的引用来着 哦对 去更新表的数据我记得
  const actionRef = useRef<ActionType>();

  // 当前题目点击的数据
  const [currentRow, setCurrentRow] = useState<API.Question>();

  /**
   * 删除节点
   *
   * @param row
   */
  const handleDelete = async (row: API.Question) => {
    const hide = message.loading("正在删除");
    if (!row) return true;
    try {
      await deleteQuestionUsingPost({
        id: row.id as any,
      });
      hide();
      message.success("删除成功");
      actionRef?.current?.reload();
      return true;
    } catch (error: any) {
      hide();
      message.error("删除失败，" + error.message);
      return false;
    }
  };

  /**
   * 批量删除节点
   *
   * @param questionIdList
   */
  const handleBatchDelete = async (questionIdList: number[]) => {
    //todo 批量删除 只在这里实现了
    const hide = message.loading("正在操作");
    try {
      await batchDeleteQuestionsUsingPost({
        questionIdList,
      });
      hide();
      message.success("操作成功");
    } catch (error: any) {
      hide();
      message.error("操作失败，" + error.message);
    }
  };

  /**
   * 表格列配置
   */
  const columns: ProColumns<API.Question>[] = [
    {
      title: "id",
      dataIndex: "id",
      valueType: "text",
      hideInForm: true,
    },
    {
      title: "所属题库",
      // todo 仅用于表单查询 表格里面看不到和这个
      dataIndex: "questionBankId",
      hideInTable: true,
      hideInForm: true,
    },
    {
      title: "标题",
      dataIndex: "title",
      valueType: "text",
    },
    {
      title: "内容",
      dataIndex: "content",
      valueType: "text",
      hideInSearch: true,
      width: 240,
      // todo renderFormItem:
      renderFormItem: (item, { fieldProps }, form) => {
        // 编写要渲染的表单项
        // value 和 onchange 会通过 form 自动注入
        return <MdEditor {...fieldProps} />;
      },
    },
    {
      title: "答案",
      dataIndex: "answer",
      valueType: "text",
      hideInSearch: true,
      width: 640,
      renderFormItem: (item, { fieldProps }, form) => {
        // 编写要渲染的表单项
        // value 和 onchange 会通过 form 自动注入
        return <MdEditor {...fieldProps} />;
        //   todo 相当于 把输入框换成了MD编辑器！

        /*// 自定义表单项的渲染方式，通常用于创建或编辑数据时的表单字段。
    // - `item`：当前列的配置对象。
    // - `{ fieldProps }`：表单字段的默认属性，组件可以直接接收这些属性。
    // - `form`：表单实例对象，用于获取或设置其他字段的值。
    // - `<MdEditor {...fieldProps} />`：渲染一个自定义的 `MdEditor` 组件（Markdown 编辑器）。
    //    - 将表单默认的 `fieldProps` 属性传递给 `MdEditor`，确保与表单联动。
    确保与表单联动
    确保与表单联动
    确保与表单联动*/
      },
    },
    {
      title: "标签",
      dataIndex: "tags",
      valueType: "select",
      fieldProps: {
        mode: "tags",
      },
      //todo 字符串转标签列表
      render: (_, record) => {
        const tagList = JSON.parse(record.tags || "[]");
        //默认是空的
        return <TagList tagList={tagList} />;

        /*// `render` 自定义当前列的渲染方式：
    // 1. `_`：忽略当前列的默认值。
    // 2. `record`：代表当前行的完整数据对象。
    // 3. `record.tags`：从当前行的数据中提取 `tags` 字段的值。
    // 4. `JSON.parse(record.tags || "[]")`：将字符串形式的 JSON 解析为数组。
    //    - 如果 `record.tags` 是空值，则返回一个空数组 `[]`，防止解析出错。
    // 5. `<TagList tagList={tagList} />`：
    //    - 渲染一个自定义组件 `TagList`，将解析出的 `tagList` 作为属性传递。*/
        //todo 标签列表组件
        /*测试时，发现创建和更新题目的标签失败，这是因为后端接口没有补充 tags 字符串到 tagList 列表的转换，
        需要给 addQuestion 和 updateQuestion 接口补充转换逻辑。示例代码如下：

Question question = new Question();
BeanUtils.copyProperties(questionAddRequest, question);
List<String> tags = questionAddRequest.getTags();
if (tags != null) {
    question.setTags(JSONUtil.toJsonStr(tags));
}*/
      },
    },
    {
      title: "创建用户",
      dataIndex: "userId",
      valueType: "text",
      hideInForm: true,
    },

    {
      title: "创建时间",
      sorter: true,
      dataIndex: "createTime",
      valueType: "dateTime",
      hideInSearch: true,
      hideInForm: true,
    },
    {
      title: "编辑时间",
      sorter: true,
      dataIndex: "editTime",
      valueType: "dateTime",
      hideInSearch: true,
      hideInForm: true,
    },
    {
      title: "更新时间",
      sorter: true,
      dataIndex: "updateTime",
      valueType: "dateTime",
      hideInSearch: true,
      hideInForm: true,
    },
    {
      title: "操作",
      // 针对某个题目进行具体的操作。。
      dataIndex: "option",
      valueType: "option",
      /*dataIndex: "option",
    // 数据源字段索引（字段名），此处用于标识操作列，但操作列一般不依赖数据源内容。
    valueType: "option",
    // 设置列的类型为“option”，表示这一列是操作按钮列，而非数据展示列。*/
      render: (_, record) => (
        <Space size="middle">
          {/*/ 使用 Ant Design 的 `Space` 组件来排列操作按钮，间距为 `middle`。*/}
          <Typography.Link
            onClick={() => {
              setCurrentRow(record);
              setUpdateModalVisible(true);
            }}
          {/*  // 一个超链接样式的按钮，点击后触发事件：
          // 1. `setCurrentRow(record)`：设置当前行记录到 `currentRow` 状态，用于在修改窗口中展示。
          // 2. `setUpdateModalVisible(true)`：打开更新弹窗。*/}
          >
            修改
          </Typography.Link>
          <Typography.Link
            onClick={() => {
              setCurrentRow(record);
              setUpdateBankModalVisible(true);
            }}
          >
            修改所属题库
          </Typography.Link>
          <Typography.Link type="danger" onClick={() => handleDelete(record)}>
            删除
          </Typography.Link>
        {/*  // 一个红色的危险按钮，点击后调用 `handleDelete` 方法：
          // `handleDelete(record)`：执行删除操作。*/}
        </Space>
      ),
    },
  ];
  //todo 11 20 书签

  return (
    <PageContainer>
      {/*页面的容器布局*/}
      <ProTable<API.Question>
        {/*  todo protable！*/}
        headerTitle={"查询表格"}
        actionRef={actionRef}
        {/*actionRef：表格的引用，用于触发外部刷新操作（例如调用 actionRef.current.reload()）。*/}
        scroll={{
          x: true,
        }}
        {/*scroll：表格支持横向滚动。*/}
        search={{
          labelWidth: 120,
        }}
        rowKey="id"
        {/*rowKey：设置唯一标识行的字段，这里是 id*/}
        rowSelection={{
          // 自定义选择项参考: https://ant.design/components/table-cn/#components-table-demo-row-selection-custom
          // 注释该行则默认不显示下拉选项
          selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
          defaultSelectedRowKeys: [1],
        }}
        {/*todo 行选择功能
        rowSelection：启用行选择功能。
selections：自定义选择项，支持全选和反选。
defaultSelectedRowKeys：默认选中的行。*/}
        tableAlertRender={({
            /*提示用户当前选中的数量，提供取消选择的交互。*/
          selectedRowKeys,
          selectedRows,
          onCleanSelected,
        }) => {
          /*参数：
selectedRowKeys：当前选中的行的主键。
selectedRows：当前选中的行数据。
onCleanSelected：取消所有选中的行。*/
          console.log(selectedRowKeys, selectedRows);
          return (
            <Space size={24}>
              {/*使用 Space 组件增加间距。*/}
              <span>
                已选 {selectedRowKeys.length} 项
                <a style={{ marginInlineStart: 8 }} onClick={onCleanSelected}>
                  取消选择
                </a>
              </span>
            </Space>
          );
        }}
        tableAlertOptionRender={({
            /*tableAlertOptionRender 自定义渲染选中行的操作按钮。*/
          selectedRowKeys,
          selectedRows,
          onCleanSelected,
        }) => {
          return (
            <Space size={16}>
              <Button
                onClick={() => {
                  // 打开弹窗
                  setSelectedQuestionIdList(selectedRowKeys as number[]);
                  setBatchAddQuestionsToBankModalVisible(true);
                }}
              >
                批量向题库添加题目
              </Button>
              <Button
                onClick={() => {
                  // 打开弹窗
                  setSelectedQuestionIdList(selectedRowKeys as number[]);
                  setBatchRemoveQuestionsFromBankModalVisible(true);
                }}
              >
                批量从题库移除题目
              </Button>
              <Popconfirm
                title="确认删除"
                description="你确定要删除这些题目么？"
                onConfirm={() => {
                  // 批量删除
                  handleBatchDelete(selectedRowKeys as number[]);
                }}
                okText="确认"
                cancelText="取消"
              >
                <Button
                  danger
                  onClick={() => {
                    // 打开弹窗
                  }}
                >
                  批量删除题目
                </Button>
              </Popconfirm>
              {/*量操作：
批量添加题目到题库：设置选中 ID 列表后打开弹窗。
批量移除题目：类似添加操作。
批量删除题目：
使用 Popconfirm 确认框，防止误操作。
调用 handleBatchDelete 执行删除逻辑。*/}
            </Space>
          );
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setCreateModalVisible(true);
            }}
          >
            <PlusOutlined /> 新建
          </Button>,
        ]}
        {/*功能说明

toolBarRender：自定义工具栏的按钮。
新建按钮：
点击后调用 setCreateModalVisible，显示创建弹窗。
*/}
        request={async (params, sort, filter) => {
          const sortField = Object.keys(sort)?.[0];
          const sortOrder = sort?.[sortField] ?? undefined;

          const { data, code } = await listQuestionByPageUsingPost({
            ...params,
            sortField,
            sortOrder,
            ...filter,
          } as API.QuestionQueryRequest);

          return {
            success: code === 0,
            data: data?.records || [],
            total: Number(data?.total) || 0,
          };
        }}

        {/*request：表格的数据请求函数。
支持分页、排序、筛选。
参数：
params：分页和搜索条件。
sort：排序字段和顺序。
filter：筛选条件。
接口调用：
使用 listQuestionByPageUsingPost 请求数据。
返回值：
success：请求是否成功。
data：表格展示的数据。
total：总记录数。*/}
        columns={columns}
      />
      <CreateModal
        visible={createModalVisible}
        columns={columns}
        onSubmit={() => {
          setCreateModalVisible(false);
          actionRef.current?.reload();
        }}
        onCancel={() => {
          setCreateModalVisible(false);
        }}
      />
      {/*功能：用于新建题目。
事件：
onSubmit：提交后关闭弹窗并刷新表格。
onCancel：取消后关闭弹窗。*/}
      <UpdateModal
          {/*todo 在用这个组件的页面里面 传入了props！*/}
        visible={updateModalVisible}
        columns={columns}
        oldData={currentRow}
        onSubmit={() => {
          setUpdateModalVisible(false);
          setCurrentRow(undefined);
          actionRef.current?.reload();
        }}
        onCancel={() => {
          setUpdateModalVisible(false);
        }}
      />
      <UpdateBankModal
        visible={updateBankModalVisible}
        questionId={currentRow?.id}
        onCancel={() => {
          setUpdateBankModalVisible(false);
        }}
      />
      <BatchAddQuestionsToBankModal
        visible={batchAddQuestionsToBankModalVisible}
        questionIdList={selectedQuestionIdList}
        onSubmit={() => {
          setBatchAddQuestionsToBankModalVisible(false);
        }}
        onCancel={() => {
          setBatchAddQuestionsToBankModalVisible(false);
        }}
      />
      <BatchRemoveQuestionsFromBankModal
        visible={batchRemoveQuestionsFromBankModalVisible}
        questionIdList={selectedQuestionIdList}
        onSubmit={() => {
          setBatchRemoveQuestionsFromBankModalVisible(false);
        }}
        onCancel={() => {
          setBatchRemoveQuestionsFromBankModalVisible(false);
        }}
      />
    {/* 批量操作弹窗：

批量添加题目：BatchAddQuestionsToBankModal
批量移除题目：BatchRemoveQuestionsFromBankModal */}
    </PageContainer>
  );
};
export default QuestionAdminPage;
