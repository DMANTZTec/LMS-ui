import { StudentTaskSubmissionControllerApi } from './openApi';
import axiosInstance from './axios/setupInterceptors';

export const stasksubapi = new StudentTaskSubmissionControllerApi(undefined, undefined, axiosInstance);
