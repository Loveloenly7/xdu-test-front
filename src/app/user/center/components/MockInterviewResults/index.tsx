//todo 展示面试的结果页面

import React, { useEffect, useState } from "react";
import { List, Button, Pagination, message } from "antd";
import { getMockInterviewResults } from "@/api/mockInterviewController"; // 假设后端接口

interface InterviewResult {
  id: number;
  title: string;
  summary: string; // 面试总结
}

const MockInterviewResults: React.FC = () => {
  const [results, setResults] = useState<InterviewResult[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);

  const fetchResults = async (page: number) => {
    try {
      const res = await getMockInterviewResults({ page, pageSize: 10 });
      setResults(res.data.records || []);
      setTotal(res.data.total || 0);
    } catch (e) {
      message.error("加载面试结果失败");
    }
  };

  useEffect(() => {
    fetchResults(currentPage);
  }, [currentPage]);

  return (
    <div>
      <List
        itemLayout="horizontal"
        dataSource={results}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Button
                type="link"
                onClick={() => {
                  // 跳转到面试结果分析页面
                  window.location.href = `/mockInterview/${item.id}`;
                }}
              >
                查看详情
              </Button>,
            ]}
          >
            <List.Item.Meta
              title={item.title}
              description={
                item.summary.length > 20
                  ? item.summary.slice(0, 20) + "..."
                  : item.summary
              }
            />
          </List.Item>
        )}
      />
      <Pagination
        current={currentPage}
        total={total}
        pageSize={10}
        onChange={(page) => setCurrentPage(page)}
        style={{ marginTop: 16, textAlign: "center" }}
      />
    </div>
  );
};

export default MockInterviewResults;
