import axiosInstance from "./axios/axiosInstance";

export const loginStaff = (data) =>
  axiosInstance.post("/staff/login", data);