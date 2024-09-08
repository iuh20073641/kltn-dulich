import { fetchRooms } from "../api/room";

export const getAllRooms = async () => {
    try {
        const response = await fetchRooms();
        return response.data; // Xử lý dữ liệu nếu cần thiết
    } catch (error) {
        console.error('Error fetching rooms:', error);
        throw error; // Xử lý lỗi tùy theo nhu cầu của bạn
    }
};