import axios from 'axios';
import config from "../config.json"

const { SERVER_API } = config;

// Tạo instance của Axios
const api = axios.create({
  baseURL: `${SERVER_API}`,
  timeout: 10000, // Thời gian chờ 10 giây
  headers: { 'Content-Type': 'application/json' }
});

// api kiểm tra tài khoản user đã tồn tại chưa
export const fetchSettings = () => {
    return api.get(`/admin/get-settings.php`);
};

// api lấy hình ảnh carousel
export const fetchCarouselImage = () => {
  return api.get(`/admin/get_carousel.php`);
};