// 'use client'
//
// import React, { useState, useEffect } from "react";
// import { Collapse, Table, Button, Modal, Input, Form, message } from "antd";
// import {aiGenerateTmJsonUsingPost} from "@/api/aiController";
//
//
// const { Panel } = Collapse;


//
// const testData="这是一份关于腾讯的面试经验汇总  \n" +
//     "# 腾讯面经特别版  \n" +
//     "记录一次比较特别的面试  \n" +
//     "  \n" +
//     "昨天突然收到的腾讯的面试邀请，因为面试岗位是后台开发而本人是算法选手，并且面试时间在晚上九点半，再加上目前是秋招末期，很难不让人觉得这是kpi面  \n" +
//     "  \n" +
//     "但是出于好奇我还是面了一下，并且一开始就表达了自己关于岗位不匹配的疑问，面试官说其实是希望招一些复合型人才，其实是完全说的通的，我也遇到过其他类似的情况，所以也可以给大家一个参考，如果遇到类似情况，可以先不急着拒绝  \n" +
//     "  \n" +
//     "然后面试开始先是简单讲了一个实习经历，可以看出来面试官对这个不感兴趣，然后直接跳到了下一个环节，一些开放的讨论，从AI讲到了工业革命，解放生产力到新质生产力(因为自己最近在准备考公所以听到这个词瞬间有些恍惚以为自己在进行公务员面试)。  \n" +
//     "  \n" +
//     "然后让我谈一下AI能创造什么新的需求？我其实比较懵，因为说AI如果重构了现有的方法实现降本增效比较好举例子，但是创造新的需求就比较难想了，要跳出现有的时空，毕竟手机出现之前很少有人想到有刷短视频这个需求（例子可能不恰当领会精神即可)  \n" +
//     "  \n" +
//     "这个问题没有回答好，但是我在反问环节也让面试官谈谈有没有因为AI的出现创造了业务中的新需求或者新功能，哈哈哈哈哈哈反将一军，感觉他也没回答好  \n" +
//     "  \n" +
//     "之所以记录这次面试还是觉得比较特别(无论是不是kpi)，当作跟一个不同年龄和阅历的前辈之间的交流也很有价值，也能感觉到在企业文化上显著的不同，与我之前实习过的部门只会低头哼哧哼哧写代码相比，这次面试以及以往在腾讯的实习经历，尤其突出的就是自由活泼的氛围和允许或者鼓励各种天马行空的想法  \n" +
//     "  \n" +
//     "写到最后发现自己的文字表达能力还是太差了，怪不得选调都没进面😢大家领会精神就好了  \n" +
//     "  \n" +
//     "先写到这吧  \n" +
//     "# 腾讯 测开 一面  \n" +
//     "上个流程五个工作日没动结束了。  \n" +
//     "这次是被wxg捞的测开。  \n" +
//     "也没问什么，问了点项目相关的技术选型、为什么做这个项目、实习中做的项目这些的。  \n" +
//     "然后手撕两个有序数组的中位数，再自己写测试用例。  \n" +
//     "反问：几面？改进？  \n" +
//     "# 腾讯天美二面  \n" +
//     "上来一道easy题，结合这个题问了一个内存压缩的场景问题，没答上来。  \n" +
//     "  \n" +
//     "剩下的就是mysql索引，日志，tcp协议，raft协议，项目相关的问题，水平扩展怎么实现。  \n" +
//     "  \n" +
//     "面试官声音很小，吐槽一下，剩下的随缘吧  \n" +
//     "# 腾讯 CSIG 腾讯云存储 HR面面经  \n" +
//     "9.26 腾讯 csig HR面  \n" +
//     "  \n" +
//     "1. 面试官首先自我介绍，  \n" +
//     "2. 询问自己对业务和技术的匹配度，自我感觉如何。（事后复盘，感觉面评上可能写了我非常 match 这份岗位）  \n" +
//     "3. 询问实习经历中最大的收获是什么  \n" +
//     "4. 为什么选择腾讯？  \n" +
//     "5. 求职时主要考虑的因素是哪些，有没有优先级  \n" +
//     "# 腾讯一面  \n" +
//     "2024-11-19 投递  \n" +
//     "发了测评，没有笔试  \n" +
//     "  \n" +
//     "2024-11-26 天美一面，一共4轮技术+1HR面  \n" +
//     "面试官开始问了为什么简历投递这么晚 + 手上有哪些offer。  \n" +
//     "手撕LRU缓存，算是撕出来了。  \n" +
//     "  \n" +
//     "八股答得还行，比字节一面答得好一点，针对简历项目会问一些场景题。  \n" +
//     "面试官一开始句句有回应，后面感觉态度没那么好了。  \n" +
//     "  \n" +
//     "2024-11-27 天美二面挂，给我转到腾讯云部门了，感觉面试官对我不是很感冒。  \n" +
//     "  \n" +
//     "2024-11-29 腾讯云一面  \n" +
//     "上来先问手头offer + 意向工作地点  \n" +
//     "面试官很好，引导式回答  \n" +
//     "服务器项目：提问有什么可以改进的地方  \n" +
//     "CPU，多线程/多进程，事件驱动，非阻塞I/O等  \n" +
//     "epoll的最大作用是什么。  \n" +
//     "  \n" +
//     "手撕 超简单的输出数组中K个最小的数，按顺序排列，时间复杂度低于O(n logn)，不允许对数组全排序，用堆做即可。  \n" +
//     "  \n" +
//     "就面了30mins，要凉  \n" +
//     "  \n" +
//     "# 腾讯云智 凉  \n" +
//     "因为最近不在国内 凌晨4.30起来面试  \n" +
//     "1.redis 单线程 多线程 区别  \n" +
//     "2.java源注解  \n" +
//     "3.java异常  \n" +
//     "4.redis sds  \n" +
//     "5.java返回值类型  \n" +
//     "6.给一段代码 找问题  \n" +
//     " 因为太瞌睡  问的不难 自己状态太差  \n" +
//     "# 腾讯云智-武汉前端一面  \n" +
//     "40min  \n" +
//     "自我介绍  \n" +
//     "你的项目中有小程序开发经历，那uniapp和小程序原生开发有什么区别？  \n" +
//     "为什么项目中要使用ts和pnpm？  \n" +
//     "webpack和vite区别？  \n" +
//     "vite为什么要使用esbuild和rollup两个？  \n" +
//     "闭包？  \n" +
//     "说一下http请求的流程？  \n" +
//     "说一下你知道哪些网络攻击？答了CSRF和XSS  \n" +
//     "代码  \n" +
//     "面试官人非常好，问我有没有什么想写的工具函数或者算法，写了防抖和节流。  \n" +
//     "节流尾部执行？  \n" +
//     "反问  \n" +
//     "技术栈：react比较多  \n" +
//     "什么时候出面试结果：3-5个工作日  \n" +
//     "面试官人真的超级好，一直引导我  \n" +
//     "# 腾讯天美后台一面  \n" +
//     "①go协程是对称的还是不对称的  \n" +
//     "②go协程的gpm机制，三色标记法，其他gc算法还有什么  \n" +
//     "③mysql索引为什么能多个，为什么用B+树  \n" +
//     "④raft算法原理，Rs纠删码算法原理，脑裂问题解决，临界问题情况  \n" +
//     "⑤redis的set底层实现原理，快表有什么优势。  \n" +
//     "⑥项目相关  \n" +
//     "  \n" +
//     "手撕：令牌桶实现  \n" +
//     "  \n" +
//     "答的不太好，这段时间根本没好好复习，打算痛定思痛好好准备春招了。各位牛友别像我一样裸面  \n" +
//     "# 腾讯WXG日常实习一面  \n" +
//     "拖了很久的面经  \n" +
//     "  \n" +
//     "1.左值右值  \n" +
//     "2.为什么要有左值右值  \n" +
//     "3.Move的底层实现  \n" +
//     "4.智能指针  \n" +
//     "5.sharedptr的计数是原子量吗  \n" +
//     "6.原子量怎么实现的  \n" +
//     "7.讲一下硬中断软中断  \n" +
//     "8.多核CPU关中断可以保证原子性吗  \n" +
//     "9.Lambda函数怎么实现的  \n" +
//     "10.Lambda和bind有什么区别吗  \n" +
//     "11.sort底层实现  \n" +
//     "12.什么时候用插入排序  \n" +
//     "13.长度是多少的时候用插入排序  \n" +
//     "14.讲一下Map  \n" +
//     "15.Map为什么不用其他的数据结构实现  \n" +
//     "16.讲一下内存管理  \n" +
//     "17.虚拟内存有什么用  \n" +
//     "18.虚拟内存大于可用的物理内存会发生什么  \n" +
//     "19.禁止换出到磁盘会发生什么  \n" +
//     "20.内核的地址是什么  \n" +
//     "21.用户态可以访问内核吗，为什么  \n" +
//     "22.讲一下TCP  \n" +
//     "23.TCP的序号为什么要随机初始化  \n" +
//     "24.TCP超时重传的是什么，是一个tcp段，还是滑动窗口内的所有tcp段  \n" +
//     "25.随机初始化能保证可靠传输吗  \n" +
//     "  \n" +
//     "手撕代码，写一个线程安全的list，  \n" +
//     "优化锁的粒度，  \n" +
//     "应该是用手锁来做优化，当时没写出来  \n" +
//     "# 腾讯天美游戏客户端 面经  \n" +
//     "算法题1绿2黄，链表 dp 字符串加法，限c++  \n" +
//     "  \n" +
//     "解释快排 快排基准数优化  \n" +
//     "c++重写和重载区别  \n" +
//     "  \n" +
//     "解释tcp和udp，udp丢包客户端怎么处理  \n" +
//     "  \n" +
//     "三维空间判断点在立方体内，如果点很多怎么优化  \n" +
//     "  \n" +
//     "（问简历）  \n" +
//     "ui数据驱动 数据变动快如何优化  \n" +
//     "命令模式  \n" +
//     "  \n" +
//     "被拷打惨了，除掉算法只面了15分钟还无反问，次日挂  \n" +
//     "# 腾讯云智系统测试  \n" +
//     "一面 50min  \n" +
//     "自我介绍  \n" +
//     "面试官自我介绍  \n" +
//     "1.说一下字节实习期间解决的难题或有最有收获的事  \n" +
//     "2.实习的地点（北京）  \n" +
//     "3.为什么想来武汉  \n" +
//     "4.自动化在什么时候使用（实习期间）  \n" +
//     "5.一些实习细节相关的问题  \n" +
//     "6.实习的收获  \n" +
//     "7.说一下TCP（可靠性、流量窗口）  \n" +
//     "8.Python中列表和元组的区别  \n" +
//     "9.对测试理论了解多少（黑盒测试、白盒测试）  \n" +
//     "10.有什么爱好  \n" +
//     "11.平时玩什么游戏  \n" +
//     "12.对自己的项目测试过吗  \n" +
//     "13.登录界面如何测试  \n" +
//     "14.编程题：删除最少的字符保证字符串中不存在回文子串  \n" +
//     "反问  \n" +
//     "  \n" +
//     "二面30min  \n" +
//     "问项目、实习、成绩  \n" +
//     "已挂  \n" +
//     "# 腾讯游戏客户端 意向  \n" +
//     "7.23 一面：八股（C++、计网，中断流程、动态链接库的原理、TCP、UDP）、手撕。  \n" +
//     "7.25 二面：八股（C++、计网，拥塞控制算法和优化）、手撕。  \n" +
//     "8.05 三面：项目经历、实习经历、个人素质。  \n" +
//     "8.15 HR面：常规问题。  \n" +
//     "  \n" +
//     "面试总体感受：腾讯面试特色针对计网知识的大量考察，面试官都有C++开发经历，针对项目问了不少C++和操作系统的八股题。个人项目经历和岗位工作内容有一定差别，面试官会尽量找相似点或者共通之处进行讨论，总体感受很好。  \n" +
//     "# 腾讯天美游戏客户端面经  \n" +
//     "三道算法题：  \n" +
//     "      1.指定范围内翻转链表  \n" +
//     "      2.在一个从行递增，列递增的矩阵中查找元素  \n" +
//     "      3.给定两个二进制字符串，求二进制字符串结果  \n" +
//     "  \n" +
//     "C++：  \n" +
//     "      1.虚函数与内存(考了很多东西)  \n" +
//     "      2.const和static存在内存那里？  \n" +
//     "      3.构造函数可以是虚函数吗？  \n" +
//     "  \n" +
//     "操作系统：  \n" +
//     "      1.进程通信的方式  \n" +
//     "      2.进程与线程之间的切换  \n" +
//     "  \n" +
//     "图形学：  \n" +
//     "      1.渲染管线  \n" +
//     "      2.early-z  \n" +
//     "      3.阴影  \n" +
//     "  \n" +
//     "设计模式：  \n" +
//     "       问题不清楚，但是确实问了一个  \n" +
//     "  \n" +
//     "总结：包G的，我啥也没答上来。面评必差的，希望明年三四月份的时候别影响我的投递。  \n" +
//     "氛围：面试官非常好，首先问问你对游戏行业的一些看法，然后再抛砖引玉问你觉得自己擅长的知识是哪些。  \n" +
//     "好消息：考的每一个点牛客上都能找到对应的面经，按照牛客准备面试基本上一面没问题。  \n" +
//     "# 腾讯 CSIG 腾讯云存储 一面面经  \n" +
//     "2024届 CSIG 腾讯云 一面 60min 不到  \n" +
//     "  \n" +
//     "一上来就说看我简历觉得我肯定很了解内核代码，让我说一下 open 的调用流程，我直接开启麦霸模式  \n" +
//     "  \n" +
//     "问我怎么一个文件是怎么定位到磁盘的？我开始讲 VFS -&gt; 硬盘的流程，结果发现面试官只是想让我说一下 ext4 inode 的寻址方式  \n" +
//     "  \n" +
//     "介绍了实习经历，两个项目问题的解决过程，评价为很详细  \n" +
//     "  \n" +
//     "问了一下 x86 OS 项目写了多少行  \n" +
//     "  \n" +
//     "手撕阻塞队列生产者、消费者  \n" +
//     "  \n" +
//     "一面秒过  \n" +
//     "# 腾讯前端 一面  \n" +
//     "bfc是什么  \n" +
//     "怎么垂直水平居中  \n" +
//     "是什么跨域，如何解决（vite有proxy选项，可以解决开发阶段的跨域；也可以nginx代理，因为跨域是浏览器的安全规则）  \n" +
//     "闭包和回调，内存泄露  \n" +
//     "cdn了解吗  \n" +
//     "http状态码  \n" +
//     "http和https（信安专业直接开始吟唱，恨不得把rsa都讲一遍）  \n" +
//     "深拷贝浅拷贝  \n" +
//     "localstorge和session storge  \n" +
//     "网络攻击方式，cookie  \n" +
//     "  \n";


'use client';

import React, {useState, useEffect} from "react";
import {Collapse, Table, Button, Modal, Input, Form, message, Spin, Popconfirm, Card, Upload} from "antd";
import {aiGenerateTjJsonUsingPost, aiGenerateTmJsonUsingPost} from "@/api/aiController";
import {repairJson} from "../../../../../config/jsonRepair";
import {QuestionCircleOutlined, UploadOutlined} from "@ant-design/icons";
import dayjs from "dayjs";

import {fetchWithRetry,splitJsonArray} from "@/app/admin/oneStation/components/newTJAnswerCard";

const {Panel} = Collapse;

// 方法1：根据 Markdown 文档和 JSON 数组进行双向转换

// 清理和标准化 Markdown 文本
function cleanMarkdown(markdown) {
    return markdown
        .split(/\n/) // 按行拆分
        .map(line => line.trim()) // 去掉每行首尾空白
        .filter(Boolean) // 移除空行
        .join('\n') // 重新合并为文本
        .replace(/-{4,}/g, '---')// 将多于三个-的分割线标准化为---
        .replace(/^---\n|\n---$/g, ''); // 去掉开头或结尾的分割线
}

// 导入 Markdown 文档并解析成 JSON 数组
function importMarkdown(markdown) {
    markdown = cleanMarkdown(markdown);
    const knowledgePointBlocks = markdown.split(/\n---\n/); // 拆分 Markdown 文档为知识点块

    return knowledgePointBlocks.map(block => {
        if (block.trim() == "") {
            return;
        }
        const lines = block.split(/\n/).filter(Boolean); // 按行拆分，并移除空行
        const titleLine = lines.shift(); // 取出第一行作为知识点标题

        if (!titleLine.startsWith('# ')) {
            throw new Error(`Invalid format: Missing knowledge point title in block: \n${block}`);
        }

        const knowledgePoint = titleLine.replace(/^#\s*/, ''); // 去掉标题前的 # 符号
        const questionList = lines.map(line => {
            if (!line.startsWith('* ')) {
                throw new Error(`Invalid format: Questions must start with '* ': \n${line}`);
            }
            return line.replace(/^\*\s*/, ''); // 去掉问题前的 * 符号
        });

        return {knowledgePoint, questionList}; // 返回 JSON 格式对象
    });
}

// 解析 JSON 数组并导出为 Markdown 文档
function generateMarkdownFromData(data) {
    if (!Array.isArray(data)) {
        throw new Error("当前页的data不是一个标准的JSON数组");
    }

    return data.map(item => {
        const questions = item.questionList.map(q => `* ${q}`).join('\n'); // 生成问题的 Markdown 列表
        return `# ${item.knowledgePoint}\n${questions}`; // 每个知识点的 Markdown
    }).join('\n---\n'); // 用分割线连接各个知识点
}


const Page2 = ({expData, onQuestionsUpdate, onListUpdate}) => {
    const [data, setData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalType, setModalType] = useState(""); // "editKnowledge" 或 "addKnowledge"
    const [currentGroupIndex, setCurrentGroupIndex] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(null);
    const [modalValue, setModalValue] = useState("");
    const [loading, setLoading] = useState(false);
    /*todo 怎么把这个传到平行的另一个组件里面？*/
    const [toNextPage, setToNextPage] = useState();
    //加入md文档的双向转换功能
    const [markdownContent, setMarkdownContent] = useState(''); // 存储 Markdown 文本内容     虽然我觉得 没啥必要用这个。。


    // 保存为md文件
    const saveToFile = () => {
        if (!data) {
            message.warning("没有可保存的内容");
            return;
        }
        const timestamp = new Date();
        const filename = `${dayjs(timestamp).format("YYYY-MM-DD HH:mm")}-知识点列表.md`;
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
                onQuestionsUpdate(parsedData);
                message.success("Markdown 文件已成功导入并解析");
            } catch (error) {
                message.error(`导入失败: ${error.message}`);
            }
        };
        reader.readAsText(file);
        return false; // 阻止默认上传行为
    };

    useEffect(() => {
        const storedData = localStorage.getItem("knowledgeData");
        if (storedData) {
            setData(JSON.parse(storedData));
        }
    }, []);

    useEffect(() => {
        // console.log(data);
        localStorage.setItem("knowledgeData", JSON.stringify(data));
    }, [data]);

    useEffect(() => {
        if (expData) {
            message.info("从 Page1 接收到数据，准备处理");
            // 可以根据 expData 做进一步的初始化操作
            //todo 为什么这里会触发两次。？
        }
    }, [expData]);

    const refreshData = async () => {
        setLoading(true);

        // message.loading({content: "加载数据中...", key: "loading"});
        try {
            // 模拟从 expData 初始化数据的逻辑
            // if (!expData) throw new Error("没有从 Page1 获取到面经数据");
            //
            // const newData = [
            //     {
            //         knowledgePoint: "数据结构与算法",
            //         questionList: [
            //             "如何求两个有序数组的中位数？",
            //             "如何实现一个线程安全的list？"
            //         ]
            //     }
            // ];

            const response = await aiGenerateTmJsonUsingPost({md: expData});

            const outerData = JSON.parse(response?.data); // 解析外层的 JSON 字符串

            const innerData = outerData?.data;


            const content = innerData.choices[0]?.message?.content || "";


            try {


                // 正则表达式匹配第一个 `[` 和最后一个 `]` 之间的内容
                // const regex = /\[.*\]/s; // 匹配从第一个 [ 到最后一个 ] 的内容，`s` 表示匹配换行符
                const regex = /\[.*]/s;  // 没有冗余的转义

                const match = content.match(regex);

                if (match) {
                    // 提取出的JSON数组字符串
                    let jsonArrayString = match[0];

                    //做一个处理
                    jsonArrayString = repairJson(jsonArrayString);


                    const parsedData = JSON.parse(jsonArrayString); // 将 JSON 字符串解析为对象
                    setData(parsedData); // 设置到状态

                    onQuestionsUpdate(parsedData);
                    localStorage.setItem("knowledgeData", JSON.stringify(parsedData)); // 保存到 localStorage
                    message.success({content: '数据已加载', key: 'loading'});
                } else {
                    console.log("没有找到JSON数组内容");
                }


            } catch (error) {
                console.error("数据解析错误：", error);
                message.error({content: '解析数据失败', key: 'loading'});
            }


        } catch (error) {
            message.error({content: `加载失败: ${error.message}`, key: "loading"});
        }

        setLoading(false);

    };

    const openModal = (type, groupIndex = null, questionIndex = null, initialValue = "") => {
        setModalType(type);
        setCurrentGroupIndex(groupIndex);
        setCurrentQuestionIndex(questionIndex);
        setModalValue(initialValue);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setModalValue("");
        setCurrentGroupIndex(null);
        setCurrentQuestionIndex(null);
    };

    const saveModal = () => {
        const newData = [...data];
        if (modalType === "editKnowledge") {
            newData[currentGroupIndex].knowledgePoint = modalValue;
        } else if (modalType === "addKnowledge") {
            newData.push({knowledgePoint: modalValue, questionList: []});
        } else if (modalType === "editQuestion") {
            newData[currentGroupIndex].questionList[currentQuestionIndex] = modalValue;
        } else if (modalType === "addQuestion") {
            newData[currentGroupIndex].questionList.push(modalValue);
        }
        setData(newData);
        //保存的时候 在每个框保存的时候
        onQuestionsUpdate(newData);
        closeModal();
    };

    /*单个发送这一页*/

    const handleThisList = async (thisList) => {

        //卧槽 有问题，这玩意是json对象而不是json数组了。。

        setLoading(true);
        try {

            //必须把这玩意放进数组 不然肯定会报错
            const array=[];
            array.push(thisList);

            //对questionData进行分片（按这个分片的思路）
            const splitData = splitJsonArray(array);


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

            // 设置结果到状态 传给page3
            onListUpdate(finalResult);
        } catch (error) {
            console.error('刷新数据失败', error);
            alert('刷新数据失败，请检查输入');
        } finally {
            setLoading(false);
        }



    }

    return (
        <div style={{width: "100%", margin: "0 auto", display: "flex", flexDirection: "column", gap: "20px"}}>
            <Card title="设置" style={{width: "100%"}}>
                <div style={{marginBottom: 16, display: 'flex', gap: '10px'}}>
                    <Button type="primary" onClick={() => openModal("addKnowledge")} style={{marginRight: 8}}>
                        新增知识点
                    </Button>
                    <Button type="default" onClick={refreshData}>
                        生成题目列表（根据刚才的面经）
                    </Button>
                    <Upload beforeUpload={handleFileUpload} accept=".md">
                        <Button icon={<UploadOutlined/>}>导入 Markdown 文件</Button>
                    </Upload>
                    <Button type="default" onClick={saveToFile} disabled={data.length === 0}
                            style={{marginLeft: '10px'}}>
                        保存本页题目列表为文件
                    </Button>
                </div>
                <div style={{marginBottom: 16}}>
                    {loading && <Spin tip="正在加载..." style={{marginTop: "10px"}}/>}
                </div>
                <div style={{marginBottom: 16}}>
                    <p style={{margin: 0, textIndent: "0.5em", fontStyle: "italic", fontFamily: "light"}}>
                        建议每次分析不要超过5个题目，分题单发送效果最佳 : )
                        （⬆️已完成分片并行的改造 突破了大模型的Token限制，随便发多少题目都可以！！）
                        导入导出的标准md格式要求：不同题单之间用---分割线，知识点用一级标题#，题单列表用*
                    </p>
                </div>

            </Card>
            <Card title="题目列表" style={{width: "100%"}}>

                <Collapse>
                    {data.map((group, groupIndex) => (
                        <Panel
                            header={
                                <div onClick={(e) => {
                                    // 点击 header 中的空白区域时，允许触发展开
                                    e.stopPropagation();
                                }}
                                     style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                                    <span>{group.knowledgePoint}</span>
                                    <div style={{display: 'flex', gap: '10px'}}>
                                        <Button
                                            onClick={() => handleThisList(group)}
                                        >
                                            分析(仅当前题单 在下页呈现)
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                // e.stopPropagation(); // 阻止展开操作
                                                openModal("editKnowledge", groupIndex, null, group.knowledgePoint);
                                            }}
                                            // onClick={() => openModal("editKnowledge", groupIndex, null, group.knowledgePoint)}
                                        >
                                            编辑
                                        </Button>

                                        <Popconfirm
                                            title="删除"
                                            description="确定要删除吗"
                                            icon={<QuestionCircleOutlined style={{color: 'red'}}/>}
                                            onConfirm={() => {
                                                setData(data.filter((_, idx) => idx !== groupIndex))
                                                onQuestionsUpdate(data);
                                            }}
                                            onCancel={() => {
                                                // 这里可以处理取消逻辑（如果有需要）
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
                            key={groupIndex}
                        >
                            <Table
                                dataSource={group.questionList.map((q, i) => ({key: i, question: q}))}
                                columns={[
                                    {title: "问题", dataIndex: "question"},
                                    {
                                        title: "操作",
                                        render: (_, __, questionIndex) => (
                                            <>
                                                <div style={{display: 'flex', gap: '10px'}}>
                                                    <Button
                                                        onClick={() => openModal("editQuestion", groupIndex, questionIndex, group.questionList[questionIndex])}
                                                    >
                                                        编辑
                                                    </Button>

                                                    <Popconfirm
                                                        title="删除"
                                                        description="确定要删除吗"
                                                        icon={<QuestionCircleOutlined style={{color: 'red'}}/>}
                                                        onConfirm={() => {
                                                            const newData = [...data];
                                                            newData[groupIndex].questionList.splice(questionIndex, 1);
                                                            setData(newData);
                                                            onQuestionsUpdate(newData);
                                                        }}
                                                        onCancel={() => {
                                                            // 这里可以处理取消逻辑（如果有需要）
                                                            message.info('取消删除');
                                                        }}
                                                    >
                                                        <Button danger>
                                                            删除
                                                        </Button>
                                                    </Popconfirm>
                                                </div>

                                            </>
                                        )
                                    }
                                ]}
                                pagination={false}
                            />
                            <Button
                                type="dashed"
                                onClick={() => openModal("addQuestion", groupIndex)}
                                style={{marginTop: 8}}
                            >
                                新增问题
                            </Button>
                        </Panel>
                    ))}
                </Collapse>
            </Card>


            <Modal
                title={modalType.includes("Knowledge") ? "编辑知识点" : "编辑问题"}
                visible={modalVisible}
                onOk={saveModal}
                onCancel={closeModal}
            >
                <Form>
                    <Form.Item label="内容">
                        <Input
                            value={modalValue}
                            onChange={(e) => setModalValue(e.target.value)}
                            placeholder="请输入内容"
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Page2;

//todo V1。0

//
// const Page2 = () => {
//     const [data, setData] = useState([]);
//     const [modalVisible, setModalVisible] = useState(false);
//     const [modalType, setModalType] = useState(""); // "editKnowledge", "addKnowledge", "editQuestion", "addQuestion"
//     const [currentGroupIndex, setCurrentGroupIndex] = useState(null);
//     const [currentQuestionIndex, setCurrentQuestionIndex] = useState(null);
//     const [modalValue, setModalValue] = useState("");
//
//
//     // 页面加载时从 localStorage 初始化数据
//     useEffect(() => {
//         const storedData = localStorage.getItem("knowledgeData");
//         if (storedData) {
//             setData(JSON.parse(storedData));
//         }
//     }, []);
//
//     // 数据更新时保存到 localStorage
//     useEffect(() => {
//         localStorage.setItem("knowledgeData", JSON.stringify(data));
//     }, [data]);
//
//     // 刷新数据函数
//     const refreshData = async () => {
//         message.loading({content: '加载数据中...', key: 'loading'});
//         const response = await aiGenerateTmJsonUsingPost({md: testData});
//         // console.log(response);
//         /*这是控制台打印的response.data 写代码 截取content里面的json字符串转化为JSON对象 存入页面的初始数据里面*/
//         // 解析外层的 response.data
//         const outerData = JSON.parse(response?.data); // 解析外层的 JSON 字符串
//
// // 获取内层的 data
//         const innerData = outerData?.data;
//
//         // console.log("response.data.data:", innerData);
//
//
//
//         const content = innerData.choices[0]?.message?.content || "";
//
//         console.log(content);
//
//         try {
//
//
//
//
//             // 正则表达式匹配第一个 `[` 和最后一个 `]` 之间的内容
//             // const regex = /\[.*\]/s; // 匹配从第一个 [ 到最后一个 ] 的内容，`s` 表示匹配换行符
//             // const regex = /\[.*]/s;  // 没有冗余的转义
//             const regex = /\[.*\]/s;
//
//
//             const match = content.match(regex);
//
//             if (match) {
//                 // 提取出的JSON数组字符串
//                 const jsonArrayString = match[0];
//                 console.log(jsonArrayString);
//
//                 const parsedData = JSON.parse(jsonArrayString); // 将 JSON 字符串解析为对象
//                 setData(parsedData); // 设置到状态
//                 localStorage.setItem("knowledgeData", JSON.stringify(parsedData)); // 保存到 localStorage
//                 message.success({content: '数据已加载', key: 'loading'});
//             } else {
//                 console.log("没有找到JSON数组内容");
//
//             }
//
//
//
//
//         } catch (error) {
//             console.error("数据解析错误：", error);
//             message.error({content: '解析数据失败', key: 'loading'});
//         }
//
//
//
//
//     }
//
//
//     // 其他功能与之前代码相同
//     const openModal = (type, groupIndex = null, questionIndex = null, initialValue = "") => {
//         setModalType(type);
//         setCurrentGroupIndex(groupIndex);
//         setCurrentQuestionIndex(questionIndex);
//         setModalValue(initialValue);
//         setModalVisible(true);
//     };
//
//     const closeModal = () => {
//         setModalVisible(false);
//         setModalValue("");
//         setCurrentGroupIndex(null);
//         setCurrentQuestionIndex(null);
//     };
//
//     const saveModal = () => {
//         const newData = [...data];
//         if (modalType === "editKnowledge") {
//             newData[currentGroupIndex].knowledgePoint = modalValue;
//         } else if (modalType === "addKnowledge") {
//             newData.push({ knowledgePoint: modalValue, questionList: [] });
//         } else if (modalType === "editQuestion") {
//             newData[currentGroupIndex].questionList[currentQuestionIndex] = modalValue;
//         } else if (modalType === "addQuestion") {
//             newData[currentGroupIndex].questionList.push(modalValue);
//         }
//         setData(newData);
//         closeModal();
//     };
//
//     const deleteKnowledgePoint = (groupIndex) => {
//         const newData = [...data];
//         newData.splice(groupIndex, 1);
//         setData(newData);
//     };
//
//     const deleteQuestion = (groupIndex, questionIndex) => {
//         const newData = [...data];
//         newData[groupIndex].questionList.splice(questionIndex, 1);
//         setData(newData);
//     };
//
//     return (
//         <div>
//             <div style={{ marginBottom: 16 }}>
//                 <Button type="primary" onClick={() => openModal("addKnowledge")} style={{ marginRight: 8 }}>
//                     新增知识点
//                 </Button>
//                 <Button type="default" onClick={refreshData}>
//                     刷新数据
//                 </Button>
//             </div>
//
//             <Collapse>
//                 {data.map((group, groupIndex) => (
//                     <Panel
//                         header={
//                             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                                 <span>{group.knowledgePoint}</span>
//                                 <div>
//                                     <Button
//                                         type="link"
//                                         onClick={() => openModal("editKnowledge", groupIndex, null, group.knowledgePoint)}
//                                     >
//                                         编辑
//                                     </Button>
//                                     <Button type="link" danger onClick={() => deleteKnowledgePoint(groupIndex)}>
//                                         删除
//                                     </Button>
//                                 </div>
//                             </div>
//                         }
//                         key={groupIndex}
//                     >
//                         <Table
//                             dataSource={group.questionList.map((q, i) => ({ key: i, question: q }))}
//                             columns={[
//                                 {
//                                     title: "问题",
//                                     dataIndex: "question",
//                                 },
//                                 {
//                                     title: "操作",
//                                     render: (_, __, questionIndex) => (
//                                         <>
//                                             <Button
//                                                 type="link"
//                                                 onClick={() =>
//                                                     openModal("editQuestion", groupIndex, questionIndex, group.questionList[questionIndex])
//                                                 }
//                                             >
//                                                 编辑
//                                             </Button>
//                                             <Button
//                                                 type="link"
//                                                 danger
//                                                 onClick={() => deleteQuestion(groupIndex, questionIndex)}
//                                             >
//                                                 删除
//                                             </Button>
//                                         </>
//                                     ),
//                                 },
//                             ]}
//                             pagination={false}
//                         />
//                         <Button
//                             type="dashed"
//                             onClick={() => openModal("addQuestion", groupIndex)}
//                             style={{ marginTop: 8 }}
//                         >
//                             新增问题
//                         </Button>
//                     </Panel>
//                 ))}
//             </Collapse>
//
//             <Modal
//                 title={
//                     modalType === "editKnowledge"
//                         ? "编辑知识点"
//                         : modalType === "addKnowledge"
//                             ? "新增知识点"
//                             : modalType === "editQuestion"
//                                 ? "编辑问题"
//                                 : "新增问题"
//                 }
//                 visible={modalVisible}
//                 onOk={saveModal}
//                 onCancel={closeModal}
//             >
//                 <Form>
//                     <Form.Item label="内容">
//                         <Input
//                             value={modalValue}
//                             onChange={(e) => setModalValue(e.target.value)}
//                             placeholder="请输入内容"
//                         />
//                     </Form.Item>
//                 </Form>
//             </Modal>
//         </div>
//     );
// };
//
// export default Page2;