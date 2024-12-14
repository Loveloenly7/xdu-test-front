
'use client';

import React, { useState } from "react";
import { Input, Button, Spin, Card, Upload, message } from "antd";
import { UploadOutlined } from '@ant-design/icons';
import MdEditor from "@/components/MdEditor";
import {actionCrawlerOldUsingPost, actionCrawlerUsingPost} from "@/api/crawlerController";
import { saveAs } from "file-saver";
import { RcFile } from "antd/es/upload";
import dayjs from "dayjs";

const Page1 = ({ onExpUpdate }) => {
    const [companyName, setCompanyName] = useState("");
    const [exp, setExp] = useState("");
    const [loading, setLoading] = useState(false);

    // 提交按钮的点击事件，调用后端方法
    const handleFetchData = async () => {
        if (!companyName.trim()) {
            message.warning("请输入公司名称");
            return;
        }
        setLoading(true);
        try {
            const response = await actionCrawlerUsingPost({ name: companyName });

            let markdownText = response.data.replace(/<h1>(.*?)<\/h1>/g, '# $1');
            markdownText = markdownText.replace(/<br>/g, '  \n');

            setExp(markdownText || "");
            /*卧槽 还能往回递属性的。。*/
            onExpUpdate(markdownText || ""); // 将数据传递给父组件
            message.success("数据加载成功");
        } catch (error) {
            message.warning("加载遇到困难，请重试 或者用下面的老接口");
        } finally {
            setLoading(false);
        }
    };
    // 提交按钮的点击事件，调用后端方法
    const handleFetchDataOld = async () => {
        if (!companyName.trim()) {
            message.warning("请输入公司名称");
            return;
        }
        setLoading(true);
        try {
            const response = await actionCrawlerOldUsingPost({ name: companyName });

            let markdownText = response.data.replace(/<h1>(.*?)<\/h1>/g, '# $1');
            markdownText = markdownText.replace(/<br>/g, '  \n');

            setExp(markdownText || "");
            /*卧槽 还能往回递属性的。。*/
            onExpUpdate(markdownText || ""); // 将数据传递给父组件
            message.success("数据加载成功");
        } catch (error) {
            message.warning("加载遇到困难，请重试");
        } finally {
            setLoading(false);
        }
    };

    const saveToFile = () => {
        if (!exp) {
            message.warning("没有可保存的内容");
            return;
        }
        const timestamp = new Date();
        const filename = `${dayjs(timestamp).format("YYYY-MM-DD HH:mm")}-${companyName || "面经"}.md`;
        const blob = new Blob([exp], { type: "text/markdown;charset=utf-8" });
        saveAs(blob, filename);
        message.success("文件已保存到本地");
    };

    const handleFileUpload = (file: RcFile) => {
        const reader = new FileReader();
        reader.onload = () => {
            const text = reader.result as string;
            setExp(text);
        };
        reader.readAsText(file);
        return false;
    };

    return (
        <div style={{ width: "100%", margin: "0 auto", display: "flex", flexDirection: "column", gap: "20px" }}>
            <Card title="设置" style={{ width: "100%" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Input
                        placeholder="输入公司名称"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        style={{ flex: 1 }}
                    />
                    <Button type="primary" onClick={handleFetchData} loading={loading}>
                        提交 （新接口 基于Selium 稳定 但是慢）
                    </Button>
                    <Button type="default" onClick={handleFetchDataOld} loading={loading}>
                        提交（老接口 基于Jsoup 会快一点 但是可能失败）
                    </Button>
                </div>
                {loading && <Spin tip="正在加载..." style={{ marginTop: "10px" }} />}
            </Card>
            <Card title="题目列表" style={{width: "100%"}}>
            </Card>


            <Card title="面经内容" style={{ width: "100%" }}>
                <MdEditor
                    value={exp}
                    placeholder="在这里编辑面经..."
                    onChange={(value) => setExp(value)}
                    style={{ height: "400px" }}
                />

                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
                    <Upload beforeUpload={handleFileUpload} accept=".md">
                        <Button icon={<UploadOutlined />}>导入 Markdown 文件</Button>
                    </Upload>
                    <Button type="default" onClick={saveToFile} disabled={!exp}>
                        保存为文件
                    </Button>
                    <Button type="default" onClick={() => setExp("")} disabled={!exp}>
                        清空内容
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default Page1;

//todo V1.0

// 'use client';
//
// import React, { useState } from "react";
// import { Input, Button, Spin, Card, Upload, message } from "antd";
// import { UploadOutlined } from '@ant-design/icons';
// import MdEditor from "@/components/MdEditor";
// import { actionCrawlerUsingPost } from "@/api/crawlerController"; // 引入后端请求方法
// import { saveAs } from "file-saver"; // 用于保存文件
// import { RcFile } from "antd/es/upload";
//
//
//
// const Page1 = () => {
//
//
//     const [companyName, setCompanyName] = useState<string>(""); // 保存公司名称
//     const [exp, setExp] = useState<string>(""); // 保存 Markdown 内容
//     const [loading, setLoading] = useState<boolean>(false); // 控制加载状态
//
//     // 提交按钮的点击事件，调用后端方法
//     const handleFetchData = async () => {
//         if (!companyName.trim()) {
//             message.warning("请输入公司名称");
//             return;
//         }
//         setLoading(true);
//         try {
//             const response = await actionCrawlerUsingPost({ name: companyName });
//
//             // 替换 <h1> 标签为 Markdown 格式的标题（#）
//             let markdownText = response.data.replace(/<h1>(.*?)<\/h1>/g, '# $1');
//
//             // 替换 <br> 标签为换行符（两个空格后换行）
//             markdownText = markdownText.replace(/<br>/g, '  \n');
//
//             // 返回转换后的 Markdown 格式文本
//
//
//             setExp(markdownText || ""); // 假设 response.data 是 Markdown 格式内容
//             message.success("数据加载成功");
//         } catch (error) {
//             message.warning("加载遇到困难，大概率是牛客网本身设置了缓存，请重试几次");
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     // 保存内容到本地文件
//     const saveToFile = () => {
//         if (!exp) {
//             message.warning("没有可保存的内容");
//             return;
//         }
//
//         // 生成文件名：当前时间戳 + 公司名称
//         const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
//         const filename = `${timestamp}-${companyName || "面经"}.md`;
//
//         // 创建文件并保存
//         const blob = new Blob([exp], { type: "text/markdown;charset=utf-8" });
//         saveAs(blob, filename);
//         message.success("文件已保存到本地");
//     };
//
//     // 处理文件导入
//     const handleFileUpload = (file: RcFile) => {
//         const reader = new FileReader();
//         reader.onload = () => {
//             const text = reader.result as string;
//             setExp(text); // 将文件内容设置到 Markdown 编辑器中
//         };
//         reader.readAsText(file);
//         return false; // 阻止默认的上传行为
//     };
//
//     return (
//         <div
//             style={{
//                 width: "80%", // 总宽度为页面宽度的 80%
//                 margin: "0 auto", // 居中显示
//                 display: "flex",
//                 flexDirection: "column", // 垂直布局
//                 gap: "20px", // 卡片之间的间距
//             }}
//         >
//             {/* 上半部分 */}
//             <Card title="获取最新面经" style={{ width: "100%" }}>
//                 <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
//                     <Input
//                         placeholder="输入公司名称"
//                         value={companyName}
//                         onChange={(e) => setCompanyName(e.target.value)}
//                         style={{ flex: 1 }}
//                     />
//                     <Button type="primary" onClick={handleFetchData} loading={loading}>
//                         提交
//                     </Button>
//                 </div>
//                 {loading && <Spin tip="正在加载..." style={{ marginTop: "10px" }} />}
//             </Card>
//
//             {/* 下半部分 */}
//             <Card title="在这里获取最新面经" style={{ width: "100%" }}>
//                 {/* Markdown 编辑器 */}
//                 <MdEditor
//                     value={exp}
//                     placeholder="在这里编辑面经..."
//                     onChange={(value) => setExp(value)}
//                     style={{ height: "400px" }}
//                 />
//
//                 {/* 底部按钮 */}
//                 <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
//                     {/* 文件上传按钮 */}
//                     <Upload beforeUpload={handleFileUpload} accept=".md">
//                         <Button icon={<UploadOutlined />}>导入 Markdown 文件</Button>
//                     </Upload>
//                     {/* 保存文件按钮 */}
//                     <Button type="default" onClick={saveToFile} disabled={!exp}>
//                         保存为文件
//                     </Button>
//                     {/* 清空按钮 */}
//                     <Button type="default" onClick={() => setExp("")} disabled={!exp}>
//                         清空内容
//                     </Button>
//                 </div>
//             </Card>
//         </div>
//     );
// };
//
// export default Page1;
