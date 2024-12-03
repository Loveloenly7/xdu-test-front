"use client";

import { Avatar, Button, Card, Col, Form, Row } from "antd"; // 导入布局和卡片组件
import { useSelector } from "react-redux"; // 导入 Redux 的 useSelector 钩子
import { RootState } from "@/stores"; // 导入 RootState 类型，表示 Redux 的状态结构
import Title from "antd/es/typography/Title"; // 导入 Title 组件，用于显示标题
import Paragraph from "antd/es/typography/Paragraph"; // 导入 Paragraph 组件，用于显示段落文本
import { useState } from "react"; // 导入 useState 用于管理状态
import CalendarChart from "@/app/user/center/components/CalendarChart"; // 导入用户刷题记录的图表组件
import "./index.css";
import { ProColumns } from "@ant-design/pro-components";
import { EditOutlined } from "@ant-design/icons";
import UserUpdateModal from "@/app/user/center/components/UserUpdateModal"; // 导入页面样式

/**
 * 用户中心页面
 * @constructor
 */
export default function UserCenterPage() {
  const loginUser = useSelector((state: RootState) => state.loginUser);
  // 获取登录用户信息
  const user = loginUser;
  // 方便复用
  const [activeTabKey, setActiveTabKey] = useState<string>("record");
  // 默认选中 "record" 标签页 todo 修改默认选择的标签页

  /*UserCenterPage 组件的定义：
  使用 useSelector 获取当前登录用户的信息。loginUser 是 Redux store 中的用户信息状态，user 用来方便复用。
  使用 useState 来控制 Tab 组件的高亮显示，默认选中 "刷题记录"（record）标签页。*/

  /*新功能 编辑用户的个人信息的弹窗*/
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  // 显示弹窗
  const showModal = () => {
    //初始化
    form.setFieldsValue({
      /*这三个是可见的 但说实话我不知道头像的上传那个要怎么搞。。。*/
      userAvatar: user.userAvatar,
      userName: user.userName,
      userProfile: user.userProfile,
    });
    setIsModalVisible(true);
  };

  /**
   * 表格列配置
   */
  const columns: ProColumns<API.User>[] = [
    {
      title: "id",
      dataIndex: "id",
      valueType: "text",
      hideInForm: true,
    },
    // {
    //     title: '账号',
    //     dataIndex: 'userAccount',
    //     valueType: 'text',
    // },
    {
      title: "用户名",
      dataIndex: "userName",
      valueType: "text",
    },
    {
      // todo 实现头像的上传式编辑。。
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
    // {
    //     title: '权限',
    //     dataIndex: 'userRole',
    //     valueEnum: {
    //         user: {
    //             text: '用户',
    //         },
    //         admin: {
    //             text: '管理员',
    //         },
    //     },
    // },
    // {
    //     title: '创建时间',
    //     sorter: true,
    //     dataIndex: 'createTime',
    //     valueType: 'dateTime',
    //     hideInSearch: true,
    //     hideInForm: true,
    // },
    // {
    //     title: '更新时间',
    //     sorter: true,
    //     dataIndex: 'updateTime',
    //     valueType: 'dateTime',
    //     hideInSearch: true,
    //     hideInForm: true,
    // },
    // {
    //     title: '操作',
    //     dataIndex: 'option',
    //     valueType: 'option',
    //     render: (_, record) => (
    //         <Space size="middle">
    //             <Typography.Link
    //                 onClick={() => {
    //                     setCurrentRow(record);
    //                     setUpdateModalVisible(true);
    //                 }}
    //             >
    //                 修改
    //             </Typography.Link>
    //             <Typography.Link type="danger" onClick={() => handleDelete(record)}>
    //                 删除
    //             </Typography.Link>
    //         </Space>
    //     ),
    // },
  ];

  return (
    <div id="userCenterPage" className="max-width-content">
      <Row gutter={[16, 16]}>
        <Col xs={24} md={6}>
          {/* 在小屏幕下占 24 列，较大屏幕下占 6 列 */}
          <Card style={{ textAlign: "center" }}>
            <Avatar src={user.userAvatar} size={72} />
            {/* 显示用户头像 */}
            <div style={{ marginBottom: 16 }} />
            <Card.Meta
              title={
                <Title level={4} style={{ marginBottom: 0 }}>
                  {user.userName}
                  {/* 显示用户姓名 */}
                </Title>
              }
              description={
                <Paragraph type="secondary">
                  {user.userProfile}
                </Paragraph> /*用户简介*/
              }
            />

            <Button
              type="default"
              shape="circle"
              icon={<EditOutlined />}
              style={{ marginTop: 16 }}
              onClick={showModal}
            />
          </Card>
        </Col>

        {/*  左边的卡片是人物简介*/}

        {/*todo 这里row和col组件起了什么作用*/}

        {/*Row 和 Col 组件来自 Ant Design，用于响应式布局。
使用 Card 显示用户的头像、名字和简介。Avatar 组件用来显示用户的头像，Card.Meta 显示用户的用户名和个人简介。*/}

        <Col xs={24} md={18}>
          <Card
            tabList={[
              {
                key: "record",
                label: "学习日历",
              },
              {
                key: "favorites",
                label: "收藏和标记",
              },
              {
                key: "mockInterviewResults",
                label: "模拟面试结果",
              },
              {
                key: "messages",
                label: "消息中心",
              },
            ]}
            activeTabKey={activeTabKey} // 当前激活的标签页
            onTabChange={(key: string) => {
              setActiveTabKey(key); // 更新选中的标签页
            }}
          >
            {activeTabKey === "record" && (
              <>
                <CalendarChart />
              </>
            )}
            {/*todo 这两个组件还没写*/}
            {activeTabKey === "messages" && (
              <>
                <CalendarChart />
              </>
            )}
            {activeTabKey === "mockInterviewResults" && (
              <>
                <CalendarChart />
              </>
            )}
            {activeTabKey === "favorites" && (
              <>
                <CalendarChart />
              </>
            )}

            {/*   实现  选中的时候渲染某个组件 */}
          </Card>
        </Col>
        {/*右边的卡片是 一个tab标签*/}
        {/*右侧的 Card 包含两个标签页：一个是 "刷题记录"，另一个是 "其他"。
tabList 属性指定了标签页的内容，每个标签页的 key 用于区分。

activeTabKey 控制当前选中的标签页，
onTabChange 用于切换标签页并更新 activeTabKey。*/}
        {/*todo 个人中心的设计 */}
      </Row>

      {/*我人晕了 这个真的有点麻烦 哦不 太麻烦了有点。。。*/}
      <UserUpdateModal
        visible={isModalVisible}
        columns={columns}
        oldData={loginUser}
        onSubmit={() => {
          setIsModalVisible(false);
          // setCurrentRow(undefined);
          // actionRef.current?.reload();
        }}
        onCancel={() => {
          setIsModalVisible(false);
        }}
      />
    </div>
  );
}
