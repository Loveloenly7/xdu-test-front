// @ts-ignore
/* eslint-disable */
import request from "@/libs/request";

/** addComment POST /api/comment/add */
export async function addCommentUsingPost(
  body: API.CommentAddRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseLong_>("/api/comment/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** batchAddComments POST /api/comment/batchAdd */
export async function batchAddCommentsUsingPost(
  body: API.CommentBatchAddRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseListLong_>("/api/comment/batchAdd", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** batchGetComments POST /api/comment/batchGet */
export async function batchGetCommentsUsingPost(
  body: API.CommentBatchGetRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseListComment_>("/api/comment/batchGet", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** deleteComment POST /api/comment/delete */
export async function deleteCommentUsingPost(
  body: API.DeleteRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>("/api/comment/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** batchDeleteComments POST /api/comment/delete/batch */
export async function batchDeleteCommentsUsingPost(
  body: API.CommentBatchDeleteRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>("/api/comment/delete/batch", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** getCommentVOById GET /api/comment/get/vo */
export async function getCommentVoByIdUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getCommentVOByIdUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseCommentVO_>("/api/comment/get/vo", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** listCommentByPage POST /api/comment/list/page */
export async function listCommentByPageUsingPost(
  body: API.CommentQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageComment_>("/api/comment/list/page", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** listCommentVOByPage POST /api/comment/list/page/vo */
export async function listCommentVoByPageUsingPost(
  body: API.CommentQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageCommentVO_>("/api/comment/list/page/vo", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** listMyCommentVOByPage POST /api/comment/my/list/page/vo */
export async function listMyCommentVoByPageUsingPost(
  body: API.CommentQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageCommentVO_>(
    "/api/comment/my/list/page/vo",
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

/** updateComment POST /api/comment/update */
export async function updateCommentUsingPost(
  body: API.CommentUpdateRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>("/api/comment/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
