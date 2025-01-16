import axios, { Method, AxiosResponse, ResponseType } from "axios";

import apiLinks from "./api-links";

interface Options {
  url: ((al: typeof apiLinks) => string) | string;
  data?: object | string;
  params?: object;
  signal?: AbortSignal;
  contentType?: string;
  responseType?: ResponseType;
  // onUploadProgress: () => void;
  authorization?: string;
  routing?: string;
  token?: string;
  contentDisposition?: string;
}

interface FullOptions extends Options {
  method: Method;
}

const request = (arg: FullOptions): Promise<AxiosResponse> => {
  //const cookie = getCookie(CookiesName.NAME);
  const {
    method,
    contentType = "application/json",
    contentDisposition,
    url,
    data,
    params,
    signal,
    responseType = "json",
    authorization = `Bearer ${arg.token}`,
    token,
    routing,
  } = arg;

  const source = axios.CancelToken.source();
  if (signal) {
    signal.addEventListener("abort", () => {
      source.cancel();
    });
  }
  return axios.request({
    method,
    headers: {
      "content-type": contentType,
      Authorization: authorization,
    },
    url: typeof url === "string" ? url : url(apiLinks),
    data,
    params,
    responseType,
    cancelToken: source.token,
  });
};

const httpClient = {
  request,
  get: (arg: Options): Promise<AxiosResponse> => {
    return request({ ...arg, method: "GET", token: arg.token });
  },
  post: (arg: Options): Promise<AxiosResponse> => {
    return request({ ...arg, method: "POST", token: arg.token });
  },
  put: (arg: Options): Promise<AxiosResponse> => {
    return request({ ...arg, method: "PUT", token: arg.token });
  },
  patch: (arg: Options): Promise<AxiosResponse> => {
    return request({ ...arg, method: "PATCH", token: arg.token });
  },
  delete: (arg: Options): Promise<AxiosResponse> => {
    return request({ ...arg, method: "DELETE", token: arg.token });
  },
  option: (arg: Options): Promise<AxiosResponse> => {
    return request({ ...arg, method: "OPTIONS", token: arg.token });
  },
};

export default httpClient;
