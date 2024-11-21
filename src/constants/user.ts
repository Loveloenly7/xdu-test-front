import ACCESS_ENUM from "@/access/accessEnum";

// todo 默认用户常量
// 因为在很多地方都用了 可以定义为常量
export const DEFAULT_USER: API.LoginUserVO = {
  //类型指定为VO？
  // 确保 DEFAULT_USER 的类型和你的接口 API.LoginUserVO 一致
  //前后端类型一致
  userName: "未登录",
  userProfile: "暂无简介",
  userAvatar: "/assets/notLoginUser.png",
  userRole: ACCESS_ENUM.NOT_LOGIN,
};
