//todo 面试结果页面

"use client";

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
// import "./index.css";

import MdViewer from "@/components/MdViewer";
import { usePathname } from "next/navigation";
import { getQuestionVoByIdUsingGet } from "@/api/questionController";
import Link from "next/link";
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
        sortField: "createTime",
        sortOrder: "ascend",
      });

      //奇怪 我用解构为什么拿不到数据。。？
      //能的 这里是异步问题

      setDetails(response.data.records);
      //
      // const sleep = (ms: number) => {
      //     return new Promise(resolve => setTimeout(resolve, ms));
      // };
      //
      //
      //
      //     // 模拟延时 2 秒
      //     await sleep(3000);
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
    console.log(questionIds);

    /*遍历questionIds数组 根据里面的id调用getQuestionVOById方法 把拿到的对象封装到一个questions的数组里面*/
    const qs = [];
    //要不要规定类型呢。？

    for (const qid of questionIds) {
      try {
        //这里的类型一致似乎被我忽略了。。有问题吗？？
        const res = await getQuestionVoByIdUsingGet({ id: qid }); // 调用 API
        if (res.data) {
          qs.push(res.data); // 成功时将结果添加到数组
        } else {
          console.warn(`无法获取ID为 ${qid} 的题目：`);
        }
      } catch (error) {
        console.error(`获取ID为 ${id} 的题目时出错`, error);
      }
    }

    //这样一来 题目也被设定好了
    setQuestions(qs);
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

    const durationMinutes = Math.floor((record.duration || 0) / 60);
    const durationSeconds = (record.duration || 0) % 60;
    const suggestedMinutes = (record.totalQuestions || 0) * 5;

    return (
      <Card title="面试相关信息" style={{ marginBottom: 20 }}>
        {/*设置条件渲染 在未完成面试的时候不会显示这个*/}
        {record?.status != 0 && (
          <>
            <p>
              您实际的完成时间：{durationMinutes} 分钟 {durationSeconds} 秒
            </p>
            <p>本次面试建议完成时间：{suggestedMinutes} 分钟</p>
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
