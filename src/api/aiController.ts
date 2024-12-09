// @ts-ignore
/* eslint-disable */
import request from "@/libs/request";

/** aiGenerateRP POST /api/ai/RP */
export async function aiGenerateRpUsingPost(
  body: API.AiRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseString_>("/api/ai/RP", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** aiGenerateTestQuery GET /api/ai/test1 */
export async function aiGenerateTestQueryUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.aiGenerateTestQueryUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseString_>("/api/ai/test1", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** aiGenerateTestJson POST /api/ai/test2 */
export async function aiGenerateTestJsonUsingPost(
  body: API.AiJsonRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseString_>("/api/ai/test2", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** aiGenerateTestMQ POST /api/ai/test3 */
export async function aiGenerateTestMqUsingPost(
  body: API.AiRepRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseString_>("/api/ai/test3", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** aiGenerateTJ POST /api/ai/TJ */
export async function aiGenerateTjUsingPost(
  body: API.AiRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseString_>("/api/ai/TJ", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** aiGenerateTM POST /api/ai/TM */
export async function aiGenerateTmUsingPost(
  body: API.AiRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseString_>("/api/ai/TM", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** aiGenerateXTJ POST /api/ai/XTJ */
export async function aiGenerateXtjUsingPost(
  body: API.AiRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseString_>("/api/ai/XTJ", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
