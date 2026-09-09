import { StudentDashboardControllerApi } from './openApi';
import axiosInstance from './axios/setupInterceptors';

export const dashboardApi = new StudentDashboardControllerApi(undefined, undefined, axiosInstance);
