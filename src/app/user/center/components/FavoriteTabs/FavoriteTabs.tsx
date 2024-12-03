import React, {useEffect, useState} from "react";
import {Tabs, List, Button} from "antd";
import {listFavoriteVoByPageUsingPost} from "@/api/favoriteController";
import {getQuestionVoByIdUsingGet} from "@/api/questionController";
import dayjs from "dayjs";
import Link from "next/link";

const {TabPane} = Tabs;

const FavoriteTabs = ({userId}) => {

    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sortOrder, setSortOrder] = useState("descend"); // 默认降序
    const [currentTab, setCurrentTab] = useState(0);
    const [pagination, setPagination] = useState({current: 1, pageSize: 5, total: 0});

    const fetchFavorites = async (favoriteType, page = 1) => {
        setLoading(true);
        try {
            const response = await listFavoriteVoByPageUsingPost({
                userId,
                favoriteType,
                current: page,
                pageSize: pagination.pageSize,
                sortField: "createTime",
                sortOrder,
            });

            // console.log(response);

            const records = response.data.records || [];
            const total = response.data.total || 0;

            // console.log(records);

            // 查询题目名称
            const questions = await Promise.all(
                records.map(async (record) => {
                    const questionResponse = await getQuestionVoByIdUsingGet({id: record.questionId});
                    return {
                        ...record,
                        question: questionResponse.data || {},
                        //卧槽 相当于 把整个对象当作了一个字段给拼接上去了。。。
                    };
                })
            );

            // console.log(questions);
            //总之我确定这里的数据是正常的了

            setFavorites(questions);
            setPagination({...pagination, total, current: page});
        } catch (error) {
            console.error("加载收藏列表失败", error);
        }
        setLoading(false);
    };

    //更改收藏夹类型
    const handleTabChange = (key) => {
        setCurrentTab(parseInt(key, 10));
        fetchFavorites(parseInt(key, 10), 1);
    };

    //更改内部排序
    const handleSortToggle = () => {
        const newSortOrder = sortOrder === "ascend" ? "descend" : "ascend";
        setSortOrder(newSortOrder);
        fetchFavorites(currentTab, pagination.current);
    };

    //页面加载的时候 数据初始化 以及。。
    useEffect(() => {
        fetchFavorites(currentTab, pagination.current);
    }, [currentTab, sortOrder]);


    //把每个页面里面的抽象出来了
    const RenderTabContent = (props: any) => (
        <>

            {/*TabPane 是 Tabs 的子组件，表示每个选项卡。
tab="收藏题目"：选项卡的标题显示为“收藏题目”。
key="0"：选项卡的唯一标识符，与 defaultActiveKey 和 onChange 回调中使用的 key 匹配。
*/}
            <div style={{textAlign: "right", marginBottom: 16}}>
                <Button onClick={handleSortToggle}>
                    {sortOrder === "ascend" ? "升序" : "降序"}
                </Button>
            </div>
            {/*一个用 div 包裹的按钮，用于切换排序方式。
style={{ textAlign: "right", marginBottom: 16 }}：
textAlign: "right"：内容右对齐。
marginBottom: 16：下方留 16 像素的间距。
<Button onClick={handleSortToggle}>：
使用 Ant Design 的按钮组件。
onClick={handleSortToggle}：点击按钮时，调用 handleSortToggle 函数（外部定义）切换排序。
{sortOrder === "ascend" ? "升序排列" : "降序排列"}：
根据 sortOrder 状态动态显示按钮文本：
如果是 "ascend"，显示“升序排列”；
否则显示“降序排列”。*/}
            <List
                loading={loading}
                dataSource={favorites}
                pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    total: pagination.total,
                    onChange: (page) => fetchFavorites(currentTab, page),
                }}
                renderItem={(item) => (
                    <List.Item>

                        {/*稍微改了下格式*/}
                        <List.Item.Meta
                            title={  <Link target={'_blank'} href={`/question/${item.question.id}`} style={{ fontWeight: "bold", color: "black", fontSize: "19px", fontFamily: "light" }}>
                                {item.question.title}
                            </Link>}
                            description={ <Link  target={'_blank'} href={`/question/${item.question.id}`} style={{ color: "black", fontSize: "14px", fontFamily: "light" }}>
                                {`${item.question.content?.substring(0, 20)}...`}
                            </Link>}
                        />


                        {/*<div style={{textAlign: "right"}}>{item.createTime}</div> todo 更友好了*/}
                        <div style={{textAlign: "right"}}>{dayjs(item.createTime).format("YYYY-MM-DD HH:mm")}</div>
                    </List.Item>
                )}
            />

            {/*List 组件：
loading={loading}：如果 loading 为 true，则列表显示加载状态。
dataSource={favorites}：数据源为 favorites（数组类型）。*/}

            {/*List里面写分页组件 current：当前页码，来源于 pagination.current。
pageSize：每页显示条数，来源于 pagination.pageSize。
total：总数据量，来源于 pagination.total。
onChange：页码变化时触发回调，调用 fetchFavorites 方法并传入 currentTab 和页码。
*/}

            {/*renderItem
            定义列表每一项的渲染方式。
item 是数据源中的每个元素。
List.Item：表示列表项。
List.Item.Meta：
title={item.question.title}：显示题目的标题。
description={${item.question.content?.substring(0, 20)}...}：
显示题目内容的前 20 个字符，后加省略号。
使用可选链（?.）避免 item.question.content 为 null 时抛出错误。
div：
样式：右对齐显示创建时间。
显示创建时间：{item.createTime}。*/}

        </>
    )

    //那么问题应该出在渲染。。
    return (
        <Tabs defaultActiveKey="0" onChange={handleTabChange}>
            {/*Tabs 是 Ant Design 的选项卡组件，用于在不同的选项卡间切换。
defaultActiveKey="0"：设置默认激活的选项卡为 key 为 "0" 的选项卡。
onChange={handleTabChange}：当选项卡切换时，触发 handleTabChange 函数（函数逻辑应在组件外定义）*/}

            {/*抽象出来了公共的部分*/}
            <TabPane tab="默认收藏夹" key="0">
                <RenderTabContent />
            </TabPane>
            <TabPane tab="已掌握" key="1">
                <RenderTabContent />
            </TabPane>
            <TabPane tab="易错" key="2">
                <RenderTabContent />
            </TabPane>


        </Tabs>
    );
};

export default FavoriteTabs;
