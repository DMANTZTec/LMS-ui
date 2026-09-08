import { InstructorDashboardControllerApi } from './openApi';
import axiosInstance from './axios/setupInterceptors';

export const instructorDashboardApi = new InstructorDashboardControllerApi(undefined, undefined, axiosInstance);