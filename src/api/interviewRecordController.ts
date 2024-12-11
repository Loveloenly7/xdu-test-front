// @ts-ignore
/* eslint-disable */
import request from "@/libs/request";

/** addInterviewRecord POST /api/interviewRecord/add */
export async function addInterviewRecordUsingPost(
  body: API.InterviewRecordAddRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseLong_>("/api/interviewRecord/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** batchAddInterviewRecords POST /api/interviewRecord/batchAdd */
export async function batchAddInterviewRecordsUsingPost(
  body: API.InterviewRecordBatchAddRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseListLong_>("/api/interviewRecord/batchAdd", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** batchGetInterviewRecords POST /api/interviewRecord/batchGet */
export async function batchGetInterviewRecordsUsingPost(
  body: API.InterviewRecordBatchGetRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseListInterviewRecord_>(
    "/api/interviewRecord/batchGet",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}

/** deleteInterviewRecord POST /api/interviewRecord/delete */
export async function deleteInterviewRecordUsingPost(
  body: API.DeleteRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>("/api/interviewRecord/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** batchDeleteInterviewRecords POST /api/interviewRecord/delete/batch */
export async function batchDeleteInterviewRecordsUsingPost(
  body: API.InterviewRecordBatchDeleteRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>(
    "/api/interviewRecord/delete/batch",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}

/** getInterviewRecordVOById GET /api/interviewRecord/get/vo */
export async function getInterviewRecordVoByIdUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getInterviewRecordVOByIdUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseInterviewRecordVO_>(
    "/api/interviewRecord/get/vo",
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** listInterviewRecordByPage POST /api/interviewRecord/list/page */
export async function listInterviewRecordByPageUsingPost(
  body: API.InterviewRecordQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageInterviewRecord_>(
    "/api/interviewRecord/list/page",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}

/** listInterviewRecordVOByPage POST /api/interviewRecord/list/page/vo */
export async function listInterviewRecordVoByPageUsingPost(
  body: API.InterviewRecordQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageInterviewRecordVO_>(
    "/api/interviewRecord/list/page/vo",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}

/** listMyInterviewRecordVOByPage POST /api/interviewRecord/my/list/page/vo */
export async function listMyInterviewRecordVoByPageUsingPost(
  body: API.InterviewRecordQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageInterviewRecordVO_>(
    "/api/interviewRecord/my/list/page/vo",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}

/** updateInterviewRecord POST /api/interviewRecord/update */
export async function updateInterviewRecordUsingPost(
  body: API.InterviewRecordUpdateRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>("/api/interviewRecord/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
