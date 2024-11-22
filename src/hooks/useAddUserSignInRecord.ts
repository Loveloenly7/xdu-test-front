import { useEffect, useState } from "react";
import { message } from "antd";
import { addUserSignInUsingPost } from "@/api/userController";
/*useEffect 和 useState：React 内置的 Hook，用于管理组件的状态和副作用。
message：Ant Design 的消息提示组件，用于显示成功或错误提示。
addUserSignInUsingPost：后端提供的 API 方法，用于发送签到请求。*/

/**
 * 添加用户刷题签到记录钩子
 * @param props
 * @constructor
 */

/*todo*/
const useAddUserSignInRecord = () => {
  // 签到状态
  const [loading, setLoading] = useState<boolean>(true);
  //交给Usestate

  // 请求后端执行签到
  const doFetch = async () => {
    setLoading(true);
    try {
      await addUserSignInUsingPost({});
    } catch (e) {
      message.error("获取刷题签到记录失败，" + e.message);
    }
    setLoading(false);
  };
  /*设置 loading 为 true，表示开始加载。
调用 addUserSignInUsingPost API 方法发送签到请求。
如果发生错误，使用 message.error 提示用户，并显示错误信息。
请求结束后，将 loading 设置为 false，表示加载完成。*/

  // 保证只会调用一次
  useEffect(() => {
    doFetch();
  }, []);

  //还是不能怎么理解好这个useEffect 有点难了说实话。。。？

  /*// 保证只会调用一次
  useEffect(() => {
    doFetch();
  }, []);
useEffect：
功能：在组件加载时调用 doFetch 方法，确保签到逻辑仅执行一次。
空依赖数组 []：表示该副作用只会在组件首次挂载时触发。*/

  return { loading };
  /*返回一个对象 { loading }，外部组件可以通过该值获取当前的加载状态。*/
};

export default useAddUserSignInRecord;
