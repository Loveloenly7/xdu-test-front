//todo 面试结果页面

"use client";
import { useRouter } from "next/router";
import { Button, message } from "antd";
import { useState, useEffect } from "react";
import Markdown from "react-markdown";
import { getInterviewResult, generateAiReport } from "@/api/interviewController";

const ResultPage = () => {
    const router = useRouter();
    const { interviewId } = router.query; // 动态获取 interviewId 参数
    const [result, setResult] = useState(null);
    const [report, setReport] = useState("");

    useEffect(() => {
        if (interviewId) {
            loadResult(interviewId as string);
        }
    }, [interviewId]);

    const loadResult = async (id: string) => {
        try {
            const res = await getInterviewResult(id);
            if (res.success) {
                setResult(res.data);
            } else {
                message.error("加载结果失败！");
            }
        } catch (error) {
            message.error("获取结果数据出错！");
        }
    };

    const handleGenerateReport = async () => {
        try {
            const res = await generateAiReport(interviewId as string);
            if (res.success) {
                setReport(res.data.report);
                message.success("生成AI分析报告成功！");
            } else {
                message.error("生成报告失败！");
            }
        } catch (error) {
            message.error("生成报告出错！");
        }
    };

    return (
        <div style={{ padding: "24px" }}>
            <h2>面试结果</h2>
            <div id="chart">{/* 饼状图展示时间分布，可用ECharts或其他图表库实现 */}</div>
            <Button type="primary" onClick={handleGenerateReport}>
                一键生成AI面试分析报告
            </Button>
            <Markdown>{report}</Markdown>
        </div>
    );
};

export default ResultPage;


