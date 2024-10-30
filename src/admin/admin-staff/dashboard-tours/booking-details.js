import { Link } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import { fetchAllBookingTour } from "../../../component/api/tours";
import PriceDisplay from "../../../component/service/money";
import FormatTime from "../../../component/service/fomat-time";
// import { toast } from "react-toastify";

function BookingDetails() {

    const [allBookings, setAllBookings] = useState([]);
    const [sortOrder, setSortOrder] = useState("asc"); // 'asc' for ascending, 'desc' for descending
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    // const [hasShownWarning, setHasShownWarning] = useState(false); // Chuyển thành state
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        // Hàm để gọi API và cập nhật state
        const allBookingData = async () => {
            try {
                // Gọi API để lấy danh sách phòng
                const allBookingResponse = await fetchAllBookingTour();
                const allBookingData = allBookingResponse.data; // Giả sử API trả về mảng các tour
                setAllBookings(allBookingData);

            } catch (err) {
                console.error('Error fetching data:', err);
            }
        };

        allBookingData();
    }, []); // Chạy một lần khi component được mount

    // Hàm sắp xếp danh sách theo depar_time
    const handleSortByDate = () => {
        const sortedBookings = [...allBookings].sort((a, b) => {
            const dateA = new Date(a.day_depar);
            const dateB = new Date(b.day_depar);
            return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
        });

        setAllBookings(sortedBookings);
        setSortOrder(sortOrder === "asc" ? "desc" : "asc"); // Đổi thứ tự sắp xếp cho lần nhấn tiếp theo
    };

    // Hàm lọc dữ liệu dựa trên khoảng thời gian
    const filteredBookings = allBookings.filter((booking) => {
        const bookingDate = new Date(booking.datetime);

        const bookingDateOnly = new Date(bookingDate.getFullYear(), bookingDate.getMonth(), bookingDate.getDate()); // Chỉ lấy ngày, tháng, năm

        const start = startDate ? new Date(new Date(startDate).setHours(0, 0, 0, 0)) : null;
        const end = endDate ? new Date(new Date(endDate).setHours(0, 0, 0, 0)) : null;
        
        const isWithinDateRange = (!start || bookingDateOnly >= start) && (!end || bookingDateOnly <= end);

        // Tìm kiếm theo tên người dùng hoặc CCCD
        const isMatchingSearchTerm = 
            booking.user_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
            booking.cccd.toLowerCase().includes(searchQuery.toLowerCase());

        return isWithinDateRange && isMatchingSearchTerm;

    });

    return (
        <div>
            <div className="flex">
                <div className="text-left mx-3 my-3">
                    <Link to="/dashboard-tours">
                        <i className="fa-solid fa-arrow-left text-2xl cursor-pointer"></i>
                    </Link>
                </div>
                <div className=" my-3 mx-auto font-semibold text-2xl uppercase">
                    Bảng chi tiết đơn đặt tour
                </div>
            </div>
            <div className="w-[95%] mx-auto">
                <div className="float-right flex gap-3">
                    <div className="w-[30%] text-end mb-4 float-right">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="block appearance-none w-full py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded shadow-none ms-auto outline-none"
                            placeholder="Nhập tên nd/Cccd"
                        />
                    </div>
                    <div className="text-end w-[650px] mb-4 float-left flex gap-3 mr-8">
                        <div className="flex items-center">
                            <div className="font-medium mx-2">Ngày BĐ: </div>
                            <input type="date" className="border-[1px] border-gray-200 px-2 py-[2px] rounded-md" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                        </div>
                        <div className="flex items-center">
                            <div className="font-medium mx-2">Ngày KT: </div>
                            <input type="date" className="border-[1px] border-gray-200 px-2 py-[2px] rounded-md" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                        </div>
                    </div>
                    <button onClick={handleSortByDate}>
                        <div className="flex w-[100px] justify-center border-[1px] border-gray-300 mb-3 rounded-[3px] bg-black text-white">
                            <div><i className="fa-solid fa-calendar-days mr-2"></i></div>
                            <div className="">
                                {sortOrder === "asc" ? "Giảm" : "Tăng"}
                            </div>
                        </div>
                    </button>
                </div>
            </div>
            <div className="w-[95%] mx-auto h-[550px] overflow-auto">
                <table className="w-[1800px] border-[1px] border-gray-300 border-collapse">
                    <thead className="">
                        <tr className="border-[1px] border-gray-300 sticky top-0 z-10 bg-gray-100 shadow-md">
                            <th className="w-[50px] border-r-[1px] border-gray-300 px-2">STT</th>
                            <th className="w-[90px] border-r-[1px] border-gray-300 px-2">Mã đơn</th>
                            <th className="w-[60px] border-r-[1px] border-gray-300 px-2">Mã tour</th>
                            <th className="w-[60px] border-r-[1px] border-gray-300 px-2">Mã ND</th>
                            <th className="w-[200px] border-r-[1px] border-gray-300 px-2">Tên người dùng</th>
                            <th className="w-[150px] border-r-[1px] border-gray-300 px-2">Cccd</th>
                            <th className="w-[150px] border-r-[1px] border-gray-300 px-2">SĐT</th>
                            <th className="w-[300px] border-r-[1px] border-gray-300 px-2">Địa chỉ</th>
                            <th className="w-[400px] border-r-[1px] border-gray-300 px-2">Tên tour</th>
                            <th className="w-[130px] border-r-[1px] border-gray-300 px-2">Số người tham gia cùng</th>
                            <th className="w-[130px] border-r-[1px] border-gray-300 px-2">Giá tour</th>
                            <th className="w-[100px] border-r-[1px] border-gray-300 px-2">Giảm giá (%)</th>
                            <th className="w-[100px] border-r-[1px] border-gray-300 px-2">Tổng giá</th>
                            <th className="w-[170px] border-r-[1px] border-gray-300 px-2">Ngày khởi hành</th>
                            <th className="w-[150px] border-r-[1px] border-gray-300 px-2">Thời gian đặt</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredBookings.map((booking, index) => (
                            <tr key={booking.booking_id} className="border-[1px] border-b-gray-300">
                                <td className="border-r-[1px] border-gray-300 px-2">{index + 1}</td>
                                <td className="border-r-[1px] border-gray-300 px-2">{booking.booking_id}</td>
                                <td className="border-r-[1px] border-gray-300 px-2">{booking.tour_id}</td>
                                <td className="border-r-[1px] border-gray-300 px-2">{booking.user_id}</td>
                                <td className="border-r-[1px] border-gray-300 px-2 text-left">{booking.user_name}</td>
                                <td className="border-r-[1px] border-gray-300 px-2 text-left">{booking.cccd}</td>
                                <td className="border-r-[1px] border-gray-300 px-2 text-left">{booking.phonenum}</td>
                                <td className="border-r-[1px] border-gray-300 px-2 text-left">{booking.address}</td>
                                <td className="border-r-[1px] border-gray-300 px-2 text-left">{booking.tour_name}</td>
                                <td className="border-r-[1px] border-gray-300 px-2 text-left">{booking.participant}</td>
                                <td className="border-r-[1px] border-gray-300 px-2 text-left"><PriceDisplay price={booking.price} /></td>
                                <td className="border-r-[1px] border-gray-300 px-2 text-left">{booking.discount}</td>
                                <td className="border-r-[1px] border-gray-300 px-2 text-left"><PriceDisplay price={booking.total_pay} /></td>
                                <td className="border-r-[1px] border-gray-300 px-2 text-left"><FormatTime date={booking.day_depar} /></td>
                                <td className="border-r-[1px] border-gray-300 px-2 text-left">{booking.datetime}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
export default BookingDetails;