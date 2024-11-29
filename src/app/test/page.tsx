// pages/interview.tsx
//todo 面试条件选择页面
"use client";

import React, { useState } from "react";
import { Card, Button, Modal, Checkbox, Select, message, Spin } from "antd";
import Image from "next/image";
// import {useRouter} from "next/router";
import {
  // listMyQuestionBankVoByPageUsingPost,
  listQuestionBankVoByPageUsingPost,
} from "@/api/questionBankController"; // 假设所有方法都在这里导入

import { searchQuestionVoByPageUsingPost } from "@/api/questionController";
import { listFavoriteByPageUsingPost } from "@/api/favoriteController";
import { addInterviewRecordUsingPost } from "@/api/interviewRecordController";
import { addInterviewRecordDetailUsingPost } from "@/api/interviewRecordDetailController";

const { Option } = Select;

const InterviewPage = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [questionBanks, setQuestionBanks] = useState([]); // 题库列表
  const [selectedBanks, setSelectedBanks] = useState([]); // 选中的题库ID
  const [questionCount, setQuestionCount] = useState(5); // 题目数量
  const [skipMastered, setSkipMastered] = useState(false);
  const [targetMistakes, setTargetMistakes] = useState(false);

  // const router = useRouter();

  // 打开Modal并加载题库
  const handleOpenModal = async () => {
    setLoading(true);
    try {
      //todo 参数
      // 提取 records 数据： 从返回的数据中找到 data.records，并将其提取为数组。
      // const {data} = await listQuestionBankVoByPageUsingPost({current:1,pageSize:100}); // 调用方法获取题库
      //调整为100似乎查的太多了点。。。

      //后端有问题啊 这里的查询条件。。。
      //不是啊 我要求能够全部查询出来啊。。
      //接口文档里发现可以 但是这里不行
      //这是响应而不是响应体！！！
      // const response = await listQuestionBankVoByPageUsingPost({current:1,pageSize:10});
      //你总不能给我整100个数据库吧。。？
      const { data } = await listQuestionBankVoByPageUsingPost({
        current: 1,
        pageSize: 100,
      });

      //在第几层呢？

      const records = data.records;
      //卧槽这么简单。。？ 那搞定了啊
      //但这样会显得很大。。要不要弄个VO。。？

      // todo 遍历 records 提取 id 卧槽这个写法nb！！！
      const ids = records.map((record) => record.id);

      console.log(ids);

      //
      if (records) {
        setQuestionBanks(records); // 提取 records
      } else {
        console.error("Unexpected response format:", data);
        setQuestionBanks([]); // 默认空数组
      }

      // setQuestionBanks(data || []);
      setModalVisible(true);
    } catch (error) {
      message.error("加载题库失败，请重试！");
    } finally {
      setLoading(false);
    }
  };

  // 提交选择
  const handleSubmit = async () => {
    setLoading(true);
    try {
      // 获取用户选择
      const questionBankIds = selectedBanks;
      const count = questionCount;

      if (questionBankIds.length === 0) {
        message.error("请至少选择一个题库！");
        return;
      }

      // 获取题库范围内的题目ID集合 A

      //todo
      let questionIdsA = [];
      for (const bankId of questionBankIds) {
        //因为这里用的这个 所以默认100
        const { data } = await searchQuestionVoByPageUsingPost({
          questionBankId: bankId,
          current: 1,
          pageSize: 100,
        });

        const records = data.records;
        // const ids = records.map(record =>record.id);

        questionIdsA = questionIdsA.concat(records.map((q) => q.id));
        //这段代码将 records 数组中所有的 id 提取出来，并将它们追加到 questionIdsA 数组中
      }

      if (questionIdsA.length < count) {
        message.error("题库范围内可供选择的题目太少了！");
        return;
      }

      // // 查询用户收藏数据
      // let questionIdsB = [];
      // let questionIdsC = [];
      // if (targetMistakes || skipMastered) {
      //     const {data: favoriteData} = await listFavoriteByPageUsingPost({current:1,pageSize:100});
      //
      //     if (targetMistakes) {
      //         questionIdsB = favoriteData.filter((fav) => fav.favoriteType === 1).map((fav) => fav.questionId);
      //     }
      //     if (skipMastered) {
      //         questionIdsC = favoriteData.filter((fav) => fav.favoriteType === 2).map((fav) => fav.questionId);
      //     }
      // }

      // 查询用户收藏数据
      let questionIdsB = [];
      let questionIdsC = [];
      if (targetMistakes || skipMastered) {
        //todo 传入当前用户的登录id 这里先固定为5 反正都是我在登录
        const { data: favoriteData } = await listFavoriteByPageUsingPost({
          userId: 5,
          current: 1,
          pageSize: 100,
        });
        //原来是解构然后换了个名字 吓死我了

        // 假设 data.records 是你真正需要的查询结果数组
        const records = favoriteData.records;

        if (targetMistakes) {
          // 获取 favoriteType 为 1 的问题的 ID
          questionIdsB = records
            .filter((fav) => fav.favoriteType === 1)
            .map((fav) => fav.questionId);
        }
        if (skipMastered) {
          // 获取 favoriteType 为 2 的问题的 ID
          questionIdsC = records
            .filter((fav) => fav.favoriteType === 2)
            .map((fav) => fav.questionId);
        }
      }

      //测试一下
      console.log(questionIdsB);
      console.log(questionIdsC);

      // 如果跳过掌握的题目，计算 A-C
      if (skipMastered) {
        questionIdsA = questionIdsA.filter((id) => !questionIdsC.includes(id));
        if (questionIdsA.length < count) {
          message.error(
            "可供选择的题目太少，您掌握的题目太多了太强了！，请联系管理员！",
          );
          return;
        }
      }

      // 从题目集合中挑选足量的题目集合 E
      let questionIdsE = [];
      if (targetMistakes) {
        questionIdsE = questionIdsB.slice(0, count);
      }
      if (questionIdsE.length < count) {
        questionIdsE = questionIdsE.concat(
          questionIdsA
            .filter((id) => !questionIdsE.includes(id))
            .slice(0, count - questionIdsE.length),
        );
      }

      // 创建面试记录
      const { data: interviewRecord } = await addInterviewRecordUsingPost({
        totalQuestions: count,
        userId: 5, // 假设用户ID为5
      });

      // 创建面试记录详情
      //这里没封装 直接就返回的id
      const interviewRecordId = interviewRecord;
      const firstDetailId = await Promise.all(
        questionIdsE.map(async (id, index) => {
          //todo 我记得后端好像会自己填充。。？
          const { data: detail } = await addInterviewRecordDetailUsingPost({
            interviewRecordId,
            questionId: id,
          });
          return index === 0 ? detail : null;
        }),
      ).then((ids) => ids.find((id) => id !== null));

      // todo 跳转到测试页面 先不跳转了
      // router.push(`/test/${interviewRecordId}/${firstDetailId}`);
      // 替换 router.push
      //用另一种跳转 不知道会不会出错
      window.location.href = `/test/${interviewRecordId}/${firstDetailId}`;
    } catch (error) {
      message.error("操作失败，请重试！");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ width: "80%", margin: "0 auto", padding: "20px" }}>
      {/* 第一个卡片 */}
      <Card title="开始你的模拟面试吧！" style={{ marginBottom: "20px" }}>
        <Image src="/test.png" alt="测试图片" width={300} height={200} />
      </Card>

      {/* 第二个卡片 */}
      <Card>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "10px",
          }}
        >
          <Button type="primary" onClick={handleOpenModal}>
            选择面试条件
          </Button>
          <Button type="default" onClick={() => handleSubmit()}>
            懒得选了
          </Button>
        </div>
      </Card>

      {/* 选择条件Modal */}
      <Modal
        title="选择面试条件"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSubmit}
        confirmLoading={loading}
      >
        <Spin spinning={loading}>
          <Checkbox.Group
            //渲染
            options={questionBanks.map((q) => ({
              label: q.title,
              value: q.id,
            }))}
            onChange={(checked) => setSelectedBanks(checked)}
          />
          <Select
            style={{ marginTop: "10px", width: "100%" }}
            value={questionCount}
            onChange={(value) => setQuestionCount(value)}
          >
            {[5, 6, 7, 8, 9, 10].map((num) => (
              <Option key={num} value={num}>
                {num}道题目
              </Option>
            ))}
          </Select>
          <Checkbox
            style={{ marginTop: "10px" }}
            checked={targetMistakes}
            onChange={(e) => setTargetMistakes(e.target.checked)}
          >
            针对易错题目
          </Checkbox>
          <Checkbox
            style={{ marginTop: "10px" }}
            checked={skipMastered}
            onChange={(e) => setSkipMastered(e.target.checked)}
          >
            跳过已经掌握的题目
          </Checkbox>
        </Spin>
      </Modal>
    </div>
  );
};

export default InterviewPage;
