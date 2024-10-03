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

// Ví dụ hàm gọi API để lấy danh sách tours
export const fetchTours = () => {
  return api.get('/select_tours.php');
};

// hàm gọi API để lấy thông tin chi tiết tours
export const fetchTourDetails = (tourId) => {
  return api.get(`/tour_details.php?idtour=${tourId}`);
};

// hàm gọi API để lấy thông tin chi tiết lịch trình của một tour
export const fetchTourSchedule = (tourId) => {
  return api.get(`/tour_schedule.php?idtour=${tourId}`);
};

// hàm gọi API để lấy thông tin đánh giá của một tour
export const fetchTourRating = (tourId) => {
  return api.get(`/rating_tour.php?tourid=${tourId}`);
};