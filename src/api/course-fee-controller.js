import { CourseFeeControllerApi } from './openApi';
import axiosInstance from './axios/setupInterceptors';

export const feeApi= new CourseFeeControllerApi(undefined, undefined, axiosInstance);