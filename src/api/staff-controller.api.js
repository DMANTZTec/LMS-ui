// import axiosInstance from "./axios/axiosInstance";

// export const loginStaff = (data) =>
//   axiosInstance.post("/staff/login", data);


import { StaffControllerApi } from './openApi';
import axiosInstance from './axios/setupInterceptors';

export const staffApi = new StaffControllerApi(undefined, undefined, axiosInstance);