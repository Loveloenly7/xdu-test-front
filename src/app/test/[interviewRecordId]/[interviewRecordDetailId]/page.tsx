//v4

// 根据v1改的v3
"use client";
// 声明该组件仅在客户端渲染

import React, { useState, useEffect } from "react";
// 导入 React 以及 useState 和 useEffect 钩子
// import {useSearchParams} from 'next/navigation';
// 导入 next/navigation 中的钩子，用于获取页面 URL 的查询参数
import { Card, Button, Progress, Tag, message, ProgressProps } from "antd";
// 导入 antd UI 库中的组件：Card、Button、Progress、Tag 和 message
import MDEditor from "@uiw/react-md-editor";
// 导入 MD 编辑器组件，用于显示和编辑 Markdown 格式的文本

//todo 问题最大的就是这里的数据源进来之后怎么处理
//我总觉得这几个方法 似乎不太够。。？
import {
  getInterviewRecordDetailVoByIdUsingGet,
  listInterviewRecordDetailVoByPageUsingPost,
  updateInterviewRecordDetailUsingPost,
} from "@/api/interviewRecordDetailController";
// 导入 API 请求函数，用于获取和更新面试记录
import { getQuestionVoByIdUsingGet } from "@/api/questionController";
import { useRouter } from "next/router";
import { usePathname } from "next/navigation";
import {
  getInterviewRecordVoByIdUsingGet,
  updateInterviewRecordUsingPost,
} from "@/api/interviewRecordController";
import loginUser from "@/stores/loginUser";
import { useSelector } from "react-redux";
import { RootState } from "@/stores";
// 导入 API 请求函数，用于获取题目信息

const InterviewPage: React.FC = () => {
  // // 定义一个 React 函数组件
  // const searchParams = useSearchParams();
  // // 获取 URL 中的查询参数
  // const interviewRecordId = searchParams.get('interviewRecordId');
  // // 获取面试记录的 ID
  // const interviewRecordDetailId = searchParams.get('interviewRecordDetailId');
  // 获取面试记录详情的 ID

  //todo 问题又回到了这里
  //老子必读完你的官方文档
  // const router = useRouter();
  // const {interviewRecordId, interviewRecordDetailId} = router.query; // 从 URL 中获取 interviewRecordId 和 interviewRecordDetailId

  //他妈的老子有的是办法来实现你这些小功能 他妈的。。
  // 获取当前路径
  const pathname = usePathname();

  // 解析路径，提取参数
  const parts = pathname.split("/").filter((part) => part); // 去掉空字符串
  const interviewRecordId = parts[1]; // 路径的第二段是参数
  const interviewRecordDetailId = parts[2]; // 路径的第三段是参数

  // 定义组件的状态，使用 useState 钩子
  const [timer, setTimer] = useState(0); //
  // 计时器的状态，初始化为 0
  const [progress, setProgress] = useState(0);
  // 答题进度的状态，初始化为 0
  const [question, setQuestion] = useState<any>(null);

  //因为涉及到保存 所以说这里我觉得要有这个
  //todo 面试记录详情记录 被记录到状态
  const [InterviewRecordDetail, setInterviewRecordDetail] = useState<any>(null);
  // 当前题目的状态，初始为空
  //是因为这里传进来的是一个数据实体吗？
  const [answer, setAnswer] = useState("");
  // 用户的作答内容，初始为空

  //是否是最后一道题目的判断
  const [isLastQuestion, setIsLastQuestion] = useState(false);

  //我需要拿到以前的面试记录数据作为钩子
  //后来发现 好像不用这玩意。。？
  const [InterviewRecord, setInterviewRecord] = useState<any>(null);

  //面试记录的所有面试详细数据一条条的 作为数组
  const [interviewDetails, setInterviewDetails] = useState<any>([]);

  //需要当前的登录用户

  // const state = useState();

  //todo Redux逻辑

  // 从 Redux 状态中获取当前用户信息
  //没问题 就是这么干的。。。
  const loginUser = useSelector((state: RootState) => state.loginUser);

  //todo 用了 useEffect来保证定时保存用户的答案啊。。。

  // 自动保存功能：每 30 秒保存一次用户的答案
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      saveAnswer();
      // 定时调用保存答案的函数
    }, 30000);
    // 30 秒执行一次
    return () => clearInterval(autoSaveInterval);
    // 清除定时器，防止组件卸载时出现内存泄漏。。？
    //？
  }, [answer]);
  // 每次答案更新时重新执行该副作用

  // 计时器逻辑：页面加载时初始化计时，保持计时不丢失
  // 页面加载时初始化计时器
  useEffect(() => {
    // 从 localStorage 中获取上次计时的记录（如果存在）
    //todo localStorage
    const savedTime = parseInt(
      localStorage.getItem(
        `timer_${interviewRecordId}_${interviewRecordDetailId}`,
      ) || "0",
      10,
    );
    setTimer(savedTime); // 设置当前的计时器状态

    // 设置每秒更新计时器的定时器
    const interval = setInterval(() => {
      setTimer((prev) => {
        const newTime = prev + 1;
        // 每秒增加 1 秒
        localStorage.setItem(
          `timer_${interviewRecordId}_${interviewRecordDetailId}`,
          String(newTime),
        );
        // 保存最新的时间到 localStorage
        return newTime;
      });
    }, 1000); // 每秒执行一次
    //你说这个会带来性能问题吗。。？ 我觉得不会。。。因为是前端本地的逻辑

    return () => clearInterval(interval);
    // 清除定时器，防止内存泄漏
  }, [interviewRecordId, interviewRecordDetailId]);
  // 依赖项是面试记录和记录详情的 ID，确保每个面试记录的计时器独立

  // 加载面试记录和题目信息
  //todo 首次加载？对的 页面加载的时候会初始化数据
  useEffect(() => {
    if (interviewRecordId && interviewRecordDetailId) {
      loadDetail(); // 如果面试记录 ID 和面试记录详情 ID 存在，则加载详细信息
    }
  }, [interviewRecordId, interviewRecordDetailId]); // 依赖项是面试记录和记录详情的 ID

  const loadDetail = async () => {
    try {
      // 获取面试记录的详细信息
      const detailRes = await getInterviewRecordDetailVoByIdUsingGet({
        id: parseInt(interviewRecordDetailId as string, 10), // 使用 API 请求获取面试记录详情
        //虽然我觉得这有点冗余。。。
        /*interviewRecordDetailId 是一个变量，表示面试记录的 ID（可能是字符串类型）。在这里，通过 as string 强制将其转换为字符串类型（即使它已经是字符串类型，这个转换操作并没有多大意义）。*/
        /*parseInt(..., 10)：
parseInt 是 JavaScript 的一个函数，用于将字符串解析为整数。第二个参数 10 表示将字符串按 10 进制解析。也就是说，interviewRecordDetailId 会被转换为一个整数，传递给 getInterviewRecordDetailVoByIdUsingGet 函数。

说人话 10进制转化*/

        /*  "data": {
    "id": "1",
    "interviewRecordId": "1",
    "questionId": "2",
    "answer": "这次的作答",
    "timeTaken": null,
    "createTime": "2024-11-25T12:16:08.000+00:00"
  },*/
      });

      const detailData = detailRes.data; // 获取返回的数据
      //相当于这里加载页面的时候 也把这个数据对象的信息保存了 后面才好去更新它。。。
      setInterviewRecordDetail(detailData);

      //仿照上面的写法 写一个初始化获取面试记录的逻辑 因为涉及到update都需要这样去写。。。
      // const {data} = await getInterviewRecordVoByIdUsingGet({id:interviewRecordId});
      const { data } = await getInterviewRecordVoByIdUsingGet({
        id: parseInt(interviewRecordId, 10),
      });
      //这个按照上面的写法来的
      //我记得 前端的对象数据可以认为是一个JSON？

      setInterviewRecord(data);

      setAnswer(detailData?.answer || ""); // 设置当前答案，如果没有答案则为空
      // 获取题目的详细信息

      const questionRes = await getQuestionVoByIdUsingGet({
        id: detailData?.questionId,
      });

      /*todo 我决定在每个调用的方法这里都贴一个模拟数据的demo
            *
            * {
  "code": 0,
  "data": {
    "id": "1",
    "title": "JavaScript 变量提升",
    "content": "请详细解释一下 JavaScript 中的变量提升现象。\n",
    "answer": "变量提升是指在 JavaScript 中，变量声明会被提升到作用域的顶部。\n\n# 关于变量提升\n\n我们尽可能在开发中要少用var字段\n除非你想兼容比较老的浏览器",
    "userId": "1",
    "createTime": "2024-11-14T05:07:04.000+00:00",
    "updateTime": "2024-11-23T07:39:58.000+00:00",
    "tagList": [
      "JavaScript",
      "基础",
      "前端"
    ],
    "user": {
      "id": "1",
      "userName": "不会写代码的02",
      "userAvatar": "http://web-static.4ce.cn/storage/bucket/v1/9c0bf10024fca91758ee25dee7e3168a.webp",
      "userProfile": "XDU web前端",
      "userRole": "user",
      "createTime": "2024-11-14T05:07:04.000+00:00"
    }
  },
  "message": "ok"
}*/
      setQuestion(questionRes.data); // 设置题目数据
      //目前看来 没有任何问题

      //todo 判断是不是最后一题
      //ok接下来 面试id 拿到一条条详情
      const responseRes =
        //todo 出问题的地方！！！

        //我日 我把字段删了发现可以了
        await listInterviewRecordDetailVoByPageUsingPost({
          current: 1,
          pageSize: 10,
          interviewRecordId: parseInt(interviewRecordId),
          // sortField: "createdTime",
          // sortOrder: "ascend"
        });
      const recordData = responseRes.data;
      const details = recordData.records || [];

      console.log(details);
      //既然去请求了 那么就更新这个钩子
      setInterviewDetails(details);
      //这里的排序在后端已经做好了相当于

      //没问题 接着排序吧 保守起见还是拍了个序
      details.sort(
        (a: any, b: any) =>
          new Date(a.createTime).getTime() - new Date(b.createTime).getTime(),
      );

      //写着写着 发现这里要不写个钩子

      console.log(details);

      // 判断当前是否是最后一题 取最后一个的id
      //我在想这里是不是有点多此一举。。。直接records数组里面就能实现了。。。
      // const ids = details.map((item: any) => item.id);

      //这里直接用下面的。。？
      // setIsLastQuestion(ids[ids.length - 1] === parseInt(interviewRecordDetailId, 10));

      // 找到当前记录在数组中的索引
      const currentId = parseInt(interviewRecordDetailId, 10);

      const currentIndex = interviewDetails.findIndex(
        (item: any) => parseInt(item.id, 10) === currentId,
      );

      // if (currentIndex !== -1) {
      // 确保找到了当前记录后，尝试获取下一条记录的 ID
      const nextId = interviewDetails[currentIndex + 1]?.id;

      //下一条id不存在就是最后一题。。
      setIsLastQuestion(nextId == null);

      // todo 计算进度
      const completedCount = details.filter(
        (item: any) => item.timeTaken,
      ).length;
      // const progressPercentage = (completedCount / details.length) * 100;

      // 保留到小数点后的一位 还要数字类型
      // const progressPercentage = ((completedCount / details.length) * 100).toFixed(1);
      const progressPercentage = parseFloat(
        ((completedCount / details.length) * 100).toFixed(1),
      );

      setProgress(progressPercentage);

      /*调试之后 {
  "current": 1,
  "interviewRecordId": 1,
  "pageSize": 10,
  "sortField": "createTime",
  "sortOrder": "ascend"
}*/

      //todo 进度这里应该被计算的。。。

      // const currentProgress = Math.floor(Math.random() * 100);  // 模拟一个随机进度
      // setProgress(currentProgress);  // 设置进度
    } catch (error) {
      message.error("加载失败，请重试！"); // 如果加载失败，显示错误提示
    }
  };

  const saveAnswer = async () => {
    try {
      // 调用 API 更新答案
      /*更新必须要先获取到之前的*/

      await updateInterviewRecordDetailUsingPost({
        id: parseInt(interviewRecordDetailId as string, 10), // 提交答案时，包含记录详情的 ID
        answer: answer, // 当前答案
        // timeTaken: timer,  // 当前计时器的时间 自动保存只会存答案！！！
        timeTaken: InterviewRecordDetail.timeTaken, // 当前计时器的时间 自动保存只会存答案！！！
        //？但是这又引申出来一个问题 要是是null怎么办？？
        interviewRecordId: InterviewRecordDetail.interviewRecordId,
        questionId: InterviewRecordDetail.questionId,
        //我是记得这里好像能解构写的。。？
      });

      /*{
  "answer": "",
  "id": 0,
  "interviewRecordId": 0,
  "questionId": 0,
  "timeTaken": 0
}*/

      /*试试这里行不行 不行 update必须要全部获取到
       * 说白了就是 其他的字段也要写进去 不然update一定会报错！*/

      message.success("自动保存成功！"); // 如果保存成功，显示成功提示
    } catch (error) {
      message.error("保存失败！"); // 如果保存失败，显示错误提示
    }
  };

  const saveAnswerEnd = async () => {
    try {
      // 调用 API 更新答案
      /*更新必须要先获取到之前的*/

      await updateInterviewRecordDetailUsingPost({
        id: parseInt(interviewRecordDetailId as string, 10), // 提交答案时，包含记录详情的 ID
        answer: answer, // 当前答案
        timeTaken: timer, // 当前计时器的时间 自动保存只会存答案！！！
        // timeTaken: InterviewRecordDetail.timeTaken,  // 当前计时器的时间 自动保存只会存答案！！！
        //？但是这又引申出来一个问题 要是是null怎么办？？
        interviewRecordId: InterviewRecordDetail.interviewRecordId,
        questionId: InterviewRecordDetail.questionId,
        //我是记得这里好像能解构写的。。？
      });
      //这里就是在完成面试的时候的东西

      /*{
  "answer": "",
  "id": 0,
  "interviewRecordId": 0,
  "questionId": 0,
  "timeTaken": 0
}*/

      /*试试这里行不行 不行 update必须要全部获取到
       * 说白了就是 其他的字段也要写进去 不然update一定会报错！*/

      message.success("已完成 答案和耗时已上传成功！"); // 如果保存成功，显示成功提示
    } catch (error) {
      message.error("保存失败！"); // 如果保存失败，显示错误提示
    }
  };

  //完成面试的时候
  //更新面试记录
  //需要拿到以前的面试记录数据
  //然后进行一个更新 我发现我这写的钩子是否有点太多。。

  const completeInterview = async () => {
    try {
      const totalDuration = interviewDetails.reduce(
        (sum, item) => sum + (item.timeTaken || 0),
        0,
      );
      console.log(totalDuration);
      //todo 测试
      await updateInterviewRecordUsingPost({
        id: parseInt(interviewRecordId, 10),
        status: 1,
        duration: totalDuration,
        userId: loginUser.userId,
        //获取当前登录用户
      });

      /*实验数据 {
  "duration": 100,
  "id": 2,
  "status": 0,
  "userId": 5
}*/

      /*
            先去试试必须要的字段aiReport?: Record<string, any>;
    duration?: number;
    id?: number;
    status?: number;
    totalQuestions?: number;
    updateTime?: string;
    userId?: number;*/

      message.success("面试完成！已更新面试记录，马上为您跳转面试结果页面");

      window.location.href = `/test/${interviewRecordId}`;
    } catch (error) {
      message.error("操作失败！");
    }
  };

  //跳转到下一题
  //我建议这里id不要固定+1 因为后面可能搞雪花算法

  // 跳转到下一题
  // const goToNextQuestion = async () => {
  // const goToNextQuestion = async () => {
  const handleNextQuestion = async () => {
    //保存时间戳的方法
    await saveAnswerEnd();

    //todo 跳转也出问题了

    // const nextIndex = interviewDetails.findIndex(
    //     (item: any) => item.id === parseInt(interviewRecordDetailId, 10)
    // ) + 1;
    //
    // //这里应该是 好像没问题啊。。因为之前确定了不是最后一题就肯定是最后一题了。。。
    //
    // //没问题 数组是紧挨着的 不是单纯的+1 我觉得现在没啥问题了。。。
    //
    // const nextId = interviewDetails[nextIndex]?.id;
    //
    // //不不不 还是有问题。。。
    // // 重写这里的代码  interviewDetails是包含多条面试interviewRecordDetail的数组，找到里面和当前interviewRecordDetailId相等的元素 取出其id 然后跳转页面
    //
    // //没跳转应该是这里的问题
    // if (nextId) {
    //     window.location.href = `/test/${interviewRecordId}/${nextId}`;
    // }

    // 将当前 interviewRecordDetailId 转换为数字
    const currentId = parseInt(interviewRecordDetailId, 10);

    // 找到当前记录在数组中的索引
    const currentIndex = interviewDetails.findIndex(
      (item: any) => parseInt(item.id, 10) === currentId,
    );

    if (currentIndex !== -1) {
      // 确保找到了当前记录后，尝试获取下一条记录的 ID
      const nextId = interviewDetails[currentIndex + 1]?.id;

      if (nextId) {
        // 跳转到下一题页面
        window.location.href = `/test/${interviewRecordId}/${nextId}`;
      } else {
        console.error("下一题 ID 不存在，可能是最后一题");
      }
    } else {
      console.error("当前记录未找到，无法跳转到下一题");
    }

    //似乎是类型不一致。。？id传过来为什么会是字符串。。？
  };

  // const handleNextQuestion = async () => {
  //     try {
  //         await saveAnswerEnd();
  //         //这里的下一个id是+1吗？？？？
  //         //因为我是创建时间来的 所以。。？好像是的。。
  //         const nextId = parseInt(interviewRecordDetailId as string, 10) + 1;
  //         window.location.href = `/test/${interviewRecordId}/${nextId}`;  // 使用 window.location.href 来跳转
  //     } catch (error) {
  //         message.error('提交失败！');
  //     }
  // };

  const conicColors: ProgressProps["strokeColor"] = {
    "0%": "#87d068",
    "50%": "#ffe58f",
    "100%": "#ffccc7",
  };

  return (
    // <div style={{display: 'flex', flexDirection: 'column', height: '100vh', padding: '20px'}}>

    /*调整逻辑
1. 保持宽度配比

使用 gridTemplateColumns: "20% 80%"，将左侧（计时器和进度条）固定为 20%，右侧（题目详情和答题区域）固定为 80%。
通过 gridTemplateRows 定义两行，其中：
第一行高度根据内容动态调整（auto）。
第二行高度分配剩余空间（1fr）。*/
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "20% 80%",
        gridTemplateRows: "auto 1fr",
        height: "100vh",
        gap: "20px",
        padding: "20px",
      }}
    >
      {/*todo 事实证明要用grid布局*/}
      <div style={{ gridColumn: "1 / 2", gridRow: "1 / 2" }}>
        <Card
          style={{
            height: "100px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div>本题作答时间</div>
          <div>
            {Math.floor(timer / 60)} 分 {timer % 60} 秒
          </div>
        </Card>
      </div>

      <div style={{ gridColumn: "2 / 3", gridRow: "1 / 2" }}>
        <Card>
          <h2>{question?.title || "加载中..."}</h2>
          <div>
            {question?.tagList?.map((tag: string, index: number) => (
              <Tag key={index}>{tag}</Tag>
            ))}
          </div>
          <p>{question?.content || "加载中..."}</p>
        </Card>
      </div>
      <div style={{ gridColumn: "1 / 2", gridRow: "2 / 3" }}>
        {/*<Card>*/}
        <Card
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            height: "100%", // 父容器的高度
            width: "100%", // 父容器的宽度
          }}
        >
          {/*<Progress percent={progress} type="line" style={{height: "20px"}}/>*/}
          {/*居中然后调整尺寸*/}
          {/*<Progress*/}
          {/*    type="circle"*/}
          {/*    percent={50}*/}
          {/*    // steps={{ count: interviewDetails.length, gap: 2}}*/}
          {/*    trailColor="rgba(0, 0, 0, 0.06)"*/}
          {/*    strokeColor={conicColors}*/}
          {/*    strokeWidth={20}*/}
          {/*/>*/}
          <Progress
            type="circle"
            percent={progress}
            trailColor="rgba(0, 0, 0, 0.06)"
            strokeColor={conicColors}
            strokeWidth={20}
            style={{
              width: "90%", // 设置进度条的宽度和父容器接近
              height: "90%", // 设置进度条的高度和父容器接近
            }}
          />
        </Card>
      </div>

      {/*<div style={{gridColumn: "2 / 3", gridRow: "2 / 3", marginTop: "20px"}}>*/}
      <div
        style={{
          gridColumn: "2 / 3",
          gridRow: "2 / 3",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {/*<Card> 填满第二行的设置*/}
        {/*<Card style={{ flexGrow: 1 }}>*/}
        {/*    <MDEditor value={answer} onChange={(value) => setAnswer(value || "")}/>*/}
        {/*    <div style={{marginTop: 20}}>*/}
        {/*        {isLastQuestion ? (*/}
        {/*            <Button type="primary" onClick={completeInterview}>*/}
        {/*                完成面试*/}
        {/*            </Button>*/}
        {/*        ) : (*/}
        {/*            <Button type="primary" onClick={handleNextQuestion}>*/}
        {/*                完成，下一题*/}
        {/*            </Button>*/}
        {/*        )}*/}
        {/*    </div>*/}
        {/*</Card>*/}
        <Card
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            padding: 0,
          }}
        >
          {/* MD 编辑器部分，占满整个卡片 */}

          {/*todo MD编辑器的大小。。。！！！！*/}
          <MDEditor
            value={answer}
            onChange={(value) => setAnswer(value || "")}
            style={{ flexGrow: 1, height: "100%", overflow: "auto" }}
          />

          {/* 按钮部分，固定在卡片底部 */}
          <div
            style={{ marginTop: 20, display: "flex", justifyContent: "center" }}
          >
            {isLastQuestion ? (
              <Button type="primary" onClick={completeInterview}>
                完成面试
              </Button>
            ) : (
              <Button type="primary" onClick={handleNextQuestion}>
                完成，下一题
              </Button>
            )}
          </div>
        </Card>
      </div>

      {/*<div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px'}}>*/}
      {/*    /!* 左侧计时器 *!/*/}
      {/*    <Card style={{*/}
      {/*        width: '30%',*/}
      {/*        height: '100px',*/}
      {/*        display: 'flex',*/}
      {/*        justifyContent: 'center',*/}
      {/*        alignItems: 'center'*/}
      {/*    }}>*/}
      {/*        <div>计时器</div>*/}
      {/*        <div>{Math.floor(timer / 60)} 分 {timer % 60} 秒</div>*/}
      {/*    </Card>*/}

      {/*    /!* 右侧答题进度 *!/*/}
      {/*    <Card style={{*/}
      {/*        width: '30%',*/}
      {/*        height: '100px',*/}
      {/*        display: 'flex',*/}
      {/*        justifyContent: 'center',*/}
      {/*        alignItems: 'center'*/}
      {/*    }}>*/}
      {/*        <Progress type="circle" percent={progress}/>*/}
      {/*    </Card>*/}
      {/*</div>*/}

      {/*<div style={{display: 'flex', flex: 1}}>*/}
      {/*    /!* 题目详情 *!/*/}
      {/*    <Card style={{width: '70%', marginRight: '10px'}}>*/}
      {/*        <h2>{question?.title || '加载中...'}</h2>*/}
      {/*        <p>{question?.content}</p>*/}
      {/*        <div>*/}
      {/*            {question?.tagList?.map((tag: string, index: number) => (*/}
      {/*                <Tag key={index}>{tag}</Tag>*/}
      {/*            ))}*/}
      {/*        </div>*/}
      {/*    </Card>*/}

      {/*    /!* 作答区域 *!/*/}
      {/*    <Card style={{width: '30%'}}>*/}
      {/*        <MDEditor value={answer} onChange={(value) => setAnswer(value || '')}/>*/}
      {/*        <div style={{marginTop: 10}}>*/}
      {/*            <Button type="primary" onClick={handleNextQuestion}>完成，下一题</Button>*/}
      {/*            <Button danger style={{marginLeft: 10}}>暂时中断面试</Button>*/}
      {/*        </div>*/}
      {/*    </Card>*/}
      {/*</div>*/}
    </div>
  );
};

export default InterviewPage;

//todo v2
//
// 'use client';
//
// import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/router';  // 引入 Next.js 的 useRouter Hook
// import { Card, Button, Progress, Tag, message } from 'antd';
// import MDEditor from '@uiw/react-md-editor';
// import { getInterviewRecordDetailVoByIdUsingGet, updateInterviewRecordDetailUsingPost } from '@/api/interviewRecordDetailController';
// import { getQuestionVoByIdUsingGet } from '@/api/questionController';
//
// const InterviewPage: React.FC = () => {
//     // 使用 useRouter 获取路由参数
//     const router = useRouter();
//     const { interviewRecordId, interviewRecordDetailId } = router.query; // 从 URL 中获取 interviewRecordId 和 interviewRecordDetailId
//
//     const [timer, setTimer] = useState(0); // 计时器的状态
//     const [progress, setProgress] = useState(0); // 答题进度的状态
//     const [question, setQuestion] = useState<any>(null); // 当前题目的状态
//     const [answer, setAnswer] = useState(''); // 用户的作答内容
//
//     // 防止在服务器端渲染时出现 NextRouter 错误，使用 useEffect 保证只有客户端渲染时才执行
//     const [isClient, setIsClient] = useState(false);
//     useEffect(() => {
//         setIsClient(true);  // 组件挂载后标记为客户端渲染
//     }, []);
//
//     // 计时器逻辑：页面加载时初始化计时，保持计时不丢失
//     useEffect(() => {
//         // 获取之前保存的计时数据
//         const savedTime = parseInt(localStorage.getItem(`timer_${interviewRecordId}_${interviewRecordDetailId}`) || '0', 10);
//         setTimer(savedTime);
//
//         const interval = setInterval(() => {
//             setTimer((prev) => {
//                 const newTime = prev + 1;  // 每秒钟增加1秒
//                 // 将计时保存到 localStorage 中，以便刷新页面后不会丢失
//                 localStorage.setItem(`timer_${interviewRecordId}_${interviewRecordDetailId}`, String(newTime));
//                 return newTime;
//             });
//         }, 1000); // 每秒更新一次计时器
//
//         return () => clearInterval(interval);  // 清除计时器
//     }, [interviewRecordId, interviewRecordDetailId]); // 依赖 interviewRecordId 和 interviewRecordDetailId，确保这两个值发生变化时重新初始化计时器
//
//     // 加载面试记录和题目信息
//     useEffect(() => {
//         if (interviewRecordId && interviewRecordDetailId) {
//             loadDetail();
//         }
//     }, [interviewRecordId, interviewRecordDetailId]); // 依赖 interviewRecordId 和 interviewRecordDetailId，确保这些参数加载时调用
//
//     // 加载面试记录和题目信息的函数
//     const loadDetail = async () => {
//         try {
//             const detailRes = await getInterviewRecordDetailVoByIdUsingGet({
//                 id: parseInt(interviewRecordDetailId as string, 10),
//             });
//             const detailData = detailRes.data;
//             setAnswer(detailData?.answer || '');  // 设置答案
//
//             // 加载问题详情
//             const questionRes = await getQuestionVoByIdUsingGet({ id: detailData?.questionId });
//             setQuestion(questionRes.data);  // 设置问题信息
//
//             // 假设从后端可以获取当前记录的排序位置（实际根据接口调整）
//             const currentProgress = Math.floor(Math.random() * 100); // 模拟进度
//             setProgress(currentProgress);  // 设置进度条
//         } catch (error) {
//             message.error('加载失败，请重试！');  // 出现错误时提示
//         }
//     };
//
//     // 保存作答内容的函数
//     const saveAnswer = async () => {
//         try {
//             await updateInterviewRecordDetailUsingPost({
//                 id: parseInt(interviewRecordDetailId as string, 10),
//                 answer,
//                 timeTaken: timer,
//             });
//             message.success('自动保存成功！');  // 提示保存成功
//         } catch (error) {
//             message.error('保存失败！');  // 提示保存失败
//         }
//     };
//
//     // 完成当前题目并跳转到下一题
//     const handleNextQuestion = async () => {
//         try {
//             await saveAnswer();  // 保存当前答案
//             const nextId = parseInt(interviewRecordDetailId as string, 10) + 1;  // 获取下一个题目ID
//             router.push(`/test/${interviewRecordId}/${nextId}`);  // 跳转到下一个问题
//         } catch (error) {
//             message.error('提交失败！');  // 提交失败时提示
//         }
//     };
//
//     // 如果是客户端渲染，则继续渲染页面内容
//     if (!isClient) {
//         return null;  // 防止服务器端渲染时访问 useRouter
//     }
//
//     return (
//         <div style={{ display: 'flex', height: '100vh' }}>
//             {/* 左上角计时器 */}
//             <Card style={{ width: '20%', height: '20%', position: 'absolute', top: 10, left: 10 }}>
//                 <div>计时器</div>
//                 <div>{Math.floor(timer / 60)} 分 {timer % 60} 秒</div> {/* 显示分钟和秒 */}
//             </Card>
//
//             {/* 左下角答题进度条 */}
//             <Card style={{ width: '20%', height: '80%', position: 'absolute', bottom: 10, left: 10 }}>
//                 <Progress type="circle" percent={progress} />  {/* 显示答题进度 */}
//             </Card>
//
//             {/* 右上角题目详情 */}
//             <Card style={{ width: '75%', margin: '10px auto' }}>
//                 <h2>{question?.title || '加载中...'}</h2> {/* 显示题目标题 */}
//                 <p>{question?.content}</p>  {/* 显示题目内容 */}
//                 <div>
//                     {question?.tagList?.map((tag: string, index: number) => (
//                         <Tag key={index}>{tag}</Tag>
//                     ))}
//                 </div>
//             </Card>
//
//             {/* 右下角作答区 */}
//             <Card style={{ width: '75%', position: 'absolute', bottom: 10, right: 10 }}>
//                 <MDEditor value={answer} onChange={(value) => setAnswer(value || '')} /> {/* MD 编辑器用于编辑答案 */}
//                 <div style={{ marginTop: 10 }}>
//                     <Button type="primary" onClick={handleNextQuestion}>完成，下一题</Button> {/* 完成并跳转到下一题 */}
//                     <Button danger style={{ marginLeft: 10 }}>暂时中断面试</Button> {/* 暂停面试按钮 */}
//                 </div>
//             </Card>
//         </div>
//     );
// };
//
// export default InterviewPage;

//todo v1

//不行 我就要让V1跑起来

//
// 'use client';
//
// import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/router';  // 引入 Next.js 的 useRouter Hook
// import { usePathname, useSearchParams } from 'next/navigation';  // 导入 next/navigation 中的钩子
// import { Card, Button, Progress, Tag, message } from 'antd';
// import MDEditor from '@uiw/react-md-editor';
// import { getInterviewRecordDetailVoByIdUsingGet, updateInterviewRecordDetailUsingPost } from '@/api/interviewRecordDetailController';
// import { getQuestionVoByIdUsingGet } from '@/api/questionController';
//
// const InterviewPage: React.FC = () => {
//     // 使用 useRouter 获取路由参数
//     // const router = useRouter();
//     // const { interviewRecordId, interviewRecordDetailId } = router.query; // 从 URL 中获取 interviewRecordId 和 interviewRecordDetailId
//
//     const pathname = usePathname();  // 获取当前的路径名
//     const searchParams = useSearchParams();  // 获取查询参数
//     const interviewRecordId = searchParams.get('interviewRecordId');
//     const interviewRecordDetailId = searchParams.get('interviewRecordDetailId');
//
//     const [timer, setTimer] = useState(0); // 计时器的状态
//     const [progress, setProgress] = useState(0); // 答题进度的状态
//     const [question, setQuestion] = useState<any>(null); // 当前题目的状态
//     const [answer, setAnswer] = useState(''); // 用户的作答内容
//
//     // 自动保存的计时器，每30秒保存一次用户的作答
//     useEffect(() => {
//         const autoSaveInterval = setInterval(() => {
//             saveAnswer();
//         }, 30000);
//         return () => clearInterval(autoSaveInterval);  // 清除定时器
//     }, [answer]); // 监听 answer 的变化
//
//     // 计时器逻辑：页面加载时初始化计时，保持计时不丢失
//     useEffect(() => {
//         // 获取之前保存的计时数据
//         const savedTime = parseInt(localStorage.getItem(`timer_${interviewRecordId}_${interviewRecordDetailId}`) || '0', 10);
//         setTimer(savedTime);
//
//         const interval = setInterval(() => {
//             setTimer((prev) => {
//                 const newTime = prev + 1;  // 每秒钟增加1秒
//                 // 将计时保存到 localStorage 中，以便刷新页面后不会丢失
//                 localStorage.setItem(`timer_${interviewRecordId}_${interviewRecordDetailId}`, String(newTime));
//                 return newTime;
//             });
//         }, 1000); // 每秒更新一次计时器
//
//         return () => clearInterval(interval);  // 清除计时器
//     }, [interviewRecordId, interviewRecordDetailId]); // 依赖 interviewRecordId 和 interviewRecordDetailId，确保这两个值发生变化时重新初始化计时器
//
//     // 加载面试记录和题目信息
//     useEffect(() => {
//         if (interviewRecordId && interviewRecordDetailId) {
//             loadDetail();
//         }
//     }, [interviewRecordId, interviewRecordDetailId]); // 依赖 interviewRecordId 和 interviewRecordDetailId，确保这些参数加载时调用
//
//     // 加载面试记录和题目信息的函数
//     const loadDetail = async () => {
//         try {
//             const detailRes = await getInterviewRecordDetailVoByIdUsingGet({
//                 id: parseInt(interviewRecordDetailId as string, 10),
//             });
//             const detailData = detailRes.data;
//             setAnswer(detailData?.answer || '');  // 设置答案
//
//             // 加载问题详情
//             const questionRes = await getQuestionVoByIdUsingGet({ id: detailData?.questionId });
//             setQuestion(questionRes.data);  // 设置问题信息
//
//             // 假设从后端可以获取当前记录的排序位置（实际根据接口调整）
//             const currentProgress = Math.floor(Math.random() * 100); // 模拟进度
//             setProgress(currentProgress);  // 设置进度条
//         } catch (error) {
//             message.error('加载失败，请重试！');  // 出现错误时提示
//         }
//     };
//
//     // 保存作答内容的函数
//     const saveAnswer = async () => {
//         try {
//             await updateInterviewRecordDetailUsingPost({
//                 id: parseInt(interviewRecordDetailId as string, 10),
//                 answer,
//                 timeTaken: timer,
//             });
//             message.success('自动保存成功！');  // 提示保存成功
//         } catch (error) {
//             message.error('保存失败！');  // 提示保存失败
//         }
//     };
//
//     // 完成当前题目并跳转到下一题
//     const handleNextQuestion = async () => {
//         try {
//             await saveAnswer();  // 保存当前答案
//             const nextId = parseInt(interviewRecordDetailId as string, 10) + 1;  // 获取下一个题目ID
//             router.push(`/test/${interviewRecordId}/${nextId}`);  // 跳转到下一个问题
//         } catch (error) {
//             message.error('提交失败！');  // 提交失败时提示
//         }
//     };
//
//     return (
//         <div style={{ display: 'flex', height: '100vh' }}>
//             {/* 左上角计时器 */}
//             <Card style={{ width: '20%', height: '20%', position: 'absolute', top: 10, left: 10 }}>
//                 <div>计时器</div>
//                 <div>{Math.floor(timer / 60)} 分 {timer % 60} 秒</div> {/* 显示分钟和秒 */}
//             </Card>
//
//             {/* 左下角答题进度条 */}
//             <Card style={{ width: '20%', height: '80%', position: 'absolute', bottom: 10, left: 10 }}>
//                 <Progress type="circle" percent={progress} />  {/* 显示答题进度 */}
//             </Card>
//
//             {/* 右上角题目详情 */}
//             <Card style={{ width: '75%', margin: '10px auto' }}>
//                 <h2>{question?.title || '加载中...'}</h2> {/* 显示题目标题 */}
//                 <p>{question?.content}</p>  {/* 显示题目内容 */}
//                 <div>
//                     {question?.tagList?.map((tag: string, index: number) => (
//                         <Tag key={index}>{tag}</Tag>
//                         ))}
//                 </div>
//             </Card>
//
//             {/* 右下角作答区 */}
//             <Card style={{ width: '75%', position: 'absolute', bottom: 10, right: 10 }}>
//                 <MDEditor value={answer} onChange={(value) => setAnswer(value || '')} /> {/* MD 编辑器用于编辑答案 */}
//                 <div style={{ marginTop: 10 }}>
//                     <Button type="primary" onClick={handleNextQuestion}>完成，下一题</Button> {/* 完成并跳转到下一题 */}
//                     <Button danger style={{ marginLeft: 10 }}>暂时中断面试</Button> {/* 暂停面试按钮 */}
//                 </div>
//             </Card>
//         </div>
//     );
// };
//
// export default InterviewPage;
