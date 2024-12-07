"use client";

//todo 面试结果页面存档 1207
import React, { useEffect, useState } from "react";
/*作用：引入 React 库以及 Hooks，用于组件开发和状态管理。
useEffect：用于组件加载或更新时触发副作用（如 API 调用）。
useState：管理组件内部的状态。*/
import { Card, Button, Table, message, Modal, Space } from "antd";

import Image from "next/image";
/*
* 作用：引入 Ant Design 的常用组件。
Card：卡片式布局。
Button：按钮。
Table：表格，用于显示题目列表。
message：全局提示信息。
Modal：弹窗确认对话框。
Space：按钮间距管理。*/

import {
  getInterviewRecordVoByIdUsingGet,
  deleteInterviewRecordUsingPost,
} from "@/api/interviewRecordController";
import { listInterviewRecordDetailVoByPageUsingPost } from "@/api/interviewRecordDetailController";

/*作用：引入 API 调用方法：
getInterviewRecordVoByIdUsingGet：根据 ID 获取面试记录。
deleteInterviewRecordUsingPost：删除面试记录。
listInterviewRecordDetailVoByPageUsingPost：分页获取面试记录详情列表。
还需要update面试记录详情的方法
还需要根据id获取题目的方法*/

// 样式配置
import "./index.css";

import MdViewer from "@/components/MdViewer";
import { usePathname } from "next/navigation";
import { getQuestionVoByIdUsingGet } from "@/api/questionController";
import Link from "next/link";
import { Pie, WordCloud } from "@ant-design/plots";
//哦哦说白了这个属于nextjs的东西

const TestResultPage = () => {
  //用nextjs框架自带的功能拿到url
  /*但是怎样才能进入框架自带的路由系统呢。。？*/
  const pathname = usePathname();

  // 解析路径，提取参数
  /*字符串处理*/
  const parts = pathname.split("/").filter((part) => part); // 去掉空字符串

  //拿到路径test/1 这里面的1 这是面试记录的id
  const id = parseInt(parts[1], 10); // 路径的第二段是参数
  /*parseInt 的作用：
它会将一个字符串解析成整数，结果是一个 number 类型。*/

  // 状态管理
  /*面试记录 单个*/
  const [record, setRecord] = useState<any>(null);
  /*面试记录详情 集合*/
  const [details, setDetails] = useState<any>([]);
  /*题目详情 集合*/
  const [questions, setQuestions] = useState<any>([]);
  /*加载？*/
  const [loading, setLoading] = useState(true);

  //词云的数据源
  const [cloud, setCloud] = useState([]);
  //来一个数组作为词云的来源 包含字符串数组
  const cloudWords = [];

  //饼图数据源 数组里面包含对象
  const [pieData, setPieData] = useState([]);

  //全局用来存的数组
  const pies = [];

  //这里连着问题一并获取了！
  //返回的promise被忽略。？

  // 页面加载时请求数据
  // useEffect(() => {
  //     if (id) {
  //         fetchRecord();
  //         fetchDetails();
  //         fetchQuestions();
  //     }
  // }, [id]);

  //确保异步！

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 首先获取面试记录
        await fetchRecord();
        // 获取面试详情
        await fetchDetails();
        // 获取问题列表
        await fetchQuestions();

        // 所有数据获取完成，更新加载状态
        setLoading(false); // 当数据获取完成，设置 loading 为 false，渲染页面
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false); // 即使发生错误，也将 loading 设置为 false，以避免永远不渲染
      }
    };

    fetchData(); // 调用异步数据获取函数
  }, []); // 空依赖数组，确保只在组件挂载时调用一次

  /*在组件加载或 id 参数变化时调用 并且要求的是id变化而且存在 */

  const fetchRecord = async () => {
    try {
      // setLoading(true);
      const { data } = await getInterviewRecordVoByIdUsingGet({ id: id });
      setRecord(data);
    } catch (error) {
      console.error(error);
      message.error("getInterviewRecordVoByIdUsingGet 加载面试记录时出现错误");
    } finally {
      // setLoading(false);
    }
  };

  //饼图会用到的 格式化时间的函数
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return minutes > 0
      ? `${minutes}m ${remainingSeconds}s`
      : `${remainingSeconds}s`;
  };

  //加载多条面试详情
  const fetchDetails = async () => {
    // setLoading(true);

    try {
      // listInterviewRecordDetailByPage
      //             const {data} = await listInterviewRecordDetailVoByPageUsingPost({
      //                 current: 1,
      //                 interviewRecordId: 1,
      //                 pageSize: 15,
      //                 sortField: 'createTime',
      //                 sortOrder: "ascend"
      //             });
      //
      //             console.log('data'+data);
      //             //
      //             /*{
      //   "current": 1,
      //   "interviewRecordId": 1,
      //   "pageSize": 10,
      //   "sortField": "createTime",
      //   "sortOrder": "ascend"
      // }*/
      //             setDetails(data.records || []);
      const response = await listInterviewRecordDetailVoByPageUsingPost({
        current: 1,
        interviewRecordId: id,
        pageSize: 10,
        sortField: "id",
        sortOrder: "ascend",
      });
      //保证对应 换成了id进行排序
      //奇怪 我用解构为什么拿不到数据。。？
      //能的 这里是异步问题
      setDetails(response.data.records);
      // 使用 forEach 遍历 records

      //用for循环遍历response.data.records 里面的每一个元素的timeTaken字段内容（number） 记录到一个新对象里 记为value属性 然后把这个新对象推进数组pies
      // response.data.records.forEach((record) => {
      //     const newObject = {
      //         value: record.timeTaken, // 将 timeTaken 记录为 value 属性
      //         time: formatTime(record.timeTaken),
      //     };
      //
      //     pies.push(newObject); // 将新对象推进 pies 数组
      // });

      // console.log('dangqian')
      // console.log(response.data.records)
      // response.data.records.forEach((record, index) => {
      for (const [index, record] of response.data.records.entries()) {
        /*forEach 循环会遍历 response.data.records 数组。forEach 的回调函数可以接受两个参数：
record：当前遍历的元素。
index：当前元素在数组中的索引。*/

        // 判断对应 index 的位置是否已经存在对象

        console.log("当前pies数组");

        console.log(pies);
        console.log("当前遍历到的下标");

        console.log(index);
        console.log("拿到时间");
        console.log("当前下标的pies里面的元素");

        //OK 总之不是undefined了
        console.log(pies[index]);
        if (pies[index]) {
          // 如果存在对象，直接添加属性
          pies[index].value = record.timeTaken;
          pies[index].time = formatTime(record.timeTaken);
        } else {
          // 如果不存在对象，创建新对象并添加到 pies 数组
          pies[index] = {
            value: record.timeTaken, // 将 timeTaken 记录为 value 属性
            time: formatTime(record.timeTaken), // 格式化后的时间
            type: null,
          };
        }
      }

      setPieData(pies);
    } catch (error) {
      console.error(error);
      message.error("加载多条面试详情时出现错误");
    }

    //接下来是根据拿到的details查询id 拿到questionId的集合 再查询拿到。。
    //但是这样是不是发的请求稍微有点多。。？
    //todo 后端考虑写一个传id数组进去就能查询的方法。。。减少了请求数量 但是。。还是要执行那么多条查询语句啊 意义何在呢。？

    // details是一个包含多个对象的数组 请遍历提取这个数组里面的每个对象里的questionId字段到另一个数组里面（保持顺序）

    // setLoading(false);
  };

  //加载多条题目数据
  const fetchQuestions = async () => {
    const questionIds = details.map((item) => parseInt(item.questionId));
    //测试拿到的题目id列表
    //注意这里是保持了顺序的！
    //todo bug
    // console.log(questionIds);

    /*遍历questionIds数组 根据里面的id调用getQuestionVOById方法 把拿到的对象封装到一个questions的数组里面*/
    const qs = [];
    //要不要规定类型呢。？

    //改造
    //论for循环的好处
    // for (const qid of questionIds) {
    //     try {
    //         const res = await getQuestionVoByIdUsingGet({id: qid}); // 调用 API
    //         if (res.data) {
    //             qs.push(res.data); // 成功时将结果添加到数组
    //
    //             res.data.title
    //
    //             const tags=res.data.tagList;
    //             tags.forEach((tag) => {
    //                 cloudWords.push(tag); // 将每一项推入 目标数组
    //             });
    //
    //         } else {
    //             console.warn(`无法获取ID为 ${qid} 的题目：`);
    //         }
    //     } catch (error) {
    //         console.error(`获取ID为 ${id} 的题目时出错`, error);
    //     }
    // }

    for (const [index, qid] of questionIds.entries()) {
      /*for...of 和 entries() 配合使用：
for (const [index, qid] of questionIds.entries()) 使用 entries() 方法来获取每个 qid 及其对应的下标 index。
这样你可以通过下标将 title 正确放入 pies 数组中。*/
      try {
        const res = await getQuestionVoByIdUsingGet({ id: qid }); // 调用 API 获取题目信息
        if (res.data) {
          qs.push(res.data); // 将题目数据推入到 qs 数组

          // // 将 title 添加到 pies 数组的对应位置
          // const newObject = {
          //     title: res.data.title, // 将 title 作为新属性
          // };

          // 将标签推入 cloudWords 数组
          const tags = res.data.tagList;
          tags.forEach((tag) => {
            cloudWords.push(tag); // 每个标签推入 cloudWords
          });

          // 确保 pies 数组对应的下标存在，并推入数据

          console.log("问题详情拿标题的当前下标");
          console.log(index);

          //问题在于这个pies！！！！
          console.log(pieData);

          //这个访问一直undef
          console.log("问题详情拿标题的当前下标");

          //我感觉又异步了。。？
          console.log(pieData[index]);

          if (pieData[index]) {
            pieData[index].type = res.data.title; // 给现有对象添加 title 属性
          } else {
            pieData[index] = { value: null, time: null, type: res.data.title }; // 如果没有该下标，创建新对象
          }
        } else {
          console.warn(`无法获取ID为 ${qid} 的题目`);
        }
      } catch (error) {
        console.error(`获取ID为 ${qid} 的题目时出错`, error);
      }

      setPieData(pieData);

      console.log("写好的数据");
      console.log(pieData);
    }

    //饼图设置

    // console.log(cloudWords);
    // 将字符串数组转换为词云图数据格式，随机生成权重
    const formattedData = cloudWords.map((text) => ({
      text, // 词语内容
      value: Math.floor(Math.random() * (100 - 75 + 1)) + 75, // 权重在 10 到 100 之间随机
    }));

    /*value: Math.floor(Math.random() * (最大值 - 最小值 + 1)) + 最小值;
     */
    // console.log(formattedData);

    setCloud(formattedData); // 设置数据源

    //这样一来 题目也被设定好了
    setQuestions(qs);
  };

  // WordCloud 配置
  const config = {
    data: cloud, // 动态生成的数据
    wordField: "text", // 对应数据中的词语字段
    weightField: "value", // 对应数据中的权重字段
    colorField: "text", // 根据词语内容着色
    wordStyle: {
      fontSize: [40, 60], // 字体大小范围
      rotation: [0, Math.PI / 3], // 随机旋转角度范围
      // rotation: [0, 0], // 随机旋转角度范围
    },
    layout: {
      spiral: "rectangular", // 布局类型
    },
  };

  // //todo 测试
  //卧槽 不是传不过来 只是需要时间！！！！
  // 使用 useEffect 监听 details 的变化

  //这下就成功了 那就可以暂时不管了。。。
  useEffect(() => {
    console.log("Details updated:", details);

    fetchQuestions();
  }, [details]); // 当 details 发生变化时打印

  //执行继续面试的逻辑
  const handleContinue = () => {
    //因为只要没点提交 timeTaken就不会更新 这是我之前做的设计
    const nextDetail = details.find((detail) => detail.timeTaken === null);
    if (nextDetail) {
      // navigate(`/test/${id}/${nextDetail.id}`);
      //用这种方法
      window.location.href = `/test/${id}/${nextDetail.id}`;
    } else {
      message.warning("没有未完成的面试详情");
    }
  };

  //点击放弃面试
  const handleAbandon = async () => {
    Modal.confirm({
      title: "确认放弃这次面试？你的作答记录也会一并被清楚哦！",
      onOk: async () => {
        try {
          const res = await deleteInterviewRecordUsingPost({ id: id });
          if (res) {
            message.success("面试记录已删除");
            window.location.href = `/test`;
          } else {
            // 我终于知道后端的信息怎么传过来的了。。
            message.error("删除面试记录失败");
          }
        } catch (error) {
          console.error(error);
          message.error("删除面试记录时出现错误");
        }
      },
    });
  };

  //卡片1的渲染逻辑 （从后面的逻辑里面弄出来的！）
  const renderCard1 = () => {
    if (!record) return null;
    const pieConfig = {
      data: pieData,
      angleField: "value",
      /*angleField: 指定用于计算饼图角度的字段，值为数据中的 value。
每个分类的 value 决定其在饼图中的比例。*/
      colorField: "type",
      /*    colorField: 'type',
      colorField: 指定用于区分颜色的字段，值为数据中的 type。
不同的 type 会使用不同的颜色填充饼图分块。

*/
      // interactions: [
      //     { type: 'element-active' }, // 鼠标悬停交互
      // ],
      label: {
        text: "time",
        // position: 'outside',
        //避免标签之间重合用了spider。。 好像自定义了之后用spider会出事。。
        position: "spider",
        // render: customLabel,
      },
      /*label: 设置饼图标签的显示样式。
text: 'value'：标签内容为数据的 value 字段值。
position: 'outside'：标签显示在饼图外部。*/
      legend: {
        color: {
          title: false,
          position: "right",
          rowPadding: 5,
        },
      },
    };

    const durationMinutes = Math.floor((record.duration || 0) / 60);
    const durationSeconds = (record.duration || 0) % 60;
    const suggestedMinutes = (record.totalQuestions || 0) * 5;

    return (
      <Card title="面试相关信息" style={{ marginBottom: 20 }}>
        {/* 设置条件渲染 在未完成面试的时候不会显示这个 */}
        {record?.status !== 0 && (
          <>
            <p>
              您实际的完成时间：{durationMinutes} 分钟 {durationSeconds} 秒
            </p>
            <p>本次面试建议完成时间：{suggestedMinutes} 分钟</p>

            {/* 使用一个容器包裹图表，控制容器的宽度占卡片宽度的80% */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "80%",
                margin: "0 auto",
              }}
            >
              {/* WordCloud图表 */}
              <div style={{ marginBottom: 20 }}>
                <WordCloud {...config} />
              </div>

              {/* Pie图表 */}
              <div style={{ width: "100%", height: 400 }}>
                {" "}
                {/* 确保容器宽高足够 */}
                <Pie {...pieConfig} />
              </div>
            </div>
          </>
        )}

        <p>面试记录 ID：{record.id}</p>
        <p>面试人 ID：{record.userId}</p>
      </Card>
    );
  };

  const renderCard2 = () => (
    <Card style={{ marginBottom: 20, textAlign: "center", height: 800 }}>
      {/*卧槽 三元表达式*/}
      {record?.status === 0 ? (
        // <img src="/testtodo.png" alt="待完成图片" style={{maxHeight: '100%'}}/> 换成nextjs里面自带的东西
        <Image
          src="/testtodo.png"
          alt="待完成图片"
          style={{ maxHeight: "100%" }}
          width={800} // 需要指定宽度
          height={800} // 需要指定高度
        />
      ) : (
        <Table
          dataSource={questions.map((item, index) => ({
            ...item,
            key: item.id,
            index: index + 1,
          }))}
          columns={[
            { title: "面试题目序号", dataIndex: "index", key: "index" },
            {
              title: "题目名称",
              dataIndex: "title",
              key: "qname",
              render: (text: string, record: any) => (
                // 使用 next/link 组件进行路由跳转 使用 passHref 来确保 href 被正确传递给 <a> 标签
                // <Link href={`/question/${record.id}`} passHref>
                //     <a target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'SimHei, Arial, sans-serif', fontWeight: 'bold' ,color: 'black'}}>{text}</a>
                // </Link>
                <Link
                  href={`/question/${record.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: "SimHei, Arial, sans-serif",
                    fontWeight: "bold",
                    color: "black",
                  }}
                >
                  {text}
                </Link>
              ),
            },
            {
              title: "快速操作",
              render: (_, record) => (
                <Space>
                  <Button onClick={() => message.info("收藏功能未实现")}>
                    收藏
                  </Button>
                  <Button
                    onClick={() =>
                      message.info(
                        "标记功能未实现 未来这里会出两个选项 快速标记为已掌握或者未解决",
                      )
                    }
                  >
                    标记
                  </Button>
                </Space>
              ),
            },
          ]}
        />
        // <Table
        //     dataSource={questions.map((item, index) => ({...item, key: item.id, index: index + 1}))}
        //     columns={[
        //         {title: '面试题目序号', dataIndex: 'index', key: 'index'},
        //         {title: '题目名称', dataIndex: 'title', key: 'qname'},
        //         {
        //             title: '快速操作',
        //             render: (_, record) => (
        //                 <Space>
        //                     <Button onClick={() => message.info('收藏功能未实现')}>收藏</Button>
        //                     <Button onClick={() => message.info('标记功能未实现 未来这里会出两个选项 快速标记为已掌握或者未解决')}>标记</Button>
        //                 </Space>
        //             ),
        //         },
        //     ]}
        // />
        /*details.map：
遍历 details 数组，将每个对象转换为新的对象。
...item：保留原始对象的所有属性。
key：指定唯一的标识符（这里使用 item.id），供 React 内部使用。
index：额外添加字段，表示当前数据的序号（从 1 开始）。
说白了就是批量处理 加了两个字段。。。*/
        /*columns

定义表格的列，每列需要一个 title 和一个字段映射规则*/

        /*具体一点
            * title：列标题，显示为 "题目名称"。
dataIndex：对应数据源中字段名 title，用于取出并显示数据。
key：列的唯一标识符 这个随便写都可以 只要别写一样的。*/
      )}
    </Card>
  );

  const renderCard3 = () => {
    if (!record) return null;

    return (
      <Card>
        {record.status === 0 ? (
          <>
            <Button
              type="primary"
              onClick={handleContinue}
              style={{ marginRight: 10 }}
            >
              继续面试
            </Button>
            <Button danger onClick={handleAbandon}>
              放弃面试
            </Button>
          </>
        ) : record.status === 2 ? (
          <MdViewer value={record.aiReport || ""} />
        ) : (
          <Button
            type="primary"
            onClick={() => message.info("生成AI报告功能未实现")}
          >
            一键生成AI报告
          </Button>
        )}
      </Card>
    );
  };

  // 渲染：只有当 loading 为 false 时才渲染页面
  if (loading) {
    return <div>Loading...</div>; // 显示加载中的状态
  } else {
    return (
      <div style={{ width: "80%", margin: "0 auto" }}>
        {renderCard1()}
        {renderCard2()}
        {renderCard3()}
      </div>
    );
  }
};

export default TestResultPage;

//存档 todo 三个图表的设计
// 'use client'; // 声明当前代码运行在客户端环境下
//
// import { Radar, Pie, WordCloud } from '@ant-design/plots'; // 引入 Ant Design 的可视化组件
// import React, { useState, useEffect } from 'react'; // React 的基础功能库
//
// const DemoWordCloud = () => {
//     // 使用 useState 钩子存储词云图的数据
//     const [data, setData] = useState([]);
//
//     // 在组件加载时，通过 useEffect 模拟数据生成并设置到状态中
//     useEffect(() => {
//         // 模拟字符串数组，表示词语集合
//         const stringArray = [
//             'React', 'JavaScript', 'Ant Design', 'WordCloud', 'TypeScript',
//             'Node.js', 'CSS', 'HTML', 'Frontend', 'Backend', 'Backend', 'Backend',
//         ];
//
//         // 转换为词云图需要的格式，每个词语赋予一个随机权重
//         const formattedData = stringArray.map((text) => ({
//             text, // 词语内容
//             value: Math.floor(Math.random() * (100 - 75 + 1)) + 75, // 权重范围在 75-100 之间
//         }));
//
//         setData(formattedData); // 将转换后的数据设置到状态中
//     }, []);
//
//     // WordCloud（词云图）的配置
//     const configWordCloud = {
//         data, // 使用动态生成的数据
//         wordField: 'text', // 数据中的词语字段
//         weightField: 'value', // 数据中的权重字段
//         colorField: 'text', // 根据词语内容着色
//         wordStyle: {
//             fontSize: [40, 60], // 字体大小范围
//             rotation: [0, Math.PI / 3], // 随机旋转角度范围
//         },
//         layout: {
//             spiral: 'rectangular', // 矩形布局
//         },
//     };
//
//     // 时间格式化函数，将秒转换为分钟和秒的形式
//     const formatTime = (seconds) => {
//         const minutes = Math.floor(seconds / 60); // 转换为分钟
//         const remainingSeconds = seconds % 60; // 计算剩余的秒数
//         return minutes > 0 ? `${minutes}分钟${remainingSeconds}秒` : `${remainingSeconds}秒`;
//     };
//
//     // 自定义饼图标签内容
//     const customLabel = (_, datum) => {
//         return (
//             <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
//                 <div style={{ width: 8, height: 8, background: 'rgba(0,0,0,0.4)', borderRadius: '50%' }} />
//                 <div>
//                     {datum.type} : <b>{formatTime(datum.value)}</b> {/* 显示分类及时间 */}
//                 </div>
//             </div>
//         );
//     };
//
//     // 饼图的数据源
//     const pieData = [
//         { type: '分类一', value: 200 },
//         { type: '分类二', value: 250 },
//         { type: '分类三', value: 18 },
//         { type: '分类四', value: 15 },
//         { type: '分类五', value: 10 },
//         { type: '其他', value: 5 },
//     ];
//
//
//
//         const pieConfig = {
//         data: pieData,
//         angleField: 'value',
//         /*angleField: 指定用于计算饼图角度的字段，值为数据中的 value。
// 每个分类的 value 决定其在饼图中的比例。*/
//         colorField: 'type',
//         /*    colorField: 'type',
//         colorField: 指定用于区分颜色的字段，值为数据中的 type。
// 不同的 type 会使用不同的颜色填充饼图分块。
//
// */
//         // interactions: [
//         //     { type: 'element-active' }, // 鼠标悬停交互
//         // ],
//         label: {
//             text: 'time',
//             // position: 'outside',
//             //避免标签之间重合用了spider。。 好像自定义了之后用spider会出事。。
//             position: 'spider',
//
//
//
//         },
//         /*label: 设置饼图标签的显示样式。
// text: 'value'：标签内容为数据的 value 字段值。
// position: 'outside'：标签显示在饼图外部。*/
//         legend: {
//             color: {
//                 title: false,
//                 position: 'right',
//                 rowPadding: 5,
//             },
//         },
//     };
//
//     // 雷达图的数据源
//     const dataRadar = [
//         { question: '题目1', fitPercentage: 85 },
//         { question: '题目2', fitPercentage: 60 },
//         { question: '题目3', fitPercentage: 40 },
//         { question: '题目4', fitPercentage: 90 },
//         { question: '题目5', fitPercentage: 70 },
//     ];
//
//     // 雷达图的配置
//     const configRadar = {
//         data: dataRadar, // 数据源
//         xField: 'question', // 横轴对应题目
//         yField: 'fitPercentage', // 纵轴对应贴合百分比
//         meta: {
//             fitPercentage: {
//                 alias: '贴合百分比', // 显示别名
//                 min: 0, // 最小值
//                 max: 100, // 最大值
//                 formatter: (val) => `${val}%`, // 百分比格式化
//             },
//         },
//         area: {
//             style: {
//                 fillOpacity: 0.2, // 区域填充透明度
//             },
//         },
//         point: {
//             size: 4, // 数据点大小
//             shape: 'circle', // 数据点形状
//         },
//         scale: {
//             fitPercentage: {
//                 min: 0, // 数据范围从 0 开始
//                 max: 100, // 数据范围最大为 100
//             },
//         },
//         axis: {
//             x: {
//                 grid: true, // 显示网格线
//             },
//             y: {
//                 gridAreaFill: 'rgba(0, 0, 0, 0.04)', // 背景网格填充颜色
//             },
//         },
//     };
//
//     // 返回渲染的组件
//     return (
//         <div>
//             <WordCloud {...configWordCloud} /> {/* 渲染词云图 */}
//             <div>
//                 <Pie {...pieConfig} /> {/* 渲染饼图 */}
//             </div>
//             <Radar {...configRadar} /> {/* 渲染雷达图 */}
//         </div>
//     );
// };
//
// export default DemoWordCloud; // 导出组件
//
//
//
// //
// //
// // 'use client'
// //
// //
// // import { Radar } from '@ant-design/plots';
// //
// //
// // // 数据示例：题目和对应的贴合百分比
// //
// //
// //
// //
// // // todo 饼图和词云图的设计
// //
// // import React, { useState, useEffect } from 'react';
// // import {Pie, WordCloud} from '@ant-design/plots';
// //
// // const DemoWordCloud = () => {
// //     const [data, setData] = useState([]);
// //
// //     useEffect(() => {
// //         // 模拟字符串数组
// //         const stringArray = [
// //             'React',
// //             'JavaScript',
// //             'Ant Design',
// //             'WordCloud',
// //             'TypeScript',
// //             'Node.js',
// //             'CSS',
// //             'HTML',
// //             'Frontend',
// //             'Backend','Backend','Backend','Backend','Backend','Backend','Backend','Backend','Backend','Backend','Backend','Backend','Backend','Backend','Backend',
// //         ];
// //
// //         // 将字符串数组转换为词云图数据格式，随机生成权重
// //         const formattedData = stringArray.map((text) => ({
// //             text, // 词语内容
// //             value: Math.floor(Math.random() * (100 - 75 + 1)) + 75, // 权重在 10 到 100 之间随机
// //         }));
// //
// //         /*value: Math.floor(Math.random() * (最大值 - 最小值 + 1)) + 最小值;
// // */
// //
// //         setData(formattedData); // 设置数据源
// //     }, []);
// //
// //     // WordCloud 配置
// //     const config = {
// //         data, // 动态生成的数据
// //         wordField: 'text', // 对应数据中的词语字段
// //         weightField: 'value', // 对应数据中的权重字段
// //         colorField: 'text', // 根据词语内容着色
// //         wordStyle: {
// //             fontSize: [40, 60], // 字体大小范围
// //             rotation: [0, Math.PI / 3], // 随机旋转角度范围
// //         },
// //         layout: {
// //             spiral: 'rectangular', // 布局类型
// //         },
// //     };
// //
// //     //饼图自定义标签
// //     const customLabel = (_, datum) => {
// //         const formatTime = (seconds) => {
// //             const minutes = Math.floor(seconds / 60);
// //             const remainingSeconds = seconds % 60;
// //             return minutes > 0 ? `${minutes}分钟${remainingSeconds}秒` : `${remainingSeconds}秒`;
// //         };
// //
// //         return (
// //             <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
// //                <div style={{ width: 8, height: 8, background: 'rgba(0,0,0,0.4)', borderRadius: '50%' }} />
// //                 <div>
// //                     {datum.type} : <b>{formatTime(datum.value)}</b>
// //                 </div>
// //             </div>
// //         );
// //     };
// //
// //
// //     //饼图
// //
// //     //数据源处理 排序是对应的
// //     //题目集合 拿type
// //     //面试详情集合 拿value 同时value调用time函数进行转化
// //     const pieData = [
// //         { type: '分类一', value: 200 ,time:'3m30s'},
// //         { type: '分类二', value: 250 ,time:'3m30s'},
// //         { type: '分类三', value: 18 ,time:'3m30s'},
// //         { type: '分类四', value: 15 ,time:'3m30s'},
// //         { type: '分类五', value: 10,time:'3m30s' },
// //         { type: '其他', value: 5 ,time:'3m30s'},
// //     ];
// //
// //     const pieConfig = {
// //         data: pieData,
// //         angleField: 'value',
// //         /*angleField: 指定用于计算饼图角度的字段，值为数据中的 value。
// // 每个分类的 value 决定其在饼图中的比例。*/
// //         colorField: 'type',
// //         /*    colorField: 'type',
// //         colorField: 指定用于区分颜色的字段，值为数据中的 type。
// // 不同的 type 会使用不同的颜色填充饼图分块。
// //
// // */
// //         // interactions: [
// //         //     { type: 'element-active' }, // 鼠标悬停交互
// //         // ],
// //         label: {
// //             text: 'time',
// //             // position: 'outside',
// //             //避免标签之间重合用了spider。。 好像自定义了之后用spider会出事。。
// //             position: 'spider',
// //             // render: customLabel,
// //
// //
// //         },
// //         /*label: 设置饼图标签的显示样式。
// // text: 'value'：标签内容为数据的 value 字段值。
// // position: 'outside'：标签显示在饼图外部。*/
// //         legend: {
// //             color: {
// //                 title: false,
// //                 position: 'right',
// //                 rowPadding: 5,
// //             },
// //         },
// //     };
// //
// //
// //     // 时间格式化函数
// //     const formatTime = (seconds) => {
// //         const minutes = Math.floor(seconds / 60);
// //         const remainingSeconds = seconds % 60;
// //         return minutes > 0 ? `${minutes}m ${remainingSeconds}s` : `${remainingSeconds}s`;
// //     };
// //
// // // 配置饼图
// // //     const pieConfig = {
// // //         data: pieData,
// // //         angleField: 'value',
// // //         colorField: 'type',
// // //         radius: 1, // 圆形饼图
// // //         label: {
// // //             position: 'outer', // 标签显示在外部
// // //             text: ({ value }) => formatTime(value), // 自定义内容为格式化的时间
// // //         },
// // //         legend: {
// // //             position: 'right', // 图例显示在右侧
// // //         },
// // //     };
// //
// //     const dataRadar = [
// //         { question: '题目1', fitPercentage: 85 },
// //         { question: '题目2', fitPercentage: 60 },
// //         { question: '题目3', fitPercentage: 40 },
// //         { question: '题目4', fitPercentage: 90 },
// //         { question: '题目5', fitPercentage: 70 },
// //     ];
// //
// //     const configRadar = {
// //         data: dataRadar,
// //         xField: 'question', // 以题目为横轴（雷达图的轴）
// //         yField: 'fitPercentage', // 以贴合百分比为纵轴（数值）
// //         meta: {
// //             fitPercentage: {
// //                 alias: '贴合百分比',
// //                 min: 0, // 最小值设置为0
// //                 max: 100, // 最大值设置为100
// //                 formatter: (val) => `${val}%`, // 格式化为百分比
// //             },
// //         },
// //         area: {
// //             style: {
// //                 fillOpacity: 0.2, // 区域透明度
// //             },
// //         },
// //         point: {
// //             size: 4, // 数据点的大小
// //             shape: 'circle', // 数据点的形状
// //         },
// //         scale: {
// //             fitPercentage: {
// //                 min: 0, // 保证百分比从0开始
// //                 max: 100, // 保证百分比最大到100
// //             },
// //         },
// //         axis: {
// //             x: {
// //                 grid: true, // 显示雷达轴的网格线
// //                 line: null, // 去掉轴线
// //                 title: false, // 不显示标题
// //             },
// //             y: {
// //                 gridAreaFill: 'rgba(0, 0, 0, 0.04)', // 背景色
// //                 label: false, // 不显示刻度标签
// //                 title: false, // 不显示标题
// //             },
// //         },
// //     };
// //
// //
// //
// //     return (<div><WordCloud {...config} />
// //
// //             <div>
// //                 <Pie {...pieConfig} />
// //
// //             </div>
// //             return <Radar {...configRadar} />;
// //
// //
// //         </div>
// //
// //
// //     );
// // };
// //
// // export default DemoWordCloud;
