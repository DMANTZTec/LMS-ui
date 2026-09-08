import { EnrollmentControllerApi } from './openApi';
import axiosInstance from './axios/setupInterceptors';

export const enrollmentApi = new EnrollmentControllerApi(undefined, undefined, axiosInstance);
