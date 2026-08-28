import { LearnerPathControllerApi } from "./openApi";
import axiosInstance from './axios/setupInterceptors';

export const  learnerPathapi= new LearnerPathControllerApi(undefined, undefined, axiosInstance);