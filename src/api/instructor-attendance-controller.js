import { InstructorAttendanceControllerApi } from './openApi';
import axiosInstance from './axios/setupInterceptors';

export const  InstructorAttendanceApi= new InstructorAttendanceControllerApi(undefined, undefined, axiosInstance);
