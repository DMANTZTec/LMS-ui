const responseInterceptor = (response) => {
  console.log("Response Interceptor");

  return response;
};

const responseError = (error) => {
  if (error.response?.status === 401) {
    console.error("Unauthorized - Token Expired");

    // Remove invalid token
    localStorage.removeItem("token");

    // Redirect to login
    window.location.href = "/login";
  }

  return Promise.reject(error);
};

export { responseInterceptor, responseError };