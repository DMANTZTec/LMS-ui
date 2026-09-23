// claude generated code
import { getToken } from "@/utils/tokenUtility";

const requestInterceptor = (config) => {
  // claude code generated
  // console.log("Request Interceptor");

  // Get token from the LmsJwTtokenAtom (jotai store)
  // claude generated code
  const token = getToken();


  // Attach token to Authorization header
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
};

const requestError = (error) => {
  console.error("Request Interceptor Error:", error);
  return Promise.reject(error);
};

export { requestInterceptor, requestError };