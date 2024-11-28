// @ts-ignore
/* eslint-disable */
import request from "@/libs/request";

/** addFavorite POST /api/favorite/add */
export async function addFavoriteUsingPost(
  body: API.FavoriteAddRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseLong_>("/api/favorite/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** deleteFavorite POST /api/favorite/delete */
export async function deleteFavoriteUsingPost(
  body: API.DeleteRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>("/api/favorite/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** getFavoriteVOById GET /api/favorite/get/vo */
export async function getFavoriteVoByIdUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getFavoriteVOByIdUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseFavoriteVO_>("/api/favorite/get/vo", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** listFavoriteByPage POST /api/favorite/list/page */
export async function listFavoriteByPageUsingPost(
  body: API.FavoriteQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageFavorite_>("/api/favorite/list/page", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** listFavoriteVOByPage POST /api/favorite/list/page/vo */
export async function listFavoriteVoByPageUsingPost(
  body: API.FavoriteQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageFavoriteVO_>(
    "/api/favorite/list/page/vo",
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

/** listMyFavoriteVOByPage POST /api/favorite/my/list/page/vo */
export async function listMyFavoriteVoByPageUsingPost(
  body: API.FavoriteQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageFavoriteVO_>(
    "/api/favorite/my/list/page/vo",
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

/** updateFavorite POST /api/favorite/update */
export async function updateFavoriteUsingPost(
  body: API.FavoriteUpdateRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>("/api/favorite/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
