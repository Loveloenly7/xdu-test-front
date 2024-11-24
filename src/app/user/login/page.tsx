"use client";
//登录页面没有SEO 客户端组件
import { LockOutlined, UserOutlined } from "@ant-design/icons";
// 用户名和密码输入框的前缀图标。
import { LoginForm, ProFormText } from "@ant-design/pro-components";
// 引入 LoginForm 和 ProFormText，用于构建登录表单。
import React from "react";
import Image from "next/image";
import Link from "next/link";
// React 及 Next.js 的核心组件：
// Image：用于显示图片。
// Link：用于跳转到注册页面。
import { userLoginUsingPost } from "@/api/userController";
import { message } from "antd";
// userLoginUsingPost：调用后端接口完成登录。
// message：Ant Design 提供的全局消息提示组件，用于显示成功或失败提示。

import { useDispatch } from "react-redux";
import { AppDispatch } from "@/stores";
import { setLoginUser } from "@/stores/loginUser";
/*Redux 相关：
useDispatch：用于触发 Redux 的 action。
AppDispatch：定义 Redux 的 dispatch 类型。
setLoginUser：更新 Redux 中的登录用户状态。*/
import { ProForm } from "@ant-design/pro-form/lib";
import { useRouter } from "next/navigation";
import "./index.css";
// /*ProForm：获取表单方法。
// useRouter：Next.js 的路由 hook，用于页面导航。
// ./index.css：登录页面的样式文件。*/

/**
 * 用户登录页面
 * @constructor
 */
const UserLoginPage: React.FC = () => {
  //
  /*定义一个 React 函数组件 UserLoginPage，
    类型为 React.FC（React Functional Component）。*/

  const [form] = ProForm.useForm();
  /*创建一个表单实例 form，用于操作表单字段。*/
  const dispatch = useDispatch<AppDispatch>();
  /*获取 Redux 的 dispatch 方法，触发 Redux 的 action。*/
  const router = useRouter();
  /*获取路由方法，控制页面跳转。*/

  /**
   * 提交
   */
  const doSubmit = async (values: API.UserLoginRequest) => {
    /*定义一个异步函数 doSubmit，接收用户输入的登录数据。
     * 默认返回的是一个异步的结果 promise默认返回一个异步的结果*/
    try {
      const res = await userLoginUsingPost(values);
      if (res.data) {
        message.success("登录成功");
        // 保存用户登录状态
        dispatch(setLoginUser(res.data));
        router.replace("/");
        form.resetFields();
      }
    } catch (e) {
      message.error("登录失败，" + e.message);
    }
    /*调用 userLoginUsingPost 接口，传递登录信息。
    如果成功，显示提示信息 登录成功，保存用户信息到 Redux 中，并跳转到首页。
    如果失败，捕获异常，显示 登录失败。*/
  };

  return (
    <div id="userLoginPage">
      <LoginForm
        form={form}
        logo={<Image src="/assets/logo.png" alt="XDU" height={44} width={44} />}
        title="XDU - 用户登录"
        subTitle="XDU校招备考系统"
        onFinish={doSubmit}
        {/*todo 前后端原理解析 点击提交的时候 Form里面的数据value被传入进来了*/}
      >
        {/*todo 登录框的配置 
        LoginForm 配置：
form: 表单实例。
logo: 显示登录页面的 logo。
title 和 subTitle：页面标题及副标题。
onFinish: 表单提交成功时调用 doSubmit。*/}
        <ProFormText
          name="userAccount"
          fieldProps={{
            size: "large",
            prefix: <UserOutlined />,
            /*大小 前缀？*/
          }}
          placeholder={"请输入账号"}
          rules={[
            {
              required: true,
              // 校验规则 这里必须填东西！！
              message: "请输入用户账号!",
            },
          ]}
        />
        {/*ProFormText 配置：
name: 表单字段名。
fieldProps: 额外属性，例如输入框大小和前缀图标。
placeholder: 提示文本。
rules: 校验规则，设置为必填。*/}
        <ProFormText.Password
          //todo 密码输入框 只是说这里会自带******
          name="userPassword"
          fieldProps={{
            size: "large",
            prefix: <LockOutlined />,
            //prefix 是 Ant Design 表单输入组件的一个属性，用于在输入框的前面添加图标或其他内容。
            //这里是ant自带的图标组件！
          }}
          placeholder={"请输入密码"}
          rules={[
            {
              required: true,
              message: "请输入密码！",
            },
          ]}
        />
        <div
          style={{
            marginBlockEnd: 24,
            textAlign: "end",
          }}
        >
          没有账号么？
          <Link href={"/user/register"}>去注册</Link>
        </div>
      </LoginForm>
    </div>
  );
};

/*代码功能总结
用户通过登录表单输入账号和密码。
提交表单后，调用后端接口验证用户信息。
登录成功时，更新 Redux 状态并跳转到首页；失败时显示错误提示。
提供链接跳转到注册页面。

关键在于 这里登录成功之后要更新Redux状态！*/

export default UserLoginPage;
