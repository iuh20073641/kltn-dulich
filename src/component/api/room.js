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

// api lấy tất cả thông tin của bảng feature
export const fetchFeatures = () => {
  return api.get(`/admin/get_features.php`);
};

// api lấy tất cả thông tin của bảng facilities
export const fetchFacilities = () => {
  return api.get(`/admin/get_facilities.php`);
};

// api lấy tất cả thông tin của mọt phòng theo id
export const fetchRoomDetails = (roomId) => {
  return api.get(`/room-details.php?roomid=${roomId}`);
};

// api thêm thông tin phòng khách sạn
export const insertRoom = () => {
  return api.post(`/admin/create-room.php`);
};
// api xóa phòng khách sạn
// export const deleteRoom = (room_id) => {
//   return api.delete(`/admin/delete_room.php`);
//   // return axios.delete(`/admin/delete_room.php`, {
//   //   params: { room_id }
//   // });
// };
    