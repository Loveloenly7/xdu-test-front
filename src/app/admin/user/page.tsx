"use client";
//客户端渲染
import CreateModal from "./components/CreateModal";
import UpdateModal from "./components/UpdateModal";
//两个modal弹窗 自己写的
import {
  deleteUserUsingPost,
  listUserByPageUsingPost,
} from "@/api/userController";
// 引入与后端交互的接口方法，分别用于删除用户和获取用户分页数据
import { PlusOutlined } from "@ant-design/icons";
// 引入Ant Design中的PlusOutlined图标 ？这图标干嘛的？
import type { ActionType, ProColumns } from "@ant-design/pro-components";
// 表格 // 引入ProTable相关类型，ActionType用于表格操作，ProColumns定义表格列
import { PageContainer, ProTable } from "@ant-design/pro-components";
// // 引入ProTable和PageContainer，PageContainer为页面容器，ProTable为表格组件
import { Button, message, Space, Typography } from "antd";
// / 引入Ant Design中的Button、message（消息提示）、Space（间距）、Typography（排版组件）
import React, { useRef, useState } from "react";
// 引入React库，useRef和useState是React的钩子函数，用于管理组件状态和引用

/**
 * 用户管理页面
 *
 * todo 管理员专用
 * @constructor
 */
const UserAdminPage: React.FC = () => {
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  // 用于控制新建框的显示与隐藏，默认值为false（隐藏）
  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false);
  // 用于控制更新框的显示与隐藏，默认值为false（隐藏）

  const actionRef = useRef<ActionType>();
  // 创建一个引用，用于访问ProTable的操作方法
  //比如下面刷新了表格的数据
    //因为actionRef引用了下面的表格组件

  const [currentRow, setCurrentRow] = useState<API.User>();
  // 当前选中的用户数据，用于更新操作 鼠标点击的页面事件。。

  /**
   * 删除节点
   *
   * @param row
   */
  const handleDelete = async (row: API.User) => {
    //删除
    const hide = message.loading("正在删除");
    //  // 显示删除中的loading提示
    if (!row) return true;
    // // 如果没有选中行，则返回
    try {
      //调用异步方法
      await deleteUserUsingPost({
        id: row.id as any,
        //？
        //     将 row.id 强制转换为 any 类型。
        /*row.id 的类型可能是 string | number（根据实际代码的上下文，可能是这两种类型中的一种），而
          在某些情况下，你可能希望将它转为更宽泛的 any 类型来避免类型错误或兼容其他类型的值。*/
      });

      hide();
      //删除成功后隐藏提示
      message.success("删除成功");

      actionRef?.current?.reload();
      // todo 刷新表格数据？
      return true;
    } catch (error: any) {
      hide();
      message.error("删除失败，" + error.message);
      //删除失败了 也先隐藏 。。
      return false;
    }
  };

  /**
   * 表格列配置
   *
   * todo 表格列
   */
  const columns: ProColumns<API.User>[] = [
    {
      title: "id",
      dataIndex: "id",
      valueType: "text",
      hideInForm: true,
      //      // 不在表单中显示？
    },
    {
      title: "账号",
      dataIndex: "userAccount",
      valueType: "text",
    },
    {
      title: "用户名",
      dataIndex: "userName",
      valueType: "text",
    },
    {
      title: "头像",
      dataIndex: "userAvatar",
      valueType: "image",
      fieldProps: {
        width: 64,
      },
      hideInSearch: true,
    },
    {
      title: "简介",
      dataIndex: "userProfile",
      valueType: "textarea",
    },
    {
      title: "权限",
      dataIndex: "userRole",
      valueEnum: {
        user: {
          text: "用户",
        },
        admin: {
          text: "管理员",
        },
      },
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
      title: "更新时间",
      sorter: true,
      dataIndex: "updateTime",
      valueType: "dateTime",
      hideInSearch: true,
      hideInForm: true,
    },
    {
      //todo 表格列里面的操作
      title: "操作",
      dataIndex: "option",
      valueType: "option",
      render: (_, record) => (
        /*todo render 函数
这是 ProTable 中一列的渲染配置，特别是针对 "操作" 列（如 "修改" 和 "删除"）。*/
        //应该是根据当前这一条来渲染。。？
        //   record 是当前行的数据，它代表了一个用户对象
        <Space size="middle">
          {/*  Space 是 Ant Design 中的布局组件，用于提供均匀的间距，size="middle" 设置了适中的间距。
          这里应该是行和行的间距？*/}
          <Typography.Link
            {/*  todo 可点击的文本 Typography.Link：这是 Ant Design 中的文本链接组件，用于显示可点击的文本。*/}
            onClick={() => {
                //设置当前行的数据 也就是你更新用户需要初始数据 创建肯定不需要这步
              setCurrentRow(record);
              // 设置当前编辑的用户数据
              setUpdateModalVisible(true);
              // 打开更新模态框
              //打开就是把状态设置为可见！
            }}
          >
            修改
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
      <ProTable<API.User>
        {/*  PageContainer：这是 Ant Design Pro 中的容器组件，用于包裹页面的主要内容并提供一些常见的布局功能。它通常用于放置表格、图表等页面内容。
ProTable<API.User>：这是 Ant Design Pro 中的表格组件，
容器加上表格*/}
        headerTitle={"查询表格"}
        {/*headerTitle={'查询表格'}：设置表格的标题为 "查询表格"。*/}
        actionRef={actionRef}
        {/*actionRef 引用了 ProTable 实例，
        允许在其他地方调用它的操作方法（例如刷新表格数据）*/}
        rowKey="key"
        {/*表格每行的唯一标识符。这里的 key 应该是表格数据中每行的唯一字段（可能是用户的 id）。*/}
        search={{
          labelWidth: 120,
        }}
        {/*search={{ labelWidth: 120 }}：配置搜索框的标签宽度为 120px。*/}
        toolBarRender={() => [
          //   toolBarRender：工具栏渲染函数，返回一个包含按钮的数组。这里有一个 "新建" 按钮：
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setCreateModalVisible(true);
            }}
          >
            <PlusOutlined /> 新建
              {/*<PlusOutlined /> 是一个加号图标，表示 "新建" 操作。*/}
          </Button>,
            /*Button 类型为 primary，即主按钮。
点击按钮时会执行 onClick，显示新建用户的模态框。
<PlusOutlined /> 是一个加号图标，表示 "新建" 操作。*/
        ]}


        request={async (params, sort, filter) => {
            //参数和返回值
            //todo 这里的异步请求逻辑！
          const sortField = Object.keys(sort)?.[0];
          const sortOrder = sort?.[sortField] ?? undefined;

          const { data, code } = await listUserByPageUsingPost({
            ...params,
            sortField,
            sortOrder,
            ...filter,
          } as API.UserQueryRequest);

          return {
            success: code === 0,
            data: data?.records || [],
            total: Number(data?.total) || 0,
          };
        }}
        {/*request={async (params, sort, filter) => {...}}：这是异步请求函数，用于获取分页数据。它会向后端发送请求并处理返回的数据：
params、sort 和 filter 分别表示分页、排序和过滤条件。
使用 listUserByPageUsingPost 向后端请求数据，并返回分页后的用户数据。
异步请求后端 拿到分页的数据*/}
        columns={columns}
      />

      {/*  用于新建和 更新的窗口*/}
      <CreateModal
        visible={createModalVisible}
        {/*通过 visible={createModalVisible} 来控制其显示与隐藏。*/}
        columns={columns}
        {/*columns={columns}：将表格的列配置传递给模态框，可能用于表单字段的显示*/}
        onSubmit={() => {
          setCreateModalVisible(false);
          actionRef.current?.reload();
        }}
        {/*onSubmit：当新建用户表单提交时，关闭模态框并刷新表格*/}

        onCancel={() => {
          setCreateModalVisible(false);
        }}
      {/*  onCancel：当取消新建用户操作时，关闭模态框。
      取消新建的时候仅仅关闭就可以了嘛？*/}
      />
      <UpdateModal
        visible={updateModalVisible}
        columns={columns}
        oldData={currentRow}
        {/*oldData={currentRow}：将当前编辑的用户数据传递给模态框，便于进行修改*/}
        onSubmit={() => {
          setUpdateModalVisible(false);
          setCurrentRow(undefined);
          actionRef.current?.reload();
        }}
        onCancel={() => {
          setUpdateModalVisible(false);
        }}
      {/*  onSubmit：当更新用户表单提交时，关闭模态框、清空 currentRow 并刷新表格。
onCancel：当取消更新操作时，关闭模态框。
*/}
      />
    </PageContainer>
  );
//   /*总结
// 操作列：每一行数据有 "修改" 和 "删除" 两个操作，点击 "修改" 会打开更新模态框，点击 "删除" 会调用删除用户的接口。
// 新建用户：页面顶部有一个 "新建" 按钮，点击后弹出新建用户的模态框。
// 表格配置：表格支持分页、排序、搜索，并通过 request 获取数据。
// 模态框：有两个模态框组件，一个用于创建用户，一个用于更新用户，操作完成后会刷新表格数据。
// 通过这种方式，代码实现了一个完整的用户管理页面，包括查看、创建、编辑和删除用户等功能。*/
};
export default UserAdminPage;
