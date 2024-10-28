import HeaderCensor from "../header-admin/header-admin";
import React, { useEffect, useState } from 'react';
import { fetchNewBookingTour } from "../../../component/api/tours";
import { toast } from 'react-toastify';
import PriceDisplay from "../../../component/service/money";

function NewBookingTour() {

    const [newBookings, setNewBookings] = useState([]);
    const [filterOption, setFilterOption] = useState('7days'); // Mặc định là 7 ngày
    const [searchQuery, setSearchQuery] = useState(''); // Thêm trạng thái để lưu giá trị tìm kiếm
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        // Hàm để gọi API và cập nhật state
        const newBookingData = async () => {
            try {
                // Gọi API để lấy danh sách phòng
                const newBookingResponse = await fetchNewBookingTour();
                const newBookingData = newBookingResponse.data; // Giả sử API trả về mảng các tour
                setNewBookings(newBookingData);

            } catch (err) {
                console.error('Error fetching data:', err);
                setError(err);
            }
        };

        newBookingData();
    }, []); // Chạy một lần khi component được mount

    // Cập nhật startDate và endDate khi filterOption thay đổi
    useEffect(() => {
        const currentDate = new Date();
        const formattedEndDate = currentDate.toISOString().split('T')[0]; // Định dạng YYYY-MM-DD
        let calculatedStartDate;

        if (filterOption === '1day') {
            calculatedStartDate = new Date();
            calculatedStartDate.setDate(currentDate.getDate() - 1);
        } else if (filterOption === '7days') {
            calculatedStartDate = new Date();
            calculatedStartDate.setDate(currentDate.getDate() - 7);
        } else if (filterOption === '1month') {
            calculatedStartDate = new Date();
            calculatedStartDate.setMonth(currentDate.getMonth() - 1);
        }

        const formattedStartDate = calculatedStartDate.toISOString().split('T')[0];

        setStartDate(formattedStartDate);
        setEndDate(formattedEndDate);
    }, [filterOption]);

     // Hàm lọc dữ liệu dựa trên khoảng thời gian
    const filteredBookings = newBookings.filter((booking) => {
        const bookingDate = new Date(booking.datetime);

        const bookingDateOnly = new Date(bookingDate.getFullYear(), bookingDate.getMonth(), bookingDate.getDate()); // Chỉ lấy ngày, tháng, năm

        const start = startDate ? new Date(new Date(startDate).setHours(0, 0, 0, 0)) : null;
        const end = endDate ? new Date(new Date(endDate).setHours(0, 0, 0, 0)) : null;
       
        // Lọc theo thời gian
        const isWithinDateRange = (!start || bookingDateOnly >= start) && (!end || bookingDateOnly <= end);
        // return (
        // (!start || bookingDateOnly >= start) && (!end || bookingDateOnly <= end)
        // );
        // Lọc theo mã đơn hoặc tên người đặt (case-insensitive)
        // const searchLowerCase = searchQuery.toLowerCase();
        // Kiểm tra search query
        console.log('Search Query:', searchQuery);
        const matchesSearchQuery = searchQuery
        ? booking.booking_id && booking.booking_id.toString().toLowerCase().includes(searchQuery.toLowerCase())
        : true; // Không lọc nếu không có searchQuery

        // console.log('Matches Search Query:', matchesSearchQuery); // Kiểm tra kết quả so sánh
    
        return isWithinDateRange && matchesSearchQuery;
    });

    // duyệt đơn đặt tour
    const updateConfirmBooking = (bookingId) => {
        console.log(bookingId);
        // if (window.confirm('Bạn có chắc chắn muốn xóa phòng này?')) {
        fetch('http://localhost:88/api_travel/api/admin/asign_new_booking_tour.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                // assign_room: true, // Thêm biến này để kích hoạt điều kiện trong PHP
                booking_id: bookingId
            }),
        })
            .then(response => response.json())
            .then(data => {
                // console.log('Đang gửi dữ liệu:', { room_id: roomId, image_id: imageId });
                if (data.status === 'success') { // Kiểm tra 'success' thay vì 'status'
                    // setTourImages(tourImages.filter(tourImage => tourImage.id !== imageId));
                    toast.success(data.message);
                } else {
                    toast.error(data.message);
                }
            })
            .catch(error => {
                // console.error('Có lỗi xảy ra:', error);
                toast.error('Lỗi.');
                console.log('Có lỗi xảy ra:', error);
            });
    };

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


    if (error) return <div>Error: {error.message}</div>;
    // console.log('Filtered Bookings:', filteredBookings);
    return (
        <div className="h-screen">
            <HeaderCensor />

            <div className="container -mt-[590px] mx-auto sm:px-4 max-w-full" id="main-content">
                <div className="flex flex-wrap ">
                    <div className="lg:w-4/5 pr-4 pl-4 ms-auto p-6">
                        <h3 className="mb-4 text-left font-semibold text-2xl uppercase">Đơn đặt mới</h3>
                        <div className="relative h-[490px] flex flex-col min-w-0 rounded break-words border bg-white border-1 border-gray-300 shadow mb-4">
                            <div className=" p-6">
                                <div className="flex ">
                                    <div className="w-[60%] text-end mb-4 float-left flex gap-3">
                                        <div className="flex items-center">
                                            <div className="font-medium">Ngày BĐ: </div>
                                            <input type="date" className="border-[1px] border-gray-200 px-2 py-[2px] rounded-md" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                                        </div>
                                        <div className="flex items-center">
                                            <div className="font-medium">Ngày KT: </div>
                                            <input type="date" className="border-[1px] border-gray-200 px-2 py-[2px] rounded-md" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                                        </div>
                                    </div>

                                    <div className="w-[10%] mt-[4px] mr-8">
                                        <select className="border-[1px] rounded-sm float-left border-gray-200 px-2 py-[1px]" value={filterOption} onChange={(e) => setFilterOption(e.target.value)}>
                                            <option value="1day">1 ngày</option>
                                            <option value="7days">7 ngày</option>
                                            <option value="1month">1 tháng</option>
                                        </select>
                                    </div>

                                    <div className="w-[30%] text-end mb-4 float-right">
                                        <input
                                            type="text"
                                            value={searchQuery} 
                                            onChange={(e) => setSearchQuery(e.target.value)} 
                                            className="block appearance-none w-full py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded shadow-none ms-auto"
                                            placeholder="Nhập mã đơn/người đặt"
                                        />
                                    </div>
                                </div>
                                <div className="block w-full overflow-auto scrolling-touch h-[400px]">
                                    <table className="w-full max-h-[370px] text-left max-w-full mb-4 bg-transparent table-hover border-[1px] border-gray-200" style={{ minWidth: 1200 }}>
                                        <thead>
                                            <tr className="bg-gray-900 text-gray-100 h-[40px] sticky top-0 z-10">
                                                <th scope="col" className="pl-3 sticky top-0 z-10">Mã đơn</th>
                                                <th scope="col" className="sticky top-0 z-10">Người đặt</th>
                                                <th scope="col" className="sticky top-0 z-10">Tour</th>
                                                <th scope="col" className="sticky top-0 z-10">Đơn đặt</th>
                                                <th scope="col" className="sticky top-0 z-10">Trạng thái</th>
                                            </tr>
                                        </thead>
                                        <tbody id="table-data" className="overflow-y-auto ">
                                            {filteredBookings.map((newBooking, index) => (
                                                <tr key={newBooking.booking_id} >
                                                    <td className="pl-3">{newBooking.booking_id}</td>
                                                    <td>
                                                        <span className='bg-[#0d6efd] text-white text-xs px-2 py-[2px] rounded-md'>
                                                            Mã thanh toán : {newBooking.order_id}
                                                        </span>
                                                        <br />
                                                        <b className="">Name :</b> {newBooking.user_name}
                                                        <br />
                                                        <b>Phone No :</b> {newBooking.phonenum}
                                                    </td>
                                                    <td>
                                                        <b>Mã tour :</b> {newBooking.tour_id}
                                                        <br />
                                                        <b>Tên :</b> {newBooking.tour_name}
                                                        <br></br>
                                                        <div className="flex">
                                                            <b className="mr-2">Giá :</b> <PriceDisplay price={newBooking.price} />
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <b>Ngày khởi hành :</b> {newBooking.departure_id}
                                                        <br />
                                                        <div className="flex">
                                                            <b className="mr-2">Tổng tiền :</b>  <PriceDisplay price={newBooking.price} />
                                                        </div>

                                                        <b>Ngày đặt :</b> {newBooking.datetime}
                                                    </td>
                                                    <td className="">
                                                        <button type='button' onClick={() => updateConfirmBooking(newBooking.booking_id)} className='btn text-white px-2 py-1 bg-[#2ec1ac] hover:bg-[#2c7c70] rounded-md text-sm custom-bg shadow-none' data-bs-toggle='modal' data-bs-target='#assign-room'>
                                                            <i className="fa-regular fa-square-check"></i> Duyệt đơn
                                                        </button>
                                                        <br></br>
                                                        <button type='button' onClick={() => cancelBookingTour(newBooking.booking_id)} className='mt-2 px-2 py-1 rounded-md btn border-[1px] border-[#dc3545] text-[#dc3545] hover:bg-[#dc3545] hover:text-white text-sm shadow-none'>
                                                            <i className='bi bi-trash'></i> Hủy đơn
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    )
}
export default NewBookingTour;