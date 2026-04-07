

const responseInterceptor = (response) => {
  console.log("this is  Response Interceptor "); // optional logging
  return response;
};

const responseError = (error) => {
  if (error.response?.status === 401) {
    console.error("this is response interceptor with status 401.");
    // window.location.href = "/login";
  }

  console.error("this is response interceptor error.");
  return Promise.reject(error);
};

export { responseInterceptor, responseError };