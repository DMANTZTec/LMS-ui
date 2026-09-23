// claude code generated
import { clearAllStorage } from "@/utils/tokenUtility";

const responseInterceptor = (response) => {
  // claude code generated
  // console.log("Response Interceptor");

  return response;
};

const responseError = (error) => {
  if (error.response?.status === 401) {
    console.error("Unauthorized - Token Expired");

    // Remove invalid token
    // localStorage.removeItem("LmsJwTtoken");
    // claude code generated
    clearAllStorage();

    // Redirect to login
    window.location.href = "/";
  }

  return Promise.reject(error);
};

export { responseInterceptor, responseError };