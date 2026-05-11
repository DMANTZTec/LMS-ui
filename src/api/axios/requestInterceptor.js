const requestInterceptor = (config) => {
  console.log("Request Interceptor");

  // Get token from localStorage
  const token = localStorage.getItem("token");

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