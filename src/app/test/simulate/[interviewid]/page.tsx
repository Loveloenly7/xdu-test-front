//todo 答题的页面

"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Button, Input, message } from "antd";
import { saveAnswer, submitInterview, getInterviewQuestions } from "@/api/interviewController";

const { TextArea } = Input;

const SimulatePage = () => {
    const router = useRouter();
    const { interviewId } = router.query; // 动态获取 interviewId 参数
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(0); // 倒计时

    useEffect(() => {
        if (interviewId) {
            loadQuestions(interviewId as string);
        }
    }, [interviewId]);

    useEffect(() => {
        if (timeLeft <= 0) return;
        const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    const loadQuestions = async (id: string) => {
        try {
            const res = await getInterviewQuestions(id);
            if (res.success) {
                setQuestions(res.data.questions);
                setTimeLeft(res.data.questions.length * 300); // 每题5分钟
            } else {
                message.error("加载题目失败！");
            }
        } catch (error) {
            message.error("获取题目数据出错！");
        }
    };

    const handleSave = async () => {
        try {
            await saveAnswer({ interviewId, answers });
            message.success("自动保存成功！");
        } catch (error) {
            message.error("自动保存失败！");
        }
    };

    const handleSubmit = async () => {
        try {
            await submitInterview({ interviewId, answers });
            message.success("提交成功！");
            router.push(`/result/${interviewId}`); // 跳转到面试结果页面
        } catch (error) {
            message.error("提交失败！");
        }
    };

    return (
        <div style={{ padding: "24px" }}>
            <h2>{questions[currentIndex]?.title || "加载中..."}</h2>
            <TextArea
                rows={6}
                value={answers[questions[currentIndex]?.id] || ""}
                onChange={(e) =>
                    setAnswers((prev) => ({
                        ...prev,
                        [questions[currentIndex].id]: e.target.value,
                    }))
                }
            />
            <div style={{ marginTop: "16px" }}>
                <Button
                    disabled={currentIndex === 0}
                    onClick={() => setCurrentIndex((prev) => prev - 1)}
                >
                    上一题
                </Button>
                <Button
                    style={{ marginLeft: "8px" }}
                    onClick={() => (currentIndex === questions.length - 1 ? handleSubmit() : setCurrentIndex((prev) => prev + 1))}
                >
                    {currentIndex === questions.length - 1 ? "提交" : "下一题"}
                </Button>
            </div>
            <Button style={{ position: "absolute", top: "16px", right: "16px" }} onClick={handleSave}>
                暂时保存并退出
            </Button>
            <div style={{ position: "absolute", top: "16px", left: "16px", color: timeLeft > 0 ? "blue" : "red" }}>
                剩余时间：{Math.floor(timeLeft / 60)}分{timeLeft % 60}秒
            </div>
        </div>
    );
};

export default SimulatePage;
