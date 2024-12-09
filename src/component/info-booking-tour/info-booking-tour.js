import Header from "../header";
import Footer from "../footer/footer";
import PriceDisplay from "../service/money";
import { fetchBookingRecordTourByUser } from "../api/tours";
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import FormatTime from "../service/fomat-time";
import { fetchBookingRecordTourById } from "../api/tours";
import { fetchParticipantsTourByBookingid } from "../api/tours";
import { fetchVehicleByIddepart } from "../api/tours";
import { fetchHotelByIddepart } from "../api/tours";
import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import config from "../../component/config.json";

const { SERVER_API } = config;

const initFormRating = {
    booking_id: "",
    tour_id: "",
    rating: "",
    review: ""
};

function InfoBookingTour() {

    const [newBookings, setNewBookings] = useState([]);
    const [isOpenModalInfo, setIsOpenModalInfo] = useState(false);
    const [isOpenModalRating, setIsOpenModalRating] = useState(false);
    const [bookingDetails, setBookingDetails] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [vehicle, setVehicle] = useState([]);
    const [depositHotel, setDepositHotel] = useState([]);
    const [formRating, setFormRating] = useState(initFormRating);

    const currentDate = new Date();


    // Bật/ẩn của sổ thông tin đơn đặt tour
    const handleModalClick = () => {
        setIsOpenModalInfo(!isOpenModalInfo);
    };

    // Bật/ẩn của sổ đánh giá tour
    const handleModalRatingClick = (newBooking) => {
        setIsOpenModalRating(!isOpenModalRating);
        setFormRating({
            booking_id: newBooking.booking_id,
            tour_id: newBooking.tour_id,
            rating: 5,
        });
    };

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


    useEffect(() => {
        fetchBookingData();
    }, []); // Chỉ chạy một lần khi component được mount


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
                    // setNewBookings(newBookings.filter(newBooking => newBooking.booking_id !== bookingId));
                    toast.success(data.message);
                    // Gọi lại API để lấy danh sách booking mới
                    fetchBookingData();
                } else {
                    toast.error(data.message);
                }
            })
            .catch(error => {
                toast.error('Lỗi.');
                console.log('Có lỗi xảy ra:', error);
            });
    };

    const fetchApproveDetailData = async (bookingTour) => {
        // console.log(bookingid);
        setIsOpenModalInfo(!isOpenModalInfo);
        try {
            const bookingResponse = await fetchBookingRecordTourById(bookingTour.booking_id);
            const bookingRecordData = bookingResponse.data; // Giả sử API trả về mảng các tour
            setBookingDetails(bookingRecordData);

            // Nếu API trả về mảng, hãy lấy phần tử đầu tiên
            if (Array.isArray(bookingRecordData) && bookingRecordData.length > 0) {
                setBookingDetails(bookingRecordData[0]);
            } else {
                setBookingDetails(null); // Xử lý nếu không có dữ liệu hợp lệ
            }

            const participantResponse = await fetchParticipantsTourByBookingid(bookingTour.booking_id);
            const participantData = participantResponse.data; // Giả sử API trả về mảng các tour
            setParticipants(participantData);
            console.log(participantData);

            // Gọi API để lấy thông tin chi tiết của phương tiện
            const vehicleResponse = await fetchVehicleByIddepart(bookingTour.departure_id);
            const vehicleData = vehicleResponse.data;
            setVehicle(vehicleData);

            // Gọi API để lấy thông tin chi tiết của nơi ở
            const hotelResponse = await fetchHotelByIddepart(bookingTour.departure_id);
            const hotelData = hotelResponse.data;
            setDepositHotel(hotelData);

        } catch (err) {
            console.error("Error fetching booking data:", err);
        }
    };

    const handleRatingChange = (event) => {
        const { value, name } = event.target;
        setFormRating((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Đánh giá tour
    const createTourRating = async (event) => {
        const userData = localStorage.getItem('user');
        const user = JSON.parse(userData);
        console.log(formRating); // Lấy ID người dùng 

        event.preventDefault(); //để không tự động reset

        fetch(`${SERVER_API}/create_rating_tour.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: user.id,
                booking_id: formRating.booking_id,
                tour_id: formRating.tour_id,
                rating: formRating.rating,
                review: formRating.review
            }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    // setFormVehicle(initVehicle);
                    toast.success(data.message);

                } else if (data.status === 'error') {
                    toast.error(data.message);
                } else if (data.status === 'warning') {
                    toast.warning(data.message);
                }
            })
            .catch(error => {
                toast.error('lỗi.');
                console.log('Có lỗi xảy ra:', error);
            });
    };

    const checkPageOverflow = (doc, yPosition) => {
        const pageHeight = doc.internal.pageSize.height;
        if (yPosition > pageHeight - 20) {
            doc.addPage();
            yPosition = 20;  // Reset yPosition to the top of the new page
        }
        return yPosition;
    };

    const generatePDF = async (bookingTour) => {

        const participantResponse = await fetchParticipantsTourByBookingid(bookingTour.booking_id);
        const participantData = participantResponse.data; // Giả sử API trả về mảng các tour
        setParticipants(participantData);

        const vehicleResponse = await fetchVehicleByIddepart(bookingTour.departure_id);
        const vehicleData = vehicleResponse.data;

        const hotelResponse = await fetchHotelByIddepart(bookingTour.departure_id);
        const hotelData = hotelResponse.data;

        const doc = new jsPDF();

        doc.setFont('font-times-new-roman', 'normal');

        // Tạo mã QR dựa trên thông tin đơn tour (sử dụng booking_id làm ví dụ)
        const qrData = bookingTour.booking_id; // Hoặc nội dung bạn muốn mã hóa
        const qrCodeUrl = await QRCode.toDataURL(String(qrData || 'N/A'), { errorCorrectionLevel: 'M' });

        const maxWidth = 130;

        //Tiêu đề
        const text = "HÓA ĐƠN TOUR";
        const textWidth = doc.getTextWidth(text);
        // Tính toán vị trí x để căn giữa
        const pageWidth = doc.internal.pageSize.getWidth();
        const x = (pageWidth - textWidth) / 2; // Căn giữa
        // Thêm văn bản vào PDF
        doc.text(text, x, 10);

        // Chèn mã QR vào PDF
        const qrSize = 50; // Kích thước mã QR trong PDF
        doc.addImage(qrCodeUrl, 'PNG', 160, 10, qrSize, qrSize); // Vị trí góc phải trên cùng

        doc.setFontSize(14);
        const textTour = "THÔNG TIN TOUR";
        doc.text(textTour, 20, 35);

        doc.setFontSize(12);

        doc.text(`Mã đơn: ${bookingTour.booking_id || 'N/A'}`, 20, 43);

        const tourName = doc.splitTextToSize(`Tên tour: ${bookingTour.tour_name + 1 || 'N/A'}`, maxWidth);
        tourName.forEach((line, index) => {
            doc.text(line, 20, 51 + (index * 5)); // Cách nhau 8 đơn vị
        });

        // const formattedPrice = (bookingTour.price || 0).toLocaleString('vi-VN', {
        //     style: 'currency',
        //     currency: 'VND'
        // });
        // doc.text(`Giá tour: ${formattedPrice || 'N/A'}`, 20, 51);
        // doc.text(`Khuyến mãi: ${bookingTour.discount  || 'N/A'} %`, 70, 51);
        doc.text(`Số người tham gia đi cùng: ${bookingTour.participant + 1 || 'N/A'}`, 20, 65);

        const formattedTotal = (bookingTour.total_pay || 0).toLocaleString('vi-VN', {
            style: 'currency',
            currency: 'VND'
        });
        doc.text(`Tổng giá: ${formattedTotal || 'N/A'}`, 20, 73);
        doc.text(`Start Date: ${bookingTour.datetime || 'N/A'}`, 20, 81);

        doc.setFontSize(14);
        const textCustomer = "THÔNG TIN KHÁCH HÀNG";
        doc.text(textCustomer, 20, 89);

        doc.setFontSize(12);

        doc.text(`Mã khách hàng: ${bookingTour.user_id || 'N/A'}`, 20, 97);
        doc.text(`Tên khách hàng: ${bookingTour.user_name || 'N/A'}`, 20, 105);
        doc.text(`Cccd: ${bookingTour.cccd || 'N/A'}`, 20, 113);
        doc.text(`Số điện thoại: ${bookingTour.phonenum || 'N/A'}`, 20, 121);
        doc.text(`Địa chỉ: ${bookingTour.address || 'N/A'}`, 20, 129);

        const text3 = "Danh sách người đi cùng";
        const textWidth2 = doc.getTextWidth(text3);
        // Tính toán vị trí x để căn giữa
        const pageWidth2 = doc.internal.pageSize.getWidth();
        const x2 = (pageWidth2 - textWidth2) / 2; // Căn giữa
        doc.text(text3, x2, 139);

        // Vẽ bảng
        const startY = 147; // Vị trí Y bắt đầu cho bảng
        const rowHeight = 10; // Chiều cao của mỗi hàng
        const columns = ["STT", "Phân loại", "Tên", "Giới tính", "Ngày sinh"]; // Tiêu đề các cột

        // Vẽ tiêu đề bảng
        doc.setFontSize(12);
        columns.forEach((col, index) => {
            doc.text(col, 20 + (index * 40), startY); // Cách nhau 60 đơn vị
        });

        // Duyệt qua mảng participants và thêm từng người vào bảng
        let yPosition = startY + rowHeight; // Bắt đầu vị trí Y cho dữ liệu
        if (Array.isArray(participantData) && participantData.length > 0) {
            console.log(participants);
            participantData.forEach((participant, index) => {
                doc.text(`${index + 1}`, 20, yPosition); // Số thứ tự
                doc.text(participant.type || 'N/A', 60, yPosition); // Tên
                doc.text(participant.name || 'N/A', 100, yPosition); // Tên
                doc.text(participant.gender || 'N/A', 140, yPosition); // Giới tính
                doc.text(participant.dob || 'N/A', 180, yPosition); // Giới tính

                // Vẽ đường kẻ ngang dưới mỗi hàng
                doc.line(20, yPosition + 3, 200, yPosition + 3); // Đường kẻ ngang dưới hàng
                yPosition += rowHeight; // Tăng vị trí Y
            });
        } else {
            doc.text("Không có dữ liệu người tham gia.", 20, yPosition);
        }

        checkPageOverflow(doc, yPosition);
        yPosition += 20;
        const text4 = "Phương tiện";
        const textWidth3 = doc.getTextWidth(text4);
        // Tính toán vị trí x để căn giữa
        const pageWidth3 = doc.internal.pageSize.getWidth();
        const x3 = (pageWidth3 - textWidth3) / 2; // Căn giữa
        doc.text(text4, x3, yPosition);

        yPosition += 10;
        yPosition = checkPageOverflow(doc, yPosition);
        doc.text('Chiều đi', 20, yPosition);
        yPosition += 5;
        yPosition = checkPageOverflow(doc, yPosition);
        doc.text(`Loại phương tiện: ${vehicleData[0].type}`, 20, yPosition);
        yPosition += 5;
        yPosition = checkPageOverflow(doc, yPosition);
        doc.text(`Ngày khởi hành: ${vehicleData[0].departure_date}`, 20, yPosition);
        yPosition += 5;
        yPosition = checkPageOverflow(doc, yPosition);
        doc.text(`Thời gian khởi hành: ${vehicleData[0].departure_time1}`, 20, yPosition);

        doc.text(`Từ: ${vehicleData[0].departure1}`, 100, yPosition);
        yPosition += 5;
        yPosition = checkPageOverflow(doc, yPosition);
        doc.text(`Thời gian hạ cánh: ${vehicleData[0].arrival_time1}`, 20, yPosition);
        doc.text(`Đến: ${vehicleData[0].destination1}`, 100, yPosition);
        yPosition += 5;
        yPosition = checkPageOverflow(doc, yPosition);
        doc.text(`Hãng: ${vehicleData[0].company1}`, 20, yPosition);
        yPosition += 5;
        yPosition = checkPageOverflow(doc, yPosition);
        doc.text(`Số hiệu: ${vehicleData[0].vehicle_number1}`, 20, yPosition);

        yPosition += 10;
        yPosition = checkPageOverflow(doc, yPosition);
        doc.text('Chiều về', 20, yPosition);
        yPosition += 5;
        yPosition = checkPageOverflow(doc, yPosition);
        doc.text(`Loại phương tiện: ${vehicleData[0].type}`, 20, yPosition);
        yPosition += 5;
        yPosition = checkPageOverflow(doc, yPosition);
        doc.text(`Ngày khởi hành: ${vehicleData[0].return_date}`, 20, yPosition);
        yPosition += 5;
        yPosition = checkPageOverflow(doc, yPosition);
        doc.text(`Thời gian khởi hành: ${vehicleData[0].departure_time1}`, 20, yPosition);
        doc.text(`Từ: ${vehicleData[0].departure1}`, 100, yPosition);
        yPosition += 5;
        yPosition = checkPageOverflow(doc, yPosition);
        doc.text(`Thời gian hạ cánh: ${vehicleData[0].arrival_time1}`, 20, yPosition);
        doc.text(`Đến: ${vehicleData[0].destination1}`, 100, yPosition);
        yPosition += 5;
        yPosition = checkPageOverflow(doc, yPosition);
        doc.text(`Hãng: ${vehicleData[0].company1}`, 20, yPosition);
        yPosition += 5;
        yPosition = checkPageOverflow(doc, yPosition);
        doc.text(`Số hiệu: ${vehicleData[0].vehicle_number1}`, 20, yPosition);

        yPosition += 30;
        yPosition = checkPageOverflow(doc, yPosition);
        const text5 = "Nơi ở";
        const textWidth4 = doc.getTextWidth(text4);
        // Tính toán vị trí x để căn giữa
        const pageWidth4 = doc.internal.pageSize.getWidth();
        const x4 = (pageWidth4 - textWidth4) / 2; // Căn giữa
        doc.text(text5, x4, yPosition);

        yPosition += 10;
        yPosition = checkPageOverflow(doc, yPosition);
        doc.text(`Khách sạn: ${hotelData[0].name_hotel}`, 20, yPosition);
        yPosition += 5;
        yPosition = checkPageOverflow(doc, yPosition);
        doc.text(`Địa chỉ: ${hotelData[0].address}`, 20, yPosition);
        yPosition += 5;
        yPosition = checkPageOverflow(doc, yPosition);
        doc.text(`Kiểu phòng: ${hotelData[0].type}`, 20, yPosition);
        yPosition += 5;
        yPosition = checkPageOverflow(doc, yPosition);
        doc.text(`Mô tả: ${hotelData[0].description}`, 20, yPosition);

        // Lưu file PDF với tên 'tour-history.pdf'
        doc.save(`tour-booking-${bookingTour.booking_id}.pdf`);
    };

    return (
        <div>
            <Header />

            <div className="min-h-screen pt-[130px] bg-gray-100">
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
                                    <div className="font-semibold">TT thanh toán:</div>
                                    <div className="ml-2">{newBooking.order_id}</div>
                                </div>
                                <div className=" mx-3">
                                    <div className="font-semibold">Thời gian thanh toán:</div>
                                    <div className="ml-2">{newBooking.datetime}</div>
                                </div>
                                {newBooking.refund === 1 && newBooking.arrival === 0 ? (
                                    <div>
                                        <div className="flex">
                                            <div className="ml-3 mb-3 mt-4 w-[70px] py-[2px] bg-[#dc3545] text-center rounded-md text-white text-xs font-semibold">
                                                <p className="px-2 py-1 text-center">Đã hủy</p>
                                            </div>
                                            <div className="ml-3 mb-3 mt-4 w-[120px] py-[2px] bg-[#198754] text-center rounded-md text-white text-xs font-semibold">
                                                <p className="px-2 py-1 text-center">Đã hoàn tiền</p>
                                            </div>
                                        </div>
                                        <div className="flex justify-center">
                                            <button type="button" onClick={() => fetchApproveDetailData(newBooking)} className="w-[90%] bg-black mx-2 inline-block align-middle text-center select-none border-[1px] border-black hover:bg-white hover:text-black duration-75 font-normal whitespace-no-wrap rounded py-1 px-3 leading-normal no-underline custom-bg text-white shadow-none">
                                                <p className="text-sm">Xem chi tiết</p>
                                            </button>
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
                                            <button type="button" className="w-[110px] bg-[#0d6efd] hover:bg-[#285394] mx-2 inline-block align-middle text-center select-none border font-normal whitespace-no-wrap rounded py-1 px-3 leading-normal no-underline custom-bg text-white shadow-none">
                                                <p className="text-sm font-semibold">Thanh toán</p>
                                            </button>
                                        </div>
                                    </div>
                                ) : newBooking.refund === null && newBooking.arrival === 0 && newBooking.order_id !== null ? (
                                    newBooking.day_depar - currentDate > 7 ? (
                                        <div>
                                            <div className="flex gap-2">
                                                <div className="ml-3 mb-3 mt-4 w-[110px] py-[2px] bg-[#198754] text-center rounded-md text-white text-xs font-semibold">
                                                    <p className="px-2 py-1 text-center">Chờ xác nhận</p>
                                                </div>
                                                <div className=" mb-3 mt-4 w-[130px] py-[2px] bg-[#198754] text-center rounded-md text-white text-xs font-semibold">
                                                    <p className="px-2 py-1 text-center">Đã thanh toán</p>
                                                </div>
                                            </div>
                                            {/* <div className="text-gray-400 text-xs text-center mb-2">Bạn cần thanh toán trong vòng 24h kể từ lúc đặt tour</div> */}
                                            <div className="ml-[3px]">
                                                <button type="button" onClick={() => cancelBookingTour(newBooking.booking_id)} className="w-[90px] bg-[#dc3545] hover:bg-[#cf3a49] mx-2 inline-block align-middle text-center select-none border font-normal whitespace-no-wrap rounded py-1 px-3 leading-normal no-underline custom-bg text-white shadow-none">
                                                    <p className="text-sm font-semibold">Hủy tour</p>
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <div className="flex gap-2">
                                                <div className="ml-3 mb-3 mt-4 w-[110px] py-[2px] bg-[#198754] text-center rounded-md text-white text-xs font-semibold">
                                                    <p className="px-2 py-1 text-center">Chờ xác nhận</p>
                                                </div>
                                                <div className=" mb-3 mt-4 w-[130px] py-[2px] bg-[#198754] text-center rounded-md text-white text-xs font-semibold">
                                                    <p className="px-2 py-1 text-center">Đã thanh toán</p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                ) : newBooking.refund === null && newBooking.arrival === 1 ? (
                                    new Date(newBooking.day_depar).getTime() - new Date(currentDate).getTime() > 7 ? (
                                        <div>
                                            <div className="mx-3 mb-3 mt-4 w-[100px] py-[2px] bg-[#198754] text-center rounded-md text-white text-xs font-semibold">
                                                <p className="px-2 py-1 text-center">Đã xác nhận</p>
                                            </div>
                                            <div className="flex mb-3 gap-2">
                                                <div className="w-[45%]">
                                                    <button type="button" onClick={() => generatePDF(newBooking)} className="w-full bg-black mx-2 inline-block align-middle text-center select-none border-[1px] border-black hover:bg-white hover:text-black duration-100 font-normal whitespace-no-wrap rounded py-1 px-3 leading-normal no-underline custom-bg text-white shadow-none">
                                                        <p className="text-sm">PDF</p>
                                                    </button>
                                                </div>
                                                <div className="w-[45%]">
                                                    <button type="button" onClick={() => handleModalRatingClick(newBooking)} className="w-full bg-black mx-2 inline-block align-middle text-center select-none border-[1px] border-black hover:bg-white hover:text-black duration-100 font-normal whitespace-no-wrap rounded py-1 px-3 leading-normal no-underline custom-bg text-white shadow-none">
                                                        <p className="text-sm">Đánh giá</p>
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <div className="w-[45%]">
                                                    <button type="button" onClick={() => fetchApproveDetailData(newBooking)} className=" w-full bg-black mx-2 inline-block align-middle text-center select-none border-[1px] border-black hover:bg-white hover:text-black duration-75 font-normal whitespace-no-wrap rounded py-1 leading-normal no-underline custom-bg text-white shadow-none">
                                                        <p className="text-sm">Xem chi tiết</p>
                                                    </button>
                                                </div>
                                                <div className="w-[45%]">
                                                    <button type="button" onClick={() => cancelBookingTour(newBooking.booking_id)} className="w-full bg-[#dc3545] hover:bg-[#cf3a49] mx-2 inline-block align-middle text-center select-none border font-normal whitespace-no-wrap rounded py-1 leading-normal no-underline custom-bg text-white shadow-none">
                                                        <p className="text-sm font-semibold">Hủy tour</p>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <div className="mx-3 mb-3 mt-4 w-[100px] py-[2px] bg-[#198754] text-center rounded-md text-white text-xs font-semibold">
                                                <p className="px-2 py-1 text-center">Đã xác nhận</p>
                                            </div>
                                            <div className="flex mb-3 gap-2">
                                                <div className="w-[45%]">
                                                    <button type="button" onClick={() => generatePDF(newBooking)} className="w-full bg-black mx-2 inline-block align-middle text-center select-none border-[1px] border-black hover:bg-white hover:text-black duration-100 font-normal whitespace-no-wrap rounded py-1 px-3 leading-normal no-underline custom-bg text-white shadow-none">
                                                        <p className="text-sm">PDF</p>
                                                    </button>
                                                </div>
                                                <div className="w-[45%]">
                                                    <button type="button" onClick={() => handleModalRatingClick(newBooking)} className="w-full bg-black mx-2 inline-block align-middle text-center select-none border-[1px] border-black hover:bg-white hover:text-black duration-100 font-normal whitespace-no-wrap rounded py-1 px-3 leading-normal no-underline custom-bg text-white shadow-none">
                                                        <p className="text-sm">Đánh giá</p>
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="flex justify-center">
                                                <button type="button" onClick={() => fetchApproveDetailData(newBooking)} className="w-[90%] bg-black mx-2 inline-block align-middle text-center select-none border-[1px] border-black hover:bg-white hover:text-black duration-75 font-normal whitespace-no-wrap rounded py-1 px-3 leading-normal no-underline custom-bg text-white shadow-none">
                                                    <p className="text-sm">Xem chi tiết</p>
                                                </button>
                                            </div>
                                        </div>
                                    )
                                ) : newBooking.refund === 1 && newBooking.arrival === 1 ? (
                                    <div>
                                        <div className="mx-3 mb-3 mt-4 w-[70px] py-[2px] bg-[#dc3545] text-center rounded-md text-white text-xs font-semibold">
                                            <p className="px-2 py-1 text-center">Đã hủy</p>
                                        </div>
                                        <div className="flex justify-center">
                                            <button type="button" onClick={() => fetchApproveDetailData(newBooking)} className="w-[90%] bg-black mx-2 inline-block align-middle text-center select-none border-[1px] border-black hover:bg-white hover:text-black duration-75 font-normal whitespace-no-wrap rounded py-1 px-3 leading-normal no-underline custom-bg text-white shadow-none">
                                                <p className="text-sm">Xem chi tiết</p>
                                            </button>
                                        </div>
                                    </div>
                                ) : newBooking.refund === 0 && newBooking.arrival === 0 ? (
                                    <div>
                                        <div className="flex">
                                            <div className="ml-3 mb-3 mt-4 w-[70px] py-[2px] bg-[#dc3545] text-center rounded-md text-white text-xs font-semibold">
                                                <p className="px-2 py-1 text-center">Đã hủy</p>
                                            </div>
                                            <div className="ml-3 mb-3 mt-4 w-[120px] py-[2px] bg-[#198754] text-center rounded-md text-white text-xs font-semibold">
                                                <p className="px-2 py-1 text-center">Chưa hoàn tiền</p>
                                            </div>
                                        </div>
                                        <div className="flex justify-center">
                                            <button type="button" onClick={() => fetchApproveDetailData(newBooking)} className="w-[90%] bg-black mx-2 inline-block align-middle text-center select-none border-[1px] border-black hover:bg-white hover:text-black duration-75 font-normal whitespace-no-wrap rounded py-1 px-3 leading-normal no-underline custom-bg text-white shadow-none">
                                                <p className="text-sm">Xem chi tiết</p>
                                            </button>
                                        </div>
                                    </div>
                                ) : newBooking.refund === 0 && newBooking.arrival === 1 ? (
                                    <div>
                                        <div className="flex">
                                            <div className="ml-3 mb-3 mt-4 w-[70px] py-[2px] bg-[#dc3545] text-center rounded-md text-white text-xs font-semibold">
                                                <p className="px-2 py-1 text-center">Đã hủy</p>
                                            </div>
                                            <div className="ml-3 mb-3 mt-4 w-[120px] py-[2px] bg-[#198754] text-center rounded-md text-white text-xs font-semibold">
                                                <p className="px-2 py-1 text-center">Chưa hoàn tiền</p>
                                            </div>
                                        </div>
                                        <div className="flex justify-center">
                                            <button type="button" onClick={() => fetchApproveDetailData(newBooking)} className="w-[90%] bg-black mx-2 inline-block align-middle text-center select-none border-[1px] border-black hover:bg-white hover:text-black duration-75 font-normal whitespace-no-wrap rounded py-1 px-3 leading-normal no-underline custom-bg text-white shadow-none">
                                                <p className="text-sm">Xem chi tiết</p>
                                            </button>
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
                                                            <div className="font-semibold w-[25%]">TG diễn ra tour:</div>
                                                            <div className="w-[75%]">{bookingDetails.timetour} ngày</div>
                                                        </div>
                                                    </div>
                                                    <div className="flex text-left">
                                                        <div className="font-semibold">Tên tour:</div>
                                                        <div className="mx-2">{bookingDetails.tour_name}</div>
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
                                                                        {/* <div className="flex w-1/3">
                                                                            <div className="font-semibold">Số lượng: </div>
                                                                            <div className="mx-2">{Hotel.quantity}</div>
                                                                        </div> */}
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
            {/* cập nhật lịch khởi hành  */}
            {isOpenModalRating && (
                <div className="w-full bg-black bg-opacity-25 inset-0 backdrop-blur-sm fixed">
                    <div className="row w-[35%] mt-[150px] mx-auto border-[1px] bg-white border-gray-300 rounded-sm py-3 px-3 shadow-sm">
                        <div className="font-semibold text-xl my-4 text-left">
                            Đánh giá
                        </div>
                        <div className="h-[1px] w-full bg-gray-300 rounded-sm mb-5"></div>
                        <form>
                            <div className="mb-3 text-left">
                                <div className="font-semibold">Đánh giá</div>
                                <select name="rating"
                                    className="border-[1px] rounded-md border-gray-300 py-2 w-full px-2 outline-none focus:border-[#007aff]"
                                    value={formRating.rating || ""}
                                    onChange={handleRatingChange}
                                >
                                    <option value={5}>Xuất sắc</option>
                                    <option value={4}>Tốt</option>
                                    <option value={3}>Bình thường</option>
                                    <option value={2}>Kém</option>
                                    <option value={1}>Tệ</option>
                                </select>
                            </div>
                            <div className="text-left">
                                <div className="font-semibold">Ý kiến</div>
                                <textarea type="text"
                                    className="border-[1px] border-gray-300 w-full min-h-[120px] rounded-md py-2 px-2"
                                    name="review"
                                    value={formRating.review || ""}
                                    onChange={handleRatingChange}
                                >

                                </textarea>
                            </div>
                        </form>
                        <div className="flex gap-x-2 items-center justify-center mt-3">
                            <div className="">
                                <button type="button" onClick={handleModalRatingClick} className="bg-black w-[90px] border-[1px] border-black hover:bg-white hover:text-black text-white px-2 py-[2px] rounded-[3px] text-sm">
                                    Hủy
                                </button>
                            </div>
                            <div className="">
                                <button type="submit" onClick={(event) => createTourRating(event)} className="bg-[#007aff] w-[90px] border-[1px] border-[#007aff] hover:bg-white hover:text-black text-white px-2 py-[2px] rounded-[3px] text-sm">
                                    Đánh giá
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    )
}
export default InfoBookingTour;