import { EnrollmentBatchControllerApi } from './openApi';
import axiosInstance from './axios/setupInterceptors';

export const enrollmentBatchApi = new EnrollmentBatchControllerApi(undefined, undefined, axiosInstance);
