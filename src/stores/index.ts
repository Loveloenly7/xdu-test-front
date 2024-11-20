import { configureStore } from "@reduxjs/toolkit";
// 引入 configureStore 方法。这个方法是 Redux Toolkit 提供的一个简化工具
// ，用于创建 Redux store
import loginUser from "@/stores/loginUser";
//这是一个reducer

//创建一个全局状态 并且维护它。。

const store = configureStore({
  //   创建 Redux store
  reducer: {
    // 在这里存放状态
    //   loginUser 是管理登录用户状态的 reducer。它被放入 reducer 对象中，键名为 loginUser。
    loginUser,
  },
});

// 用于类型推断和提示
export type RootState = ReturnType<typeof store.getState>;
// 定义了 RootState 类型，表示整个 Redux 状态树的类型。
// store.getState 是 Redux 提供的方法，用于获取当前的状态。
// 用途: 在 TypeScript 项目中，用来为 useSelector 提供类型提示。
//？
export type AppDispatch = typeof store.dispatch;
//定义 AppDispatch 类型，表示 store 的 dispatch 方法的类型
// 在需要使用 useDispatch 时，可以直接通过 AppDispatch 为其类型提供提示。

export default store;
// 将创建好的 store 导出，供其他模块使用
