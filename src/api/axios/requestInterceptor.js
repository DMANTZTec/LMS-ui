
const requestInterceptor = (config) => {

  console.log("this is Request interceptor"); // optional logging
  return config;
};

const requestError = (error) => {
  console.error("this is Request interceptor Error:");
  return Promise.reject(error);
};

export { requestInterceptor, requestError };