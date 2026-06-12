import { StaffCourseControllerApi } from './openApi';
import axiosInstance from './axios/setupInterceptors';

export const staffcourseApi= new StaffCourseControllerApi(undefined, undefined, axiosInstance);

