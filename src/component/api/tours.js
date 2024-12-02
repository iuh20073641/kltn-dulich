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

// hàm gọi API để lấy thông tin chi tiết lịch trình của một tour
export const fetchTourDepart = (tourId) => {
  return api.get(`/get_tour_depart.php?tourid=${tourId}`);
};

// hàm gọi API để lấy thông tin chi tiết lịch trình của một tour
export const fetchDayDepart = (departId) => {
  return api.get(`/get_day_depart.php?departid=${departId}`);
};

// hàm gọi API để lấy thông tin đánh giá của một tour
export const fetchTourRating = (tourId) => {
  return api.get(`/rating_tour.php?tourid=${tourId}`);
};

// api lấy tất cả hình ảnh của một tour theo id
export const fetchTourImages = (tourId) => {
  return api.get(`/admin/get_tour_images.php?tourid=${tourId}`);
};

// api lấy hình ảnh tour thumb của một tour theo id
export const fetchTourThumb = (tourId) => {
  return api.get(`/get_tour_thumb.php?tourid=${tourId}`);
};

// api lấy tất cả thông tin new booking tour
export const fetchNewBookingTour = () => {
  return api.get(`/admin/get_new_booking_tour.php`);
};

// api lấy tất cả thông tin đơn đặt tour bị hủy
export const fetchRefundBookingTour = () => {
  return api.get(`/admin/get_refund_booking_tour.php`);
};

// api lấy tất cả thông tin lịch sử đặt tour
export const fetchBookingRecordTour = () => {
  return api.get(`/admin/get_booking_records_tour.php`);
};

// api lấy tất cả đơn đặt tour
export const fetchAllBookingTour = () => {
  return api.get(`/admin/get_all_booking.php`);
};

// api lấy tất cả thông tin lịch sử đặt tour
export const fetchApprovedApplicationTour = () => {
  return api.get(`/admin/get_approved_application.php`);
};

// api lấy tất cả thông tin lịch sử đặt tour
export const fetchBookingRecordTourByUser = (userId) => {
  return api.post(`/get_booking_user.php`, {
    user_id: userId, // Truyền user_id trong body
  });
};

// api lấy tất cả thông tin của một đơn đặt tour
export const fetchBookingApprovedApplicationTourById = (bookingId) => {
  return api.post(`/admin/get_approved_application_details.php`, {
    booking_id: bookingId, // Truyền booking_id trong body
  });
};

// api lấy tất cả thông tin của một đơn đặt tour
export const fetchBookingRecordTourById = (bookingId) => {
  return api.post(`/admin/get_booking_record_tour_details.php`, {
    booking_id: bookingId, // Truyền booking_id trong body
  });
};

// api lấy tất cả thông tin của tất cả tour tìm kiếm theo yêu cầu
export const fetchTourSeachFull = (destination, selectedDate, selectedPrice) => {
  return api.get(`get_tour_seach_full.php?destination=${destination}&date=${selectedDate}&priceRange=${selectedPrice}`);
};

// api lấy tất cả thông tin tour theo loại tìm kiếm theo yêu cầu
export const fetchTourSeach = (destination, selectedDate, selectedPrice, style) => {
  return api.get(`get_tour_seach.php?destination=${destination}&date=${selectedDate}&priceRange=${selectedPrice}&style=${style}`);
};

// api lấy tất cả thông tin tour có giảm giá tìm kiếm theo yêu cầu
export const fetchTourDiscountSeach = (destination, selectedDate, selectedPrice) => {
  return api.get(`get_tour_discount_seach.php?destination=${destination}&date=${selectedDate}&priceRange=${selectedPrice}`);
};

// api lấy thông tin người tham gia của đơn đặt tour
export const fetchParticipantsTourByBookingid = (bookingId) => {
  return api.post(`/admin/get_participant_by_bookingId.php`, {
    booking_id: bookingId, // Truyền booking_id trong body
  });
};

// api lấy thông tin người tham gia của đơn đặt tour
export const fetchBookingByQrcode = (bookingId) => {
  return api.post(`/admin/qr_code.php`, {
    booking_id: bookingId, // Truyền booking_id trong body
  });
};

// api lấy tất cả thông tin user queries
export const fetchUserQueries = () => {
  return api.get(`/admin/get-user-query.php`);
};

// api lấy tất cả thông tin rating tour
export const fetchAllTourRating = () => {
  return api.get(`/admin/get_rating_tour.php`);
};

// api lấy thông tin phương tiện theo id_depart
export const fetchVehicleByIddepart = (tourId) => {
  return api.get(`/get_vehicle_tour.php?id_depart=${tourId}`);
};

// api lấy thông tin nơi ở đặt cọc theo id_depart
export const fetchHotelByIddepart = (tourId) => {
  return api.get(`/admin/get_deposit_hotel.php?id_depart=${tourId}`);
};

// api lấy thông tin số lượng đơn đã đặt
export const fetchCheckBookingOrder = (departure_Id) => {
  return api.get(`/check_booking_tour_bydepartId.php?depart_id=${departure_Id}`);
};

// api lấy thông tin lịch trình tour theo id lịch trình
export const fetchDataScheduleTourByIdtour = (schedule_id) => {
  return api.get(`/admin/get_tour_schedule_byId.php?id_schedule=${schedule_id}`);
};