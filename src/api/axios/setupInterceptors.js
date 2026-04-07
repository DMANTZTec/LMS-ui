
import axiosInstance from "./axiosInstance";
import { requestInterceptor, requestError } from "./requestInterceptor";
import { responseInterceptor, responseError } from "./responseInterceptor";

axiosInstance.interceptors.request.use(requestInterceptor, requestError);
axiosInstance.interceptors.response.use(responseInterceptor, responseError);

export default axiosInstance;