import { SocialMediaControllerApi } from './openApi'; 
import axiosInstance from './axios/setupInterceptors';

export const socialmApi = new SocialMediaControllerApi(undefined, undefined, axiosInstance);