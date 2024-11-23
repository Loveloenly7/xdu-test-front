/**
 * 我决定在这里写 只有管理员能进入的
 * todo 获取最新面经
 * （仅管理员）
 */

import React, { useState } from "react";
import { Input, Button, Spin, message } from "antd"; // 引入 Ant Design 的组件
import MdEditor from "@/components/MdEditor"; // 引入你自定义的 Markdown 编辑器组件
import { saveAs } from "file-saver"; // 引入 file-saver，用于保存文件

const ExperienceEditor = () => {
  // 定义一个状态变量，用于保存输入的公司名称
  const [companyName, setCompanyName] = useState<string>("");

  // 定义一个状态变量，用于保存从后端获取到的 Markdown 内容
  const [content, setContent] = useState<string>("");

  // 定义一个状态变量，用于控制是否显示加载动画
  const [loading, setLoading] = useState<boolean>(false);

  /**
   * 模拟请求后端获取数据的方法
   */
  const fetchData = async () => {
    // 判断是否输入了公司名称，未输入时提示用户
    if (!companyName.trim()) {
      message.warning("请输入公司名称");
      return;
    }

    setLoading(true); // 设置加载状态为 true，显示加载动画

    try {
      // 模拟后端请求延迟（1秒后返回数据）
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 模拟的 Markdown 数据，通常应从后端接口获取
      const mockData = `# ${companyName} 面经\n\n这是模拟的面经内容。可以在此编辑。`;

      setContent(mockData); // 更新内容状态
      message.success("数据加载成功"); // 提示加载成功
    } catch (error) {
      // 捕获错误并提示加载失败
      message.error("加载失败，请稍后重试");
    } finally {
      setLoading(false); // 加载完成后关闭加载状态
    }
  };

  /**
   * 保存 Markdown 内容为本地文件
   */
  const saveToFile = () => {
    if (!content) {
      message.warning("没有可保存的内容"); // 如果内容为空，提示用户
      return;
    }

    // 获取当前时间戳，用于生成文件名
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    // 拼接文件名：时间戳 + 公司名称 + .md
    const filename = `${timestamp}-${companyName}.md`;

    // 创建一个 Blob 对象，用于存储 Markdown 内容
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });

    // 使用 file-saver 将文件保存到本地
    saveAs(blob, filename);
    message.success("文件已保存"); // 提示保存成功
  };

  return (
    <div
      style={{
        // 样式：设置页面居中
        display: "flex",
        flexDirection: "column", // 子元素垂直排列
        alignItems: "center", // 水平方向居中
        justifyContent: "center", // 垂直方向居中
        height: "100vh", // 页面高度占满
        gap: "20px", // 子元素之间的间距
        padding: "20px", // 页面内边距
      }}
    >
      {/* 搜索框：用于输入公司名称 */}
      <Input
        placeholder="输入公司名称" // 输入框提示文字
        value={companyName} // 输入框的值绑定到 companyName 状态
        onChange={(e) => setCompanyName(e.target.value)} // 输入变化时更新状态
        style={{ width: "300px" }} // 设置宽度
      />

      {/* 提交按钮：用于发送请求 */}
      <Button type="primary" onClick={fetchData} disabled={loading}>
        提交
      </Button>

      {/* 加载动画：数据加载时显示 */}
      {loading ? <Spin tip="正在加载..." /> : null}

      {/* Markdown 编辑器 */}
      <div style={{ width: "100%", maxWidth: "800px" }}>
        <MdEditor
          value={content} // 当前 Markdown 内容
          placeholder="在这里编辑面经..." // 占位符文字
          onChange={(v) => setContent(v)} // 当编辑器内容改变时更新状态
        />
      </div>

      {/* 底部操作按钮 */}
      <div style={{ display: "flex", gap: "20px" }}>
        {/* 保存为文件 */}
        <Button type="default" onClick={saveToFile}>
          保存为文件
        </Button>

        {/* 清空内容 */}
        <Button
          type="default"
          onClick={() => setContent("")} // 点击按钮时清空内容
          disabled={!content} // 当没有内容时按钮禁用
        >
          清空内容
        </Button>
      </div>
    </div>
  );
};

export default ExperienceEditor;

/*
const fetchData = async () => {
  if (!companyName.trim()) {
    message.warning("请输入公司名称");
    return;
  }

  setLoading(true);

  try {
    const response = await fetch("/api/getExperience", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ companyName }), // 请求体传递公司名称
    });

    const data = await response.json(); // 解析后端返回的数据
    if (response.ok) {
      setContent(data.markdownContent); // 假设返回字段为 markdownContent
      message.success("数据加载成功");
    } else {
      throw new Error(data.message || "加载失败");
    }
  } catch (error) {
    message.error(error.message || "加载失败，请稍后重试");
  } finally {
    setLoading(false);
  }
};
const fetchData = async () => {
  if (!companyName.trim()) {
    message.warning("请输入公司名称");
    return;
  }

  setLoading(true);

  try {
    const response = await fetch("/api/getExperience", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ companyName }), // 请求体传递公司名称
    });

    const data = await response.json(); // 解析后端返回的数据
    if (response.ok) {
      setContent(data.markdownContent); // 假设返回字段为 markdownContent
      message.success("数据加载成功");
    } else {
      throw new Error(data.message || "加载失败");
    }
  } catch (error) {
    message.error(error.message || "加载失败，请稍后重试");
  } finally {
    setLoading(false);
  }
};

*/
