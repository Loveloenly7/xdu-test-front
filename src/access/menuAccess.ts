import { menus } from "../../config/menu";
import checkAccess from "@/access/checkAccess";

//todo 权限控制菜单栏的显隐

/**
 * 获取有权限、可访问的菜单（递归）
 * @param loginUser
 * @param menuItems
 */
const getAccessibleMenus = (loginUser: API.LoginUserVO, menuItems = menus) => {
  //参数 登录的用户 以及菜单栏的集合

  return menuItems.filter((item) => {
    // 使用了 Array.prototype.filter() 来遍历 menuItems
    //返回经过过滤之后的menuItem's对象

    if (!checkAccess(loginUser, item.access)) {
      //   检查当前用户是否有权限访问该菜单项。这是个自定义的方法
      return false;
    }

    if (item.children) {
      //递归调用 获取当前有权限的部分
      item.children = getAccessibleMenus(loginUser, item.children);
    }

    return true;
  });
  //   最终，filter() 返回一个只包含用户有权限访问的菜单项的数组。如果菜单项有子菜单，子菜单也会经过相同的过滤和递归处理。
};

export default getAccessibleMenus;
