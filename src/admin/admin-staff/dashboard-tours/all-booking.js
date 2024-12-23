import PriceDisplay from "../../../component/service/money";
import React, { useEffect, useState } from 'react';
// import { fetchBookingRecordTour } from "../../../component/api/tours";
import { fetchBookingRecordTourById } from "../../../component/api/tours";
import { fetchAllBookingTour } from "../../../component/api/tours";

import { Link } from "react-router-dom";

function AllBookingTour() {

    const [bookingRecords, setBookingRecord] = useState([]);
    const [filterOption, setFilterOption] = useState('7days'); // Mặc định là 7 ngày
    const [searchQuery, setSearchQuery] = useState(''); // Thêm trạng thái để lưu giá trị tìm kiếm
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [error, setError] = useState(null);
    const [isOpenModalInfo, setIsOpenModalInfo] = useState(false);
    const [bookingDetails, setBookingDetails] = useState(null);
    // const [participants, setParticipants] = useState([]);
    // const [scannedData, setScannedData] = useState(null);

    // Bật/ẩn của sổ thông tin đơn đặt tour
    const handleModalClick = () => {
        setIsOpenModalInfo(!isOpenModalInfo);
    };

    useEffect(() => {
        // Hàm để gọi API và cập nhật state
        const newBookingData = async () => {
            try {
                // Gọi API để lấy danh sách phòng
                const bookingRecordResponse = await fetchAllBookingTour();
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
            ? (booking.booking_id && booking.booking_id.toString().toLowerCase().includes(searchQuery.toLowerCase())) ||
            (booking.phonenum && booking.phonenum.toString().toLowerCase().includes(searchQuery.toLowerCase())) ||
            (booking.tour_id && booking.tour_id.toString().toLowerCase().includes(searchQuery.toLowerCase()))
            : true; // Không lọc nếu không có searchQuery
    
            // console.log('Matches Search Query:', matchesSearchQuery); // Kiểm tra kết quả so sánh
        
            return isWithinDateRange && matchesSearchQuery;
        });

    
    // Hàm gọi API
    const fetchApproveDetailData = async (bookingid) => {
        // console.log(bookingid);
        setIsOpenModalInfo(!isOpenModalInfo);
        try {
            const bookingResponse = await fetchBookingRecordTourById(bookingid);
            const bookingRecordData = bookingResponse.data; // Giả sử API trả về mảng các tour
            setBookingDetails(bookingRecordData);

            // Nếu API trả về mảng, hãy lấy phần tử đầu tiên
            if (Array.isArray(bookingRecordData) && bookingRecordData.length > 0) {
                setBookingDetails(bookingRecordData[0]);
            } else {
                setBookingDetails(null); // Xử lý nếu không có dữ liệu hợp lệ
            }

            // console.log('Booking Data:', approvedApplicationData);
            
        } catch (err) {
            console.error("Error fetching booking data:", err);
        }
    };
    

    if (error) return <div>Error: {error.message}</div>;

    return (
        <div>

            <div className="container mx-auto sm:px-4 max-w-full" id="main-content">
                <div className="flex flex-wrap ">
                    <div className="w-full pr-4 pl-4 mx-auto p-6 overflow-hidden">
                        <div className="flex items-center">
                            
                            <div className="w-[20%] text-left mx-3 my-3">
                                <Link to="/dashboard-tours">
                                    <i className="fa-solid fa-arrow-left text-2xl cursor-pointer"></i>
                                </Link>
                            </div>
                            <h3 className="mb-4 mx-auto font-semibold text-2xl uppercase w-[60%]">Tất cả đơn đặt tour</h3>
                            
                            <div className="w-[20%] text-right">
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
                                            placeholder="mã đơn/mã ND/sđt"
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
                                                <th scope="col" className="sticky top-0 z-10 w-[250px]">Trạng thái</th>
                                                <th scope="col" className="sticky top-0 z-10 w-[100px]">Tùy chọn</th>
                                            </tr>
                                        </thead>
                                        <tbody id="table-data">
                                        {filteredBookings.map((bookingRecord, index) => (
                                            <tr key={bookingRecord.booking_id} className="text-left">
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
                                                <td className="">
                                                    <div className="text-left flex items-center">
                                                        <b className="">Tên :</b> 
                                                        <div>{bookingRecord.tour_name}</div>
                                                    </div>
                                                    <div className="flex">
                                                        <b className="mr-2">Giá tiền :</b>  <PriceDisplay price={bookingRecord.price} />
                                                    </div> 
                                                </td>
                                                <td>
                                                    <div className="flex">
                                                        <b className="mr-2">Tổng tiền :</b>  <PriceDisplay price={bookingRecord.total_pay} />
                                                    </div>
                                                    <div className="flex">
                                                        <div className="text-left mr-2"><b>Ngày đặt :</b></div> {bookingRecord.datetime} 
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="">
                                                    {bookingRecord.refund === 1 && bookingRecord.arrival === 0 ? (
                                                        <div className="w-[100%] text-sm bg-[#dc3545] text-white rounded-md ">
                                                            <p className="px-2 py-1 text-center">Đã hủy và hoàn tiền</p>
                                                        </div>
                                                    ): bookingRecord.refund === 0 &&  bookingRecord.arrival === 1 ? (
                                                        <div className="w-[100%] bg-[#dc3545] text-white rounded-md">
                                                            <p className="px-2 py-1 text-center">Đã hủy, chưa hoàn tiền</p>
                                                        </div>
                                                    ): bookingRecord.refund === 0 &&  bookingRecord.arrival ===0 ? (
                                                        <div className="w-[100%] bg-[#dc3545] text-white rounded-md">
                                                            <p className="px-2 py-1 text-center">Đã hủy, chưa hoàn tiền</p>
                                                        </div>
                                                    ): bookingRecord.refund === null &&  bookingRecord.arrival === 1 ? (
                                                        <div className="w-[100%] bg-[#198754] text-white rounded-md">
                                                            <p className="px-2 py-1 text-center">Đã duyệt</p>
                                                        </div>
                                                    ): bookingRecord.refund === null &&  bookingRecord.arrival === 0 ? (
                                                        <div className="w-[100%] bg-[#198754] text-white rounded-md">
                                                            <p className="px-2 py-1 text-center">Đơn mới</p>
                                                        </div>
                                                    ): bookingRecord.refund === 1 &&  bookingRecord.arrival === 1 &&(
                                                        <div className="w-[100%] text-sm bg-[#dc3545] text-white rounded-md">
                                                            <p className="px-2 py-1 text-center">Đã hủy</p>
                                                        </div>
                                                    )}
                                                    </div>
                                                </td>
                                                <td>
                                                    <button type='button' onClick={() => fetchApproveDetailData(bookingRecord.booking_id)} className='mx-3 border-[1px] border-[#0d6efd] text-[#0d6efd] hover:bg-[#356ec4] hover:text-white py-[2px] px-[7px] duration-100 shadow-none'>
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
                    <div className="modal " id="add-room" tabIndex={-1}>
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
                                                    <div className="flex">
                                                        <div className="font-semibold">Mã Khách hàng:</div>
                                                        <div className="mx-2">{bookingDetails.user_id}</div>
                                                    </div>
                                                    <div className="flex ml-10">
                                                        <div className="font-semibold">Tên Khách hàng:</div>
                                                        <div className="mx-2">{bookingDetails.user_name}</div>
                                                    </div>
                                                </div>
                                                <div className="flex">
                                                    <div className="flex">
                                                        <div className="font-semibold">Số điện thoại:</div>
                                                        <div className="mx-2">{bookingDetails.phonenum}</div>
                                                    </div>
                                                    <div className="flex ml-10">
                                                        <div className="font-semibold">Địa chỉ:</div>
                                                        <div className="mx-2">{bookingDetails.address}</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-semibold text-lg text-left mb-4 mt-9">Thông tin tour</div>
                                                <div className="flex">
                                                    <div className="flex">
                                                        <div className="font-semibold">Mã tour:</div>
                                                        <div className="mx-2">{bookingDetails.booking_id}</div>
                                                    </div>
                                                    <div className="flex ml-10">
                                                        <div className="font-semibold">Tên tour:</div>
                                                        <div className="mx-2">{bookingDetails.tour_name}</div>
                                                    </div>
                                                </div>
                                                <div className="flex">
                                                    <div className="flex">
                                                        <div className="font-semibold">Số người tham gia:</div>
                                                        <div className="mx-2">{bookingDetails.participant}</div>
                                                    </div>
                                                    <div className="flex ml-10">
                                                        <div className="font-semibold">Ngày khởi hành:</div>
                                                        <div className="mx-2">{bookingDetails.day_depar}</div>
                                                    </div>
                                                </div>
                                                <div className="flex">
                                                    <div className="flex">
                                                        <div className="font-semibold">Giá tour:</div>
                                                        <div className="mx-2"><PriceDisplay price={bookingDetails.price} /></div>
                                                    </div>
                                                    <div className="flex ml-10">
                                                        <div className="font-semibold">Tổng tiền:</div>
                                                        <div className="mx-2"><PriceDisplay price={bookingDetails.total_pay} /></div>
                                                    </div>
                                                </div>
                                                <div className="flex">
                                                    <div className="flex">
                                                        <div className="font-semibold">Mã thanh toán:</div>
                                                        <div className="mx-2">{bookingDetails.order_id}</div>
                                                    </div>
                                                    <div className="flex ml-10">
                                                        <div className="font-semibold">Thời gian thanh toán:</div>
                                                        <div className="mx-2">{bookingDetails.datetime}</div>
                                                    </div>
                                                </div>
                                                <div>

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
export default AllBookingTour;