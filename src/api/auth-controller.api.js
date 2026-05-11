import { AuthControllerApi } from "./openApi";
import axiosInstance from './axios/setupInterceptors';

export const authapi= new AuthControllerApi(undefined, undefined, axiosInstance);