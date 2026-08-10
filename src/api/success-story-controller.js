import { SuccessStoryControllerApi } from './openApi'; 
import axiosInstance from './axios/setupInterceptors';

export const  SuccessApi= new SuccessStoryControllerApi(undefined, undefined, axiosInstance);