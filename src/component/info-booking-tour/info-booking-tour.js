import Header from "../header";
import Footer from "../footer/footer";
import PriceDisplay from "../service/money";
import { fetchBookingRecordTourByUser } from "../api/tours";
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
// import { useSearchParams } from 'react-router-dom';

function InfoBookingTour() {

    const [newBookings, setNewBookings] = useState([]);
    // const [error, setError] = useState(null);

    useEffect(() => {
        // Hàm gọi API
        const fetchBookingData = async () => {
            const userData = localStorage.getItem('user');

            const user = JSON.parse(userData);
            console.log("User ID:", user.id); // Lấy ID người dùng

            try {
                const response = await fetchBookingRecordTourByUser(user.id);

                if (response.data.status === 'success') {
                    setNewBookings(response.data.data); // Lưu kết quả booking data
                    console.log('Booking Data:', response.data.data);
                } else {
                    console.log(response.data.message);
                }
            } catch (err) {
                console.error("Error fetching booking data:", err);
            }
        };

        fetchBookingData();
    }, []); // Gọi lại khi userId thay đổi

    // hủy đơn đặt tour
    const cancelBookingTour = (bookingId) => {
        console.log(bookingId);
        // if (window.confirm('Bạn có chắc chắn muốn xóa phòng này?')) {
        fetch('http://localhost:88/api_travel/api/admin/cancel_booking_tour.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                cancel_booking: true, // Thêm biến này để kích hoạt điều kiện trong PHP
                booking_id: bookingId
            }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') { // Kiểm tra 'success' thay vì 'status'
                    toast.success(data.message);
                } else {
                    toast.error(data.message);
                }
            })
            .catch(error => {
                toast.error('Lỗi.');
                console.log('Có lỗi xảy ra:', error);
            });
    };

    // if (error) return <div>Error: {error.message}</div>;

    return (
        <div>
            <Header />

            <div className="min-h-screen mt-[130px] bg-gray-100">
                <div className="uppercase text-2xl font-semibold text-left ml-5 pt-11">Trạng thái đơn</div>
                <div className="w-[90%] grid grid-cols-4 gap-2 mt-11 mx-auto">
                    {Array.isArray(newBookings) && newBookings.length > 0 ? (
                        newBookings.map((newBooking) => (
                            <div className="booking h-[330px] bg-white rounded-sm text-left" key={newBooking.booking_id}>
                                <div className="font-semibold text-xl mx-3 mt-2 mb-3">{newBooking.user_name}</div>
                                <div className="flex mx-3">
                                    <div className="font-semibold">Giá tour:</div>
                                    <div className="ml-2"><PriceDisplay price={newBooking.price} /></div>
                                </div>
                                <div className="flex mx-3">
                                    <div className="font-semibold">Tổng tiền:</div>
                                    <div className="ml-2"><PriceDisplay price={newBooking.total_pay} /></div>
                                </div>
                                <div className="flex mx-3">
                                    <div className="font-semibold">Mã đơn:</div>
                                    <div className="ml-2">{newBooking.booking_id}</div>
                                </div>
                                <div className="flex mx-3">
                                    <div className="font-semibold">Mã thanh toán:</div>
                                    <div className="ml-2">{newBooking.order_id}</div>
                                </div>
                                <div className=" mx-3">
                                    <div className="font-semibold">Thời gian thanh toán:</div>
                                    <div className="ml-2">{newBooking.datetime}</div>
                                </div>
                                {newBooking.refund === 1 && newBooking.arrival === 0 ? (
                                    <div className="flex">
                                        <div className="ml-3 mb-3 mt-4 w-[70px] py-[2px] bg-[#dc3545] text-center rounded-md text-white text-xs font-semibold">
                                            <p className="px-2 py-1 text-center">Đã hủy</p>
                                        </div>
                                        <div className="ml-3 mb-3 mt-4 w-[120px] py-[2px] bg-[#198754] text-center rounded-md text-white text-xs font-semibold">
                                            <p className="px-2 py-1 text-center">Đã hoàn tiền</p>
                                        </div>
                                    </div>
                                ) : newBooking.refund === null && newBooking.arrival === 0 && newBooking.order_id === null ? (
                                    <div>
                                        <div className="flex gap-2">
                                            <div className="ml-3 mb-3 mt-4 w-[110px] py-[2px] bg-[#198754] text-center rounded-md text-white text-xs font-semibold">
                                                <p className="px-2 py-1 text-center">Chờ xác nhận</p>
                                            </div>
                                            <div className=" mb-3 mt-4 w-[130px] py-[2px] bg-[#198754] text-center rounded-md text-white text-xs font-semibold">
                                                <p className="px-2 py-1 text-center">Chưa thanh toán</p>
                                            </div>
                                        </div>
                                        <div className="text-gray-400 text-xs text-center mb-2">Bạn cần thanh toán trong vòng 24h kể từ lúc đặt tour</div>
                                        <div className="ml-[3px]">
                                            <button type="button" onClick={() => cancelBookingTour(newBooking.booking_id)} className="w-[90px] bg-[#dc3545] hover:bg-[#cf3a49] mx-2 inline-block align-middle text-center select-none border font-normal whitespace-no-wrap rounded py-1 px-3 leading-normal no-underline custom-bg text-white shadow-none">
                                                <p className="text-sm font-semibold">Hủy tour</p>
                                            </button>
                                            <button type="button" onClick={() => cancelBookingTour(newBooking.booking_id)} className="w-[110px] bg-[#0d6efd] hover:bg-[#285394] mx-2 inline-block align-middle text-center select-none border font-normal whitespace-no-wrap rounded py-1 px-3 leading-normal no-underline custom-bg text-white shadow-none">
                                                <p className="text-sm font-semibold">Thanh toán</p>
                                            </button>
                                        </div>
                                    </div>
                                ) : newBooking.refund === null && newBooking.arrival === 1 ? (
                                    <div>
                                        <div className="mx-3 mb-3 mt-4 w-[100px] py-[2px] bg-[#198754] text-center rounded-md text-white text-xs font-semibold">
                                            <p className="px-2 py-1 text-center">Đã xác nhận</p>
                                        </div>
                                        <div className="flex mb-3 gap-2">
                                            <div className="w-[45%]">
                                                <button type="submit" className="w-full bg-black mx-2 inline-block align-middle text-center select-none border font-normal whitespace-no-wrap rounded py-1 px-3 leading-normal no-underline custom-bg text-white shadow-none">
                                                    <p className="text-sm">PDF</p>
                                                </button>
                                            </div>
                                            <div className="w-[45%]">
                                                <button type="submit" className="w-full bg-black mx-2 inline-block align-middle text-center select-none border font-normal whitespace-no-wrap rounded py-1 px-3 leading-normal no-underline custom-bg text-white shadow-none">
                                                    <p className="text-sm">Đánh giá</p>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : newBooking.refund === 1 && newBooking.arrival === 1 ? (
                                    <div className="mx-3 mb-3 mt-4 w-[70px] py-[2px] bg-[#dc3545] text-center rounded-md text-white text-xs font-semibold">
                                        <p className="px-2 py-1 text-center">Đã hủy</p>
                                    </div>
                                ) : newBooking.refund === 0 && newBooking.arrival === 0 ? (
                                    <div className="flex">
                                        <div className="ml-3 mb-3 mt-4 w-[70px] py-[2px] bg-[#dc3545] text-center rounded-md text-white text-xs font-semibold">
                                            <p className="px-2 py-1 text-center">Đã hủy</p>
                                        </div>
                                        <div className="ml-3 mb-3 mt-4 w-[120px] py-[2px] bg-[#198754] text-center rounded-md text-white text-xs font-semibold">
                                            <p className="px-2 py-1 text-center">Chưa hoàn tiền</p>
                                        </div>
                                    </div>
                                ) : newBooking.refund === 0 && newBooking.arrival === 1 ? (
                                    <div className="flex">
                                        <div className="ml-3 mb-3 mt-4 w-[70px] py-[2px] bg-[#dc3545] text-center rounded-md text-white text-xs font-semibold">
                                            <p className="px-2 py-1 text-center">Đã hủy</p>
                                        </div>
                                        <div className="ml-3 mb-3 mt-4 w-[120px] py-[2px] bg-[#198754] text-center rounded-md text-white text-xs font-semibold">
                                            <p className="px-2 py-1 text-center">Chưa hoàn tiền</p>
                                        </div>
                                    </div>
                                ) : null}
                                
                            </div>
                        ))
                    ) : (
                        <p className="text-center">Bạn chưa đặt tour</p>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    )
}
export default InfoBookingTour;