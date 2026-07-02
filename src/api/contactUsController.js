import { ContactUsControllerApi } from './openApi';
import axiosInstance from './axios/setupInterceptors';

export const contactUsApi = new ContactUsControllerApi(undefined, undefined, axiosInstance);