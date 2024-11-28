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
