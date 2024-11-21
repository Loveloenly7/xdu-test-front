import ACCESS_ENUM from "@/access/accessEnum";
import AccessEnum from "@/access/accessEnum";

//为什么这两个都可以？

/**
 * 检查权限（判断当前登录用户是否具有某个权限）
 * @param loginUser 当前登录用户
 * @param needAccess 需要具有的权限
 * @return boolean 有无权限
 */

//todo 判断权限
const checkAccess = (
  loginUser: API.LoginUserVO,
  needAccess = ACCESS_ENUM.NOT_LOGIN,
) => {
  //参数 登录的用户 传入一个未登录的初始权限

  // 获取当前登录用户具有的权限（如果没有登录，则默认没有权限）
  const loginUserAccess = loginUser?.userRole ?? ACCESS_ENUM.NOT_LOGIN;
  // ?. 是 TypeScript 中的可选链操作符（Optional Chaining），它可以确保如果 loginUser 为 null 或 undefined 时，访问 userRole 不会抛出错误，而是返回 undefined。

  //   ?? 是空值合并运算符（Nullish Coalescing Operator），用于检查其左侧的值是否为 null 或 undefined。如果左侧值为 null 或 undefined，则返回右侧的值。
  //todo 这里的ts语法 这个写法有点东西。。

  // 如果当前不需要任何权限
  if (needAccess === ACCESS_ENUM.NOT_LOGIN) {
    return true;
  }

  // 如果需要登录才能访问
  if (needAccess === AccessEnum.USER) {
    // 如果用户未登录，表示无权限
    if (loginUserAccess === ACCESS_ENUM.NOT_LOGIN) {
      return false;
    }
  }

  // 如果需要管理员权限才能访问
  if (needAccess === ACCESS_ENUM.ADMIN) {
    // 必须要有管理员权限，如果没有，则表示无权限
    if (loginUserAccess !== ACCESS_ENUM.ADMIN) {
      return false;
    }
  }
  return true;
};

//本质在于 need AC 以及用户本身的AC
//但是这个needAC是谁给的？
//todo needAC在哪拿到？

export default checkAccess;
