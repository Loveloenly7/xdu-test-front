import React from "react";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/stores";
import { findAllMenuItemByPath } from "../../config/menu";
import ACCESS_ENUM from "@/access/accessEnum";
import checkAccess from "@/access/checkAccess";
import Forbidden from "@/app/forbidden";

/**
 * 统一权限校验拦截器
 * @param children
 * @constructor
 */
/*获取pathname loginUser
 * 获取菜单项配置 获取NeedAC
 * 调用checkAC函数检测权限是否具有权限 是否去无权限页面*/
const AccessLayout: React.FC<
  Readonly<{
    children: React.ReactNode;
  }>
> = ({ children }) => {
  //默认的 带children参数的

  const pathname = usePathname();

  // 当前登录用户 用selector去拿到
  const loginUser = useSelector((state: RootState) => state.loginUser);

  // 获取当前路径需要的权限

  const menu = findAllMenuItemByPath(pathname);
  //先拿到当前menu config里面的
  const needAccess = menu?.access ?? ACCESS_ENUM.NOT_LOGIN;

  // 校验权限 两个AC之间进行权限的校验
  const canAccess = checkAccess(loginUser, needAccess);

  //校验之后 根据不同的内容进行产出
  if (!canAccess) {
    return <Forbidden />;
  }
  return children;
};

export default AccessLayout;
