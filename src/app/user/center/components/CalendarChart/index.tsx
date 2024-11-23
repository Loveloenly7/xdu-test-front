import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import dayjs from "dayjs";
import { message } from "antd";
import { getUserSignInRecordUsingGet } from "@/api/userController";
import "./index.css";

/*React 和 useEffect, useState：用于 React 组件的基本功能。
ReactECharts：用于在 React 中展示 ECharts 图表。
dayjs：轻量级日期处理库，用于处理日期和时间。
message：来自 Ant Design 的消息提示组件，用于显示操作反馈。
getUserSignInRecordUsingGet：从后端获取用户签到记录的 API 函数。
"./index.css"：样式文件，用于自定义组件样式。*/

interface Props {}

/*定义了一个空的 Props 接口，表示该组件没有额外的属性
 * 但是这样 数据又从何而来呢*/

/**
 * 刷题日历图
 * @param props
 * @constructor
 */
const CalendarChart = (props: Props) => {
  const {} = props;

  /*定义了一个名为 CalendarChart 的函数式组件，接收 props，但此处没有使用任何 props。*/

  // 签到日期列表（[1, 200]，表示第 1 和第 200 天有签到记录）
  const [dataList, setDataList] = useState<number[]>([]);

  // 当前年份
  const year = new Date().getFullYear();

  /*
  dataList：状态变量，存储用户的签到记录，类型为一个数组（签到的天数）。
year：获取当前年份。*/

  /*巧妙得到 根据后端存的有限数据得到无限的。。？*/

  // 请求后端获取数据
  const fetchDataList = async () => {
    try {
      const res = await getUserSignInRecordUsingGet({
        year,
      });
      setDataList(res.data);
    } catch (e) {
      message.error("获取刷题签到记录失败，" + e.message);
    }
  };

  /*fetchDataList：异步函数，调用后端 API getUserSignInRecordUsingGet 获取指定年份的用户签到记录。
如果请求成功，调用 setDataList 更新 dataList。
如果请求失败，使用 Ant Design 的 message.error 提示错误信息。*/

  // 保证只会调用一次
  useEffect(() => {
    fetchDataList();
  }, []);

  // 计算图表所需的数据
  const optionsData = dataList.map((dayOfYear) => {
    // 计算日期字符串
    const dateStr = dayjs(`${year}-01-01`)
      .add(dayOfYear - 1, "day")
      .format("YYYY-MM-DD");
    console.log(dateStr);
    return [dateStr, 1];
  });
  // todo 这里就是算法设计带来的好处！

  /*optionsData：处理签到数据，将每一天的签到数据转化为图表所需的格式。
dayOfYear：从后端返回的签到天数（例如，1 表示一年中的第一天，200 表示第 200 天）。
dayjs(${year}-01-01)：构造当前年份的第一天。
.add(dayOfYear - 1, "day")：根据签到天数 dayOfYear 计算出该日期。
.format("YYYY-MM-DD")：将日期格式化为 YYYY-MM-DD 的字符串。
最后，将日期和签到标记（1）作为数组返回，构成图表数据。
bitmap！
*/

  // 图表配置
  /*todo 这里可以把图表换个样式 不一定要github的那种*/
  const options = {
    visualMap: {
      show: false,
      min: 0,
      max: 1,
      inRange: {
        // 颜色从灰色到浅绿色
        color: ["#efefef", "lightgreen"],
      },
    },
    calendar: {
      range: year,
      left: 20,
      // 单元格自动宽度，高度为 16 像素
      cellSize: ["auto", 16],
      yearLabel: {
        position: "top",
        formatter: `您的${year} 年刷题记录`,
      },
    },
    series: {
      type: "heatmap",
      coordinateSystem: "calendar",
      data: optionsData,
    },
  };

  /*options：ECharts 图表配置对象，定义了图表的视觉效果和展示方式。
visualMap：
控制颜色的范围，min: 0 和 max: 1 表示数据值从 0 到 1 映射到颜色。这里的颜色范围是从灰色到浅绿色，表示用户的签到状态（未签到为灰色，已签到为绿色）。
calendar：
定义日历的显示方式。range: year 表示显示指定年份的日历。
cellSize: ["auto", 16] 设置单元格的高度为 16 像素，宽度自动调整。
yearLabel 设置年份标签的位置和格式。
series：
设置图表的类型为 heatmap（热力图），并指定 coordinateSystem 为 calendar，表示这是一个日历热力图。
data: optionsData 设置热力图的数据源。*/

  return <ReactECharts className="calendar-chart" option={options} />;
};

export default CalendarChart;
