import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// createSlice 方法，简化了 Redux 中 reducer 的创建和操作方式
// PayloadAction：这是 Redux Toolkit 定义的类型，用于描述 action 的 payload 类型。
import { DEFAULT_USER } from "@/constants/user";
// DEFAULT_USER：表示登录用户的默认值（需要在 constants/user 中定义）。

/**
 * 登录用户全局状态
 */

//相当于 把store给分成了很多小的sore？
export const loginUserSlice = createSlice({
  name: "loginUser",
  // 定义 slice 的名称
  initialState: DEFAULT_USER,
  // 定义该状态的初始值，这里使用了 DEFAULT_USER，通常表示未登录的初始用户状态。
  //所以说要引入
  reducers: {
    // reducers: 定义该状态的所有修改方法，每个方法自动生成对应的 action。
    setLoginUser: (state, action: PayloadAction<API.LoginUserVO>) => {
      // setLoginUser:
      // 作用: 更新登录用户的状态。
      //参数 当前的状态 action.payload: 接收的参数，类型为 API.LoginUserVO，表示新的用户信息。
      return {
        ...action.payload,
      };
      //返回一个新的对象
    },
  },
});
//得到一个登录用户的切片

// 修改状态
export const { setLoginUser } = loginUserSlice.actions;
// 从 loginUserSlice.actions 中解构导出了 setLoginUser 方法，这是 Redux Toolkit 自动生成的 action。
//？
// 组件中通过 dispatch(setLoginUser(payload)) 来触发状态更新。
export default loginUserSlice.reducer;
// 作用: 导出 reducer，用于在 store 中注册。
// 用途: 在 store 的 reducer 属性中引入 loginUserSlice.reducer，用于管理 loginUser 相关的状态。
