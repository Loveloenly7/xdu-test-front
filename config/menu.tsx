import { MenuDataItem } from "@ant-design/pro-layout";
import { CrownOutlined } from "@ant-design/icons";
import ACCESS_ENUM from "@/access/accessEnum";

//todo 为了更方便地编辑 导航栏的内容

// 菜单列表
//这里把默认导出给删除了。。？
export const menus = [
  //todo 要不加一下权限 只有注册之后才能。。？
  //不然只给看主页 题库都不能看！
  {
    path: "/",
    name: "主页",
  },
  {
    path: "/banks",
    name: "题库",
  },
  {
    path: "/questions",
    name: "题目",
  },
  {
    name: "模拟面试",
    path: "/test",
    target: "_blank",
  },
  {
    path: "/admin",
    name: "管理",
    icon: <CrownOutlined />,
    access: ACCESS_ENUM.ADMIN,
    // todo 补充了对权限的配置
    children: [
      {
        // todo 管理员才能去管理用户 题库 题目
        path: "/admin/user",
        name: "用户管理",
        access: ACCESS_ENUM.ADMIN,
      },
      {
        path: "/admin/bank",
        name: "题库管理",
        access: ACCESS_ENUM.ADMIN,
      },
      {
        path: "/admin/question",
        name: "题目管理",
        access: ACCESS_ENUM.ADMIN,
      },
      {
        path: "/admin/news",
        name: "获取最新面经",
        access: ACCESS_ENUM.ADMIN,
      },
    ],
  },
] as MenuDataItem[];

// 根据全部路径查找菜单
export const findAllMenuItemByPath = (path: string): MenuDataItem | null => {
  /*返回查找到的菜单项（MenuDataItem 类型）
   * 如果没有匹配的菜单项 返回null
   * 括号是参数 后面是返回值 这样定义？*/
  return findMenuItemByPath(menus, path);
};

// 根据路径查找菜单（递归）
export const findMenuItemByPath = (
  menus: MenuDataItem[],
  path: string,
): MenuDataItem | null => {
  //依然是参数以及返回值 这里写了一个函数
  for (const menu of menus) {
    //遍历集合

    //todo 这里的递归查找
    if (menu.path === path) {
      return menu;
    }
    if (menu.children) {
      const matchedMenuItem = findMenuItemByPath(menu.children, path);
      if (matchedMenuItem) {
        return matchedMenuItem;
      }
    }
  }
  return null;
};
