"use client";
import CreateModal from "./components/CreateModal";
import UpdateModal from "./components/UpdateModal";
import {
    batchDeleteQuestionsUsingPost,
    deleteQuestionUsingPost,
    listQuestionByPageUsingPost,
} from "@/api/questionController";
import {PlusOutlined} from "@ant-design/icons";
import type {ActionType, ProColumns} from "@ant-design/pro-components";
import {PageContainer, ProTable} from "@ant-design/pro-components";
import {Button, Input, message, Popconfirm, Select, Space, Table, Typography} from "antd";
import React, {useRef, useState} from "react";
import TagList from "@/components/TagList";
import MdEditor from "@/components/MdEditor";
import UpdateBankModal from "@/app/admin/question/components/UpdateBankModal";
import BatchAddQuestionsToBankModal from "@/app/admin/question/components/BatchAddQuestionsToBankModal";
import BatchRemoveQuestionsFromBankModal from "@/app/admin/question/components/BatchRemoveQuestionsFromBankModal";
import "./index.css";
import {aiGenerateXtjJsonUsingPost} from "@/api/aiController";
import {repairJson} from "../../../../config/jsonRepair";

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
            dataIndex: "questionBankId",
            hideInTable: true,
            hideInForm: true,
        },
        {
            title: "标题",
            dataIndex: "title",
            valueType: "text",
            renderFormItem: (item, {defaultRender, ...rest}, form) => {
                // 默认渲染的输入框 但是没有原来的值了
                const defaultInput = defaultRender(item);
                const title = form.getFieldValue('title');
                // 自定义按钮的逻辑
                const handleButtonClick = async () => {
                    //设置loading
                    // 获取表单中某个字段的值，比如 'age'
                    const title = form.getFieldValue('title');
                    const content = form.getFieldValue('content');
                    const answer = form.getFieldValue('answer');
                    const tagList = form.getFieldValue('tagList');
                    const oldQuestion = {
                        title: title,
                        content: content,
                        answer: answer,
                        tagList: tagList,
                    }

                    const response = await aiGenerateXtjJsonUsingPost({md: JSON.stringify(oldQuestion)});

                    const outerData = JSON.parse(response?.data);
                    const innerData = outerData?.data;
                    const content1 = innerData.choices[0]?.message?.content || '';
                    //先用以前的当默认了
                    let newQuestion = {
                        ...oldQuestion
                    };
                    //我终于知道为什么洗不出来了你妈的
                    //todo 这里是大花括号 然后前后包围
                    const regex = /\{.*}/s;
                    const match = content1.match(regex);
                    if (match) {
                        let jsonArrayString = match[0];
                        jsonArrayString = repairJson(jsonArrayString);
                        console.log(jsonArrayString);
                        newQuestion = JSON.parse(jsonArrayString);
                    }


                    message.success('已生成Ai超丰富报告')
                    // form.setFieldsValue({ title: newQuestion.title }); // 更新表单字段 标题不用补充吧。？
                    form.setFieldsValue({content: newQuestion.content}); // 更新表单字段
                    form.setFieldsValue({answer: newQuestion.answer}); // 更新表单字段
                    form.setFieldsValue({tagList: newQuestion.tagList}); // 更新表单字段
                };

                return (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column', // 设置为垂直排列
                        justifyContent: 'center', // 垂直居中
                        alignItems: 'center', // 水平居中
                        gap: '10px', // 控制元素之间的垂直间距
                    }}>
                        {/* 将 form.getFieldValue 返回的值传递给 input */}
                        <Input
                            {...rest} // 保留传递给输入框的其他属性
                            value={title} // 确保表单字段值和输入框的值保持同步
                            onChange={(e) => form.setFieldsValue({title: e.target.value})} // 更新表单的值
                            placeholder="标题" // 你可以自定义输入框的提示文本
                        />
                        <Space>
                            <Button type="default" onClick={handleButtonClick}>
                                一键生成Ai超丰富题解！
                            </Button>
                        </Space>
                    </div>

                );
            }
        },
        {
            title: "内容",
            dataIndex: "content",
            valueType: "text",
            hideInSearch: true,
            width: 240,
            renderFormItem: (item, {fieldProps}, form) => {
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
            /*超出部分部分显示*/
            render: (text) => (
                <div
                    style={{
                        fontFamily: 'Roboto, sans-serif', // 设置light字体，假设这里用Roboto字体
                        fontWeight: 300, // 轻量级字体
                    }}
                >
                    {text && text?.length > 200 ? `${text?.substring(0, 200)}...` : text}
                </div>

            ),
            renderFormItem: (item, {fieldProps}, form) => {
                // 编写要渲染的表单项
                // value 和 onchange 会通过 form 自动注入
                return <MdEditor {...fieldProps} />;
            },
        },
        // {
        //     title: "标签",
        //     dataIndex: "tagList",
        //     valueType: "select",
        //     fieldProps: {
        //         mode: "tagList",
        //     },
        //     render: (_, record) => {
        //         const tagList = JSON.parse(record.tagList || "[]");
        //         return <TagList tagList={tagList}/>;
        //     },
        //     renderFormItem: (item, { defaultRender, ...rest }, form) => {
        //         return (
        //         const fieldValue = form.getFieldValue("tagList");
        //             <Select {...rest} style={{ width: '100%' }}>
        //                 <Option value="tag1">标签1</Option>
        //                 <Option value="tag2">标签2</Option>
        //                 <Option value="tag3">标签3</Option>
        //             </Select>
        //         );
        //     },
        //     // renderFormItem: (item, {fieldProps}, form) => {
        //     //     // 编写要渲染的表单项
        //     //     const fieldValue = form.getFieldValue("tagList");
        //     //     // value 和 onchange 会通过 form 自动注入
        //     //
        //     //     return <MdEditor {...fieldProps} />;
        //     // },
        // },todo 我也不懂这里我怎么弄的。。？
        {
            title: '标签',
            dataIndex: 'tagList',
            valueType: 'select',
            render: (_, record) => {
                const tagList = JSON.parse(record.tagList || '[]');
                return <TagList tagList={tagList} />;
            },
            renderFormItem: (item, { defaultRender, ...rest }, form) => {
                const fieldValue = form.getFieldValue('tagList') || [];
                return (
                    <Select
                        {...rest}
                        mode="tags"
                        style={{ width: '100%' }}
                        placeholder="编辑标签"
                        value={fieldValue}
                        onChange={(value) => form.setFieldsValue({ tagList: value })}
                    >

                    </Select>
                );
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
            dataIndex: "option",
            valueType: "option",
            render: (_, record) => (
                <Space size="middle">
                    <Typography.Link
                        onClick={() => {
                            setCurrentRow(record);
                            setUpdateModalVisible(true);
                        }}
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
                </Space>
            ),
        },
    ];

    return (
        <PageContainer>
            <ProTable<API.Question>
                headerTitle={"查询表格"}
                actionRef={actionRef}
                scroll={{
                    x: true,
                }}
                search={{
                    labelWidth: 120,
                }}
                rowKey="id"
                rowSelection={{
                    // 自定义选择项参考: https://ant.design/components/table-cn/#components-table-demo-row-selection-custom
                    // 注释该行则默认不显示下拉选项
                    selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
                    defaultSelectedRowKeys: [1],
                }}
                tableAlertRender={({
                                       selectedRowKeys,
                                       selectedRows,
                                       onCleanSelected,
                                   }) => {
                    console.log(selectedRowKeys, selectedRows);
                    return (
                        <Space size={24}>
              <span>
                已选 {selectedRowKeys.length} 项
                <a style={{marginInlineStart: 8}} onClick={onCleanSelected}>
                  取消选择
                </a>
              </span>
                        </Space>
                    );
                }}
                tableAlertOptionRender={({
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
                        <PlusOutlined/> 新建
                    </Button>,
                ]}
                request={async (params, sort, filter) => {
                    const sortField = Object.keys(sort)?.[0];
                    const sortOrder = sort?.[sortField] ?? undefined;

                    const {data, code} = await listQuestionByPageUsingPost({
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
            <UpdateModal
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
        </PageContainer>
    );
};
export default QuestionAdminPage;
