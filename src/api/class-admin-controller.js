import { ClassAdminControllerApi } from './openApi';
import axiosInstance from './axios/setupInterceptors';

export const cAdminControllerApi= new ClassAdminControllerApi(undefined, undefined, axiosInstance);

