//todo 题目生成题解

'use client';

import React, { useState } from "react";
import { Button, Card, Upload, message, Spin } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import MdEditor from "@/components/MdEditor";
import { aiGenerateTjUsingPost } from "@/api/aiController";
import { saveAs } from "file-saver";
import { RcFile } from "antd/es/upload";

const AiContentGenerator = () => {
    const [inputContent, setInputContent] = useState<string>(""); // 输入内容
    const [outputContent, setOutputContent] = useState<string>(""); // 输出内容
    const [loading, setLoading] = useState<boolean>(false); // 全局加载状态

    // 调用后端接口
    const handleGenerate = async () => {
        if (!inputContent.trim()) {
            message.warning("输入内容不能为空");
            return;
        }
        setLoading(true); // 开启加载状态
        try {
            const response = await aiGenerateTjUsingPost({ md: inputContent });

            const parsedResponse = JSON.parse(response.data);
            setOutputContent(parsedResponse.data.choices?.[0]?.message?.content || ""); // 假设 response.data 是 Markdown 格式内容
            // setOutputContent(response.data || ""); // 假设 response.data 是 Markdown 格式内容
            message.success("生成成功");
        } catch (error) {
            message.error("生成失败，请稍后重试");
        } finally {
            setLoading(false); // 关闭加载状态
        }
    };

    // 导出 Markdown 文件
    const saveToFile = (content: string, filenamePrefix: string) => {
        if (!content) {
            message.warning("没有可保存的内容");
            return;
        }
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const filename = `${timestamp}-${filenamePrefix}.md`;
        const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
        saveAs(blob, filename);
        message.success("文件已保存到本地");
    };

    // 导入文件：设置内容到指定编辑器
    const handleFileUpload = (file: RcFile, setContent: React.Dispatch<React.SetStateAction<string>>) => {
        const reader = new FileReader();
        reader.onload = () => {
            const text = reader.result as string;
            setContent(text); // 将文件内容设置到编辑器
        };
        reader.readAsText(file);
        return false; // 阻止默认上传行为
    };

    return (
        <div
            style={{
                width: "80%",
                margin: "0 auto",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                position: "relative",
            }}
        >
            {/* 全局加载遮罩 */}
            {loading && (
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 1000,
                    }}
                >
                    <Spin size="large" tip="正在生成内容，请稍候..." />
                </div>
            )}

            {/* 上方编辑器 */}
            <Card title="输入文本（将作为参数传输到后端）" style={{ width: "100%" }}>
                <MdEditor
                    value={inputContent}
                    placeholder="在这里输入内容..."
                    onChange={(value) => setInputContent(value)}
                    style={{ height: "300px" }}
                    disabled={loading} // 禁用编辑器
                />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
                    {/* 导入按钮 */}
                    <Upload beforeUpload={(file) => handleFileUpload(file, setInputContent)} accept=".md" disabled={loading}>
                        <Button icon={<UploadOutlined />} disabled={loading}>
                            导入 Markdown 文件
                        </Button>
                    </Upload>
                    {/* 导出按钮 */}
                    <Button
                        type="default"
                        onClick={() => saveToFile(inputContent, "输入文本")}
                        disabled={!inputContent || loading}
                    >
                        保存为文件
                    </Button>
                </div>
            </Card>

            {/* 提交按钮 */}
            <Button
                type="primary"
                onClick={handleGenerate}
                style={{ alignSelf: "center" }}
                disabled={loading} // 禁用按钮
            >
                生成内容
            </Button>

            {/* 下方编辑器 */}
            <Card title="输出结果（由后端生成）" style={{ width: "100%" }}>
                <MdEditor
                    value={outputContent}
                    placeholder="这里将显示生成的结果..."
                    onChange={(value) => setOutputContent(value)}
                    style={{ height: "300px" }}
                    disabled={loading} // 禁用编辑器
                />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
                    {/* 导入按钮 */}
                    <Upload beforeUpload={(file) => handleFileUpload(file, setOutputContent)} accept=".md" disabled={loading}>
                        <Button icon={<UploadOutlined />} disabled={loading}>
                            导入 Markdown 文件
                        </Button>
                    </Upload>
                    {/* 导出按钮 */}
                    <Button
                        type="default"
                        onClick={() => saveToFile(outputContent, "生成结果")}
                        disabled={!outputContent || loading}
                    >
                        保存为文件
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default AiContentGenerator;
