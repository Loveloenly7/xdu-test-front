"use client";
import { GithubFilled, LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { ProLayout } from "@ant-design/pro-components";
import { Dropdown, message } from "antd";
import React from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import GlobalFooter from "@/components/GlobalFooter";
import { menus } from "../../../config/menu";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/stores";
import getAccessibleMenus from "@/access/menuAccess";
import { userLogoutUsingPost } from "@/api/userController";
import { setLoginUser } from "@/stores/loginUser";
import { DEFAULT_USER } from "@/constants/user";
import SearchInput from "@/layouts/BasicLayout/components/SearchInput";
import "./index.css";

interface Props {
  children: React.ReactNode;
}

/**
 * 全局通用布局
 * @param children
 * @constructor
 */
export default function BasicLayout({ children }: Props) {
  const pathname = usePathname();
  // 当前登录用户
  const loginUser = useSelector((state: RootState) => state.loginUser);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  /**
   * 用户注销
   */
  const userLogout = async () => {
    try {
      await userLogoutUsingPost();
      message.success("已退出登录");
      dispatch(setLoginUser(DEFAULT_USER));
      router.push("/user/login");
    } catch (e) {
      message.error("操作失败，" + e.message);
    }
  };

  return (
    <div
      id="basicLayout"
      style={{
        height: "100vh",
        overflow: "auto",
      }}
    >
      {/*todo 基本布局里面的顶部栏 根据layout属性不同 可以是侧边栏 头部栏*/}
      <ProLayout
        title="XDU校招备考平台"
        layout="top"
        logo={
          <Image
            src="/assets/logo.png"
            height={32}
            width={32}
            alt="XDU校招备考平台"
          />
          //     alt是图片加载失败的时候的替代文本
        }

        //todo 同步高亮 usePathname 客户端的钩子函数
        location={{
          pathname,
        }}
        //   用于指定当前页面的路径信息，pathname 是当前页面的路径变量。
        // Ant Design Pro 的布局会根据 pathname 自动高亮导航菜单，增强用户体验。

        //配置用户的头像
        avatarProps={{
          // 默认获取登录用户对象里面的
          src: loginUser.userAvatar || "/assets/logo.png",
          size: "small",
          title: loginUser.userName || "HW",
          //todo render 一个自定义渲染函数
          render: (props, dom) => {
            //头像的配置 默认渲染的dom元素
            if (!loginUser.id) {
              //如果用户没有登录 id不存在 也就是没登录

              //没登录情况下的默认渲染
              return (
                <div
                  onClick={() => {
                    router.push("/user/login");
                  }}
                >
                  {dom}
                </div>

                //这个div包裹默认头像 点击的时候默认跳转登录页面
              );
            }

            //如果已经登录
            return (
              <Dropdown
                //todo 渲染一个下拉菜单
                menu={{
                  //下拉菜单包括
                  items: [
                    {
                      key: "userCenter",
                      icon: <UserOutlined />,
                      label: "个人中心",
                    },
                    {
                      key: "logout",
                      icon: <LogoutOutlined />,
                      label: "退出登录",
                    },
                  ],

                  //点击下拉菜单会触发的事件 登出 或者导航到用户中心页面
                  onClick: async (event: { key: React.Key }) => {
                    const { key } = event;
                    if (key === "logout") {
                      userLogout();
                    } else if (key === "userCenter") {
                      router.push("/user/center");
                    }
                  },
                }}
              >
                {dom}
              </Dropdown>

              /*{dom}
dom 是通过 render 函数接收的默认头像的 DOM 元素。
此处直接将 dom 插入到 Dropdown 组件中，作为下拉菜单的触发器。
</Dropdown>
表示 Dropdown 组件的结束标签，包裹在其中的内容（此处为 dom）用于触发下拉菜单的显示。*/
            );
          },
        }}
        actionsRender={(props) => {
          // 自定义去页面右上角
          if (props.isMobile) return [];
          //是否是移动端 移动端就不渲染这个
          //todo 移动端不渲染
          return [
            <SearchInput key="search" />,
            //自定义的搜索框组件 带了个key 相当于id
            <a
              key="github"
              href="https://github.com/lovelonely7"
              target="_blank"
            {/*  点击的时候在新标签页打开连接 */}
            >
              <GithubFilled key="GithubFilled" />
            </a>,
          /*<a> 标签：渲染一个链接，跳转到 GitHub 主页 https://github.com/lovelonely7。
target="_blank"：点击时在新标签页打开链接。
GithubFilled：Ant Design 图标库中的 GitHub 图标，用于美观展示。*/
          ];
        }}
        headerTitleRender={(logo, title, _) => {
          //导航栏的标题部分 自定义如何渲染
          //第三个参数 是一个占位符
          return (
            <a>
              {logo}
              {title}
            {/*  当前的logo和title todo 这里可以点击 返回主页？*/}
            </a>
          );
        }}
        // todo 全局里的底部栏
        footerRender={() => {
          return <GlobalFooter />;
        }}
        onMenuHeaderClick={(e) => console.log(e)}


        // 定义有哪些菜单
        menuDataRender={() => {
          return getAccessibleMenus(loginUser, menus);
        }}


        // 定义了菜单项如何渲染
        menuItemRender={(item, dom) => (
          <Link href={item.path || "/"} target={item.target}>
            {/*菜单项的path决定了路径 没找到就返回根路径*/}
            {/*可以自己定义 打开的方式 比如跳转方式*/}
            {/*todo ？*/}
            {dom}
          </Link>
        )}
      >
        {/*以上所有都是标签头*/}
        {/*todo ？*/}
        {children}
      {/*  children 是 React 中的一个特殊属性，表示组件内部嵌套的子内容。
这里表示 ProLayout 布局组件中的主体内容（通常是页面的主要内容区域）*/}
      </ProLayout>
    </div>
  );
}
