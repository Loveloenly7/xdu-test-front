//todo 一站式 面经 题目列表 大量初步题解 修改导入

/*单个题目的详细化怎么设置。。？
*
* 单个题目的题解详细化 。。。。这个直接嵌入到题目管理页面里面来
*
*
* 初步想法是 一站式这边直接是多个Tab的方式
*
* 具体来说 三个Tab
*
* 第一个
*
*
*
* 还是上面输入
* 下面导入的方式 。。。
*
* 等会来做比较详细的设计吧。。。先画图 不急。。。 */

/*先设计好页面再说 */

'use client'



import React, { useState } from "react";
import { Card, Tabs, message } from "antd";
import Page1 from "./components/newExpCard";
import Page2 from "./components/newTMListCard";
import Page3 from "./components/newTJAnswerCard";

const { TabPane } = Tabs;

const OneStationPage = () => {
    const [expData, setExpData] = useState(""); // 用于保存 Page1 的面经数据
    const [questionData, setQuestionData] = useState([]); // 用于保存 Page2 的题目列表
    const [listData, setLIstData] = useState([]); // 用于保存 Page2 的题目列表生成的单列表内容

    // Page1 数据更新
    const handlePage1DataUpdate = (newExp) => {
        setExpData(newExp);
        message.success("Page1 数据已传递到 Page2");
    };

    // Page2 数据更新
    const handlePage2DataUpdate = (newQuestions) => {
        setQuestionData(newQuestions);
        message.success("Page2 题单数据已传递到 Page3");
    };
    // Page2 数据更新 单个题单的初步题解
    const handlePage2ListDataUpdate = (list) => {
        setLIstData(list);
        message.success("Page2 题单初步题解数据已传递到 Page3");
    };

    return (
        <Card style={{ width: "90%", margin: "0 auto", marginTop: "20px" }}>
            <Tabs defaultActiveKey="1">
                {/* Page1: 获取面经 */}
                <TabPane tab="获取面经" key="1">
                    <Page1
                        onExpUpdate={handlePage1DataUpdate} // 将数据传递给 Page2
                    />
                </TabPane>

                {/* Page2: 获取题目列表 */}
                <TabPane tab="获取题目列表" key="2">
                    <Page2
                        expData={expData} // 从 Page1 获取数据
                        onQuestionsUpdate={handlePage2DataUpdate} // 将数据传递给 Page3
                        onListUpdate={handlePage2ListDataUpdate} // 将数据传递给 Page3
                    />
                </TabPane>

                {/* Page3: 获取初步题解的题目列表 */}
                <TabPane tab="获取初步题解" key="3">
                    <Page3
                        questionData={questionData} // 从 Page2 获取数据
                        listData={listData} // 从 Page2 获取数据
                    />
                </TabPane>
            </Tabs>
        </Card>
    );
};

export default OneStationPage;
