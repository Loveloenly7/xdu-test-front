// @ts-ignore
/* eslint-disable */
import request from "@/libs/request";

/** addInterviewRecordDetail POST /api/interviewRecordDetail/add */
export async function addInterviewRecordDetailUsingPost(
  body: API.InterviewRecordDetailAddRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseLong_>("/api/interviewRecordDetail/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** batchAddInterviewRecordDetails POST /api/interviewRecordDetail/batchAdd */
export async function batchAddInterviewRecordDetailsUsingPost(
  body: API.InterviewRecordDetailBatchAddRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseListLong_>(
    "/api/interviewRecordDetail/batchAdd",
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

/** batchGetInterviewRecordDetails POST /api/interviewRecordDetail/batchGet */
export async function batchGetInterviewRecordDetailsUsingPost(
  body: API.InterviewRecordDetailBatchGetRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseListInterviewRecordDetail_>(
    "/api/interviewRecordDetail/batchGet",
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

/** deleteInterviewRecordDetail POST /api/interviewRecordDetail/delete */
export async function deleteInterviewRecordDetailUsingPost(
  body: API.DeleteRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>(
    "/api/interviewRecordDetail/delete",
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

/** batchDeleteInterviewRecordDetails POST /api/interviewRecordDetail/delete/batch */
export async function batchDeleteInterviewRecordDetailsUsingPost(
  body: API.InterviewRecordDetailBatchDeleteRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>(
    "/api/interviewRecordDetail/delete/batch",
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

/** editInterviewRecordDetail POST /api/interviewRecordDetail/edit */
export async function editInterviewRecordDetailUsingPost(
  body: API.InterviewRecordDetailEditRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>("/api/interviewRecordDetail/edit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** getInterviewRecordDetailVOById GET /api/interviewRecordDetail/get/vo */
export async function getInterviewRecordDetailVoByIdUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getInterviewRecordDetailVOByIdUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseInterviewRecordDetailVO_>(
    "/api/interviewRecordDetail/get/vo",
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** listInterviewRecordDetailByPage POST /api/interviewRecordDetail/list/page */
export async function listInterviewRecordDetailByPageUsingPost(
  body: API.InterviewRecordDetailQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageInterviewRecordDetail_>(
    "/api/interviewRecordDetail/list/page",
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

/** listInterviewRecordDetailVOByPage POST /api/interviewRecordDetail/list/page/vo */
export async function listInterviewRecordDetailVoByPageUsingPost(
  body: API.InterviewRecordDetailQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageInterviewRecordDetailVO_>(
    "/api/interviewRecordDetail/list/page/vo",
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

/** listMyInterviewRecordDetailVOByPage POST /api/interviewRecordDetail/my/list/page/vo */
export async function listMyInterviewRecordDetailVoByPageUsingPost(
  body: API.InterviewRecordDetailQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageInterviewRecordDetailVO_>(
    "/api/interviewRecordDetail/my/list/page/vo",
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

/** updateInterviewRecordDetail POST /api/interviewRecordDetail/update */
export async function updateInterviewRecordDetailUsingPost(
  body: API.InterviewRecordDetailUpdateRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>(
    "/api/interviewRecordDetail/update",
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
