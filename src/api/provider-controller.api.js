import { ProviderControllerApi } from './openApi';
import axiosInstance from './axios/setupInterceptors';

export const providerApi = new ProviderControllerApi(undefined, undefined, axiosInstance);