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

// Ví dụ hàm gọi API để lấy danh sách phòng
export const fetchRooms = () => {
  return api.get('/xem_phongks.php');
};

// api lấy thông tin feature của từng phòng
export const fetchRoomFeature = (roomId) => {
  return api.get(`/feature.php?roomid=${roomId}`);
};

// api lấy thông tin facilities của từng phòng
export const fetchRoomFacilities = (roomId) => {
  return api.get(`/facilities.php?roomid=${roomId}`);
};
    