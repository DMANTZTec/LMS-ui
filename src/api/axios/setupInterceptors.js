import axiosInstance from "./axiosInstance";

import {
  requestInterceptor,
  requestError,
} from "./requestInterceptor";

import {
  responseInterceptor,
  responseError,
} from "./responseInterceptor";

// Request Interceptor
axiosInstance.interceptors.request.use(
  requestInterceptor,
  requestError
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  responseInterceptor,
  responseError
);

export default axiosInstance;