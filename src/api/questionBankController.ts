// @ts-ignore
/* eslint-disable */
import request from "@/libs/request";

/** addQuestionBank POST /api/questionBank/add */
export async function addQuestionBankUsingPost(
  body: API.QuestionBankAddRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseLong_>("/api/questionBank/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** batchAddQuestionBanks POST /api/questionBank/batchAdd */
export async function batchAddQuestionBanksUsingPost(
  body: API.QuestionBankBatchAddRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseListLong_>("/api/questionBank/batchAdd", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** batchGetQuestionBanks POST /api/questionBank/batchGet */
export async function batchGetQuestionBanksUsingPost(
  body: API.QuestionBankBatchGetRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseListQuestionBank_>(
    "/api/questionBank/batchGet",
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

/** deleteQuestionBank POST /api/questionBank/delete */
export async function deleteQuestionBankUsingPost(
  body: API.DeleteRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>("/api/questionBank/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** batchDeleteQuestionBanks POST /api/questionBank/delete/batch */
export async function batchDeleteQuestionBanksUsingPost(
  body: API.QuestionBankBatchDeleteRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>("/api/questionBank/delete/batch", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** editQuestionBank POST /api/questionBank/edit */
export async function editQuestionBankUsingPost(
  body: API.QuestionBankEditRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>("/api/questionBank/edit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** getQuestionBankVOById GET /api/questionBank/get/vo */
export async function getQuestionBankVoByIdUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getQuestionBankVOByIdUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseQuestionBankVO_>("/api/questionBank/get/vo", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** listQuestionBankByPage POST /api/questionBank/list/page */
export async function listQuestionBankByPageUsingPost(
  body: API.QuestionBankQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageQuestionBank_>(
    "/api/questionBank/list/page",
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

/** listQuestionBankVOByPage POST /api/questionBank/list/page/vo */
export async function listQuestionBankVoByPageUsingPost(
  body: API.QuestionBankQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageQuestionBankVO_>(
    "/api/questionBank/list/page/vo",
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

/** listMyQuestionBankVOByPage POST /api/questionBank/my/list/page/vo */
export async function listMyQuestionBankVoByPageUsingPost(
  body: API.QuestionBankQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageQuestionBankVO_>(
    "/api/questionBank/my/list/page/vo",
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

/** updateQuestionBank POST /api/questionBank/update */
export async function updateQuestionBankUsingPost(
  body: API.QuestionBankUpdateRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>("/api/questionBank/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
