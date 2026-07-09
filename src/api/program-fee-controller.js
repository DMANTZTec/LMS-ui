import { ProgramFeeControllerApi } from './openApi';
import axiosInstance from './axios/setupInterceptors';

export const programFeeApi= new ProgramFeeControllerApi(undefined, undefined, axiosInstance);