import axiosInstance from "./axios/axiosInstance";

export const registerStudent = (data) =>
  axiosInstance.post("/student/register", data);

export const loginStudent = (data) =>
  axiosInstance.post("/student/login", data);

export const verifyOtp = (data) =>
  axiosInstance.post("/student/otp-verify", data);


export const forgotPassword = (data) =>
  axiosInstance.post("/student/forgot-password", data);

export const resetPassword = (data) =>
  axiosInstance.post("/student/reset-password", data);

export const updateStudent = (id, data) =>
  axiosInstance.put(`/student/update/${id}`, data);

export const getStudents = () =>
  axiosInstance.get("/student/view-students");