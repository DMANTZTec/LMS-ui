import { CourseManagementControllerApi } from "./openApi";
import axiosInstance from './axios/setupInterceptors';

export const api = new CourseManagementControllerApi(undefined, undefined, axiosInstance);