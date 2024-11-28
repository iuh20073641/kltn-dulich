import HeaderCensor from "../header-admin/header-admin";
import PriceDisplay from "../../../component/service/money";
import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import React, { useEffect, useState } from 'react';
import { fetchBookingRecordTour } from "../../../component/api/tours";
import { fetchBookingRecordTourById } from "../../../component/api/tours";
import { fetchParticipantsTourByBookingid } from "../../../component/api/tours";
import { Link } from "react-router-dom";
import FormatTime from "../../../component/service/fomat-time";
import { fetchVehicleByIddepart } from "../../../component/api/tours";
import { fetchHotelByIddepart } from "../../../component/api/tours";

import '../../../component/font-times-new-roman-normal';

function BookingRecord() {

    const [bookingRecords, setBookingRecord] = useState([]);
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

    // Bật/ẩn của sổ thông tin đơn đặt tour
    const handleModalClick = () => {
        setIsOpenModalInfo(!isOpenModalInfo);
    };

    useEffect(() => {
        // Hàm để gọi API và cập nhật state
        const newBookingData = async () => {
            try {
                // Gọi API để lấy danh sách phòng
                const bookingRecordResponse = await fetchBookingRecordTour();
                const bookingRecordData = bookingRecordResponse.data; // Giả sử API trả về mảng các tour

                // Tính toán giá trị hoàn lại và thêm vào mảng dữ liệu
                const updatedRefundBookings = bookingRecordData.map((booking) => {
                    const bookingDate = new Date(booking.datetime); // Giả sử 'bookingDate' là ngày đặt tour
                    const currentDate = new Date();

                    // Tính thời gian chênh lệch (số ngày)
                    const timeDifference = (currentDate - bookingDate) / (1000 * 3600 * 24);

                    let refundAmount = 0;
                    if (timeDifference > 1) {
                        // Nếu đã trôi qua hơn 1 ngày, tính 50% tổng tiền
                        refundAmount = booking.total_pay * 0.5;
                    }

                    // Thêm giá trị hoàn lại vào đối tượng booking
                    return { ...booking, refundAmount };
                });

                setBookingRecord(updatedRefundBookings);



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
    const filteredBookings = bookingRecords.filter((booking) => {
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
        // console.log('Search Query:', searchQuery);
        const matchesSearchQuery = searchQuery
            ? booking.booking_id && booking.booking_id.toString().toLowerCase().includes(searchQuery.toLowerCase())
            : true; // Không lọc nếu không có searchQuery

        // console.log('Matches Search Query:', matchesSearchQuery); // Kiểm tra kết quả so sánh

        return isWithinDateRange && matchesSearchQuery;
    });


    // Hàm gọi API
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
        const columns = ["STT", "Tên", "CCCD"]; // Tiêu đề các cột

        // Vẽ tiêu đề bảng
        doc.setFontSize(12);
        columns.forEach((col, index) => {
            doc.text(col, 20 + (index * 60), startY); // Cách nhau 60 đơn vị
        });

        // Duyệt qua mảng participants và thêm từng người vào bảng
        let yPosition = startY + rowHeight; // Bắt đầu vị trí Y cho dữ liệu
        if (Array.isArray(participantData) && participantData.length > 0) {
            console.log(participants);
            participantData.forEach((participant, index) => {
                doc.text(`${index + 1}`, 20, yPosition); // Số thứ tự
                doc.text(participant.name || 'N/A', 80, yPosition); // Tên
                doc.text(participant.cccd || 'N/A', 140, yPosition); // CCCD

                // Vẽ đường kẻ ngang dưới mỗi hàng
                doc.line(20, yPosition + 3, 190, yPosition + 3); // Đường kẻ ngang dưới hàng
                yPosition += rowHeight; // Tăng vị trí Y
            });
        } else {
            doc.text("Không có dữ liệu người tham gia.", 20, yPosition);
        }

        const text4 = "Phương tiện";
        const textWidth3 = doc.getTextWidth(text4);
        // Tính toán vị trí x để căn giữa
        const pageWidth3 = doc.internal.pageSize.getWidth();
        const x3 = (pageWidth3 - textWidth3) / 2; // Căn giữa
        doc.text(text4, x3, 190);

        doc.text('Chiều đi', 20, 195);
        doc.text(`Loại phương tiện: ${vehicleData[0].type}`, 20, 200);
        doc.text(`Ngày khởi hành: ${vehicleData[0].departure_date}`, 20, 205);
        doc.text(`Thời gian khởi hành: ${vehicleData[0].departure_time1}`, 20, 210);
        doc.text(`Từ: ${vehicleData[0].departure1}`, 100, 210);
        doc.text(`Thời gian hạ cánh: ${vehicleData[0].arrival_time1}`, 20, 215);
        doc.text(`Đến: ${vehicleData[0].destination1}`, 100, 215);
        doc.text(`Hãng: ${vehicleData[0].company1}`, 20, 220);
        doc.text(`Số hiệu: ${vehicleData[0].vehicle_number1}`, 20, 225);

        doc.text('Chiều về', 20, 235);
        doc.text(`Loại phương tiện: ${vehicleData[0].type}`, 20, 240);
        doc.text(`Ngày khởi hành: ${vehicleData[0].return_date}`, 20, 245);
        doc.text(`Thời gian khởi hành: ${vehicleData[0].departure_time1}`, 20, 250);
        doc.text(`Từ: ${vehicleData[0].departure1}`, 100, 250);
        doc.text(`Thời gian hạ cánh: ${vehicleData[0].arrival_time1}`, 20, 255);
        doc.text(`Đến: ${vehicleData[0].destination1}`, 100, 255);
        doc.text(`Hãng: ${vehicleData[0].company1}`, 20, 260);
        doc.text(`Số hiệu: ${vehicleData[0].vehicle_number1}`, 20, 265);

        const text5 = "Nơi ở";
        const textWidth4 = doc.getTextWidth(text4);
        // Tính toán vị trí x để căn giữa
        const pageWidth4 = doc.internal.pageSize.getWidth();
        const x4 = (pageWidth4 - textWidth4) / 2; // Căn giữa
        doc.text(text5, x4, 270);

        doc.text(`Khách sạn: ${hotelData[0].name_hotel}`, 20, 275);
        doc.text(`Địa chỉ: ${hotelData[0].address}`, 20, 280);
        doc.text(`Kiểu phòng: ${hotelData[0].type}`, 20, 285);
        doc.text(`Mô tả: ${hotelData[0].description}`, 20, 290);
        
        // Lưu file PDF với tên 'tour-history.pdf'
        doc.save(`tour-booking-${bookingTour.booking_id}.pdf`);
    };


    if (error) return <div>Error: {error.message}</div>;

    return (
        <div>
            <HeaderCensor />

            <div className="container -mt-[590px] mx-auto sm:px-4 max-w-full" id="main-content">
                <div className="flex flex-wrap ">
                    <div className="lg:w-4/5 pr-4 pl-4 ms-auto p-6 overflow-hidden">
                        <div className="flex items-center">
                            <h3 className="mb-4 text-left font-semibold text-2xl uppercase w-[50%]">Lịch sử đặt tour</h3>
                            <div className="w-[50%] text-right">
                                <Link to="/qr-code">
                                    <div className="cursor-pointer">
                                        <i className="fa-solid fa-qrcode text-2xl"></i>
                                    </div>
                                </Link>
                            </div>
                        </div>

                        <div className="relative flex flex-col min-w-0 rounded break-words border bg-white border-1 border-gray-300 shadow -mb-[9px]">
                            <div className="flex-auto p-6">
                                <div className="flex">
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
                                            placeholder="Nhập mã đơn"
                                        />
                                    </div>
                                </div>
                                <div className="block w-full overflow-auto scrolling-touch h-[400px]">
                                    <table className="w-full max-h-[300px] text-left max-w-full mb-4 bg-transparent table-hover border" style={{ minWidth: 1200 }}>
                                        <thead>
                                            <tr className="bg-gray-900 text-gray-100 h-[40px] sticky top-0 z-10">
                                                <th scope="col" className="pl-3 sticky top-0 z-10 w-[80px]">Mã đơn</th>
                                                <th scope="col" className="sticky top-0 z-10 w-[300px]">Người đặt</th>
                                                <th scope="col" className="sticky top-0 z-10 w-[350px]">Tour</th>
                                                <th scope="col" className="sticky top-0 z-10 w-[300px]">Thông tin đặt tour</th>
                                                <th scope="col" className="sticky top-0 z-10 w-[150px]">Trạng thái</th>
                                                <th scope="col" className="sticky top-0 z-10 w-[100px]">Tùy chọn</th>
                                            </tr>
                                        </thead>
                                        <tbody id="table-data">
                                            {filteredBookings.map((bookingRecord, index) => (
                                                <tr key={bookingRecord.booking_id}>
                                                    <td className="pl-3">{bookingRecord.booking_id}</td>
                                                    <td>
                                                        <span className='badge bg-[#0d6efd] text-white text-xs py-[2px] px-2 rounded-md'>
                                                            Mã thanh toán : {bookingRecord.order_id}
                                                        </span>
                                                        <br />
                                                        <b>Tên :</b> {bookingRecord.user_name}
                                                        <br />
                                                        <b>SĐT :</b> {bookingRecord.phonenum}
                                                    </td>
                                                    <td>
                                                        <b>Tên :</b> {bookingRecord.tour_name}
                                                        <br />
                                                        <div className="flex">
                                                            <b className="mr-2">Giá tiền :</b>  <PriceDisplay price={bookingRecord.price} />
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="flex">
                                                            <b className="mr-2">Tổng tiền :</b>  <PriceDisplay price={bookingRecord.total_pay} />
                                                        </div>
                                                        <div className="flex">
                                                            <b>Ngày đặt :</b> {bookingRecord.datetime}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="">
                                                            {bookingRecord.refund === 1 && bookingRecord.arrival === 0 ? (
                                                                <div className="w-[80%] text-sm bg-[#dc3545] text-white rounded-md ">
                                                                    <p className="px-2 py-1 text-center">Đã hủy và hoàn tiền</p>
                                                                </div>
                                                            ) : bookingRecord.refund === 0 && bookingRecord.arrival === 1 ? (
                                                                <div className="w-[80%] bg-[#198754] text-white rounded-md">
                                                                    <p className="px-2 py-1 text-center">Đã hủy, chưa hoàn tiền</p>
                                                                </div>
                                                            ) : bookingRecord.refund === null && bookingRecord.arrival === 1 ? (
                                                                <div className="w-[80%] bg-[#198754] text-white rounded-md">
                                                                    <p className="px-2 py-1 text-center">Đã duyệt</p>
                                                                </div>
                                                            ) : bookingRecord.refund === 1 && bookingRecord.arrival === 1 && (
                                                                <div className="w-[70%] text-sm bg-[#dc3545] text-white rounded-md">
                                                                    <p className="px-2 py-1 text-center">Đã hủy</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <button type='button' onClick={() => generatePDF(bookingRecord)} className='border-[1px] border-[#198754] text-[#198754] hover:bg-[#198754] hover:text-white py-[2px] px-[5px] duration-100 shadow-none'>
                                                            <i className="fa-regular fa-file-pdf "></i>
                                                        </button>
                                                        <button type='button' onClick={() => fetchApproveDetailData(bookingRecord)} className='mx-3 border-[1px] border-[#0d6efd] text-[#0d6efd] hover:bg-[#356ec4] hover:text-white py-[2px] px-[7px] duration-100 shadow-none'>
                                                            <i className="fa-solid fa-file-invoice"></i>
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
                                                                        <th className="border-[1px] border-black">Tên</th>
                                                                        <th className="border-[1px] border-black">CCCD</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {participants.map((participant, index) => (
                                                                        <tr className="border-[1px] border-black" key={participant.id}>
                                                                            <td className="border-[1px] border-black px-2">{index + 1}</td>
                                                                            <td className="border-[1px] border-black px-2">{participant.name}</td>
                                                                            <td className="border-[1px] border-black px-2">{participant.cccd}</td>
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
                                                        <div className="flex w-1/2">
                                                            <div className="font-semibold">Số người tham gia:</div>
                                                            <div className="mx-2">{bookingDetails.participant}</div>
                                                        </div>
                                                        <div className="flex w-1/2">
                                                            <div className="font-semibold">Ngày khởi hành:</div>
                                                            <div className="mx-2"><FormatTime date={bookingDetails.day_depar} /></div>
                                                        </div>
                                                    </div>
                                                    <div className="flex">
                                                        <div className="flex w-1/2">
                                                            <div className="font-semibold">Giá tour:</div>
                                                            <div className="mx-2"><PriceDisplay price={bookingDetails.price} /></div>
                                                        </div>
                                                        <div className="flex w-1/2">
                                                            <div className="font-semibold">Tổng tiền:</div>
                                                            <div className="mx-2"><PriceDisplay price={bookingDetails.total_pay} /></div>
                                                        </div>
                                                    </div>
                                                    <div className="flex">
                                                        <div className="flex w-1/2">
                                                            <div className="font-semibold">TT thanh toán:</div>
                                                            <div className="mx-2">{bookingDetails.order_id}</div>
                                                        </div>
                                                        <div className="flex w-1/2">
                                                            <div className="font-semibold">Thời gian thanh toán:</div>
                                                            <div className="mx-2">{bookingDetails.datetime}</div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="font-medium mt-3">Phương tiện</div>
                                                        <div>
                                                            {vehicle && Array.isArray(vehicle) && vehicle.length > 0 ? (
                                                                vehicle.map((vehicle) => (
                                                                    <div className="w-full mt-3">
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
                                                                    <div className="mx-auto border-[1px] border-gray-300 py-2 px-3 rounded-lg" style={{ boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', }}>
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

        </div>
    )
}
export default BookingRecord;