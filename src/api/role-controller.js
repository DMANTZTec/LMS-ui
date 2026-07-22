import { RoleControllerApi } from './openApi'; 
import axiosInstance from './axios/setupInterceptors';

export const roleApi = new RoleControllerApi(undefined, undefined, axiosInstance);