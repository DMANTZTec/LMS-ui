import axiosInstance from "./axiosInstance";

export const loginStaff = (data) =>
  axiosInstance.post("/staff/login", data);