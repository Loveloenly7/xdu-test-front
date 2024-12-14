'use client';


import React, {useState, useEffect} from "react";
import {Collapse, Table, Button, Modal, Input, Form, Select, message, Spin, Popconfirm, Card} from "antd";
import MDEditor from '@uiw/react-md-editor';
import {aiGenerateTjJsonUsingPost, aiGenerateTmJsonUsingPost} from "@/api/aiController";
import {repairJson} from "../../../../../config/jsonRepair";
import {batchAddQuestionsUsingPost} from "@/api/questionController";
import {QuestionCircleOutlined} from "@ant-design/icons";

const {Panel} = Collapse;
const {Option} = Select;




const Page3 = ({questionData, listData}) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalType, setModalType] = useState(""); // "edit" 或 "add"
    const [currentIndex, setCurrentIndex] = useState(null);
    const [modalValue, setModalValue] = useState(""); // 当前编辑的题目
    const [modalContent, setModalContent] = useState(""); // 编辑的题目内容
    const [modalAnswer, setModalAnswer] = useState(""); // 编辑的答案
    const [modalTags, setModalTags] = useState([]); // 编辑的标签

    useEffect(() => {
        if (questionData.length > 0) {
            console.log(questionData);
            message.info("从 Page2 接收到数据，准备处理");

            //别自动化了
        }
    }, [questionData]);

    useEffect(() => {
        if (listData) {
            setData(listData);
            message.info("从 Page2 接收到题单的题解数据，准备处理");
        }
    }, [listData]);

    const refreshData = async () => {
        setLoading(true);
        // message.loading({content: "加载数据中...", key: "loading"});


        const response = await aiGenerateTjJsonUsingPost({md: JSON.stringify(questionData)});
        // const parsedData = JSON.parse(response.data);


        const outerData = JSON.parse(response?.data); // 解析外层的 JSON 字符串

        const innerData = outerData?.data;


        const content = innerData.choices[0]?.message?.content || "";


        // 正则表达式匹配第一个 `[` 和最后一个 `]` 之间的内容
        // const regex = /\[.*\]/s; // 匹配从第一个 [ 到最后一个 ] 的内容，`s` 表示匹配换行符
        const regex = /\[.*]/s;  // 没有冗余的转义

        const match = content.match(regex);


        // 提取出的JSON数组字符串
        let jsonArrayString = match[0];

        //做一个处理
        jsonArrayString = repairJson(jsonArrayString);


        const parsedData = JSON.parse(jsonArrayString); // 将 JSON 字符串解析为对象
        setData(parsedData); // 设置到状态


        setLoading(false);

    };

    const openModal = (type, index = null, initialValue = "", content = "", answer = "", tags = []) => {
        setModalType(type);
        setCurrentIndex(index);
        setModalValue(initialValue);
        setModalContent(content);
        setModalAnswer(answer);
        setModalTags(tags);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setModalValue("");
        setModalContent("");
        setModalAnswer("");
        setModalTags([]);
        setCurrentIndex(null);
    };

    const saveModal = () => {
        const newData = [...data];
        if (modalType === "edit") {
            newData[currentIndex] = {
                title: modalValue,
                content: modalContent,
                answer: modalAnswer,
                tagList: modalTags
            };
        } else if (modalType === "add") {
            newData.push({
                title: modalValue,
                content: modalContent,
                answer: modalAnswer,
                tagList: modalTags
            });
        }
        setData(newData);
        closeModal();
    };

    const deleteQuestion = (index) => {
        const newData = [...data];
        newData.splice(index, 1);
        setData(newData);
    };

    const saveAll = async () => {


        //没有进行类型转换 但是可以
        const response = await batchAddQuestionsUsingPost({questionAddRequests: data});

        if (response?.data?.length > 0) {

            message.success('已批量添加当前页的题目')

        } else {
            message.error("批量保存失败，请检查格式")
        }

    }

    return (
        <div style={{width: "100%", margin: "0 auto", display: "flex", flexDirection: "column", gap: "20px"}}>

            <Card title="设置" style={{width: "100%"}}>
                <div style={{marginBottom: 16, display: 'flex', gap: '10px'}}>
                <Button type="primary" onClick={() => openModal("add")} disabled={loading}>新增题目</Button>
                    <Button type="default" onClick={refreshData}>批量生成初步题解(从上个页面的所有题单）（慎用 目前一次过多处理不过来 已自动处理数据截断）</Button>
                    <Button type="default" onClick={saveAll}>执行批量添加题目</Button>
                </div>
                <div style={{marginBottom: 16}}>
                    {loading && <Spin tip="正在加载..." style={{marginTop: "10px"}}/>}
                </div>
                <div style={{marginBottom: 16}}>
                    <p style={{margin: 0, textIndent: "0.5em", fontStyle: "italic", fontFamily: "light"}}>
                        在这里初步进行题目的添加 后续可以前往题目管理页面对单个题目进行AI详细化的工作
                    </p>
                </div>
            </Card>
            <Card title="题目详情列表" style={{width: "100%"}}>
                <Collapse>
                    {data.map((item, index) => (
                        <Panel
                            header={
                                <div
                                    onClick={(e) => {
                                        // 点击 header 中的空白区域时，允许触发展开
                                        e.stopPropagation();
                                    }}
                                    style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                                    <span>{item.title}</span>

                                    <div style={{display: 'flex', gap: '10px'}}>
                                        <Button
                                            onClick={() => openModal("edit", index, item.title, item.content, item.answer, item.tagList)}
                                        >
                                            编辑
                                        </Button>

                                        <Popconfirm
                                            title="删除"
                                            description="确定要删除吗"
                                            icon={<QuestionCircleOutlined style={{color: 'red'}}/>}
                                            onConfirm={() => {
                                                deleteQuestion(index);
                                            }}
                                            onCancel={() => {
                                                message.info('取消删除');
                                            }}
                                        >
                                            <Button danger>
                                                删除
                                            </Button>
                                        </Popconfirm>
                                    </div>

                                </div>
                            }
                            key={index}
                        >
                            <Table
                                dataSource={[item]}
                                columns={[
                                    {
                                        title: "内容",
                                        dataIndex: "content",
                                        render: (content) => <div>{content}</div>
                                    },
                                    {
                                        title: "答案",
                                        dataIndex: "answer",
                                        render: (answer) => <div>{answer}</div>
                                    },
                                    {
                                        title: "标签",
                                        dataIndex: "tagList",
                                        render: (tags) => <div>{tags.join(", ")}</div>
                                    }
                                ]}
                                pagination={false}
                            />
                        </Panel>
                    ))}
                </Collapse>
            </Card>


            <Modal
                title={modalType === "edit" ? "编辑题目" : "新增题目"}
                visible={modalVisible}
                onOk={saveModal}
                onCancel={closeModal}
                width={800}
            >
                <Form>
                    <Form.Item label="题目">
                        <Input
                            value={modalValue}
                            onChange={(e) => setModalValue(e.target.value)}
                            placeholder="请输入题目"
                        />
                    </Form.Item>
                    <Form.Item label="内容">
                        <MDEditor
                            value={modalContent}
                            onChange={setModalContent}
                            height={300}
                            preview="edit"
                        />
                    </Form.Item>
                    <Form.Item label="答案">
                        <MDEditor
                            value={modalAnswer}
                            onChange={setModalAnswer}
                            height={300}
                            preview="edit"
                        />
                    </Form.Item>
                    <Form.Item label="标签">
                        <Select
                            mode="tags"
                            style={{width: "100%"}}
                            value={modalTags}
                            onChange={setModalTags}
                            tokenSeparators={[","]}
                            placeholder="请输入标签"
                        >
                            {['简单', '中等', '高难'].map(tag => (
                                <Option key={tag} value={tag}>{tag}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Page3;
//todo V1.0

// 'use client'
//
// import React, { useState, useEffect } from "react";
// import {Collapse, Table, Button, Modal, Input, Form, message, Select} from "antd";
// import {aiGenerateTjJsonUsingPost} from "@/api/aiController";
//
// import {repairJson} from "../../../../../config/jsonRepair";
//
// const { Panel } = Collapse;
//
//
//
// const testData ="[\n  {\n    \"knowledgePoint\": \"数据结构与算法\",\n    \"questionList\": [\n      \"如何求两个有序数组的中位数？\",\n      \"如何实现一个线程安全的list？\",\n      \"如何输出数组中K个最小的数，保持时间复杂度低于O(n logn)？\",\n      \"解释快速排序及其基准数优化？\",\n      \"如何实现链表、动态规划、字符串加法等算法题？\",\n      \"删除最少的字符保证字符串中不存在回文子串？\"\n    ]\n  },\n  {\n    \"knowledgePoint\": \"计算机网络\",\n    \"questionList\": [\n      \"解释OSI网络模型？\",\n      \"TCP为什么需要三次握手？\",\n      \"TCP与UDP的区别？\",\n      \"TCP的可靠性是如何保证的？\",\n      \"TCP超时重传的是什么？\",\n      \"网络攻击方式有哪些？\"\n    ]\n  },\n  {\n    \"knowledgePoint\": \"操作系统\",\n    \"questionList\": [\n      \"解释进程与线程的切换？\",\n      \"进程通信的方式有哪些？\",\n      \"什么是虚拟内存，它的作用是什么？\",\n      \"多核CPU关中断可以保证原子性吗？\",\n      \"内核的地址是什么？\",\n      \"用户态可以访问内核吗，为什么？\"\n    ]\n  }\n]"
// ;
//
//
// import MDEditor from '@uiw/react-md-editor';
//
// const { Option } = Select;
//
// const Page3 = () => {
//     const [data, setData] = useState([]); // 数据存储
//     const [modalVisible, setModalVisible] = useState(false);
//     const [modalType, setModalType] = useState(""); // "edit" 或 "add"
//     const [currentQuestionIndex, setCurrentQuestionIndex] = useState(null);
//     const [modalValue, setModalValue] = useState(""); // 当前编辑/新增的值
//     const [modalContent, setModalContent] = useState(""); // 编辑的标签
//     const [modalAnswer, setModalAnswer] = useState(""); // 编辑的答案
//     const [modalTags, setModalTags] = useState([]); // 编辑的标签
//
//
//     // 页面加载时从 localStorage 初始化数据
//     useEffect(() => {
//         const storedData = localStorage.getItem("questionData");
//         if (storedData) {
//             setData(JSON.parse(storedData));
//         }
//     }, []);
//
//     // 数据更新时保存到 localStorage
//     useEffect(() => {
//         localStorage.setItem("questionData", JSON.stringify(data));
//     }, [data]);
//
//     // 刷新数据函数
//     const refreshData = async () => {
//         message.loading({ content: '加载数据中...', key: 'loading' });
//         try {
//             const response = await aiGenerateTjJsonUsingPost({ md: testData });
//             const outerData = JSON.parse(response?.data); // 解析外层的 JSON 字符串
//             const innerData = outerData?.data;
//
//             const content = innerData.choices[0]?.message?.content || "";
//             const regex = /\[.*]/s;
//             const match = content.match(regex);
//
//             if (match) {
//                 let jsonArrayString = match[0];
//                 jsonArrayString = repairJson(jsonArrayString);
//
//                 const parsedData = JSON.parse(jsonArrayString);
//                 setData(parsedData);
//                 localStorage.setItem("questionData", JSON.stringify(parsedData));
//                 message.success({ content: '数据已加载', key: 'loading' });
//             } else {
//                 throw new Error("未找到有效 JSON 数据");
//             }
//         } catch (error) {
//             message.error({ content: '解析数据失败', key: 'loading' });
//         }
//     };
//
//     // 打开模态框，处理编辑或新增
//     const openModal = (type, questionIndex = null, initialValue = "",content="", answer = "", tags = []) => {
//         setModalType(type);
//         setCurrentQuestionIndex(questionIndex);
//         setModalValue(initialValue);
//         setModalContent(content);
//         setModalAnswer(answer);
//         setModalTags(tags);
//         setModalVisible(true);
//     };
//
//     // 关闭模态框
//     const closeModal = () => {
//         setModalVisible(false);
//         setModalValue("");
//         setModalContent("");
//         setModalAnswer("");
//         setModalTags([]);
//         setCurrentQuestionIndex(null);
//     };
//
//     // 保存模态框的修改
//     const saveModal = () => {
//         const newData = [...data];
//         if (modalType === "edit") {
//             newData[currentQuestionIndex].title = modalValue; // 编辑题目
//             newData[currentQuestionIndex].content = modalContent; // 编辑题目
//             newData[currentQuestionIndex].answer = modalAnswer; // 编辑答案
//             newData[currentQuestionIndex].tagList = modalTags; // 编辑标签
//         } else if (modalType === "add") {
//             newData.push({ title: modalValue, content: modalContent, answer: modalAnswer, tagList: modalTags }); // 新增题目
//         }
//         setData(newData);
//         closeModal();
//     };
//
//     // 删除题目
//     const deleteQuestion = (questionIndex) => {
//         const newData = [...data];
//         newData.splice(questionIndex, 1);
//         setData(newData);
//     };
//
//     return (
//         <div>
//             <div style={{ marginBottom: 16 }}>
//                 <Button type="primary" onClick={() => openModal("add")} style={{ marginRight: 8 }}>
//                     新增题目
//                 </Button>
//                 <Button type="default" onClick={refreshData}>
//                     刷新数据
//                 </Button>
//             </div>
//
//             <Collapse>
//                 {data.map((item, index) => (
//                     <Panel
//                         header={
//                             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                                 <span>{item.title}</span>
//                                 <div>
//                                     <Button
//                                         type="link"
//                                         onClick={() => openModal("edit", index, item.title,item.content, item.answer, item.tagList)}
//                                     >
//                                         编辑
//                                     </Button>
//                                     <Button type="link" danger onClick={() => deleteQuestion(index)}>
//                                         删除
//                                     </Button>
//                                 </div>
//                             </div>
//                         }
//                         key={index}
//                     >
//                         <Table
//                             dataSource={[item]}
//                             columns={[
//                                 {
//                                     title: "内容",
//                                     dataIndex: "content",
//                                     render: (content) => <div>{content}</div>
//                                 },
//                                 {
//                                     title: "答案",
//                                     dataIndex: "answer",
//                                     render: (answer) => <div>{answer}</div>
//                                 },
//                                 {
//                                     title: "标签",
//                                     dataIndex: "tagList",
//                                     render: (tags) => <div>{tags.join(", ")}</div>
//                                 }
//                             ]}
//                             pagination={false}
//                         />
//                     </Panel>
//                 ))}
//             </Collapse>
//
//             <Modal
//                 title={modalType === "edit" ? "编辑题目" : "新增题目"}
//                 visible={modalVisible}
//                 onOk={saveModal}
//                 onCancel={closeModal}
//                 width={800}
//             >
//                 <Form>
//                     <Form.Item label="题目">
//                         <Input
//                             value={modalValue}
//                             onChange={(e) => setModalValue(e.target.value)}
//                             placeholder="请输入题目"
//                         />
//                     </Form.Item>
//                     <Form.Item label="内容">
//                         <MDEditor
//                             value={modalContent}
//                             onChange={setModalContent}
//                             height={300}
//                             preview="edit"
//                         />
//                     </Form.Item>
//                     <Form.Item label="答案">
//                         <MDEditor
//                             value={modalAnswer}
//                             onChange={setModalAnswer}
//                             height={300}
//                             preview="edit"
//                         />
//                     </Form.Item>
//                     <Form.Item label="标签">
//                         <Select
//                             mode="tags"
//                             style={{ width: "100%" }}
//                             value={modalTags}
//                             onChange={setModalTags}
//                             tokenSeparators={[","]}
//                             placeholder="请输入标签"
//                         >
//                             {["数据结构", "算法", "多线程", "排序", "链表"].map((tag) => (
//                                 <Option key={tag} value={tag}>
//                                     {tag}
//                                 </Option>
//                             ))}
//                         </Select>
//                     </Form.Item>
//                 </Form>
//             </Modal>
//         </div>
//     );
// };
//
// export default Page3;
