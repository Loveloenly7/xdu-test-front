"use client";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import BasicLayout from "@/layouts/BasicLayout";
import React, { useCallback, useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import store, { AppDispatch } from "@/stores";
//引入了Redux Store
import { getLoginUserUsingGet } from "@/api/userController";
import AccessLayout from "@/access/AccessLayout";
import { setLoginUser } from "@/stores/loginUser";
import "./globals.css";

/**
 * 全局布局
 * @param children
 * @constructor
 */

//todo 封装出来的一层 初始化逻辑
const InitLayout: React.FC<
  //FC是一个类型的声明 这个类型规定的是一个function
  Readonly<{
    // Readonly 来声明 props 是只读的，这样可以保证组件内部不修改传入的 props。
    //这个属性对象只能读？
    children: React.ReactNode;
    // React.ReactNode 是一个包含所有可能作为 React 子节点的类型，比如：
    //
    // string
    // number
    // ReactElement
    // Array<ReactNode>
    // null 或 undefined
    // 这意味着你可以将任意的 React 元素、字符串、数字或空值作为子元素传递给这个组件。
  }>
> =
  // 上面是组件的类型！！
  //同时也声明了 属性的类型
  //组件和属性的类型都可以这样声明 但是语法好绕啊

  ({ children }) =>
    //     总之参数依然是被括号包裹起来的 用函数来理解就好
    {
      //初始化 todo  获取全局状态里面的用户登录情况
      const dispatch = useDispatch<AppDispatch>();
      // store 是一个包含应用程序状态的对象，它是 Redux 状态管理的核心部分。它存储着所有的应用状态，并且提供了一些方法来操作这些状态
      // dispatching actions，可以修改 store 中的状态。
      //Redux 提供的一个 Hook，允许我们向 Redux store 发送 action？
      // AppDispatch 是自定义的类型
      // 初始化全局用户状态
      const doInitLoginUser = useCallback(async () => {
        //异步函数 todo ？
        //只有在依赖项（此处为空，表示函数只会在组件挂载时初始化一次）发生变化时才会重新创建

        const res = await getLoginUserUsingGet();
        //请求后端获取当前登录用户的信息。todo 异步请求后端

        if (res.data) {
          // 如果请求成功拿到后端的数据了 更新全局用户状态
          //todo dispatch 主动触发！触发了全局状态的更新
          dispatch(setLoginUser(res.data));
          //   dispatch(setLoginUser(res.data)) 会将用户信息存入 Redux store，更新全局用户状态。
          //   dispatch方法 维护用户的全局状态。？
        } else {
          //测试的时候 就算没拿到也行
          // 仅用于测试
          // setTimeout(() => {
          //   const testUser = {
          //     userName: "测试登录",
          //     id: 1,
          //     userAvatar: "",
          //     userRole: ACCESS_ENUM.ADMIN
          //   };
          //   dispatch(setLoginUser(testUser));
          // }, 3000);
        }
      }, []);

      //todo 全局初始化 只会执行一次的代码
      // 只执行一次
      useEffect(() => {
        //useEffect 是 React 提供的 Hook，它会在组件挂载后执行
        //组件加载后立刻执行
        doInitLoginUser();
        //doInitLoginUser() 被调用来初始化用户信息。 也就是上面写的 初始化用户的全局状态
      }, []);

      // [] 作为第二个参数意味着 doInitLoginUser 只会在组件初次渲染时执行一次。

      return children;
    };

//我大概明白js函数了 括号里面是参数 冒号后面是类型 括号后面还可以跟返回值
export default function RootLayout({
  //   RootLayout 组件是应用程序的根布局组件， 顾名思义
  //根里面装的是basic！！
  children,
}: Readonly<{
  //只能读
  children: React.ReactNode;
  //？
}>) {
  return (
    //返回的东西是JSX
    <html lang="zh">
      {/*//HTML 的语言属性为简体中文。*/}
      <body>
        <AntdRegistry>
          {/*为 Ant Design 组件库提供上下文的组件*/}
          <Provider store={store}>
            {/*将 Redux 的 store 提供给整个应用，确保 store 在子组件中可用。*/}
            <InitLayout>
              {/*初始化用户信息的布局组件*/}
              <BasicLayout>
                {/*应用的基本布局，可能包含侧边栏、头部等常见布局元素。*/}
                {/*todo 引入了权限校验的组件 实现了403*/}
                <AccessLayout>{children}</AccessLayout>
                {/*  控制访问权限的布局组件，可能是根据用户角色来渲染不同的内容。*/}
              </BasicLayout>
            </InitLayout>
          </Provider>
        </AntdRegistry>
      </body>
    </html>
  );

  //   /*总结InitLayout 负责初始化和管理全局用户状态，它通过请求用户信息并将其存入 Redux store 来设置用户状态。
  // RootLayout 是应用程序的根组件，负责组织不同的布局层次，并通过 Provider 提供 Redux 的全局状态。
  // useEffect 和 useCallback 保证了用户信息的初始化只会发生一次，而不会在每次渲染时重复请求。*/
}
