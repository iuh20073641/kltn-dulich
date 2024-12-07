import HeaderCensor from "../header-admin/header-admin";
import React, { useEffect, useState } from 'react';
import { fetchApprovedApplicationTour } from "../../../component/api/tours";
import { fetchBookingApprovedApplicationTourById } from "../../../component/api/tours";
import { toast } from 'react-toastify';
import PriceDisplay from "../../../component/service/money";
import FormatTime from "../../../component/service/fomat-time";
import jsPDF from 'jspdf';
import { fetchParticipantsTourByBookingid } from "../../../component/api/tours";
import { fetchVehicleByIddepart } from "../../../component/api/tours";
import { fetchHotelByIddepart } from "../../../component/api/tours";
import config from "../../../component/config.json";

const { SERVER_API } = config;

const formUser = {
    namend: '',
    cccd: '',
    booking_id: ''
};

function ApprovedApplication() {

    const [approvedApplications, setApprovedApplications] = useState([]);
    const [filterOption, setFilterOption] = useState('7days'); // Mặc định là 7 ngày
    const [searchQuery, setSearchQuery] = useState(''); // Thêm trạng thái để lưu giá trị tìm kiếm
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [error, setError] = useState(null);
    const [isOpenModalInfo, setIsOpenModalInfo] = useState(false);
    const [bookingDetails, setBookingDetails] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [vehicle, setVehicle] = useState([]);
    const [depositHotel, setDepositHotel] = useState([]);
    const [isOpenModalUpdate, setIsOpenModalUdate] = useState(false);
    const [userDatas, setUserData] = useState({ formUser });
    const [updateParticipants, setUpdateParticipants] = useState([
        { id: "", name: "", gender: "", dob: "" },
      ]);
    
    const today = new Date().toISOString().split("T")[0]; // Lấy ngày hiện tại dưới định dạng YYYY-MM-DD

    const currentDate = new Date();

    // Bật/ẩn của sổ thông tin đơn đặt tour
    const handleModalClick = () => {
        setIsOpenModalInfo(!isOpenModalInfo);
    };

    useEffect(() => {
        // Hàm để gọi API và cập nhật state
        const newBookingData = async () => {
            try {
                // Gọi API để lấy danh sách phòng
                const approvedApplicationResponse = await fetchApprovedApplicationTour();
                const approvedApplicationData = approvedApplicationResponse.data; // Giả sử API trả về mảng các tour
                setApprovedApplications(approvedApplicationData);

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
    const filteredBookings = approvedApplications.filter((booking) => {
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

    // hủy đơn đặt tour
    const cancelBookingTour = (bookingId) => {
        console.log(bookingId);
        // if (window.confirm('Bạn có chắc chắn muốn xóa phòng này?')) {
        fetch(`${SERVER_API}/admin/cancel_booking_tour.php`, {
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
                    setApprovedApplications(approvedApplications.filter(approvedApplication => approvedApplication.booking_id !== bookingId));
                } else {
                    toast.error(data.message);
                }
            })
            .catch(error => {
                toast.error('Lỗi.');
                console.log('Có lỗi xảy ra:', error);
            });
    };

    const generatePDF = (bookingTour) => {
        const doc = new jsPDF();

        // Thêm tiêu đề và nội dung cho PDF
        doc.setFontSize(18);
        doc.text('Tour History Report', 20, 20);

        doc.setFontSize(12);
        doc.text(`Tour Name: ${bookingTour.tour_name}`, 20, 40);
        doc.text(`Start Date: ${bookingTour.datetime}`, 20, 50);
        // doc.text(`End Date: ${tour.endDate}`, 20, 60);
        // doc.text(`Price: ${tour.price}`, 20, 70);
        // doc.text(`Description: ${tour.description}`, 20, 80);

        // Thêm các thông tin khác của tour vào PDF
        // Ví dụ thêm lịch sử tour
        if (bookingTour.address) {
            doc.text('Tour History:', 20, 90);
            bookingTour.history.forEach((entry, index) => {
                doc.text(`${index + 1}. ${entry.date} - ${entry.details}`, 20, 100 + index * 10);
            });
        }

        // Lưu file PDF với tên 'tour-history.pdf'
        doc.save('tour-history.pdf');
    };

    // Hàm gọi API
    const fetchApproveDetailData = async (newBooking) => {
        // console.log(bookingid);
        setIsOpenModalInfo(!isOpenModalInfo);
        try {
            const bookingResponse = await fetchBookingApprovedApplicationTourById(newBooking.booking_id);
            const approvedApplicationData = bookingResponse.data; // Giả sử API trả về mảng các tour
            setBookingDetails(approvedApplicationData);

            // Nếu API trả về mảng, hãy lấy phần tử đầu tiên
            if (Array.isArray(approvedApplicationData) && approvedApplicationData.length > 0) {
                setBookingDetails(approvedApplicationData[0]);
            } else {
                setBookingDetails(null); // Xử lý nếu không có dữ liệu hợp lệ
            }

            const participantResponse = await fetchParticipantsTourByBookingid(newBooking.booking_id);
            const participantData = participantResponse.data; // Giả sử API trả về mảng các tour
            setParticipants(participantData);
            console.log(participantData);

            // Gọi API để lấy thông tin chi tiết của phương tiện
            const vehicleResponse = await fetchVehicleByIddepart(newBooking.departure_id);
            const vehicleData = vehicleResponse.data;
            setVehicle(vehicleData);

            // Gọi API để lấy thông tin chi tiết của nơi ở
            const hotelResponse = await fetchHotelByIddepart(newBooking.departure_id);
            const hotelData = hotelResponse.data;
            setDepositHotel(hotelData);

        } catch (err) {
            console.error("Error fetching booking data:", err);
        }
    };

    // Bật của sổ update booking tour
    const handleModalUpdateClick = () => {
        setIsOpenModalUdate(!isOpenModalUpdate);
    };

    const handleUpdateBookingChange = (event) => {
        const { value, name } = event.target;
        setUserData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const ModalUpdateClick = async(newBooking) => {
        setIsOpenModalUdate(!isOpenModalUpdate);

        const bookingResponse = await fetchBookingApprovedApplicationTourById(newBooking.booking_id);
        const approvedApplicationData = bookingResponse.data; // Giả sử API trả về mảng các tour

        const participantResponse = await fetchParticipantsTourByBookingid(newBooking.booking_id);
            const participantData = participantResponse.data; // Giả sử API trả về mảng các tour

        setUserData({
            namend: approvedApplicationData[0].user_name,
            cccd: approvedApplicationData[0].cccd,
            booking_id: newBooking.booking_id
        });

        setUpdateParticipants( participantData );
    };

    const handleAddParticipant = (e, index) => {
        const { name, value } = e.target;
        setUpdateParticipants((prevParticipants) =>
          prevParticipants.map((updateParticipants, i) =>
            i === index ? { ...updateParticipants, [name]: value } : updateParticipants
          )
        );
      };

     // hủy đơn đặt tour
     const updateBookingTour = () => {
        // const updateParticipantsString = JSON.stringify(updateParticipants); // Chuyển đổi thành chuỗi JSON
        console.log(updateParticipants);
        // if (window.confirm('Bạn có chắc chắn muốn xóa phòng này?')) {
        fetch(`${SERVER_API}/admin/update_booking_tour.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                booking_id: userDatas.booking_id,
                namend: userDatas.namend,
                cccd: userDatas.cccd,
                participants: JSON.stringify(updateParticipants)
            }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') { // Kiểm tra 'success' thay vì 'status'
                    toast.success(data.message);
                    // setApprovedApplications(approvedApplications.filter(approvedApplication => approvedApplication.booking_id !== bookingId));
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

            <div className="container -mt-[602px] mx-auto sm:px-4 max-w-full" id="main-content">
                <div className="flex flex-wrap ">
                    <div className="lg:w-4/5 pr-4 pl-4 ms-auto p-6">
                        <h3 className="mb-4 text-left font-semibold text-2xl uppercase">Đơn đã duyệt</h3>
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
                                                <th scope="col" className="pl-3 sticky top-0 z-10 w-[80px]">Mã đơn</th>
                                                <th scope="col" className="sticky top-0 z-10 w-[300px]">Người đặt</th>
                                                <th scope="col" className="sticky top-0 z-10 w-[350px]">Tour</th>
                                                <th scope="col" className="sticky top-0 z-10 w-[300px]">Đơn đặt</th>
                                                <th scope="col" className="sticky top-0 z-10 w-[150px]">Trạng thái</th>
                                                <th scope="col" className="sticky top-0 z-10 w-[100px]">Tùy chọn</th>
                                            </tr>
                                        </thead>
                                        <tbody id="table-data" className="overflow-y-auto ">
                                            {filteredBookings.map((newBooking, index) => (
                                                <tr key={newBooking.booking_id} className="border-b-[1px] border-gray-200">
                                                    <td className="pl-3">{newBooking.booking_id}</td>
                                                    <td>
                                                        <span className='bg-[#0d6efd] text-white text-xs px-2 py-[2px] rounded-md'>
                                                            TT thanh toán : {newBooking.order_id}
                                                        </span>
                                                        <br />
                                                        <b className="">Name :</b> {newBooking.user_name}
                                                        <br />
                                                        <b>Phone No :</b> {newBooking.phonenum}
                                                    </td>
                                                    <td>
                                                        <div className="flex">
                                                            <div className="mr-2 font-semibold">Mã tour:</div>
                                                            <div>{newBooking.tour_id}</div>
                                                        </div>
                                                        <div className="flex">
                                                            <div className="mr-2 font-semibold">Tên:</div>
                                                            <div>{newBooking.tour_name}</div>
                                                        </div>
                                                        <div className="flex">
                                                            <div className="mr-2 font-semibold">Giá :</div> <PriceDisplay price={newBooking.price} />
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="flex">
                                                            <div className="mr-2 font-semibold">Ngày khởi hành:</div>
                                                            <div><FormatTime date={newBooking.day_depar} /></div>
                                                        </div>
                                                        <div className="flex">
                                                            <div className="mr-2 font-semibold">Tổng tiền :</div>  <PriceDisplay price={newBooking.price} />
                                                        </div>
                                                        <div className="flex">
                                                            <div className="mr-2 font-semibold">Ngày đặt:</div>
                                                            <div>{newBooking.datetime}</div>
                                                        </div>
                                                    </td>
                                                    <td className="">
                                                        {new Date(newBooking.day_depar).getTime() - new Date(currentDate).getTime() > 7 ? (
                                                            <button type='button' onClick={() => cancelBookingTour(newBooking.booking_id)} className='px-2 py-1 rounded-md btn border-[1px] border-[#dc3545] text-[#dc3545] hover:bg-[#dc3545] hover:text-white text-sm shadow-none'>
                                                                <i className='bi bi-trash'></i> Hủy đơn
                                                            </button>
                                                        ) : (
                                                            <div className="text-[#dc3545] text-sm">Không thể hủy đơn</div>
                                                        )}
                                                    </td>
                                                    <td>
                                                        <button type='button' onClick={() => generatePDF(newBooking)} className='border-[1px] border-[#198754] text-[#198754] hover:bg-[#198754] hover:text-white py-[2px] px-[5px] duration-100 shadow-none'>
                                                            <i className="fa-regular fa-file-pdf "></i>
                                                        </button>
                                                        <button type='button' onClick={() => fetchApproveDetailData(newBooking)} className='mx-3 border-[1px] border-[#0d6efd] text-[#0d6efd] hover:bg-[#356ec4] hover:text-white py-[2px] px-[7px] duration-100 shadow-none'>
                                                            <i className="fa-solid fa-file-invoice"></i>
                                                        </button>
                                                        <button type='button' onClick={() => ModalUpdateClick(newBooking)} className='mr-3 border-[1px] border-[#0d6efd] text-[#0d6efd] hover:bg-[#356ec4] hover:text-white py-[2px] px-[7px] duration-100 shadow-none'>
                                                            <i className="fa-solid fa-pen-to-square "></i>
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

            {/* thông tin chi tiết của đơn đặt tour */}
            {isOpenModalInfo && (
                <div className="w-full bg-black bg-opacity-25 inset-0 backdrop-blur-sm fixed z-50">
                    <div className="lg:w-3/5 h-[95%] mt-4 pr-4 pl-4 mx-auto p-6 bg-white overflow-hidden rounded-md overflow-y-auto">
                        <div>
                            <div className="modal-dialog modal-lg">
                                <div className="modal-content">
                                    <div className="modal-header mb-5 flex items-center w-full">
                                        <div className="w-1/2">
                                            <h5 className="modal-title text-left font-medium text-xl">Thông tin đơn đặt tour</h5>
                                        </div>
                                        <div className="w-1/2">
                                            <button type='button' onClick={handleModalClick} className="float-right">
                                                <i className="fa-regular fa-circle-xmark"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="h-[1px] w-full bg-gray-300"></div>
                                    <div className="modal-body my-3">
                                        {bookingDetails ? (
                                            <div>
                                                <div>
                                                    <div className="font-semibold text-lg text-left mb-4">Thông tin khách hàng</div>
                                                    <div className="flex">
                                                        <div className="flex w-1/2">
                                                            <div className="font-semibold">Mã Khách hàng:</div>
                                                            <div className="mx-2">{bookingDetails.user_id}</div>
                                                        </div>
                                                        <div className="flex w-1/2">
                                                            <div className="font-semibold">Tên Khách hàng:</div>
                                                            <div className="mx-2">{bookingDetails.user_name}</div>
                                                        </div>
                                                    </div>
                                                    <div className="flex">
                                                        <div className="flex w-1/2">
                                                            <div className="font-semibold">Số điện thoại:</div>
                                                            <div className="mx-2">{bookingDetails.phonenum}</div>
                                                        </div>
                                                        <div className="flex w-1/2">
                                                            <div className="font-semibold">Địa chỉ:</div>
                                                            <div className="mx-2">{bookingDetails.address}</div>
                                                        </div>
                                                    </div>
                                                    <div className="flex w-1/2">
                                                        <div className="font-semibold">CCCD:</div>
                                                        <div className="mx-2">{bookingDetails.cccd}</div>
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-lg mt-3 mb-4">Thông tin thành viên</div>
                                                        <div className="">
                                                            <table className="mx-auto border-[1px] border-black">
                                                                <thead>
                                                                    <tr className="border-[1px] border-black">
                                                                        <th className="border-[1px] border-black px-2">STT</th>
                                                                        <th className="border-[1px] border-black px-2">Độ tuổi</th>
                                                                        <th className="border-[1px] border-black">Tên</th>
                                                                        <th className="border-[1px] border-black">Ngày sinh</th>
                                                                        <th className="border-[1px] border-black">Giới tính</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {participants.map((participant, index) => (
                                                                        <tr className="border-[1px] border-black" key={participant.id}>
                                                                            <td className="border-[1px] border-black px-2">{index + 1}</td>
                                                                            <td className="border-[1px] border-black px-2">{participant.type}</td>
                                                                            <td className="border-[1px] border-black px-2 text-left">{participant.name}</td>
                                                                            <td className="border-[1px] border-black px-2"><FormatTime date={participant.dob} /></td>
                                                                            <td className="border-[1px] border-black px-2">{participant.gender}</td>
                                                                        </tr>

                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-lg text-left mb-4 mt-9">Thông tin tour</div>
                                                    <div className="flex">
                                                        <div className="flex w-1/3">
                                                            <div className="font-semibold">Mã tour:</div>
                                                            <div className="mx-2">{bookingDetails.booking_id}</div>
                                                        </div>
                                                        <div className="flex w-2/3 text-left">
                                                            <div className="font-semibold w-[20%]">Tên tour:</div>
                                                            <div className="w-[80%]">{bookingDetails.tour_name}</div>
                                                        </div>
                                                    </div>
                                                    <div className="flex">
                                                        <div className="flex w-1/3">
                                                            <div className="font-semibold">Số người tham gia:</div>
                                                            <div className="mx-2">{bookingDetails.participant}</div>
                                                        </div>
                                                        <div className="flex w-2/3">
                                                            <div className="font-semibold">Ngày khởi hành:</div>
                                                            <div className="mx-2"><FormatTime date={bookingDetails.day_depar} /></div>
                                                        </div>
                                                    </div>
                                                    <div className="flex">
                                                        <div className="flex w-1/3">
                                                            <div className="font-semibold">Giá tour:</div>
                                                            <div className="mx-2"><PriceDisplay price={bookingDetails.price} /></div>
                                                        </div>
                                                        <div className="flex w-2/3">
                                                            <div className="font-semibold">Tổng tiền:</div>
                                                            <div className="mx-2"><PriceDisplay price={bookingDetails.total_pay} /></div>
                                                        </div>
                                                    </div>
                                                    <div className="flex">
                                                        <div className="flex w-1/3">
                                                            <div className="font-semibold">TT thanh toán:</div>
                                                            <div className="mx-2">{bookingDetails.order_id}</div>
                                                        </div>
                                                        <div className="flex w-12/3">
                                                            <div className="font-semibold">Thời gian thanh toán:</div>
                                                            <div className="mx-2">{bookingDetails.datetime}</div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="font-medium mt-3">Phương tiện</div>
                                                        <div>
                                                            {vehicle && Array.isArray(vehicle) && vehicle.length > 0 ? (
                                                                vehicle.map((vehicle) => (
                                                                    <div className="w-full mt-3" key={vehicle.id}>
                                                                        <div className="mx-auto border-[1px] border-gray-300 py-2 px-3 rounded-lg" style={{ boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', }}>
                                                                            <div className="font-semibold text-xl text-[#FF5E1F] mt-4 mb-3"><FormatTime date={vehicle.day_depar} /></div>
                                                                            <div className="text-xl font-semibold text-[#3467cd] mb-4">Phương tiện di chuyển</div>
                                                                            {vehicle.type === 'xe khach' ? (
                                                                                <div className="flex mx-auto" key={vehicle.id}>
                                                                                    <div className="w-[45%]">
                                                                                        <div className="flex mb-3">
                                                                                            <div className="font-medium text-xs">Ngày đi:</div>
                                                                                            <div className="mx-2 text-xs"><FormatTime date={vehicle.departure_date} /></div>
                                                                                        </div>
                                                                                        <div className="flex mb-2">
                                                                                            <div className="w-1/3 text-left text-xs font-medium">{vehicle.departure_time1}</div>
                                                                                            <div className="w-1/3"><i className="fa-solid fa-bus text-xs"></i></div>
                                                                                            <div className="w-1/3 text-right text-xs font-medium">{vehicle.arrival_time1}</div>
                                                                                        </div>
                                                                                        <div className="w-full h-[1px] bg-gray-300"></div>
                                                                                        <div className="flex mt-2">
                                                                                            <div className="w-1/3 text-left font-semibold text-xs">{vehicle.departure1}</div>
                                                                                            <div className="w-1/3"></div>
                                                                                            <div className="w-1/3 text-right font-semibold text-xs">{vehicle.destination1}</div>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="w-[10%]">
                                                                                        <div className="mx-auto w-[1px] h-[100px] bg-gray-200"></div>
                                                                                    </div>
                                                                                    <div className="w-[45%]">
                                                                                        <div className="flex mb-3">
                                                                                            <div className="font-medium text-xs">Ngày về:</div>
                                                                                            <div className="mx-2 text-xs"><FormatTime date={vehicle.return_date} /></div>
                                                                                        </div>
                                                                                        <div className="flex mb-2">
                                                                                            <div className="w-1/3 text-left font-medium text-xs">{vehicle.departure_time2}</div>
                                                                                            <div className="w-1/3"><i className="fa-solid fa-bus text-xs"></i></div>
                                                                                            <div className="w-1/3 text-right font-medium text-xs">{vehicle.arrival_time2}</div>
                                                                                        </div>
                                                                                        <div className="w-full h-[1px] bg-gray-300"></div>
                                                                                        <div className="flex mt-2">
                                                                                            <div className="w-1/3 text-left font-semibold text-xs">{vehicle.departure2}</div>
                                                                                            <div className="w-1/3"></div>
                                                                                            <div className="w-1/3 text-right font-semibold text-xs">{vehicle.destination2}</div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            ) : vehicle.type === 'may bay' ? (
                                                                                <div className="flex mx-auto" key={vehicle.id}>
                                                                                    <div className="w-[45%]">
                                                                                        <div className="flex mb-3 justify-between items-center">
                                                                                            <div className="flex">
                                                                                                <div className="font-medium text-xs">Ngày đi:</div>
                                                                                                <div className="mx-2 text-xs"><FormatTime date={vehicle.departure_date} /></div>
                                                                                            </div>
                                                                                            <div className="flex items-center">
                                                                                                <div><i className="fa-solid fa-plane-departure text-[#007aff] text-xs"></i></div>
                                                                                                <div className="ml-2 text-[#007aff] text-xs">{vehicle.vehicle_number1}</div>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="flex mb-2">
                                                                                            <div className="w-1/3 text-left font-medium text-xs">{vehicle.departure_time1}</div>
                                                                                            <div className="w-1/3 text-[#007aff] tracking-wide text-xs">{vehicle.company1}</div>
                                                                                            <div className="w-1/3 text-right font-medium text-xs">{vehicle.arrival_time1}</div>
                                                                                        </div>
                                                                                        <div className="w-full h-[1px] bg-gray-300"></div>
                                                                                        <div className="flex mt-2">
                                                                                            <div className="w-1/3 text-left font-semibold text-xs">{vehicle.departure1}</div>
                                                                                            <div className="w-1/3"></div>
                                                                                            <div className="w-1/3 text-right font-semibold text-xs">{vehicle.destination1}</div>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="w-[10%]">
                                                                                        <div className="mx-auto w-[1px] h-[130px] bg-gray-200"></div>
                                                                                    </div>
                                                                                    <div className="w-[45%]">
                                                                                        <div className="flex mb-3 justify-between items-center">
                                                                                            <div className="flex">
                                                                                                <div className="font-medium text-xs">Ngày về:</div>
                                                                                                <div className="mx-2 text-xs"><FormatTime date={vehicle.return_date} /></div>
                                                                                            </div>
                                                                                            <div className="flex items-center">
                                                                                                <div><i className="fa-solid fa-plane-departure text-[#007aff] text-xs"></i></div>
                                                                                                <div className="ml-2 text-[#007aff] text-xs">{vehicle.vehicle_number2}</div>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="flex mb-2">
                                                                                            <div className="w-1/3 text-left font-medium text-xs">{vehicle.departure_time2}</div>
                                                                                            <div className="w-1/3 text-[#007aff] tracking-wide text-xs">{vehicle.company1}</div>
                                                                                            <div className="w-1/3 text-right font-medium text-xs">{vehicle.arrival_time2}</div>
                                                                                        </div>
                                                                                        <div className="w-full h-[1px] bg-gray-300"></div>
                                                                                        <div className="flex mt-2">
                                                                                            <div className="w-1/3 text-left font-semibold text-xs">{vehicle.departure2}</div>
                                                                                            <div className="w-1/3"></div>
                                                                                            <div className="w-1/3 text-right font-semibold text-xs">{vehicle.destination2}</div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            ) : (
                                                                                <div>Phương tiện không xác định</div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                <p className="mt-3">Không có thông tin phương tiện!</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="font-medium mt-3">Nơi ở</div>
                                                        <div className="my-3">
                                                            {depositHotel && Array.isArray(depositHotel) && depositHotel.length > 0 ? (
                                                                depositHotel.map((Hotel) => (
                                                                    <div key={Hotel.id} className="mx-auto border-[1px] border-gray-300 py-2 px-3 rounded-lg" style={{ boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', }}>
                                                                        <div className="flex text-left">
                                                                            <div className="font-semibold w-[15%]">Khách sạn: </div>
                                                                            <div className="mr-2 w-[85%]">{Hotel.name_hotel}</div>
                                                                        </div>
                                                                        <div className="flex text-left">
                                                                            <div className="font-semibold w-[10%]">Địa chỉ: </div>
                                                                            <div className="mr-2 w-[90%]">{Hotel.address}</div>
                                                                        </div>
                                                                        <div className="flex text-left">
                                                                            <div className="font-semibold ">Loại phòng: </div>
                                                                            <div className="mx-2">{Hotel.type}</div>
                                                                        </div>
                                                                        <div className="flex w-1/3">
                                                                            <div className="font-semibold">Số lượng: </div>
                                                                            <div className="mx-2">{Hotel.quantity}</div>
                                                                        </div>
                                                                        <div className="flex">
                                                                            <div className="flex items-center w-1/2">
                                                                                <div className="font-semibold">Ngày nhận: </div>
                                                                                <div className="mx-2 text-sm"><FormatTime date={Hotel.check_in} /></div>
                                                                            </div>
                                                                            <div className="flex items-center w-1/2">
                                                                                <div className="font-semibold">Ngày trả: </div>
                                                                                <div className="mx-2 text-sm"><FormatTime date={Hotel.check_out} /></div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex text-left">
                                                                            <div className="font-semibold w-[10%]">Mô tả</div>
                                                                            <div className="mx-2 w-[90%]">{Hotel.description}</div>
                                                                        </div>
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                <p className="mt-3">Không có thông tin nơi ở!</p>
                                                            )}

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <p>Đang tải dữ liệu...</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Update booking tour */}
            {isOpenModalUpdate && (
                <div className="w-full bg-black bg-opacity-25 inset-0 backdrop-blur-sm fixed z-20">
                    <div className="row w-[50%] mt-[50px] mx-auto border-[1px] bg-white border-gray-300 rounded-sm py-3 px-3 shadow-sm overflow-auto max-h-[600px]">
                        <div className="font-semibold text-xl my-4 text-left">
                            Cập nhật thông tin đặt tour
                        </div>
                        <div className="h-[1px] w-full bg-gray-300 rounded-sm mb-5"></div>
                        <div className="mt-5 pl-3">
                            <div className="text-left text-lg font-medium mb-5">Thông tin người dùng</div>
                            <div>
                                <div className="flex gap-x-3 mb-2">
                                    <div className="text-left mb-2 w-1/2">
                                        <div>Họ tên</div>
                                        <div>
                                            <input type='text' name='namend' 
                                                value={userDatas.namend || ""}
                                                onChange={handleUpdateBookingChange}
                                                className='w-[300px] border-[1px] border-gray-200 outline-none px-2 py-1 rounded-md'
                                                required>
                                            </input>
                                        </div>
                                    </div>
                                    <div className="text-left mb-2 w-1/2">
                                        <div>CCCD/CMND</div>
                                        <div>
                                            <input type='text' name='cccd' value={userDatas.cccd || ""} onChange={handleUpdateBookingChange} className='w-[300px] border-[1px] border-gray-200 outline-none px-2 py-1 rounded-md' required></input>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="text-left text-lg font-medium mb-5">Thông tin thành viên đi cùng</div>
                            <div>
                            {updateParticipants.map((participant, index) => (
                                <div className="flex" key={index}>
                                    
                                    <div className="w-2/5">
                                        <div>Họ tên</div>
                                        <div>
                                            <input type='text' 
                                                    name='name' 
                                                    value={participant.name || ""} 
                                                    onChange={(e) => handleAddParticipant(e, index)}
                                                    className=' border-[1px] border-gray-200 outline-none px-2 py-1 rounded-md' required>

                                            </input>
                                        </div>
                                    </div>
                                    <div className="w-1/5">
                                        <div>Giới tính</div>
                                        <div>
                                            <select 
                                                className="border-[1px] border-gray-300 px-2 py-1 rounded-md"
                                                name="gender"
                                                value={participant.gender || ""} 
                                                onChange={(e) => handleAddParticipant(e, index)}
                                            >
                                                <option value={"Nam"}>Nam</option>
                                                <option value={"Nữ"}>Nữ</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="w-2/5">
                                        <div>Ngày sinh</div>
                                        <div>
                                            <input type='date' 
                                                    name='dob' 
                                                    value={participant.dob || ""} 
                                                    max={today}
                                                    onChange={(e) => handleAddParticipant(e, index)}
                                                    className=' border-[1px] border-gray-200 outline-none px-2 py-1 rounded-md' required>

                                            </input>
                                        </div>
                                    </div>
                                    {/* <div className="w-[50%] h-[1px] bg-gray-300 rounded-sm mx-auto mt-3"></div> */}
                                </div>
                            ))} 
                            </div>
                        </div>
                        <div className="flex gap-x-2 items-center justify-center mt-3">
                            <div className="">
                                <button type="button" onClick={handleModalUpdateClick} className="bg-black w-[90px] border-[1px] border-black hover:bg-white hover:text-black text-white px-2 py-[2px] rounded-[3px] text-sm">
                                    Hủy
                                </button>
                            </div>
                            <div className="">
                                <button type="submit" onClick={() => updateBookingTour()} className="bg-[#007aff] w-[90px] border-[1px] border-[#007aff] hover:bg-white hover:text-black text-white px-2 py-[2px] rounded-[3px] text-sm">
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
export default ApprovedApplication;