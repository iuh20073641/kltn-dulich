import HeaderAdmin from "../header-admin/header-admin";
import PriceDisplay from "../../../component/service/money";
import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { fetchNewBookingTour } from "../../../component/api/tours";
import { fetchRefundBookingTour } from "../../../component/api/tours";
import { fetchUserQueries } from "../../../component/api/tours";
import { fetchAllTourRating } from "../../../component/api/tours";
import { fetchAllBookingTour } from "../../../component/api/tours";
import { fetchApprovedApplicationTour } from "../../../component/api/tours";
import CustomPieChart from "../../../component/service/chart";

function DashboardTours() {

    const [newBookings, setNewBookings] = useState([]);
    const [newbookingCount, setNewBookingCount] = useState(0);
    const [refundBookings, setRefundBookings] = useState([]);
    const [refundBookingCount, setRefundBookingCount] = useState(0);
    const [refundTotalPrice, setRefundTotalPrice] = useState(0); // Thêm biến lưu tổng giá tiền
    const [userQueries, setUserQuieries] = useState([]);
    const [userQueriesCount, setUserQueriesCount] = useState(0);
    const [tourRating, setTourRating] = useState([]);
    const [tourRatingCount, setTourRatingCount] = useState(0);
    const [bookingRecords, setBookingRecord] = useState([]);
    const [bookingRecordsCount, setBookingRecordCount] = useState(0);
    const [bookingTotalPrice, setBookingTotalPrice] = useState(0); // Thêm biến lưu tổng giá tiền
    const [approvedApplications, setApprovedApplications] = useState([]);
    const [bookingApproveCount, setBookingApproveCount] = useState(0);
    const [approveTotalPrice, setApproveTotalPrice] = useState(0); // Thêm biến lưu tổng giá tiền

    const [filterOption, setFilterOption] = useState('1month'); // Mặc định là 7 ngày
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    // State để lưu dữ liệu đã lọc
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [filteredApproveBookings, setFilteredApproveBookings] = useState([]);
    const [filteredRefundBookings, setFilteredRefundBookings] = useState([]);

    const data = [
        { name: 'Tổng đã duyệt', value: bookingApproveCount },
        { name: 'Tour đã hủy', value: refundBookingCount },
        { name: 'Tour mới', value: newbookingCount },
      ];

    useEffect(() => {
        // Hàm để gọi API và cập nhật state
        const newBookingData = async () => {
            try {
                const newBookingResponse = await fetchNewBookingTour();
                const newBookingData = newBookingResponse.data; // Giả sử API trả về mảng các tour
                setNewBookings(newBookingData);
                setNewBookingCount(newBookings.length);

            } catch (err) {
                console.error('Error fetching data:', err);

            }
        };

        newBookingData();
    }, [newBookings.length]); // Chạy một lần khi component được mount

    useEffect(() => {
        // Hàm để gọi API và cập nhật state
        const userQueriesData = async () => {
            try {
                const userQueriesResponse = await fetchUserQueries();
                const userQueriesData = userQueriesResponse.data; // Giả sử API trả về mảng các tour
                setUserQuieries(userQueriesData);
                setUserQueriesCount(userQueries.length);
            } catch (err) {
                console.error('Error fetching data:', err);

            }
        };

        userQueriesData();
    }, [userQueries.length]); // Chạy một lần khi component được mount


    useEffect(() => {
        // Hàm để gọi API và cập nhật state
        const tourRatingData = async () => {
            try {

                const tourRatingResponse = await fetchAllTourRating();
                const tourRatingData = tourRatingResponse.data; // Giả sử API trả về mảng các tour
                setTourRating(tourRatingData);
                setTourRatingCount(tourRating.length);

            } catch (err) {
                console.error('Error fetching data:', err);

            }
        };

        tourRatingData();
    }, [tourRating.length]); // Chạy một lần khi component được mount

    useEffect(() => {
        // Hàm để gọi API và cập nhật state
        const refundBookingData = async () => {
            try {
                // Gọi API để lấy danh sách phòng
                const refundBookingResponse = await fetchRefundBookingTour();
                const refundBookingData = refundBookingResponse.data; // Giả sử API trả về mảng các tour

                setRefundBookings(refundBookingData);

                // Cập nhật giá trị đã lọc khi nhận dữ liệu mới
                setFilteredRefundBookings(refundBookings.filter((booking) => {
                    const bookingDate = new Date(booking.datetime);
                    const bookingDateOnly = new Date(bookingDate.getFullYear(), bookingDate.getMonth(), bookingDate.getDate());
                    const start = startDate ? new Date(new Date(startDate).setHours(0, 0, 0, 0)) : null;
                    const end = endDate ? new Date(new Date(endDate).setHours(0, 0, 0, 0)) : null;
                    return (!start || bookingDateOnly >= start) && (!end || bookingDateOnly <= end);
                }));

                setRefundBookingCount(filteredRefundBookings.length);

                // Tính tổng giá tiền từ bookingRecordData
                const totalPrice = filteredRefundBookings.reduce((total, record) => total + record.total_pay, 0);
                setRefundTotalPrice(totalPrice);

            } catch (err) {
                console.error('Error fetching data:', err);
            }
        };

        refundBookingData();
    }, [filteredRefundBookings.length, endDate, filteredRefundBookings, refundBookings, startDate]); // Chạy một lần khi component được mount

    useEffect(() => {
        // Hàm để gọi API và cập nhật state
        const bookingRecodeData = async () => {
            try {
                // Gọi API để lấy danh sách phòng
                const bookingRecordResponse = await fetchAllBookingTour();
                const bookingRecordData = bookingRecordResponse.data; // Giả sử API trả về mảng các tour

                setBookingRecord(bookingRecordData);

                // Cập nhật giá trị đã lọc khi nhận dữ liệu mới
                setFilteredBookings(bookingRecords.filter((booking) => {
                    const bookingDate = new Date(booking.datetime);
                    const bookingDateOnly = new Date(bookingDate.getFullYear(), bookingDate.getMonth(), bookingDate.getDate());
                    const start = startDate ? new Date(new Date(startDate).setHours(0, 0, 0, 0)) : null;
                    const end = endDate ? new Date(new Date(endDate).setHours(0, 0, 0, 0)) : null;
                    return (!start || bookingDateOnly >= start) && (!end || bookingDateOnly <= end);
                }));

                setBookingRecordCount(filteredBookings.length);

                // Tính tổng giá tiền từ bookingRecordData
                const totalPrice = filteredBookings.reduce((total, record) => total + record.total_pay, 0);
                setBookingTotalPrice(totalPrice);

            } catch (err) {
                console.error('Error fetching data:', err);
            }
        };

        bookingRecodeData();
    }, [bookingRecords, endDate, startDate, filteredBookings.length, filteredBookings]); // Chạy một lần khi component được mount

    useEffect(() => {
        // Hàm để gọi API và cập nhật state
        const approveBookingData = async () => {
            try {
                // Gọi API để lấy danh sách phòng
                const approvedApplicationResponse = await fetchApprovedApplicationTour();
                const approvedApplicationData = approvedApplicationResponse.data; // Giả sử API trả về mảng các tour
                setApprovedApplications(approvedApplicationData);

                // Cập nhật giá trị đã lọc khi nhận dữ liệu mới
                setFilteredApproveBookings(approvedApplications.filter((booking) => {
                    const bookingDate = new Date(booking.datetime);
                    const bookingDateOnly = new Date(bookingDate.getFullYear(), bookingDate.getMonth(), bookingDate.getDate());
                    const start = startDate ? new Date(new Date(startDate).setHours(0, 0, 0, 0)) : null;
                    const end = endDate ? new Date(new Date(endDate).setHours(0, 0, 0, 0)) : null;
                    return (!start || bookingDateOnly >= start) && (!end || bookingDateOnly <= end);
                }));

                setBookingApproveCount(filteredApproveBookings.length);

                // Tính tổng giá tiền từ bookingRecordData
                const totalPrice = filteredApproveBookings.reduce((total, record) => total + record.total_pay, 0);
                setApproveTotalPrice(totalPrice);

            } catch (err) {
                console.error('Error fetching data:', err);
            }
        };

        approveBookingData();
    }, [approvedApplications.length, approvedApplications, endDate, startDate, filteredApproveBookings]); // Chạy một lần khi component được mount

    // Cập nhật startDate và endDate khi filterOption thay đổi
    useEffect(() => {
        const currentDate = new Date();
        const formattedEndDate = currentDate.toISOString().split('T')[0]; // Định dạng YYYY-MM-DD
        let calculatedStartDate;

        if (filterOption === '1month') {
            calculatedStartDate = new Date();
            calculatedStartDate.setDate(currentDate.getDate() - 30);
        } else if (filterOption === '1quarter') {
            calculatedStartDate = new Date();
            calculatedStartDate.setDate(currentDate.getDate() - 90);
        } else if (filterOption === '1year') {
            calculatedStartDate = new Date();
            calculatedStartDate.setMonth(currentDate.getMonth() - 365);
        } else {
            setStartDate(null);
            setEndDate(null);
            return; // Kết thúc hàm để không thực hiện các thao tác sau
        }

        const formattedStartDate = calculatedStartDate.toISOString().split('T')[0];

        setStartDate(formattedStartDate);
        setEndDate(formattedEndDate);
    }, [filterOption]);

    // Hàm lọc dữ liệu dựa trên khoảng thời gian
    // const filteredBookings = newBookings.filter((booking) => {
    //     const bookingDate = new Date(booking.datetime);

    //     const bookingDateOnly = new Date(bookingDate.getFullYear(), bookingDate.getMonth(), bookingDate.getDate()); // Chỉ lấy ngày, tháng, năm

    //     const start = startDate ? new Date(new Date(startDate).setHours(0, 0, 0, 0)) : null;
    //     const end = endDate ? new Date(new Date(endDate).setHours(0, 0, 0, 0)) : null;
       
    //     // Lọc theo thời gian
    //     const isWithinDateRange = (!start || bookingDateOnly >= start) && (!end || bookingDateOnly <= end);
    
    //     return isWithinDateRange;
    // });

    return (
        <div>
            <HeaderAdmin />
            <div className="-mt-[660px] float-right w-[80%] h-screen bg-gray-100 overflow-auto">
                <div className="font-semibold text-2xl uppercase text-left mx-3 mt-4">Đơn đặt tour</div>
                <div className="flex gap-5 items-center justify-center mt-4">
                    <div className="bg-white w-[20%] rounded-md border-[1px] border-gray-300 text-[#198754]">
                        <div className="text-base font-normal mt-2">Đơn đặt mới</div>
                        <div className="text-4xl my-4">{newbookingCount}</div>
                    </div>
                    <div className="bg-white w-[20%] rounded-md border-[1px] border-gray-300 text-[#dc3545]">
                        <div className="text-base font-normal mt-2">Đơn đã hủy</div>
                        <div className="text-4xl my-4">{refundBookingCount}</div>
                    </div>
                    <div className="bg-white w-[20%] rounded-md border-[1px] border-gray-300 text-[#0dcaf0]">
                        <div className="text-base font-normal mt-2">Phản hồi </div>
                        <div className="text-4xl my-4">{userQueriesCount}</div>
                    </div>
                    <div className="bg-white w-[20%] rounded-md border-[1px] border-gray-300 text-[#ffc107]">
                        <div className="text-base font-normal mt-2">Đánh giá</div>
                        <div className="text-4xl my-4">{tourRatingCount}</div>
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <div className="text-left text-xl mx-3 font-normal mt-10 mb-4">Dữ liệu đơn đặt Tour</div>
                    <div className="w-[10%] mt-10 mb-4 mr-8">
                        <select className="border-[1px] rounded-sm float-left border-gray-200 px-2 py-[1px]" value={filterOption} onChange={(e) => setFilterOption(e.target.value)}>
                            <option value="1month">1 tháng</option>
                            <option value="7quarter">1 quý</option>
                            <option value="1year">1 năm</option>
                            <option value="all">tất cả</option>
                        </select>
                    </div>
                </div>
                <div className="flex gap-5 items-center justify-center mt-4">
                    <div className="bg-white w-[20%] rounded-md border-[1px] border-gray-300 text-[#0d6efd]">
                        <div className="text-base font-normal mt-2">Tổng đơn</div>
                        <div className="text-4xl mt-4">{bookingRecordsCount}</div>
                        <div className="mb-3">
                            <PriceDisplay price={bookingTotalPrice} />
                        </div>
                    </div>
                    <div className="bg-white w-[20%] rounded-md border-[1px] border-gray-300 text-[#198754]">
                        <div className="text-base font-normal mt-2">Đơn đã duyệt</div>
                        <div className="text-4xl mt-4">{bookingApproveCount}</div>
                        <div className="mb-3">
                            <PriceDisplay price={approveTotalPrice} />
                        </div>
                    </div>
                    <div className="bg-white w-[20%] rounded-md border-[1px] border-gray-300 text-[#dc3545]">
                        <div className="text-base font-normal mt-2">Đơn đã hủy </div>
                        <div className="text-4xl mt-4">{refundBookingCount}</div>
                        <div className="mb-3">
                            <PriceDisplay price={refundTotalPrice} />
                        </div>
                    </div>
                    <div className="w-[20%]">

                    </div>
                </div>
                <div className="mt-5">
                    <Link to="/dashboard-tours/booking-detail">
                        <button className="border-[1px] border-gray-300 px-2 py-[2px] hover:bg-gray-300 duration-100 rounded-sm font-medium">
                            Xem chi tiết
                        </button>
                    </Link>
                </div>
                <div className="w-[100%] mx-auto mb-8">
                    <div className="font-medium text-lg mt-8">Biểu đồ tỉ lệ đơn đặt tour</div>
                    <CustomPieChart data={data} />
                </div>
            </div>
        </div>
    )
}
export default DashboardTours;