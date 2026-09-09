import { StudentTaskControllerApi } from './openApi';
import axiosInstance from './axios/setupInterceptors';

export const staskapi = new StudentTaskControllerApi(undefined, undefined, axiosInstance);
