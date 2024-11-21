"use client";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
/*引入 Ant Design 图标组件：
LockOutlined：密码框的锁图标。
UserOutlined：用户名框的用户图标。*/
import { LoginForm, ProFormText } from "@ant-design/pro-components";
/*LoginForm 和 ProFormText：
LoginForm：提供登录/注册表。
ProFormText：输入框组件。*/
import React from "react";
import Image from "next/image";
import Link from "next/link";
/*引入 React 和 Next.js 核心组件：
Image：用于显示注册页面 logo。
Link：用于跳转到登录页面。*/
import { userRegisterUsingPost } from "@/api/userController";
import { message } from "antd";
/*userRegisterUsingPost：用于调用后端接口进行注册。
message：Ant Design 的消息提示组件，用于反馈成功或失败信息。*/
import { ProForm } from "@ant-design/pro-form/lib";
import { useRouter } from "next/navigation";
import "./index.css";
/*ProForm：提供表单
useRouter：Next.js 的路由 hook，页面跳转。
./index.css：引入当前组件的样式文件。*/

/**
 * 用户注册页面
 * @constructor
 */
const UserRegisterPage: React.FC = () => {
  /*定义一个 React 函数组件 UserRegisterPage，类型为 React.FC（React Functional Component）。*/
  const [form] = ProForm.useForm();
  const router = useRouter();
  /*两个实例
  * 表单和路由
const [form] = ProForm.useForm();
创建表单实例 form，用于操作表单字段。
const router = useRouter();
获取路由对象，支持页面跳转功能。*/

  /**
   * 提交
   */
  const doSubmit = async (values: API.UserRegisterRequest) => {
    // 定义一个异步函数 doSubmit，处理表单提交
    try {
      const res = await userRegisterUsingPost(values);
      //todo 调用后端的注册接口
      if (res.data) {
        //res是前后端规定好了的格式 我记得是JSON？
        message.success("注册成功，请登录");
        // 前往登录页
        router.replace("/user/login");
        form.resetFields();
        //清空了表单？注册失败的时候不清空表单！！！
      }
    } catch (e) {
      message.error("注册失败，" + e.message);
    }
  };

  return (
    <div id="userRegisterPage">
      <LoginForm
        form={form}
        logo={<Image src="/assets/logo.png" alt="XDU" height={44} width={44} />}
        title="XDU - 用户注册"
        subTitle="XDU校招备考系统"
        submitter={{
          searchConfig: {
            submitText: "注册",
          },
        }}
        onFinish={doSubmit}
      >
        {/*LoginForm 配置：
form：绑定表单实例。
logo：页面顶部的 logo 图标。
title 和 subTitle：页面标题和副标题。
submitter：
searchConfig.submitText：自定义提交按钮的文字为“注册”。
onFinish：表单提交后调用 doSubmit。*/}
        <ProFormText
          name="userAccount"
          fieldProps={{
            size: "large",
            prefix: <UserOutlined />,
          }}
          placeholder={"请输入用户账号"}
          rules={[
            {
              required: true,
              message: "请输入用户账号!",
            },
          ]}
        />
        {/*用户账号的文本框
        配置：
name：表单字段名。
fieldProps：输入框大小为 large，前缀为用户图标。
placeholder：输入提示文字。
rules：校验规则，设置为必填。*/}
        <ProFormText.Password
          name="userPassword"
          fieldProps={{
            size: "large",
            prefix: <LockOutlined />,
          }}
          placeholder={"请输入密码"}
          rules={[
            {
              required: true,
              message: "请输入密码！",
            },
          ]}
        />
        {/*用户密码的输入框
         配置：
类型为密码输入框，遮掩输入内容。
提供校验规则，确保必填。*/}
        <ProFormText.Password
          name="checkPassword"
          fieldProps={{
            size: "large",
            prefix: <LockOutlined />,
          }}
          placeholder={"请输入确认密码"}
          rules={[
            {
              required: true,
              message: "请输入确认密码！",
            },
          ]}
        />
        {/*和上面是完全一样的吗。。？*/}
        <div
          style={{
            marginBlockEnd: 24,
            textAlign: "end",
          }}
        >
          已有账号？
          <Link href={"/user/login"}>去登录</Link>
          {/*link跳转路由*/}
        </div>
      </LoginForm>
    </div>
  );
};

export default UserRegisterPage;
