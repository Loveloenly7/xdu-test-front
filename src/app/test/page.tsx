//todo 面试页面

//要不要做成沉浸式的呢。。？
//想法 只保留底部布局

//流程为卡片式的一步一步

"use client";
import { useState } from "react";
import { Modal, Checkbox, Select, Button, message } from "antd";
import { getAvailableQuestionBanks, startRandomInterview, startInterview } from "@/API/interviewController";
//todo 后端还没写的 面试

const { Option } = Select;

const TestPage = () => {
    const [visible, setVisible] = useState(false); // 控制题库选择弹窗
    const [selectedBanks, setSelectedBanks] = useState<string[]>([]); // 用户选择的题库
    const [questionCount, setQuestionCount] = useState<number>(5); // 题目数量
    const [banks, setBanks] = useState([]); // 可用题库列表

    // 打开弹窗时加载题库数据
    const handleOpenModal = async () => {
        try {
            const res = await getAvailableQuestionBanks(); // 后端返回可用题库
            if (res.success) {
                setBanks(res.data);
                setVisible(true);
            } else {
                message.error("获取题库列表失败！");
            }
        } catch (error) {
            message.error("加载题库数据出错！");
        }
    };

    // 提交选择
    const handleSubmit = async () => {
        if (!selectedBanks.length) {
            message.warning("请至少选择一个题库！");
            return;
        }

        try {
            const res = await startInterview({ questionBanks: selectedBanks, questionCount });
            if (res.success) {
                message.success("开始面试！");
                window.location.href = `/simulate/${res.data.interviewId}`; // 跳转到答题页面
            } else {
                message.error("开始面试失败！");
            }
        } catch (error) {
            message.error("提交失败！");
        }
    };

    // 随机开始
    const handleRandomStart = async () => {
        try {
            const res = await startRandomInterview();
            if (res.success) {
                message.success("随机开始面试！");
                window.location.href = `/simulate/${res.data.interviewId}`;
            } else {
                message.error("随机面试失败！");
            }
        } catch (error) {
            message.error("随机开始出错！");
        }
    };

    return (
        <div style={{ padding: "24px" }}>
            <h1>模拟面试</h1>
            <Button type="primary" onClick={handleOpenModal}>
                选择题库范围
            </Button>
            <Modal
                title="选择题库范围"
                visible={visible}
                onCancel={() => setVisible(false)}
                footer={[
                    <Button key="cancel" onClick={() => setVisible(false)}>
                        取消
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleSubmit}>
                        提交
                    </Button>,
                ]}
            >
                <Checkbox.Group
                    options={banks.map((bank) => ({
                        label: bank.title,
                        value: bank.id,
                        disabled: bank.type === "经验分享", // 不可选经验分享题库
                    }))}
                    onChange={(values) => setSelectedBanks(values)}
                />
                <div style={{ marginTop: "16px" }}>
                    <span>题目数量：</span>
                    <Select value={questionCount} onChange={(value) => setQuestionCount(value)}>
                        {[5, 6, 7, 8, 9, 10].map((count) => (
                            <Option key={count} value={count}>
                                {count}
                            </Option>
                        ))}
                    </Select>
                </div>
            </Modal>
            <Button style={{ marginLeft: "16px" }} onClick={handleRandomStart}>
                以全随机的方式开始
            </Button>
        </div>
    );
};

export default TestPage;
