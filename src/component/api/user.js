// import { Component } from "react";
import axios from 'axios';
// import React, { useEffect, useState } from 'react';
import config from "../config.json"

const { SERVER_API } = config;

// Tạo instance của Axios
const api = axios.create({
  baseURL: `${SERVER_API}`,
  timeout: 10000, // Thời gian chờ 10 giây
  headers: { 'Content-Type': 'application/json' }
});

// api kiểm tra tài khoản user đã tồn tại chưa
export const checkUser = (mail, phone) => {
  return api.get(`/check-client.php?email=${mail}&phonenum=${phone}`);
};

// api thêm cài khoản user mới
export const register = (name, mail, phone, image, address, birthDay, pass) => {
  return api.post(`/register.php?name=${name}&mail=${mail}&phone=${phone}&image=${image}&address=${address}&birthDate=${birthDay}&pass=${pass}`);
};

// api login
export const login = (mailPhone, pass) => {
  return api.get(`/login.php?mail_phone=${mailPhone}&pass=${pass}`);
};

// api team_details (about)
export const teamDetail = () => {
  return api.get(`/about.php`);
};

// api lấy toàn bộ thông tin tài khoản người dùng
export const selectAllUsers = () => {
  return api.get(`/admin/get_usernd.php`);
};

// api lấy toàn bộ thông tin của một người dùng
export const getUsersData = (iduser) => {
  return api.get(`/get_user_by_id.php?userid=${iduser}`);
};

// api tìm kiếm người dùng qua từ khóa
export const getUsersDataByKey = (key) => {
  return api.get(`/admin/find_user.php?info_user=${key}`);
};

// api lấy danh sách nhân viên
export const getListHdv = (day_depar, timetour) => {
  return api.get(`/admin/get_list_hdv.php?day_depart=${day_depar}&timetour=${timetour}`);
};