import axios from "axios";
//用于发送网络请求！

// 创建 Axios 实例
// 区分开发和生产环境
// todo 后端地址
const DEV_BASE_URL = "http://116.198.200.68:8101";
// const PROD_BASE_URL = "http://localhost:8101 https://116.198.200.68:8101";
//开发环境和生产环境的后端地址

const myAxios = axios.create({
  //   所有发出的请求 都自动拼接这个
  baseURL: DEV_BASE_URL,

  //创建请求 多久超时 10s无响应会自动取消
  timeout: 10000,

  //允许跨域的时候带cookie 或者其他验证信息
  withCredentials: true,
});
/*创建axios的实例
 * */

// AXios请求拦截器
myAxios.interceptors.request.use(
  function (config) {
    // 请求执行前执行
    return config;
  },
  function (error) {
    // 处理请求错误 promise。。？
    return Promise.reject(error);
  },
);

// 创建响应拦截器
//为什么响应也需要拦截呢。。？
myAxios.interceptors.response.use(
  // 2xx 响应触发
  function (response) {
    // 处理响应数据
    //todo 后端的响应数据 在这里解构
    const { data } = response;

    //这里前后端规定了通用的返回类的我记得

    // 未登录
    if (data.code === 40100) {
      //401代表没登录
      // 不是获取用户信息接口，或者不是登录页面，则跳转到登录页面
      if (
        !response.request.responseURL.includes("user/get/login") &&
        !window.location.pathname.includes("/user/login")
      ) {
        //如果响应不是 去拿用户信息的 就这个
        //而且当前没有在登陆界面
        window.location.href = `/user/login?redirect=${window.location.href}`;
        //重定向
      }
    } else if (data.code !== 0) {
      // 其他错误 为什么
      throw new Error(data.message ?? "服务器错误");
      /*如果返回的 code 不为 0（即表示有错误），抛出一个新的错误。
todo 前端传递了来自后端的错误信息 错误信息取自 data.message，若无具体信息，则显示默认的 "服务器错误"。*/
    }

    //最后没问题就返回这个响应
    return data;
  },

  // 非 2xx 响应触发
  function (error) {
    // 处理响应错误
    return Promise.reject(error);
  },
);

export default myAxios;
