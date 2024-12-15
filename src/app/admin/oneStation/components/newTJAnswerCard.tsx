'use client';


import React, {useState, useEffect} from "react";
import {Collapse, Table, Button, Modal, Input, Form, Select, message, Spin, Popconfirm, Card, Upload} from "antd";
import MDEditor from '@uiw/react-md-editor';
import {aiGenerateTjJsonUsingPost, aiGenerateTmJsonUsingPost} from "@/api/aiController";
import {repairJson} from "../../../../../config/jsonRepair";
import {batchAddQuestionsUsingPost} from "@/api/questionController";
import {QuestionCircleOutlined, UploadOutlined} from "@ant-design/icons";
import TagList from "@/components/TagList";
import dayjs from "dayjs";

const {Panel} = Collapse;
const {Option} = Select;




// 清理和标准化 Markdown 文本
function cleanMarkdown(markdown) {
    return markdown
        .split(/\n/) // 按行拆分
        .map(line => line.trim()) // 去掉每行首尾空白
        .filter(Boolean) // 移除空行
        .join('\n') // 重新合并为文本
        .replace(/-{4,}/g, '---')// 将多于三个-的分割线标准化为---
        .replace(/^---\n|\n---$/g, '') // 去掉开头或结尾的分割线
}


// 导入 Markdown 文档并解析成 JSON 数组
function importMarkdown(markdown) {
    const cleanedMarkdown = cleanMarkdown(markdown); // 清理 Markdown 文本
    const blocks = cleanedMarkdown.split(/\n---\n/); // 拆分 Markdown 文档为块

    return blocks.map(block => {

        if(block.trim() == "") {
            return;
        }
        const lines = block.split(/\n/).filter(Boolean); // 按行拆分，并移除空行

        // 解析 title
        const titleLine = lines.shift();
        if (!titleLine.startsWith('# ')) {
            throw new Error(`Invalid format: Missing title in block:\n${block}`);
        }
        const title = titleLine.replace(/^#\s*/, '');

        // 解析 content
        const contentLine = lines.shift();
        if (!contentLine.startsWith('**') || !contentLine.endsWith('**')) {
            throw new Error(`Invalid format: Missing or invalid content in block:\n${block}`);
        }
        const content = contentLine.replace(/\*\*/g, '');

        // 处理 answer 和 tagList
        const tagList = [];
        const answerLines = [];


        //todo 算法

        // 倒序解析，优先提取 tagList
        while (lines.length) {
            const line = lines[lines.length - 1]; // 检查最后一行
            if (line.startsWith('* ')) {
                tagList.unshift(lines.pop().replace(/^\*\s*/, ''));
            } else {
                break;
            }
        }

        // 剩余部分为 answer
        answerLines.push(...lines);
        const answer = answerLines.join('\n');

        return { title, content, answer, tagList };
    });
}



// 解析 JSON 数组并导出为 Markdown 文档
function generateMarkdownFromData(data) {
    if (!Array.isArray(data)) {
        throw new Error("Invalid data format. Expected an array.");
    }

    return data.map(item => {
        const answer = item.answer; // 保留 answer 的 Markdown 格式
        const tags = item.tagList.map(tag => `* ${tag}`).join('\n'); // 标签列表
        return `# ${item.title}\n**${item.content}**\n\n${answer}\n\n${tags}`;
    }).join('\n---\n'); // 用分割线连接
}


//这俩抽离出来用。。
// 完成数据分片 3个一组 并行发送 减少翻车概率 同时提高初步题解的质量
export const splitJsonArray = (array) => {
    const result = [];
    let currentGroup = [];
    let currentCount = 0;

    array.forEach((item) => {
        let { knowledgePoint, questionList } = item;
        for (let question of questionList) {
            // 如果当前组的问题数达到3，则保存当前组，重置
            if (currentCount === 3) {
                result.push([...currentGroup]);
                currentGroup = [];
                currentCount = 0;
            }

            // 添加当前问题到当前组
            const existingIndex = currentGroup.findIndex(
                (groupItem) => groupItem.knowledgePoint === knowledgePoint
            );

            if (existingIndex !== -1) {
                currentGroup[existingIndex].questionList.push(question);
            } else {
                currentGroup.push({
                    knowledgePoint,
                    questionList: [question],
                });
            }

            currentCount++;
        }
    });

    // 添加最后一组（如果存在）
    if (currentGroup.length > 0) {
        result.push([...currentGroup]);
    }

    return result;
};

//加入重试机制的请求

// 封装带重试机制的请求
export const fetchWithRetry = async (group, retries = 3) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const response = await aiGenerateTjJsonUsingPost({ md: JSON.stringify(group) });
            const outerData = JSON.parse(response?.data);
            const innerData = outerData?.data;
            const content = innerData.choices[0]?.message?.content || '';
            const regex = /\[.*]/s;
            const match = content.match(regex);
            if (match) {
                let jsonArrayString = match[0];
                jsonArrayString = repairJson(jsonArrayString);
                return JSON.parse(jsonArrayString);
            }
            return [];
        } catch (error) {
            console.error(`第 ${attempt} 次请求失败:`, error);
            if (attempt === retries) {
                throw new Error(`请求失败次数达到限制: ${retries}`);
            }
        }
    }
};







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

            //总之 这俩的目的都是data。。。
            message.info("从 Page2 接收到数据，准备处理");

            //别自动化了
        }
    }, [questionData]);

    useEffect(() => {
        if (listData) {
            setData(listData);
            console.log(listData);
            message.info("从 Page2 接收到题单的题解数据，准备处理");
        }
    }, [listData]);

    //这俩抽离到上面 page2也用这个逻辑
    // // 完成数据分片 3个一组 并行发送 减少翻车概率 同时提高初步题解的质量
    // const splitJsonArray = (array) => {
    //     const result = [];
    //     let currentGroup = [];
    //     let currentCount = 0;
    //
    //     array.forEach((item) => {
    //         let { knowledgePoint, questionList } = item;
    //         for (let question of questionList) {
    //             // 如果当前组的问题数达到3，则保存当前组，重置
    //             if (currentCount === 3) {
    //                 result.push([...currentGroup]);
    //                 currentGroup = [];
    //                 currentCount = 0;
    //             }
    //
    //             // 添加当前问题到当前组
    //             const existingIndex = currentGroup.findIndex(
    //                 (groupItem) => groupItem.knowledgePoint === knowledgePoint
    //             );
    //
    //             if (existingIndex !== -1) {
    //                 currentGroup[existingIndex].questionList.push(question);
    //             } else {
    //                 currentGroup.push({
    //                     knowledgePoint,
    //                     questionList: [question],
    //                 });
    //             }
    //
    //             currentCount++;
    //         }
    //     });
    //
    //     // 添加最后一组（如果存在）
    //     if (currentGroup.length > 0) {
    //         result.push([...currentGroup]);
    //     }
    //
    //     return result;
    // };
    //
    // //加入重试机制的请求
    //
    // // 封装带重试机制的请求
    // const fetchWithRetry = async (group, retries = 3) => {
    //     for (let attempt = 1; attempt <= retries; attempt++) {
    //         try {
    //             const response = await aiGenerateTjJsonUsingPost({ md: JSON.stringify(group) });
    //             const outerData = JSON.parse(response?.data);
    //             const innerData = outerData?.data;
    //             const content = innerData.choices[0]?.message?.content || '';
    //             const regex = /\[.*]/s;
    //             const match = content.match(regex);
    //             if (match) {
    //                 let jsonArrayString = match[0];
    //                 jsonArrayString = repairJson(jsonArrayString);
    //                 return JSON.parse(jsonArrayString);
    //             }
    //             return [];
    //         } catch (error) {
    //             console.error(`第 ${attempt} 次请求失败:`, error);
    //             if (attempt === retries) {
    //                 throw new Error(`请求失败次数达到限制: ${retries}`);
    //             }
    //         }
    //     }
    // };
    //
    
    const refreshData = async () => {
        setLoading(true);

        //遍历分片后的数组 按原有的方式请求后端（这里要求并行发送 因为一个请求会消耗很长时间）

        //所有把获取到的结果汇总

        try {
            //对questionData进行分片（按这个分片的思路）
            const splitData = splitJsonArray(questionData);


            // 并行发送请求，并带有重试机制
            const promises = splitData.map((group) => fetchWithRetry(group));


            // 并行发送请求 老版本 不带重试机制
            // const promises = splitData.map(async (group) => {
            //     const response = await aiGenerateTjJsonUsingPost({ md: JSON.stringify(group) });
            //     const outerData = JSON.parse(response?.data);
            //     const innerData = outerData?.data;
            //     const content = innerData.choices[0]?.message?.content || '';
            //     const regex = /\[.*]/s;
            //     const match = content.match(regex);
            //     if (match) {
            //         let jsonArrayString = match[0];
            //         jsonArrayString = repairJson(jsonArrayString);
            //         return JSON.parse(jsonArrayString);
            //     }
            //     return [];
            // });

            // 等待所有请求完成
            const allResults = await Promise.all(promises);

            // 汇总结果
            const finalResult = allResults.flat();

            // 设置结果到状态
            setData (finalResult);
        } catch (error) {
            console.error('刷新数据失败', error);
            alert('刷新数据失败，请检查输入');
        } finally {
            setLoading(false);
        }

//todo 以前的单个处理方法
//         const response = await aiGenerateTjJsonUsingPost({md: JSON.stringify(questionData)});
//         const outerData = JSON.parse(response?.data); // 解析外层的 JSON 字符串
//         const innerData = outerData?.data;
//         const content = innerData.choices[0]?.message?.content || "";
//         // 正则表达式匹配第一个 `[` 和最后一个 `]` 之间的内容
//         // const regex = /\[.*\]/s; // 匹配从第一个 [ 到最后一个 ] 的内容，`s` 表示匹配换行符
//         const regex = /\[.*]/s;
//         const match = content.match(regex);
//         // 提取出的JSON数组字符串
//         let jsonArrayString = match[0];
//         //做一个处理
//         jsonArrayString = repairJson(jsonArrayString);
//         const parsedData = JSON.parse(jsonArrayString); // 将 JSON 字符串解析为对象
//
//         //这里先把parsedData暂时存到一个新数组里面
//
//         //遍历新数组里面的parsedData 遍历新数组里面的数组 把每一个元素汇总到最后的大数组里面（完成数组的拼接）
//
//
//
//         //这时候再setData
//         setData(parsedData); // 设置到状态
//
//
//         setLoading(false);

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
            //批量添加之后 把当页的数据全部消除掉 其实之前也能这样设计我感觉

            /*多去看 视频。。。
            * 我想看看 todo 能不能通过设置Token数量的方式来 现在消息显示不全卧槽。。。
            *       或者把消息分片
            * 去读API文档吧。。。*/
            setData([]);

        } else {
            message.error("批量保存失败，请检查格式")
        }

    }

    // 保存为md文件
    const saveToFile = () => {
        if (data===[]) {
            message.warning("没有可保存的内容");
            return;
        }
        const timestamp = new Date();
        const filename = `${dayjs(timestamp).format("YYYY-MM-DD HH:mm")}-题目详情列表.md`;
        const blob = new Blob([generateMarkdownFromData(data)], {type: "text/markdown;charset=utf-8"});
        saveAs(blob, filename);
        message.success("文件已保存到本地");
    };


    // 上传文件处理
    const handleFileUpload = (file) => {
        const reader = new FileReader();
        reader.onload = () => {
            const text = reader.result;
            try {
                const parsedData = importMarkdown(text);
                setData(parsedData);
                message.success("Markdown 文件已成功导入并解析");
            } catch (error) {
                message.error(`导入失败: ${error.message}`);
            }
        };
        reader.readAsText(file);
        return false; // 阻止默认上传行为
    };

    return (
        <div style={{width: "100%", margin: "0 auto", display: "flex", flexDirection: "column", gap: "20px"}}>

            <Card title="设置" style={{width: "100%"}}>
                <div style={{marginBottom: 16, display: 'flex', gap: '10px'}}>
                <Button type="primary" onClick={() => openModal("add")} disabled={loading}>新增题目</Button>
                    <Button type="default" onClick={refreshData}>批量生成(从上个页面的所有）（现在处理得过来了！）</Button>
                    <Button type="default" onClick={saveAll}>执行批量添加题目</Button>
                    <Upload beforeUpload={handleFileUpload} accept=".md">
                        <Button icon={<UploadOutlined/>}>导入 Markdown 文件</Button>
                    </Upload>
                    <Button type="default" onClick={saveToFile} disabled={data.length === 0}
                            style={{marginLeft: '10px'}}>
                        保存本页题目详情为文件
                    </Button>
                </div>
                <div style={{marginBottom: 16}}>
                    {loading && <Spin tip="正在加载..." style={{marginTop: "10px"}}/>}
                </div>
                <div style={{marginBottom: 16}}>
                    <p style={{margin: 0, textIndent: "0.5em", fontStyle: "italic", fontFamily: "light"}}>
                        在这里进行题目的批量初步添加 后续可前往题目管理页面对单个题目进行AI自动详细化和更深入的编辑操作
                        批量导入的标准md格式：
                        题目间使用分割线---，标题用#，内容用**粗体**包围，答案格式Free，以多行* 的标签列表结尾（标签可以省略）
                        （要顺利导入的话请务必按照格式和约定的顺序来写md文档 不熟悉格式可以先导出一份标准的来参考）
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
                                    // {
                                    //     title: "标签",
                                    //     dataIndex: "tagList",
                                    //     render: (tags) => <div>{tags.join(", ")}</div>
                                    // }
                                    {
                                        title: "标签",
                                        dataIndex: "tagList",
                                        key: "tagList",
                                        render: (tagList: string[]) => (
                                            // 使用 next/link 组件进行路由跳转 使用 passHref 来确保 href 被正确传递给 <a> 标签
                                            // <Link href={`/question/${record.id}`} passHref>
                                            //     <a target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'SimHei, Arial, sans-serif', fontWeight: 'bold' ,color: 'black'}}>{text}</a>
                                            // </Link>
                                            <TagList tagList={tagList}>

                                            </TagList>

                                        ),
                                    },
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
