import HeaderAdmin from "../header-admin/header-admin";
import PriceDisplay from "../../../component/service/money";
import React, { useEffect, useState } from 'react';
import { fetchAssignmentBooking } from "../../../component/api/tours";
import FormatTime from "../../../component/service/fomat-time";
import { fetchBookingRecordTourById } from "../../../component/api/tours";
import { fetchParticipantsTourByBookingid } from "../../../component/api/tours";
import { fetchVehicleByIddepart } from "../../../component/api/tours";
import { fetchHotelByIddepart } from "../../../component/api/tours";

function AssignmentSchedule() {

    const [newBookings, setNewBookings] = useState([]);
    const [isOpenModalInfo, setIsOpenModalInfo] = useState(false);
    const [depositHotel, setDepositHotel] = useState([]);
    const [vehicle, setVehicle] = useState([]);
    const [bookingDetails, setBookingDetails] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [filterOption, setFilterOption] = useState('7days'); // Mặc định là 7 ngày
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // Bật/ẩn của sổ thông tin đơn đặt tour
    const handleModalClick = () => {
        setIsOpenModalInfo(!isOpenModalInfo);
    };

    // Hàm gọi API
    const fetchBookingData = async () => {
        const storedUserId = localStorage.getItem("userId");

        const staff = JSON.parse(storedUserId);
        console.log("hdv ID:", staff); // Lấy ID người dùng

        try {
            const response = await fetchAssignmentBooking(staff);

            if (response.data.status === 'success') {
                setNewBookings(response.data.data); // Lưu kết quả booking data
                console.log('Booking Data:', response.data.data);
            } else if (response.data.status === 'error') {
                console.log(response.data.message);
            }
        } catch (err) {
            console.error("Error fetching booking data:", err);
        }
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

    useEffect(() => {
        fetchBookingData();
    }, []); // Chỉ chạy một lần khi component được mount

    // Cập nhật startDate và endDate khi filterOption thay đổi
    useEffect(() => {
        const currentDate = new Date();
        const formattedStartDate = currentDate.toISOString().split('T')[0]; // Định dạng YYYY-MM-DD
        let calculatedStartDate;

        if (filterOption === '7days') {
            calculatedStartDate = new Date();
            calculatedStartDate.setDate(currentDate.getDate() + 7);
        } else if (filterOption === '1month') {
            calculatedStartDate = new Date();
            calculatedStartDate.setMonth(currentDate.getMonth() + 1);
        }

        const formattedEndDate = calculatedStartDate.toISOString().split('T')[0];

        setStartDate(formattedStartDate);
        setEndDate(formattedEndDate);
    }, [filterOption]);

    // Hàm lọc dữ liệu dựa trên khoảng thời gian
    const filteredBookings = newBookings.filter((booking) => {
        const bookingDate = new Date(booking.day_depar);

        const bookingDateOnly = new Date(bookingDate.getFullYear(), bookingDate.getMonth(), bookingDate.getDate()); // Chỉ lấy ngày, tháng, năm

        const start = startDate ? new Date(new Date(startDate).setHours(0, 0, 0, 0)) : null;
        const end = endDate ? new Date(new Date(endDate).setHours(0, 0, 0, 0)) : null;

        // Lọc theo thời gian
        const isWithinDateRange = (!start || bookingDateOnly >= start) && (!end || bookingDateOnly <= end);

        return isWithinDateRange;
    });

    return (
        <div>
            <HeaderAdmin />

            <div className="container bg-gray-100 mx-auto h-screen sm:px-4 w-[80%] -mt-[660px] float-right overflow-auto">
                <div className="mb-6 mt-5 text-left font-semibold text-2xl uppercase">Lịch phân công</div>
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
                            {/* <option value="1day">1 ngày</option> */}
                            <option value="7days">7 ngày</option>
                            <option value="1month">1 tháng</option>
                        </select>
                    </div>
                </div>
                {filteredBookings.length > 0 ? (
                    <div className="max-h-[410px] overflow-y-auto">
                        <div className="grid grid-cols-4 gap-2">
                            {filteredBookings.map((newBooking) => (
                                <div className="booking h-[280px] bg-white rounded-md text-left" key={newBooking.booking_id}>
                                    <div className="text-center mt-3"><FormatTime date={newBooking.day_depar} /></div>
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
                                    <div className="flex justify-center my-3">
                                        <button type="button" onClick={() => fetchApproveDetailData(newBooking)} className="w-[90%] bg-black mx-2 inline-block align-middle text-center select-none border-[1px] border-black hover:bg-white hover:text-black duration-75 font-normal whitespace-no-wrap rounded py-1 px-3 leading-normal no-underline custom-bg text-white shadow-none">
                                            <p className="text-sm">Xem chi tiết</p>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <p className="text-center">Không có lịch trình</p>
                )}
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
        </div>
    );
}
export default AssignmentSchedule;