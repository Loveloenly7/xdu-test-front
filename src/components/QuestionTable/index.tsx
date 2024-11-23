"use client";

import { searchQuestionVoByPageUsingPost } from "@/api/questionController";

import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { ProTable } from "@ant-design/pro-components";
// ProTable：Ant Design Pro 提供的高级表格组件，支持复杂的表格功能。
import React, { useRef, useState } from "react";
// useRef、useState：React Hooks，用于管理组件状态和引用。
import TagList from "@/components/TagList";
import { TablePaginationConfig } from "antd";
// TablePaginationConfig：分页配置的类型定义。
import Link from "next/link";
import "./index.css";

//todo 具体的分页展示逻辑

interface Props {
  // 默认值（用于展示服务端渲染的数据）
  //？
  //todo 这里怎么拿到默认值的？
  defaultQuestionList?: API.QuestionVO[];
  defaultTotal?: number;
  // 默认搜索条件
  defaultSearchParams?: API.QuestionQueryRequest;
}
/*Props 接口：
defaultQuestionList：初始题目数据，来自服务端渲染。
defaultTotal：初始数据的总记录数。
defaultSearchParams：初始搜索参数。
*/

/**
 * 题目表格组件
 *
 * @constructor
 */

/*题目大全 里面展现搜索内容让你过的表格*/
const QuestionTable: React.FC = (props: Props) => {
  /*React.FC：React 函数组件，接受 Props 类型的属性。*/
  const { defaultQuestionList, defaultTotal, defaultSearchParams = {} } = props;

  const actionRef = useRef<ActionType>();

  // 题目列表
  const [questionList, setQuestionList] = useState<API.QuestionVO[]>(
    defaultQuestionList || [],
  );
  // 题目总数
  const [total, setTotal] = useState<number>(defaultTotal || 0);

  // todo 用于判断是否首次加载
  const [init, setInit] = useState<boolean>(true);

  /*解构 初始化 也就是说 第一次点进去显示的默认查询

  * defaultQuestionList、defaultTotal：
解构组件传入的默认数据，用于初始化表格内容。


useRef：
actionRef 是 ProTable 的引用，用于在组件外部操作表格，例如刷新。

useState：
questionList：当前表格数据。
total：总记录数。
init：标记是否首次加载，用于避免重复请求。*/

  /**
   * 表格列配置
   */
  const columns: ProColumns<API.QuestionVO>[] = [
    /*列配置说明：
title：列标题。
dataIndex：数据字段名，需与数据结构匹配。
valueType：
text：普通文本字段。
select：下拉选择器，用于搜索条件。
hideInTable：是否在表格中隐藏。
hideInSearch：是否在搜索栏中隐藏。
render：自定义渲染函数，用于生成复杂内容。
Link：跳转链接，标题点击跳转到题目详情页。*/
    {
      title: "搜索",
      dataIndex: "searchText",
      /*todo 和es的对应*/
      valueType: "text",
      hideInTable: true,
    },
    {
      title: "标题",
      dataIndex: "title",
      valueType: "text",
      hideInSearch: true,
      // 标题的特殊渲染是因为要作为链接
      render: (_, record) => {
        return <Link href={`/question/${record.id}`}>{record.title}</Link>;
      },
    },
    {
      title: "标签",
      dataIndex: "tagList",
      //为什么标签是一个下拉搜索框？
      //对的 总不能填文本
      valueType: "select",
      fieldProps: {
        mode: "tags",
      },
      render: (_, record) => {
        //标签要怎么渲染 需要传入什么然后。。。
        return <TagList tagList={record.tagList} />;
      },
    },
  ];

  return (
    <div className="question-table">
      <ProTable<API.QuestionVO>
        actionRef={actionRef}
        {/*actionRef：绑定表格引用，支持外部操作。*/}
        size="large"
        search={{
          labelWidth: "auto",
        }}
        form={{
          initialValues: defaultSearchParams,
        }}
        dataSource={questionList}
        pagination={
          {
            pageSize: 12,
            showTotal: (total) => `总共 ${total} 条`,
            showSizeChanger: false,
            total,
          } as TablePaginationConfig
            /*todo pagination：分页配置：
每页显示 12 条。
总记录数为 total。
隐藏分页大小选择器。*/
        }
        request={async (params, sort, filter) => {
          // 首次加载时，若已有默认数据，无需请求。
          if (init) {
            setInit(false);
            // 如果已有外层传来的默认数据，无需再次查询
            if (defaultQuestionList && defaultTotal) {
              return;
            }
          }

          //接下来才是查询的逻辑

          const sortField = Object.keys(sort)?.[0] || "createTime";
          const sortOrder = sort?.[sortField] || "descend";
          /*动态获取排序字段 sortField 和排序方式 sortOrder。*/

          const { data, code } = await searchQuestionVoByPageUsingPost({
            ...params,
            sortField,
            sortOrder,
            ...filter,
          } as API.QuestionQueryRequest);
          /*把他们封装成为查询的条件*/

          // 更新结果
          const newData = data?.records || [];
          const newTotal = data?.total || 0;


          // 更新状态
          setQuestionList(newData);
          setTotal(newTotal);

          //todo 这里状态和结果能反着来吗？

          return {
            success: code === 0,
            data: newData,
            total: newTotal,
          };
        }}
        columns={columns}
      />
    </div>
  );
};
export default QuestionTable;
