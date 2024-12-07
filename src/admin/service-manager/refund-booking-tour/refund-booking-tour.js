import HeaderManager from "../header-manager/header-manager";
import PriceDisplay from "../../../component/service/money";
import React, { useEffect, useState } from 'react';
import { fetchRefundBookingTour } from "../../../component/api/tours";
// import { toast } from 'react-toastify';
import FormatTime from "../../../component/service/fomat-time";
// import config from "../../../component/config.json";

// const { SERVER_API } = config;

function RefundBookingTour3() {

    const [refundBookings, setRefundBookings] = useState([]);
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
                const refundBookingResponse = await fetchRefundBookingTour();
                const refundBookingData = refundBookingResponse.data; // Giả sử API trả về mảng các tour

                // Tính toán giá trị hoàn lại và thêm vào mảng dữ liệu
                const updatedRefundBookings = refundBookingData.map((booking) => {
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

                setRefundBookings(updatedRefundBookings);

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
    const filteredBookings = refundBookings.filter((booking) => {
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
            (booking.phonenum && booking.phonenum.toString().toLowerCase().includes(searchQuery.toLowerCase())) ||
            (booking.tour_id && booking.tour_id.toString().toLowerCase().includes(searchQuery.toLowerCase()))
            : true; // Không lọc nếu không có searchQuery

        // console.log('Matches Search Query:', matchesSearchQuery); // Kiểm tra kết quả so sánh

        return isWithinDateRange && matchesSearchQuery;
    });

    // duyệt đơn hủy tour
    // const updateConfirmBooking = (bookingId) => {
    //     console.log(bookingId);
    //     // if (window.confirm('Bạn có chắc chắn muốn xóa phòng này?')) {
    //     fetch(`${SERVER_API}/admin/asign_refund_booking_tour.php`, {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({
    //             refund_booking: true, // Thêm biến này để kích hoạt điều kiện trong PHP
    //             booking_id: bookingId
    //         }),
    //     })
    //         .then(response => response.json())
    //         .then(data => {
    //             // console.log('Đang gửi dữ liệu:', { room_id: roomId, image_id: imageId });
    //             if (data.status === 'success') { // Kiểm tra 'success' thay vì 'status'
    //                 setRefundBookings(refundBookings.filter(refundBooking => refundBooking.booking_id !== bookingId));
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

    if (error) return <div>Error: {error.message}</div>;


    return (
        <div>
            <HeaderManager />

            <div className="container -mt-[630px] mx-auto sm:px-4 max-w-full" id="main-content">
                <div className="flex flex-wrap ">
                    <div className="lg:w-4/5 pr-4 pl-4 ms-auto p-6 overflow-hidden">
                        <h3 className="mb-4 text-left font-semibold text-2xl uppercase">Đơn đã hủy</h3>
                        <div className="relative h-[500px] flex flex-col min-w-0 rounded break-words border bg-white border-1 border-gray-300 shadow mb-4">
                            <div className="flex-auto p-6">
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
                                            placeholder="Nhập mã đơn / SĐT / mã tour"
                                        />
                                    </div>
                                </div>
                                <div className="block w-full h-[400px] overflow-auto scrolling-touch">
                                    <table className="w-full overflow-auto text-left max-w-full mb-4 bg-transparent table-hover border" style={{ minWidth: 700 }}>
                                        <thead>
                                            <tr className="bg-gray-900 text-gray-100 h-[40px] sticky top-0 z-10">
                                                <th scope="col" className="px-3 w-[70px]">Mã đơn</th>
                                                <th scope="col" className="px-3 w-[250px]">Người đặt</th>
                                                <th scope="col" className="px-3 w-[270px]">Đơn đặt</th>
                                                <th scope="col" className="w-[100px]" >Tiền hoàn</th>
                                                {/* <th scope="col" className="w-[100px]">Trạng thái</th> */}
                                            </tr>
                                        </thead>
                                        <tbody id="table-data" className="overflow-y-auto">
                                            {filteredBookings.map((refundBooking, index) => (
                                                <tr key={refundBooking.booking_id} className="border-[1px] border-b-gray-300">
                                                    <td className="pl-3">{refundBooking.booking_id}</td>
                                                    <td className="px-3">
                                                        <span class='bg-[#0d6efd] text-white text-xs px-2 py-[2px] rounded-md'>
                                                            TT thanh toán : {refundBooking.order_id}
                                                        </span>
                                                        <br />
                                                        <b>Tên :</b> {refundBooking.user_name}
                                                        <br />
                                                        <b>SĐT :</b> {refundBooking.phonenum}
                                                    </td>
                                                    <td className="px-3">
                                                        <div className="flex">
                                                            <div className="mr-2 font-semibold">Mã tour:</div>
                                                            <div>{refundBooking.tour_id}</div>
                                                        </div>
                                                        <div className="flex">
                                                            <div className="mr-2 font-semibold">Tên:</div>
                                                            <div>{refundBooking.tour_name}</div>
                                                        </div>
                                                        <div className="flex">
                                                            <div className="mr-2 font-semibold">Ngày khởi hành:</div>
                                                            <div><FormatTime date={refundBooking.departure_id} /></div>
                                                        </div>
                                                        <div className="flex">
                                                            <div className="mr-2 font-semibold">Ngày đặt:</div>
                                                            <div>{refundBooking.datetime} </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="flex">
                                                            <b className="mr-2">Tổng tiền :</b>  <PriceDisplay price={refundBooking.total_pay} />
                                                        </div>
                                                        {/* {refundBookings.map((booking) => ( */}
                                                        <div className="flex">
                                                            <b className="mr-2">Tiền hoàn :</b>  <PriceDisplay price={refundBooking.refundAmount ? refundBooking.refundAmount : refundBooking.total_pay} />
                                                        </div>
                                                        {/* ))} */}
                                                    </td>
                                                    {/* <td>
                                                        <button type='button' onClick={() => updateConfirmBooking(refundBooking.booking_id)} class='text-sm bg-[#198754] hover:bg-[#21784f] text-white px-2 py-1 rounded-md shadow-none'>
                                                            <i className="fa-solid fa-money-bill"></i> Hoàn tiền
                                                        </button>
                                                    </td> */}
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
export default RefundBookingTour3;