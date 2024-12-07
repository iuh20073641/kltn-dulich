import HeaderManager from "../header-manager/header-manager";
import React, { useEffect, useState } from 'react';
import { fetchNewBookingTour } from "../../../component/api/tours";
import { toast } from 'react-toastify';
import PriceDisplay from "../../../component/service/money";
import FormatTime from "../../../component/service/fomat-time";
import { getListHdv } from "../../../component/api/user";
import config from "../../../component/config.json";

const settingValue =
{
    booking_id: "",
    staff_id: ""
};

const { SERVER_API } = config;

function NewBookingTour3() {

    const [newBookings, setNewBookings] = useState([]);
    const [filterOption, setFilterOption] = useState('7days'); // Mặc định là 7 ngày
    const [searchQuery, setSearchQuery] = useState(''); // Thêm trạng thái để lưu giá trị tìm kiếm
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isOpenAssignment, setIsOpenModalAssignment] = useState(false);
    const [formHdv, setFormHdv] = useState(settingValue);
    const [tourGuides, setTourGuides] = useState([]);
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
            ? (booking.booking_id && booking.booking_id.toString().toLowerCase().includes(searchQuery.toLowerCase())) ||
            (booking.phonenum && String(booking.phonenum).toLowerCase().includes(searchQuery.toLowerCase())) ||
            (booking.tour_id && booking.tour_id.toString().toLowerCase().includes(searchQuery.toLowerCase()))
            : true; // Không lọc nếu không có searchQuery

        // console.log('Matches Search Query:', matchesSearchQuery); // Kiểm tra kết quả so sánh

        return isWithinDateRange && matchesSearchQuery;
    });

    // // duyệt đơn đặt tour
    // const updateConfirmBooking = (bookingId) => {
    //     console.log(bookingId);
    //     // if (window.confirm('Bạn có chắc chắn muốn xóa phòng này?')) {
    //     fetch(`${SERVER_API}/admin/asign_new_booking_tour.php`, {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({
    //             // assign_room: true, // Thêm biến này để kích hoạt điều kiện trong PHP
    //             booking_id: bookingId
    //         }),
    //     })
    //         .then(response => response.json())
    //         .then(data => {
    //             // console.log('Đang gửi dữ liệu:', { room_id: roomId, image_id: imageId });
    //             if (data.status === 'success') { // Kiểm tra 'success' thay vì 'status'
    //                 // setTourImages(tourImages.filter(tourImage => tourImage.id !== imageId));
    //                 toast.success(data.message);
    //             } else {
    //                 toast.error(data.message);
    //             }
    //         })
    //         .catch(error => {
    //             // console.error('Có lỗi xảy ra:', error);
    //             toast.error('Lỗi.');
    //             console.log('Có lỗi xảy ra:', error);
    //         });
    // };

    // hủy đơn đặt tour
    // const cancelBookingTour = (bookingId) => {
    //     console.log(bookingId);
    //     // if (window.confirm('Bạn có chắc chắn muốn xóa phòng này?')) {
    //     fetch(`${SERVER_API}/admin/cancel_booking_tour.php`, {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({
    //             cancel_booking: true, // Thêm biến này để kích hoạt điều kiện trong PHP
    //             booking_id: bookingId
    //         }),
    //     })
    //         .then(response => response.json())
    //         .then(data => {
    //             if (data.status === 'success') { // Kiểm tra 'success' thay vì 'status'
    //                 toast.success(data.message);
    //             } else {
    //                 toast.error(data.message);
    //             }
    //         })
    //         .catch(error => {
    //             toast.error('Lỗi.');
    //             console.log('Có lỗi xảy ra:', error);
    //         });
    // };

    const handleModalClick = () => {
        setIsOpenModalAssignment(!isOpenAssignment);
    };

    // Bật/ẩn của sổ đánh giá tour
    const handleModalAssignmentClick = async (booking_id) => {
        setIsOpenModalAssignment(!isOpenAssignment);

        const guideResponse = await getListHdv();
        const guideData = guideResponse.data; // Giả sử API trả về mảng các tour

        setFormHdv({
            booking_id: booking_id,
        });

        setTourGuides(guideData);

    };

    const handleHdvChange = (event) => {
        const { value, name } = event.target;
        setFormHdv((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // phân công hướng dẫn viên
    const updateBookingHdv = () => {
        console.log(formHdv.staff_id);
        // if (window.confirm('Bạn có chắc chắn muốn xóa phòng này?')) {
        fetch(`${SERVER_API}/admin/create_assignment_hdv.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                // assign_room: true, // Thêm biến này để kích hoạt điều kiện trong PHP
                booking_id: formHdv.booking_id,
                staff_id: formHdv.staff_id
            }),
        })
            .then(response => response.json())
            .then(data => {
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

    if (error) return <div>Error: {error.message}</div>;
    // console.log('Filtered Bookings:', filteredBookings);
    return (
        <div className="h-screen">
            <HeaderManager />

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
                                            placeholder="Nhập mã đơn/SĐT/mã tour"
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
                                                        <div>
                                                            <div className="flex">
                                                                <div className="mr-2 font-semibold">Mã tour:</div>
                                                                <div>{newBooking.tour_id}</div>
                                                            </div>
                                                            <div className="flex">
                                                                <div className="mr-2 font-semibold">Tên :</div>
                                                                <div>{newBooking.tour_name}</div>
                                                            </div>
                                                            <div className="flex">
                                                                <div className="mr-2 font-semibold">Giá :</div> <PriceDisplay price={newBooking.price} />
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="flex">
                                                            <div className="mr-2 font-semibold">Ngày khởi hành:</div>
                                                            <div><FormatTime date={newBooking.day_depar} /></div>
                                                        </div>
                                                        <div className="flex">
                                                            <b className="mr-2">Tổng tiền :</b>  <PriceDisplay price={newBooking.price} />
                                                        </div>
                                                        <div className="flex">
                                                            <div className="mr-2 font-semibold">Ngày đặt:</div>
                                                            <div>{newBooking.datetime}</div>
                                                        </div>
                                                    </td>
                                                    <td className="">
                                                        <button type='button' onClick={() => handleModalAssignmentClick(newBooking.booking_id)} className='btn text-white px-2 py-1 bg-[#2ec1ac] hover:bg-[#2c7c70] rounded-md text-sm custom-bg shadow-none' data-bs-toggle='modal' data-bs-target='#assign-room'>
                                                            <i className="fa-regular fa-square-check"></i> Phân công HDV
                                                        </button>
                                                        {/* <br></br>
                                                        <button type='button' onClick={() => cancelBookingTour(newBooking.booking_id)} className='mt-2 px-2 py-1 rounded-md btn border-[1px] border-[#dc3545] text-[#dc3545] hover:bg-[#dc3545] hover:text-white text-sm shadow-none'>
                                                            <i className='bi bi-trash'></i> Hủy đơn
                                                        </button> */}
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

            {/* Modal phân công hướng dẫn viên */}
            {isOpenAssignment && (
                <div className="w-full bg-black bg-opacity-25 inset-0 backdrop-blur-sm fixed z-20">
                    <div className="row w-[40%] mt-[50px] mx-auto border-[1px] bg-gray-100 border-gray-300 rounded-sm py-3 px-3 shadow-sm">
                        <div className="font-semibold text-xl my-4">Phân công hướnh dẫn viên</div>
                        <div className="w-full h-[1px] bg-gray-300 rounded-sm mb-3"></div>
                        <form>
                            <div className="items-center my-4">
                                <div className="font-semibold text-left mb-3">Hướng dẫn viên</div>
                                <select className="w-full rounded-md h-9 outline-none"
                                    name="staff_id"
                                    value={formHdv.staff_id}
                                    onChange={handleHdvChange}
                                >
                                    <option value="">Chọn hướng dẫn viên</option> {/* Tùy chọn mặc định */}
                                    {tourGuides && Array.isArray(tourGuides) && tourGuides.length > 0 ? (
                                        tourGuides.map((tourGuide) => (
                                            <option key={tourGuide.id} value={tourGuide.id}>{tourGuide.username}</option>
                                        ))
                                        ) : (
                                        <option value="">Chưa có hướng dẫn viên</option> /* Tùy chọn mặc định */
                                    )}
                                </select>
                            </div>
                        </form>
                        <div className="flex gap-x-2 items-center justify-center mt-3">
                            <div className="">
                                <button type="button" onClick={handleModalClick} className="bg-black w-[90px] border-[1px] border-black hover:bg-white hover:text-black text-white px-2 py-[2px] rounded-[3px] text-sm">
                                    Hủy
                                </button>
                            </div>
                            <div className="">
                                <button type="submit" onClick={(event) => updateBookingHdv(event)} className="bg-[#007aff] w-[90px] border-[1px] border-[#007aff] hover:bg-white hover:text-black text-white px-2 py-[2px] rounded-[3px] text-sm">
                                    Cập nhật
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}
export default NewBookingTour3;