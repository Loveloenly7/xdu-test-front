// @ts-ignore
/* eslint-disable */
import request from "@/libs/request";

/** actionCrawler POST /api/crawler/name */
export async function actionCrawlerUsingPost(
  body: API.CrawlerRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseString_>("/api/crawler/name", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
