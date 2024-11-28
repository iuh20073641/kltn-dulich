import HeaderAdmin from "../header-admin/header-admin";
import PriceDisplay from "../../../component/service/money";
import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { fetchNewBookingTour } from "../../../component/api/tours";
import { fetchRefundBookingTour } from "../../../component/api/tours";
// import { fetchUserQueries } from "../../../component/api/tours";
import { fetchAllTourRating } from "../../../component/api/tours";
import { fetchAllBookingTour } from "../../../component/api/tours";
import { fetchApprovedApplicationTour } from "../../../component/api/tours";
import { fetchTours } from "../../../component/api/tours";
import { fetchTourDepart } from "../../../component/api/tours";
import CustomPieChart from "../../../component/service/chart";

function DashboardTours() {

    const [tours, setTours] = useState([]);
    const [upcomingTours, setUpcomingTours] = useState([]); // Lưu tour có ngày lịch trình > ngày hiện tại
    const [newBookings, setNewBookings] = useState([]);
    const [newbookingCount, setNewBookingCount] = useState(0);
    const [newTotalPrice, setnewTotalPrice] = useState(0); // Thêm biến lưu tổng giá tiền
    const [refundBookings, setRefundBookings] = useState([]);
    const [refundBookingCount, setRefundBookingCount] = useState(0);
    const [refundTotalPrice, setRefundTotalPrice] = useState(0); // Thêm biến lưu tổng giá tiền
    // const [userQueries, setUserQuieries] = useState([]);
    // const [userQueriesCount, setUserQueriesCount] = useState(0);
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
    const [filteredNewBookings, setFilteredNewBookings] = useState([]);

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

            } catch (err) {
                console.error('Error fetching data:', err);

            }
        };

        newBookingData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [endDate, startDate]); // Chạy một lần khi component được mount

    // Hàm lọc dữ liệu dựa trên khoảng thời gian
    const filterNewBookings = () => {
        const filtered = newBookings.filter((booking) => {
          const bookingDate = new Date(booking.datetime);
          const bookingDateOnly = new Date(bookingDate.getFullYear(), bookingDate.getMonth(), bookingDate.getDate()); // Chỉ lấy ngày, tháng, năm
    
          const start = startDate ? new Date(new Date(startDate).setHours(0, 0, 0, 0)) : null;
          const end = endDate ? new Date(new Date(endDate).setHours(0, 0, 0, 0)) : null;
          
          return (!start || bookingDateOnly >= start) && (!end || bookingDateOnly <= end);
        });
    
        setFilteredNewBookings(filtered); // Cập nhật kết quả lọc
      };
    // Tính tổng số booking và tổng giá trị từ kết quả lọc
    const calculateResults = () => {
        // Lọc lại khi startDate hoặc endDate thay đổi
        const totalBookingCount = filteredNewBookings.length;
        setNewBookingCount(totalBookingCount);

        // Tính tổng giá trị từ các booking đã lọc
        const totalPrice = filteredNewBookings.reduce((total, record) => total + record.total_pay, 0);
        setnewTotalPrice(totalPrice);
    };
    useEffect(() => {
        if (newBookings.length > 0) {
            filterNewBookings();
          calculateResults();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [startDate, endDate, newBookings]);

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

            } catch (err) {
                console.error('Error fetching data:', err);
            }
        };

        refundBookingData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [endDate, startDate]); // Chạy một lần khi component được mount

    
    // Hàm lọc dữ liệu dựa trên khoảng thời gian
    const filterReffundBookings = () => {
        const filtered = refundBookings.filter((booking) => {
          const bookingDate = new Date(booking.datetime);
          const bookingDateOnly = new Date(bookingDate.getFullYear(), bookingDate.getMonth(), bookingDate.getDate()); // Chỉ lấy ngày, tháng, năm
    
          const start = startDate ? new Date(new Date(startDate).setHours(0, 0, 0, 0)) : null;
          const end = endDate ? new Date(new Date(endDate).setHours(0, 0, 0, 0)) : null;
          
          return (!start || bookingDateOnly >= start) && (!end || bookingDateOnly <= end);
        });
    
        setFilteredRefundBookings(filtered); // Cập nhật kết quả lọc
      };
    // Tính tổng số booking và tổng giá trị từ kết quả lọc
    const calculateRefundResults = () => {
        // Lọc lại khi startDate hoặc endDate thay đổi
        const totalBookingCount = filteredRefundBookings.length;
        setRefundBookingCount(totalBookingCount);

        // Tính tổng giá trị từ các booking đã lọc
        const totalPrice = filteredRefundBookings.reduce((total, record) => total + record.total_pay, 0);
        setRefundTotalPrice(totalPrice);
    };
    useEffect(() => {
        if (bookingRecords.length > 0) {
            filterReffundBookings();
            calculateRefundResults();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [startDate, endDate, refundBookings]);

    useEffect(() => {
        // Hàm để gọi API và cập nhật state
        const bookingRecodeData = async () => {
            try {
                // Gọi API để lấy danh sách phòng
                const bookingRecordResponse = await fetchAllBookingTour();
                const bookingRecordData = bookingRecordResponse.data; // Giả sử API trả về mảng các tour

                setBookingRecord(bookingRecordData);


            } catch (err) {
                console.error('Error fetching data:', err);
            }
        };

        bookingRecodeData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [endDate, startDate]); // Chạy một lần khi component được mount

    // Hàm lọc dữ liệu dựa trên khoảng thời gian
    const filterRecordBookings = () => {
        const filtered = bookingRecords.filter((booking) => {
          const bookingDate = new Date(booking.datetime);
          const bookingDateOnly = new Date(bookingDate.getFullYear(), bookingDate.getMonth(), bookingDate.getDate()); // Chỉ lấy ngày, tháng, năm
    
          const start = startDate ? new Date(new Date(startDate).setHours(0, 0, 0, 0)) : null;
          const end = endDate ? new Date(new Date(endDate).setHours(0, 0, 0, 0)) : null;
          
          return (!start || bookingDateOnly >= start) && (!end || bookingDateOnly <= end);
        });
    
        setFilteredBookings(filtered); // Cập nhật kết quả lọc
      };
    // Tính tổng số booking và tổng giá trị từ kết quả lọc
    const calculateRecordResults = () => {
        // Lọc lại khi startDate hoặc endDate thay đổi
        const totalBookingCount = filteredBookings.length;
        setBookingRecordCount(totalBookingCount);

        // Tính tổng giá trị từ các booking đã lọc
        const totalPrice = filteredBookings.reduce((total, record) => total + record.total_pay, 0);
        setBookingTotalPrice(totalPrice);
    };
    useEffect(() => {
        if (bookingRecords.length > 0) {
            filterRecordBookings();
            calculateRecordResults();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [startDate, endDate, bookingRecords]);

    useEffect(() => {
        // Hàm để gọi API và cập nhật state
        const approveBookingData = async () => {
            try {
                // Gọi API để lấy danh sách phòng
                const approvedApplicationResponse = await fetchApprovedApplicationTour();
                const approvedApplicationData = approvedApplicationResponse.data; // Giả sử API trả về mảng các tour
                setApprovedApplications(approvedApplicationData);

            } catch (err) {
                console.error('Error fetching data:', err);
            }
        };

        approveBookingData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ endDate, startDate]); // Chạy một lần khi component được mount

    // Hàm lọc dữ liệu dựa trên khoảng thời gian
    const filterApproveBookings = () => {
        const filtered = approvedApplications.filter((booking) => {
          const bookingDate = new Date(booking.datetime);
          const bookingDateOnly = new Date(bookingDate.getFullYear(), bookingDate.getMonth(), bookingDate.getDate()); // Chỉ lấy ngày, tháng, năm
    
          const start = startDate ? new Date(new Date(startDate).setHours(0, 0, 0, 0)) : null;
          const end = endDate ? new Date(new Date(endDate).setHours(0, 0, 0, 0)) : null;
          
          return (!start || bookingDateOnly >= start) && (!end || bookingDateOnly <= end);
        });
    
        setFilteredApproveBookings(filtered); // Cập nhật kết quả lọc
      };
    // Tính tổng số booking và tổng giá trị từ kết quả lọc
    const calculateApproveResults = () => {
        // Lọc lại khi startDate hoặc endDate thay đổi
        const totalBookingCount = filteredApproveBookings.length;
        setBookingApproveCount(totalBookingCount);

        // Tính tổng giá trị từ các booking đã lọc
        const totalPrice = filteredApproveBookings.reduce((total, record) => total + record.total_pay, 0);
        setApproveTotalPrice(totalPrice);
    };
    useEffect(() => {
        if (approvedApplications.length > 0) {
            filterApproveBookings();
            calculateApproveResults();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [startDate, endDate, approvedApplications]);

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
            calculatedStartDate.setMonth(currentDate.getDate() - 365);
        } else {
            setStartDate(null);
            setEndDate(null);
            return; // Kết thúc hàm để không thực hiện các thao tác sau
        }

        const formattedStartDate = calculatedStartDate.toISOString().split('T')[0];
        console.log(formattedStartDate, formattedEndDate);
        setStartDate(formattedStartDate);
        setEndDate(formattedEndDate);
    }, [filterOption]);

   // Gọi API đầu tiên để lấy danh sách tour
  useEffect(() => {
    const fetchData = async () => {
      try {
        const toursResponse = await fetchTours(); // Hàm này cần định nghĩa để gọi API
        const toursData = toursResponse.data; // Giả sử API trả về mảng các tour
        setTours(toursData);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Hàm để lấy và lọc lịch trình tour
    const filterUpcomingTours = async () => {
      const today = new Date(); // Ngày hiện tại
      console.log(today);
      const filteredTours = [];

      for (const tour of tours) {
        try {
          const response = await fetchTourDepart(tour.id); // Gọi API lấy lịch trình của tour
          const schedules = response.data; // Giả sử API trả về mảng lịch trình

          // Lọc các lịch trình có ngày khởi hành > ngày hiện tại
          const upcomingSchedules = schedules.filter((schedule) => {
            
            const tourDate = new Date(schedule.day_depart);
            // console.log(tourDate);
            return tourDate > today;
          });

          // Nếu có lịch trình trong tương lai, thêm tour vào danh sách kết quả
          console.log(upcomingSchedules);
          if (upcomingSchedules.length > 0) {
            filteredTours.push({
              ...tour,
              upcomingSchedules, // Lưu các lịch trình tương lai trong tour
            });
          }
        } catch (error) {
          console.error(`Lỗi khi kiểm tra lịch trình cho tour ID ${tour.id}:`, error);
        }
      }

      setUpcomingTours(filteredTours); // Lưu các tour có lịch trình hợp lệ
    };

    if (tours.length > 0) {
      filterUpcomingTours();
    }
  }, [tours]);

    return (
        <div>
            <HeaderAdmin />
            <div className="-mt-[660px] float-right w-[80%] h-screen bg-gray-100 overflow-auto">
                <div className="font-semibold text-2xl uppercase text-left mx-3 mt-4">Tour</div>
                <div className="flex gap-5 items-center justify-center mt-4">
                    <Link to="/dashboard-tours/all-tours"  className="bg-white w-[20%] rounded-md border-[1px] border-gray-300 text-[#198754]">
                        <div className="text-base font-normal mt-2">Tổng tour</div>
                        <div className="text-4xl my-4">{tours.length}</div>
                    </Link>
                    <Link to="/dashboard-tours/activities-tours" className="bg-white w-[20%] rounded-md border-[1px] border-gray-300 text-[#dc3545]">
                        <div className="text-base font-normal mt-2">Tour hoạt động</div>
                        <div className="text-4xl my-4">{upcomingTours.length}</div>
                    </Link>
                    <Link to="/dashboard-tours/suspend-tours" className="bg-white w-[20%] rounded-md border-[1px] border-gray-300 text-[#0dcaf0]">
                        <div className="text-base font-normal mt-2">Tour tạm ngừng</div>
                        <div className="text-4xl my-4">{tours.length - upcomingTours.length}</div>
                    </Link> 
                    <Link to="/dashboard-tours/all-rating-tours" className="bg-white w-[20%] rounded-md border-[1px] border-gray-300 text-[#ffc107]">
                        <div className="text-base font-normal mt-2">Đánh giá</div>
                        <div className="text-4xl my-4">{tourRatingCount}</div>
                    </Link>
                </div>
                <div className="flex items-center justify-between">
                    <div className="text-left text-xl mx-3 font-normal mt-10 mb-4">Dữ liệu đơn đặt Tour</div>
                    <div className="w-[10%] mt-10 mb-4 mr-8">
                        <select className="border-[1px] rounded-sm float-left border-gray-200 px-2 py-[1px]" value={filterOption} onChange={(e) => setFilterOption(e.target.value)}>
                            <option value="1month">1 tháng</option>
                            <option value="1quarter">1 quý</option>
                            <option value="1year">1 năm</option>
                            <option value="all">tất cả</option>
                        </select>
                    </div>
                </div>
                <div className="flex gap-5 items-center justify-center mt-4">
                    <Link to="/dashboard-tours/all-booking-tours" className="bg-white w-[20%] rounded-md border-[1px] border-gray-300 text-[#0d6efd]">
                        <div className="text-base font-normal mt-2">Tổng đơn</div>
                        <div className="text-4xl mt-4">{bookingRecordsCount}</div>
                        <div className="mb-3">
                            <PriceDisplay price={bookingTotalPrice} />
                        </div>
                    </Link>
                    <Link to="/dashboard-tours/all-new-tours" className="bg-white w-[20%] rounded-md border-[1px] border-gray-300 text-[#ffc107]">
                        <div className="text-base font-normal mt-2">Đơn đặt mới</div>
                        <div className="text-4xl mt-4">{newbookingCount}</div>
                        <div className="mb-3">
                            <PriceDisplay price={newTotalPrice} />
                        </div>
                    </Link>
                    <Link to="/dashboard-tours/all-approved-tours" className="bg-white w-[20%] rounded-md border-[1px] border-gray-300 text-[#198754]">
                        <div className="text-base font-normal mt-2">Đơn đã duyệt</div>
                        <div className="text-4xl mt-4">{bookingApproveCount}</div>
                        <div className="mb-3">
                            <PriceDisplay price={approveTotalPrice} />
                        </div>
                    </Link>
                    <Link to="/dashboard-tours/all-refund-tours" className="bg-white w-[20%] rounded-md border-[1px] border-gray-300 text-[#dc3545]">
                        <div className="text-base font-normal mt-2">Đơn đã hủy </div>
                        <div className="text-4xl mt-4">{refundBookingCount}</div>
                        <div className="mb-3">
                            <PriceDisplay price={refundTotalPrice} />
                        </div>
                    </Link>
                    
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