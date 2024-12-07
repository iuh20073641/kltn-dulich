import HeaderManager from "../header-manager/header-manager";
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchTourDetails } from "../../../component/api/tours";
import { fetchTourSchedule } from "../../../component/api/tours";
// import { fetchTourDepart } from "../../../component/api/tours";
import { Formik, Field, Form, ErrorMessage, FieldArray } from 'formik';
import { toast } from 'react-toastify';
import { fetchTourDepart } from "../../../component/api/tours";
import { fetchVehicleByIddepart } from "../../../component/api/tours";
import { fetchHotelByIddepart } from "../../../component/api/tours";
import FormatTime from "../../../component/service/fomat-time";
import { fetchDataScheduleTourByIdtour } from "../../../component/api/tours";
import { fetchDayDepart } from "../../../component/api/tours";

import config from "../../../component/config.json";

const { SERVER_API } = config;

const initFormSchedule =
{
    // id_tour: "",
    day: "",
    image: null,
    schedule: "",
    locations: ""
};


const initFormSchedule2 =
{
    id_schedule: "",
    day: "",
    image: null,
    schedule: "",
    locations: ""
};


const initFormDepart = {
    day: "",
    order: ""
};

const initFormDepart2 = {
    depart_id: "",
    day: "",
    order: ""
};

const initFormHotel = {
    depart_id: "",
    name_hotel: "",
    address: "",
    type: "",
    quantity: "",
    check_in: "",
    check_out: "",
    description: ""
};

const initVehicle = {
    id_depart: "",
    type: "",
    departure_date: "",
    departure_time1: "",
    departure1: "",
    arrival_time1: "",
    destination1: "",
    company1: "",
    vehicle_number1: "",
    number_of_seats1: "",
    return_date: "",
    departure_time2: "",
    departure2: "",
    arrival_time2: "",
    destination2: "",
    company2: "",
    vehicle_number2: "",
    number_of_seats2: "",
};

function TourSetting() {

    const { id } = useParams();  // Lấy ID từ URL
    const [tourDetails, setTourDetails] = useState(null);
    const [tourSchedule, setTourSchedule] = useState([]);
    const [error, setError] = useState(null);
    const [formSchedule, setFormSchedule] = useState(initFormSchedule);
    const [formUpdateSchedule, setFormUdateSchedule] = useState(initFormSchedule2);
    const [formDepart, setFormDepart] = useState(initFormDepart);
    const [formDepartUpdate, setFormDepartUpdate] = useState(initFormDepart2);
    const [vahicle, setVahicle] = useState('may bay');
    const [tourDepart, setTourDepart] = useState([]);
    const [formHotel, setFormHotel] = useState(initFormHotel);
    const [formVehicle, setFormVehicle] = useState(initVehicle);
    const [vehicle, setVehicle] = useState([]);
    const [depositHotel, setDepositHotel] = useState([]);
    const [isOpenModalUpdateSchule, setIsOpenModalUpdateSchule] = useState(false);
    const [isOpenModalUpdateDepart, setIsOpenModalUpdateDepart] = useState(false);
    const today = new Date().toISOString().split("T")[0]; // Lấy ngày hiện tại dưới định dạng YYYY-MM-DD

    // Hàm xử lý khi chọn loại phương tiện
    const handleTypeVehicleChange = (event) => {
        setVahicle(event.target.value);
    };

    const handleHotelChange = (event) => {
        const { value, name } = event.target;
        setFormHotel(prevState => ({
            ...prevState,
            [name]: value
        }));
    };


    // Hàm để gọi API và cập nhật state
    const tourDetail = async (id) => {
        try {
            // Gọi API để lấy thông tin chi tiết của một phòng
            const toursResponse = await fetchTourDetails(id);
            const toursData = toursResponse.data;
            setTourDetails(toursData);
            // console.log('Dữ liệu từ API:', tourDetails);

            // Nếu API trả về mảng, hãy lấy phần tử đầu tiên
            if (Array.isArray(toursData) && toursData.length > 0) {
                setTourDetails(toursData[0]);
            } else {
                setTourDetails(null); // Xử lý nếu không có dữ liệu hợp lệ
            }

            // Gọi API để lấy thông tin chi tiết của một phòng
            const toursScheduleResponse = await fetchTourSchedule(id);
            const toursScheduleData = toursScheduleResponse.data;
            setTourSchedule(toursScheduleData);

            // // Gọi API để lấy thông tin chi tiết của một phòng
            // const tourDepartResponse = await fetchTourDepart(id);
            // const toursDepartData = tourDepartResponse.data;
            // setTourDepart(toursDepartData);

        } catch (err) {
            console.error('Error fetching data:', err);
            setError('Có lỗi xảy ra khi lấy dữ liệu sản phẩm.');
        }
    };


    useEffect(() => {
        tourDetail(id);
    }, [id]);


    // Hàm để gọi API và cập nhật state
    const getTourDepart = async (id) => {
        try {

            const tourDepartResponse = await fetchTourDepart(id);
            const toursDepartData = tourDepartResponse.data;

            // Lấy ngày hiện tại
            const currentDate = new Date();

            // Lọc những ngày lớn hơn hoặc bằng ngày hiện tại
            const filteredTours = toursDepartData.filter(tour => {
                const tourDate = new Date(tour.day_depart); // Đảm bảo cột ngày trong API là departureDate
                return tourDate >= currentDate;
            });

            setTourDepart(filteredTours);
            // console.log(toursDepartData);

        } catch (err) {
            console.error('Error fetching data:', err);
            setError('Có lỗi xảy ra khi lấy dữ liệu sản phẩm.');
        }
    };


    useEffect(() => {
        getTourDepart(id);
    }, [id]);

    const [selectedTour, setSelectedTour] = useState("");

    // Bước 2: Hàm xử lý khi select thay đổi
    const handleSelectChange = (event) => {
        const selectedValue = event.target.value; // Lấy giá trị từ option được chọn
        setSelectedTour(event.target.value); // Cập nhật giá trị đã chọn
        console.log('Selected Tour ID:', selectedValue);
    };

    const getVehucleByIddepart = async (selectedTour) => {
        try {
            console.log(selectedTour);
            // Gọi API để lấy thông tin chi tiết của một phòng
            const vehicleResponse = await fetchVehicleByIddepart(selectedTour);
            const vehicleData = vehicleResponse.data;
            setVehicle(vehicleData);
            console.log(vehicleData);

        } catch (err) {
            console.error('Error fetching data:', err);
        }
    };
    useEffect(() => {
        getVehucleByIddepart(selectedTour); // Gọi hàm khi component render lần đầu
    }, [selectedTour]);

    const [selectedTour2, setSelectedTour2] = useState("");

    // Bước 2: Hàm xử lý khi select thay đổi
    const handleSelectChange2 = (event) => {
        const selectedValue2 = event.target.value; // Lấy giá trị từ option được chọn
        setSelectedTour2(event.target.value); // Cập nhật giá trị đã chọn
        console.log('Selected Tour ID:', selectedValue2);
    };

    const getHotelByIddepart = async (selectedTour) => {
        try {
            console.log(selectedTour);
            // Gọi API để lấy thông tin chi tiết của một phòng
            const hotelResponse = await fetchHotelByIddepart(selectedTour);
            const hotelData = hotelResponse.data;
            setDepositHotel(hotelData);
        } catch (err) {
            console.error('Error fetching data hotel:', err);
        }
    };
    useEffect(() => {
        getHotelByIddepart(selectedTour2); // Gọi hàm khi component render lần đầu
    }, [selectedTour2]);

    const handleVehicleChange = (event) => {
        const { value, name } = event.target;
        setFormVehicle(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // Hàm xử lý thay đổi cho ô tải lên hình ảnh
    const handleImageChange = (e) => {
        setFormSchedule({ ...formSchedule, image: e.target.files[0] });
    };

    const handleScheduleChange = (event) => {
        const { value, name } = event.target;
        setFormSchedule((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // thêm lịch trình tour
    const hendleScheduleSubmit = async (event) => {
        event.preventDefault(); //để không tự động reset
        // Tạo FormData
        const formDataSchedule = new FormData();

        // Append từng trường vào formData
        // initFormSchedule.forEach((tour, index) => {
        formDataSchedule.append("id_tour", id);
        formDataSchedule.append("day", formSchedule.day);
        formDataSchedule.append("image", formSchedule.image); // File sẽ được gửi dưới dạng multipart
        formDataSchedule.append("schedule", formSchedule.schedule);
        formDataSchedule.append("locations", formSchedule.locations);
        // });
        console.log("formDataSchedule", id);
        fetch(`${SERVER_API}/admin/create-schedule.php`, {
            method: 'POST',
            // headers: {
            //   'Content-Type': 'application/json',
            // },
            body: formDataSchedule,
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    toast.success(data.message);
                    setFormSchedule(initFormSchedule); // Đặt lại form về rỗng nếu có lỗi
                    tourDetail(id);
                } else if (data.status === 'error1') {
                    toast.error(data.message);
                    // setFormSchedule(initFormSchedule); // Đặt lại form về rỗng nếu có lỗi
                } else if (data.status === 'error2') {
                    toast.error(data.message);
                    // setFormSchedule(initFormSchedule); // Đặt lại form về rỗng nếu có lỗi
                } else if (data.status === 'error3') {
                    toast.error(data.message);
                    // setFormSchedule(initFormSchedule); // Đặt lại form về rỗng nếu có lỗi
                } else if (data.status === 'error4') {
                    toast.error(data.message);
                    // setFormSchedule(initFormSchedule); // Đặt lại form về rỗng nếu có lỗi
                } else if (data.status === 'error5') {
                    toast.error(data.message);
                    // setFormSchedule(initFormSchedule); // Đặt lại form về rỗng nếu có lỗi
                } else if (data.status === 'error6') {
                    toast.error(data.message);
                    // setFormSchedule(initFormSchedule); // Đặt lại form về rỗng nếu có lỗi
                } else if (data.status === 'error7') {
                    toast.error(data.message);
                    // setFormSchedule(initFormSchedule); // Đặt lại form về rỗng nếu có lỗi
                } else {
                    toast.error('Thêm lịch trình tour không thành công.');
                    // setFormSchedule(initFormSchedule); // Đặt lại form về rỗng nếu có lỗi
                }
            })
            .catch(error => {

                toast.error('lỗi.');
                console.log('Có lỗi xảy ra:', error);
                setFormSchedule(initFormSchedule); // Đặt lại form về rỗng nếu có lỗi
            });
    };

    const initialValues = {
        friends: [
            {
                name: '',
                day: '',
                locations: '',
                image: '',
            },
        ],
    };

    const handleChange = (event) => {
        const { value, name } = event.target;
        setFormDepart({
            ...formDepart,
            [name]: value,
        });
    };

    const hendleDepartSubmit = async (event) => {
        event.preventDefault(); //để không tự động reset
        console.log("formValue", id);
        fetch(`${SERVER_API}/admin/create_departure_tour.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id_tour: id,
                day_depar: formDepart.day,
                orders: formDepart.order
            }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    toast.success(data.message);
                    setFormDepart(initFormDepart); // Đặt lại form về rỗng nếu có lỗi
                    getTourDepart(id);
                } else if (data.status === 'error') {
                    toast.error(data.message);
                    // setFormDepart(initFormDepart); // Đặt lại form về rỗng nếu có lỗi
                }
            })
            .catch(error => {

                toast.error('lỗi.');
                console.log('Có lỗi xảy ra:', error);
                setFormDepart(initFormDepart); // Đặt lại form về rỗng nếu có lỗi
            });
    };

    // thêm đặt cọc hotel
    const createTourHotel = async (event) => {
        event.preventDefault(); //để không tự động reset
        console.log("formValue", formHotel);
        fetch(`${SERVER_API}/admin/create_deposit_hotel.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                depart_id: formHotel.depart_id,
                name_hotel: formHotel.name_hotel,
                address: formHotel.address,
                type: formHotel.type,
                quantity: formHotel.quantity,
                check_in: formHotel.check_in,
                check_out: formHotel.check_out,
                description: formHotel.depart_id
            }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    setFormHotel(initFormHotel); // Đặt lại form về rỗng nếu có lỗi
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
                setFormHotel(initFormHotel); // Đặt lại form về rỗng nếu có lỗi
            });
    };

    // thiết lập phương tiện cho tour
    const createTourVehicle = async (event) => {
        event.preventDefault(); //để không tự động reset
        console.log("formValue", formVehicle);
        fetch(`${SERVER_API}/admin/create_vehicle.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id_depart: formVehicle.id_depart,
                type: vahicle,
                departure_date: formVehicle.departure_date,
                departure_time1: formVehicle.departure_time1,
                departure1: formVehicle.departure1,
                arrival_time1: formVehicle.arrival_time1,
                destination1: formVehicle.destination1,
                company1: formVehicle.company1,
                vehicle_number1: formVehicle.vehicle_number1,
                number_of_seats1: formVehicle.number_of_seats1,
                return_date: formVehicle.return_date,
                departure_time2: formVehicle.departure_time2,
                departure2: formVehicle.departure2,
                arrival_time2: formVehicle.arrival_time2,
                destination2: formVehicle.destination2,
                company2: formVehicle.company2,
                vehicle_number2: formVehicle.vehicle_number2,
                number_of_seats2: formVehicle.number_of_seats2
            }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    setFormVehicle(initVehicle);
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

    const deleteTourSchedule = (scheduleId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa lịch trình trong ngày này?')) {
            fetch(`${SERVER_API}/admin/delete_schedule_tour.php`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ schedule_id: scheduleId }),
            })
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        setTourSchedule(tourSchedule.filter(schedule => schedule.id !== scheduleId));
                        toast.success(data.message);
                    } else if (data.status === 'error') {
                        toast.error(data.message);
                    }
                })
                .catch(error => {
                    // console.error('Có lỗi xảy ra:', error);
                    toast.error('lỗi.');
                    console.log('Có lỗi xảy ra:');
                });
        }
    };

    const handleModalUpdateSchedule = async () => {
        setIsOpenModalUpdateSchule(!isOpenModalUpdateSchule);
    };

    // Bật của sổ cập nhật lịch trình
    const ModalUpdateSchedule = async (schedule_id) => {
        setIsOpenModalUpdateSchule(!isOpenModalUpdateSchule);

        const scheduleResponse = await fetchDataScheduleTourByIdtour(schedule_id);
        const scheduleData = scheduleResponse.data;
        console.log(scheduleData);

        if (scheduleData.length > 0) {
            setFormUdateSchedule({
                id_schedule: scheduleData[0].id,
                day: scheduleData[0].date,
                image: null,
                schedule: scheduleData[0].schedule,
                locations: scheduleData[0].locations
            });
        }
    };

    // Hàm xử lý thay đổi cho ô tải lên hình ảnh
    const handleUpdateImageChange = (e) => {
        setFormUdateSchedule({ ...formUpdateSchedule, image: e.target.files[0] });
    };

    const handleUpdateScheduleChange = (event) => {
        const { value, name } = event.target;
        setFormUdateSchedule((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // update schedule setting
    const updateScheduleSetting = (event) => {
        event.preventDefault(); //để không tự động reset
        // Tạo FormData
        const formDataSchedule = new FormData();

        // Append từng trường vào formData
        // initFormSchedule.forEach((tour, index) => {
        formDataSchedule.append("id_schedule", formUpdateSchedule.id_schedule);
        formDataSchedule.append("day", formUpdateSchedule.day);
        formDataSchedule.append("image", formUpdateSchedule.image); // File sẽ được gửi dưới dạng multipart
        formDataSchedule.append("schedule", formUpdateSchedule.schedule);
        formDataSchedule.append("locations", formUpdateSchedule.locations);
        // });
        console.log("formDataSchedule", formUpdateSchedule);
        fetch(`${SERVER_API}/admin/update_schedule_tour.php`, {
            method: 'POST',
            body: formDataSchedule,
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    toast.success(data.message);
                    // setFormUdateSchedule(initFormSchedule2); // Đặt lại form về rỗng nếu có lỗi
                    tourDetail(id);
                } else if (data.status === 'error1') {
                    toast.error('Không có file hình ảnh hoặc có lỗi xảy ra.');
                } else if (data.status === 'error2') {
                    toast.error('Thiếu hoặc không hợp lệ các tham số');
                } else if (data.status === 'error3') {
                    toast.error('id_tour không tồn tại');
                } else if (data.status === 'error4') {
                    toast.error('File không phải là hình ảnh hợp lệ');
                } else if (data.status === 'error5') {
                    toast.error('Kích thước file quá lớn');
                } else if (data.status === 'error6') {
                    toast.error('Thư mục tải lên không tồn tại');
                } else if (data.status === 'error7') {
                    toast.error('Tải lên hình ảnh thất bại.');
                } else {
                    toast.error('Cập nhật lịch trình tour không thành công');
                }
            })
            .catch(error => {

                toast.error('lỗi.');
                console.log('Có lỗi xảy ra:', error);
            });
    };

    const deleteTourDepart = (departId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa ngày khởi hành này?')) {
            fetch(`${SERVER_API}/admin/delete_depart_byid.php`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ depart_id: departId }),
            })
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        setTourDepart(tourDepart.filter(schedule => schedule.id !== departId));
                        toast.success(data.message);
                    } else if (data.status === 'error') {
                        toast.error(data.message);
                    }
                })
                .catch(error => {
                    // console.error('Có lỗi xảy ra:', error);
                    toast.error('lỗi.');
                    console.log('Có lỗi xảy ra:');
                });
        }
    };

    const handleModalUpdateDepart = () => {
        setIsOpenModalUpdateDepart(!isOpenModalUpdateDepart);
    };

    // Bật của sổ cập nhật lịch trình
    const ModalUpdateDepart = async (depart_id) => {
        setIsOpenModalUpdateDepart(!isOpenModalUpdateDepart);

        const departResponse = await fetchDayDepart(depart_id);
        const departData = departResponse.data;
        // console.log(departData);

        if (departData.length > 0) {
            setFormDepartUpdate({
                depart_id: departData[0].id,
                day: departData[0].day_depart,
                order: departData[0].order
            });
        }
    };

    const handleDepartUpdateChange = (event) => {
        const { value, name } = event.target;
        setFormDepartUpdate((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const updateDepartSetting = async (event) => {
        event.preventDefault(); //để không tự động reset
        console.log(formDepartUpdate);
        fetch(`${SERVER_API}/admin/update_depart_day.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                depart_id: parseInt(formDepartUpdate.depart_id),
                id_tour: parseInt(id),
                day: formDepartUpdate.day,
                order: parseInt(formDepartUpdate.order)
            }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    toast.success(data.message);
                    getTourDepart(id);
                } else if (data.status === 'error') {
                    toast.error(data.message);
                }
            })
            .catch(error => {

                toast.error('lỗi.');
                console.log('Có lỗi xảy ra:', error);
            });
    };



    if (error) return <p>{error}</p>;

    return (
        <div className="">
            <HeaderManager />

            <div className="w-[80%] h-screen -mt-[660px] float-right flex">
                <div className="w-[60%]">
                    <div className="w-full px-3 h-[95%] mb-5 mt-6 mx-auto overflow-auto bg-white rounded-md" id="edit-room" >
                        <div className="modal-dialog modal-lg">
                            <div className="modal-header mb-5 mx-3 pt-5">
                                <h5 className="modal-title text-left font-semibold text-xl">Thêm lịch trình tour</h5>
                            </div>
                            <Formik initialValues={initialValues} onSubmit={async (values) => {
                                await new Promise((r) => setTimeout(r, 500));
                                alert(JSON.stringify(values, null, 2));
                            }}
                            >
                                {({ values }) => (
                                    <Form onSubmit={hendleScheduleSubmit}>
                                        <FieldArray name="friends">
                                            {({ insert, remove, push }) => (
                                                <div className="bg-white">
                                                    {values.friends.length > 0 &&
                                                        values.friends.map((friend, index) => (
                                                            <div className="row w-[98%] mt-3 mx-auto border-[1px] bg-gray-100 border-gray-200 rounded-sm" key={index}>
                                                                {/* <div className="col text-right mr-4 my-3">
                                                                    <button type="button" className="secondary" onClick={() => remove(index)}>
                                                                        <i className="fa-solid fa-square-xmark"></i>
                                                                    </button>
                                                                </div> */}
                                                                <div className="col w-[95%] text-left mb-3 ">
                                                                    {/* <div className="w-full" htmlFor={`friends.${index}.name`}>Day: </div> */}
                                                                    <Field name='id_tour' value={formSchedule.id_tour} onChange={handleScheduleChange} className='border-[1px] border-gray-200 rounded-md w-full py-2 px-2' type="hidden" />
                                                                    <ErrorMessage name={`friends.${index}.name`} component="div" className="field-error" />
                                                                </div>
                                                                <div className="col w-[95%] text-left mx-auto mb-3">
                                                                    <div className="w-full" htmlFor={`friends.${index}.name`}>Ngày: </div>
                                                                    {/* <Field name={`friends.${index}.name`} className='border-[1px] border-gray-200 rounded-md w-full py-2 px-2' type="number" />
                                                        <ErrorMessage name={`friends.${index}.name`} component="div" className="field-error" /> */}
                                                                    <Field name='day' value={formSchedule.day} onChange={handleScheduleChange} className='border-[1px] border-gray-200 rounded-md w-full py-2 px-2' type="number" />
                                                                    <ErrorMessage name={`friends.${index}.name`} component="div" className="field-error" />
                                                                </div>
                                                                <div className="col w-[95%] text-left mx-auto mb-3">
                                                                    <div className="w-full" htmlFor={`friends.${index}.name`}>Địa điểm: </div>
                                                                    <Field name='locations' value={formSchedule.locations} onChange={handleScheduleChange} className='border-[1px] border-gray-200 rounded-md w-full py-2 px-2' type="text" />
                                                                    <ErrorMessage name={`friends.${index}.name`} component="div" className="field-error" />
                                                                </div>
                                                                <div className="col w-[95%] text-left mx-auto mb-3">
                                                                    <div className="w-full" htmlFor={`friends.${index}.name`}>Hình ảnh: </div>
                                                                    {/* <Field name='image' value={formSchedule.image} onChange={handleScheduleChange} className='border-[1px] border-gray-200 rounded-md w-full py-2 px-2' type="file" /> */}
                                                                    <input type="file" name="image" onChange={handleImageChange}
                                                                        className="border-[1px] border-gray-200 rounded-md w-full py-2 px-2" required=""
                                                                    />
                                                                    <ErrorMessage name={`friends.${index}.name`} component="div" className="field-error" />
                                                                </div>
                                                                <div className="col w-[95%] text-left mx-auto mb-4">
                                                                    <div htmlFor={`friends.${index}.email`}>Lịch trình trong ngày: </div>
                                                                    {/* <Field name={`friends.${index}.email`} className='h-[150px] border-[1px] border-gray-200 rounded-md w-[95%]' type="email" /> */}
                                                                    <textarea name='schedule' value={formSchedule.schedule} onChange={handleScheduleChange} className='h-[150px] px-2 py-2 border-[1px] border-gray-200 rounded-md w-full' type="email">

                                                                    </textarea>
                                                                    <ErrorMessage name={`friends.${index}.name`} component="div" className="field-error" />
                                                                </div>
                                                                {/* <div className="col">
                                                        <button type="button" className="secondary" onClick={() => remove(index)}>
                                                        X
                                                        </button>
                                                    </div> */}
                                                            </div>
                                                        ))}
                                                    {/* <div className="mt-5 mb-3 bg-[#0d6efd] text-white mx-2 inline-block align-middle text-center select-none font-normal whitespace-no-wrap rounded py-1 px-3 leading-normal no-underline border-[2px] border-[#0d6efd]  hover:text-[#0d6efd] hover:bg-white duration-100 shadow-none">
                                                        <button type="button" className="secondary" onClick={() => push({ name: '', email: '' })}>
                                                            One More Day
                                                        </button>
                                                    </div> */}
                                                </div>
                                            )}
                                        </FieldArray>
                                        <div className="flex bg-white justify-center mb-4">
                                            {/* <div>
                                            <button type="reset" onClick={handleModalTourSchedule} className="mx-2 inline-block align-middle text-center select-none border font-normal whitespace-no-wrap rounded py-1 px-3 leading-normal no-underline text-gray-600 shadow-none" data-bs-dismiss="modal">
                                                CANCEL
                                            </button>
                                        </div> */}
                                            <div>
                                                <button type="submit" onClick={(event) => hendleScheduleSubmit(event)} className="bg-black mt-3 mx-2 inline-block align-middle text-center select-none border font-normal whitespace-no-wrap rounded py-1 px-3 leading-normal no-underline custom-bg text-white shadow-none">
                                                    Thêm
                                                </button>
                                            </div>
                                        </div>
                                    </Form>
                                )}
                            </Formik>

                            <div>
                                <div className="text-left mb-5 mx-3 pt-5 font-semibold text-xl">Thiết lập lịch trình khởi hành</div>
                                <div className="row w-[98%] mt-3 mx-auto border-[1px] bg-gray-100 border-gray-200 rounded-sm py-3 px-3">
                                    <form onSubmit={hendleDepartSubmit}>
                                        <div className="flex items-center mb-3">
                                            <div className="font-semibold">Ngày khởi hành:</div>
                                            <input type="date"
                                                className="border-[1px] rounded-md mx-2 py-2 w-[300px] px-2"
                                                name="day"
                                                min={today}
                                                value={formDepart.day}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="flex items-center">
                                            <div className="font-semibold">Số lượng đơn đặt tour:</div>
                                            <input type="number"
                                                className="border-[1px] rounded-md mx-2 py-2 px-2"
                                                name="order"
                                                value={formDepart.order}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </form>
                                </div>
                                <div>
                                    <button type="submit" onClick={(event) => hendleDepartSubmit(event)} className="bg-black mx-2 my-3 inline-block align-middle text-center select-none border font-normal whitespace-no-wrap rounded py-1 px-3 leading-normal no-underline custom-bg text-white shadow-none">
                                        Thêm
                                    </button>
                                </div>
                            </div>
                            <div>
                                <div className="text-left mb-5 mx-3 pt-5 font-semibold text-xl">Đặt cọc dịch vụ</div>
                                <div>
                                    <div className="text-center mx-3 font-semibold text-lg">Nơi ở</div>
                                    <div className="w-[98%] mt-3 mx-auto border-[1px] bg-gray-100 border-gray-200 rounded-sm py-3 px-3">
                                        <div className="text-left my-3">
                                            <div>Ngày khởi hành</div>
                                            <select className="w-[95%] rounded-md h-9 outline-none" name="depart_id" value={formHotel.depart_id}
                                                onChange={handleHotelChange}>
                                                <option value="">Chọn ngày</option> {/* Tùy chọn mặc định */}
                                                {tourDepart && Array.isArray(tourDepart) && tourDepart.length > 0 ? (
                                                    tourDepart
                                                        .filter((tour) => new Date(tour.day_depart) > new Date()) // Lọc chỉ ngày > ngày hiện tại
                                                        .map((tour) => (
                                                            <option key={tour.id} value={tour.id}>{tour.day_depart}</option>
                                                        ))
                                                ) : (
                                                    <option value="">Chưa được lên lịch</option> /* Tùy chọn mặc định */
                                                )}
                                            </select>
                                        </div>
                                        <div className="text-left my-3">
                                            <div>Khách sạn</div>
                                            <input type="text"
                                                className="border-[1px] w-full rounded-md py-[2px] px-2"
                                                name="name_hotel"
                                                value={formHotel.name_hotel}
                                                onChange={handleHotelChange}
                                            />
                                        </div>
                                        <div className="text-left my-3">
                                            <div>Địa chỉ</div>
                                            <input type="text"
                                                className="border-[1px] w-full rounded-md py-[2px] px-2"
                                                name="address"
                                                value={formHotel.address}
                                                onChange={handleHotelChange}
                                            />
                                        </div>
                                        <div className="text-left my-3">
                                            <div>Loại phòng</div>
                                            <input type="text"
                                                className="border-[1px] w-full rounded-md py-[2px] px-2"
                                                name="type"
                                                placeholder="phòng đơn"
                                                value={formHotel.type}
                                                onChange={handleHotelChange}
                                            />
                                        </div>
                                        <div className="text-left my-3">
                                            <div>Số lượng phòng</div>
                                            <input type="number"
                                                className="border-[1px] w-full rounded-md py-[2px] px-2"
                                                name="quantity"
                                                value={formHotel.quantity}
                                                onChange={handleHotelChange}
                                            />
                                        </div>
                                        <div className="flex gap-3">
                                            <div className="w-1/2 text-left">
                                                <div>Ngày nhận</div>
                                                <div className="">
                                                    <input type="date"
                                                        className="border-[1px] w-full rounded-md py-[2px] px-2"
                                                        name="check_in"
                                                        value={formHotel.check_in}
                                                        onChange={handleHotelChange}
                                                    />
                                                </div>
                                            </div>
                                            <div className="w-1/2 text-left">
                                                <div>Ngày trả</div>
                                                <div className="">
                                                    <input type="date"
                                                        className="border-[1px] w-full rounded-md py-[2px] px-2"
                                                        name="check_out"
                                                        value={formHotel.check_out}
                                                        onChange={handleHotelChange}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-left my-3">
                                            <div>Mô tả phòng</div>
                                            <textarea type="number"
                                                className="border-[1px] h-[200px] w-full rounded-md py-2 px-2"
                                                name="description"
                                                value={formHotel.description}
                                                onChange={handleHotelChange}
                                            />
                                        </div>
                                        <div>
                                            <button type="button" onClick={(event) => createTourHotel(event)} className="bg-black text-white px-2 py-[2px] rounded-[3px]">
                                                Thêm
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <div className="text-center mx-3 font-semibold text-lg">Phương tiện</div>
                                    <div className="w-[98%] mt-3 mx-auto border-[1px] bg-gray-100 border-gray-200 rounded-sm py-3 px-3">
                                        <div className="text-left">
                                            <div>Ngày khởi hành</div>
                                            <select name="id_depart" value={formVehicle.id_depart}
                                                onChange={handleVehicleChange}
                                            >
                                                <option value="">Chọn ngày</option>
                                                {tourDepart && Array.isArray(tourDepart) && tourDepart.length > 0 ? (
                                                    tourDepart
                                                        .filter((tour) => new Date(tour.day_depart) > new Date()) // Lọc chỉ ngày > ngày hiện tại
                                                        .map((tour) => (
                                                            <option key={tour.id} value={tour.id}>{tour.day_depart}</option>
                                                        ))
                                                ) : (
                                                    <option value="">Chưa được lên lịch</option> /* Tùy chọn mặc định */
                                                )}
                                            </select>
                                        </div>
                                        <div className="text-left">
                                            <div>Loại phương tiện</div>
                                            <select onChange={handleTypeVehicleChange}>
                                                <option value='may bay'>Máy bay</option>
                                                <option value='xe khach'>Xe khách</option>
                                            </select>
                                        </div>
                                        {vahicle === 'may bay' && (
                                            <div className="mt-3 border-[1px] border-gray-400 rounded-[3px] px-2">
                                                <form onSubmit={createTourVehicle}>
                                                    <div>
                                                        <div className="my-3">
                                                            <div>Ngày đi</div>
                                                            <input type="date"
                                                                className="border-[1px] w-[50%] rounded-md py-[2px] px-2"
                                                                name="departure_date"
                                                                value={formVehicle.departure_date}
                                                                onChange={handleVehicleChange}
                                                            />
                                                        </div>
                                                        <div className="flex gap-x-2">
                                                            <div className="w-1/2">
                                                                <div>Khởi hành</div>
                                                                <input type="time"
                                                                    className="border-[1px] w-full rounded-md py-[2px] px-2"
                                                                    name="departure_time1"
                                                                    value={formVehicle.departure_time1}
                                                                    onChange={handleVehicleChange}
                                                                />
                                                                <input type="text"
                                                                    className="border-[1px] w-full rounded-md py-[2px] px-2"
                                                                    name="departure1"
                                                                    placeholder="Điểm đi"
                                                                    value={formVehicle.departure1}
                                                                    onChange={handleVehicleChange}
                                                                />
                                                            </div>
                                                            <div className="w-1/2">
                                                                <div>Kết thúc</div>
                                                                <input type="time"
                                                                    className="border-[1px] w-full rounded-md py-[2px] px-2"
                                                                    name="arrival_time1"
                                                                    value={formVehicle.arrival_time1}
                                                                    onChange={handleVehicleChange}
                                                                />
                                                                <input type="text"
                                                                    className="border-[1px] w-full rounded-md py-[2px] px-2"
                                                                    name="destination1"
                                                                    placeholder="Điểm đến"
                                                                    value={formVehicle.destination1}
                                                                    onChange={handleVehicleChange}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="text-left my-3">
                                                            <div>Hãng máy bay</div>
                                                            <input type="text"
                                                                className="border-[1px] w-full rounded-md py-[2px] px-2"
                                                                name="company1"
                                                                placeholder="Vietname airline"
                                                                value={formVehicle.company1}
                                                                onChange={handleVehicleChange}
                                                            />
                                                        </div>
                                                        <div className="flex gap-x-2">
                                                            <div className="w-1/2 text-left my-3">
                                                                <div>Số hiệu máy bay</div>
                                                                <input type="text"
                                                                    className="border-[1px] w-full rounded-md py-[2px] px-2"
                                                                    name="vehicle_number1"
                                                                    placeholder="VN123"
                                                                    value={formVehicle.vehicle_number1}
                                                                    onChange={handleVehicleChange}
                                                                />
                                                            </div>
                                                            <div className="w-1/2 text-left my-3">
                                                                <div>Số lượng ghế</div>
                                                                <input type="number"
                                                                    className="border-[1px] w-full rounded-md py-[2px] px-2"
                                                                    name="number_of_seats1"
                                                                    value={formVehicle.number_of_seats1}
                                                                    onChange={handleVehicleChange}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="my-3">
                                                            <div>Ngày về</div>
                                                            <input type="date"
                                                                className="border-[1px] w-[50%] rounded-md py-[2px] px-2"
                                                                name="return_date"
                                                                value={formVehicle.return_date}
                                                                onChange={handleVehicleChange}
                                                            />
                                                        </div>
                                                        <div className="flex gap-x-2">
                                                            <div className="w-1/2">
                                                                <div>Khởi hành</div>
                                                                <input type="time"
                                                                    className="border-[1px] w-full rounded-md py-[2px] px-2"
                                                                    name="departure_time2"
                                                                    value={formVehicle.departure_time2}
                                                                    onChange={handleVehicleChange}
                                                                />
                                                                <input type="text"
                                                                    className="border-[1px] w-full rounded-md py-[2px] px-2"
                                                                    name="departure2"
                                                                    value={formVehicle.departure2}
                                                                    onChange={handleVehicleChange}
                                                                />
                                                            </div>
                                                            <div className="w-1/2">
                                                                <div>Kết thúc</div>
                                                                <input type="time"
                                                                    className="border-[1px] w-full rounded-md py-[2px] px-2"
                                                                    name="arrival_time2"
                                                                    value={formVehicle.arrival_time2}
                                                                    onChange={handleVehicleChange}
                                                                />
                                                                <input type="text"
                                                                    className="border-[1px] w-full rounded-md py-[2px] px-2"
                                                                    name="destination2"
                                                                    value={formVehicle.destination2}
                                                                    onChange={handleVehicleChange}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="text-left my-3">
                                                            <div>Hãng máy bay</div>
                                                            <input type="text"
                                                                className="border-[1px] w-full rounded-md py-[2px] px-2"
                                                                name="company2"
                                                                placeholder="Vietname airline"
                                                                value={formVehicle.company2}
                                                                onChange={handleVehicleChange}
                                                            />
                                                        </div>
                                                        <div className="flex gap-x-2">
                                                            <div className="w-1/2 text-left my-3">
                                                                <div>Số hiệu máy bay</div>
                                                                <input type="text"
                                                                    className="border-[1px] w-full rounded-md py-[2px] px-2"
                                                                    name="vehicle_number2"
                                                                    placeholder="VN123"
                                                                    value={formVehicle.vehicle_number2}
                                                                    onChange={handleVehicleChange}
                                                                />
                                                            </div>
                                                            <div className="w-1/2 text-left my-3">
                                                                <div>Số lượng ghế</div>
                                                                <input type="number"
                                                                    className="border-[1px] w-full rounded-md py-[2px] px-2"
                                                                    name="number_of_seats2"
                                                                    value={formVehicle.number_of_seats2}
                                                                    onChange={handleVehicleChange}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </form>
                                                <div className="mb-3">
                                                    <button type="submit" onClick={(event) => createTourVehicle(event)} className="bg-black text-white px-2 py-[2px] rounded-[3px]">
                                                        Thêm
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {vahicle === 'xe khach' && (
                                            <div className="mt-3 border-[1px] border-gray-400 rounded-[3px] px-2">
                                                <div>
                                                    <div className="my-3">
                                                        <div>Ngày đi</div>
                                                        <input type="date"
                                                            className="border-[1px] w-[50%] rounded-md py-[2px] px-2"
                                                            name="departure_date"
                                                            value={formVehicle.departure_date}
                                                            onChange={handleVehicleChange}
                                                        />
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <div className="w-1/2">
                                                            <div>Khởi hành</div>
                                                            <input type="time"
                                                                className="border-[1px] w-full rounded-md py-[2px] px-2"
                                                                name="departure_time1"
                                                                value={formVehicle.departure_time1}
                                                                onChange={handleVehicleChange}
                                                            />
                                                            <input type="text"
                                                                className="border-[1px] w-full rounded-md py-[2px] px-2"
                                                                name="departure1"
                                                                placeholder="Điểm đi"
                                                                value={formVehicle.departure1}
                                                                onChange={handleVehicleChange}
                                                            />
                                                        </div>
                                                        <div className="w-1/2">
                                                            <div>Kết thúc</div>
                                                            <input type="time"
                                                                className="border-[1px] w-full rounded-md py-[2px] px-2"
                                                                name="arrival_time1"
                                                                value={formVehicle.arrival_time1}
                                                                onChange={handleVehicleChange}
                                                            />
                                                            <input type="text"
                                                                className="border-[1px] w-full rounded-md py-[2px] px-2"
                                                                name="destination1"
                                                                placeholder="Điểm đến"
                                                                value={formVehicle.destination1}
                                                                onChange={handleVehicleChange}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="text-left my-3">
                                                        <div>Hãng xe</div>
                                                        <input type="text"
                                                            className="border-[1px] w-full rounded-md py-[2px] px-2"
                                                            placeholder="Phương Trang"
                                                            name="company1"
                                                            value={formVehicle.company1}
                                                            onChange={handleVehicleChange}
                                                        />
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <div className="w-1/2 text-left my-3">
                                                            <div>Biển số</div>
                                                            <input type="text"
                                                                className="border-[1px] w-full rounded-md py-[2px] px-2"
                                                                placeholder="61B2-22489"
                                                                name="vehicle_number1"
                                                                value={formVehicle.vehicle_number1}
                                                                onChange={handleVehicleChange}
                                                            />
                                                        </div>
                                                        <div className="w-1/2 text-left my-3">
                                                            <div>Số lượng ghế</div>
                                                            <input type="number"
                                                                className="border-[1px] w-full rounded-md py-[2px] px-2"
                                                                name="number_of_seats1"
                                                                value={formVehicle.number_of_seats1}
                                                                onChange={handleVehicleChange}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="my-3">
                                                        <div>Ngày về</div>
                                                        <input type="date"
                                                            className="border-[1px] w-[50%] rounded-md py-[2px] px-2"
                                                            name="return_date"
                                                            value={formVehicle.return_date}
                                                            onChange={handleVehicleChange}
                                                        />
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <div className="w-1/2">
                                                            <div>Khởi hành</div>
                                                            <input type="time"
                                                                className="border-[1px] w-full rounded-md py-[2px] px-2"
                                                                name="departure_time2"
                                                                value={formVehicle.departure_time2}
                                                                onChange={handleVehicleChange}
                                                            />
                                                            <input type="text"
                                                                className="border-[1px] w-full rounded-md py-[2px] px-2"
                                                                name="departure2"
                                                                value={formVehicle.departure2}
                                                                onChange={handleVehicleChange}
                                                            />
                                                        </div>
                                                        <div className="w-1/2">
                                                            <div>Kết thúc</div>
                                                            <input type="time"
                                                                className="border-[1px] w-full rounded-md py-[2px] px-2"
                                                                name="arrival_time2"
                                                                value={formVehicle.arrival_time2}
                                                                onChange={handleVehicleChange}
                                                            />
                                                            <input type="text"
                                                                className="border-[1px] w-full rounded-md py-[2px] px-2"
                                                                name="destination2"
                                                                value={formVehicle.destination2}
                                                                onChange={handleVehicleChange}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="text-left my-3">
                                                        <div>Hãng xe</div>
                                                        <input type="text"
                                                            className="border-[1px] w-full rounded-md py-[2px] px-2"
                                                            placeholder="Thành Bưởi"
                                                            name="company2"
                                                            value={formVehicle.company2}
                                                            onChange={handleVehicleChange}
                                                        />
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <div className="w-1/2 text-left my-3">
                                                            <div>Biển số</div>
                                                            <input type="text"
                                                                className="border-[1px] w-full rounded-md py-[2px] px-2"
                                                                placeholder="61B2-22489"
                                                                name="vehicle_number2"
                                                                value={formVehicle.vehicle_number2}
                                                                onChange={handleVehicleChange}
                                                            />
                                                        </div>
                                                        <div className="w-1/2 text-left my-3">
                                                            <div>Số lượng ghế</div>
                                                            <input type="number"
                                                                className="border-[1px] w-full rounded-md py-[2px] px-2"
                                                                name="number_of_seats2"
                                                                value={formVehicle.number_of_seats2}
                                                                onChange={handleVehicleChange}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="mb-3">
                                                        <button type="button" onClick={(event) => createTourVehicle(event)} className="bg-black text-white px-2 py-[2px] rounded-[3px]">
                                                            Thêm
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>

                </div>
                <div className="w-[40%] h-screen border-[1px] border-gray-200 px-3 py-3 overflow-auto">
                    <div className="uppercase font-semibold text-xl">Thông tin cơ bản của tour</div>
                    <div className="text-xs mb-4">&#40;Bạn cần phải thiết lập lịch trình của tour theo đúng thông tin cơ bản của tour&#41;</div>
                    {tourDetails && tourDetails.id ? (
                        <div>
                            <div className="flex mb-3">
                                <div className="font-semibold">Mã tour:</div>
                                <div className="mx-2">{tourDetails.id}</div>
                            </div>
                            <div className="flex mb-3 text-left">
                                <div className="font-semibold w-[20%]">Tên tour</div>
                                <div className="mx-2 w-[80%]">{tourDetails.name}</div>
                            </div>
                            <div className="flex mb-3">
                                <div className="font-semibold">Kiểu tour:</div>
                                <div className="mx-2">{tourDetails.type}</div>
                            </div>
                            <div className="flex mb-3">
                                <div className="font-semibold">Giá tour:</div>
                                <div className="mx-2">{tourDetails.price}</div>
                            </div>
                            <div className="flex mb-3">
                                <div className="font-semibold">Giảm giá &#40;%&#41;:</div>
                                <div className="mx-2">{tourDetails.discount}</div>
                            </div>
                            <div className="flex mb-3">
                                <div className="font-semibold">SL người tham gia tối thiểu:</div>
                                <div className="mx-2">{tourDetails.min_participant}</div>
                            </div>
                            <div className="flex mb-3">
                                <div className="font-semibold">SL người tham gia tối đa:</div>
                                <div className="mx-2">{tourDetails.max_participant}</div>
                            </div>
                            <div className="flex mb-3">
                                <div className="font-semibold">Xuất phát từ:</div>
                                <div className="mx-2">{tourDetails.departurelocation}</div>
                            </div>
                            <div className="flex mb-3">
                                <div className="font-semibold">Thời gian:</div>
                                <div className="mx-2">{tourDetails.timeTour}</div>
                            </div>
                            <div className="flex mb-3">
                                <div className="font-semibold">Lịch khởi hành:</div>
                                <div className="mx-2">{tourDetails.depart}</div>
                            </div>
                            <div className="text-left mb-3">
                                <div className="font-semibold">Mô tả:</div>
                                <div dangerouslySetInnerHTML={{ __html: tourDetails.description.replace(/\n/g, '<br/>') }} />
                            </div>
                            <div className="flex mb-3">
                                <div className="font-semibold">Phương tiện:</div>
                                <div className="mx-2">{tourDetails.vehicle}</div>
                            </div>
                            <div className="flex mb-3 text-left">
                                <div className="font-semibold w-[25%]">Hành trình:</div>
                                <div className="mx-2 w-[75%]">{tourDetails.itinerary}</div>
                            </div>
                        </div>
                    ) : (
                        <p>tên phòng...</p>
                    )}

                    <div className="w-full text-left" key={tourSchedule.id}>
                        <div className="font-semibold text-lg mb-3 text-center">
                            Lịch trình cụ thể
                        </div>
                        {Array.isArray(tourSchedule) && tourSchedule.length > 0 ? (
                            tourSchedule.map((tourSchedule) => (
                                <div className="mb-2" key={tourSchedule.id}>
                                    <div className="flex justify-between items-center mb-3">
                                        <div className="flex">
                                            <div className="font-medium">Ngày {tourSchedule.date}</div>
                                            <div className="mx-2">
                                                | {tourSchedule.locations}
                                            </div>
                                        </div>
                                        <div className="flex gap-x-2 items-center">
                                            <div className="">
                                                <button type="button" onClick={() => ModalUpdateSchedule(tourSchedule.id)} className="bg-[#0dcaf0] border-[1px] border-[#0dcaf0] hover:bg-white hover:text-black text-white px-2 py-[2px] rounded-[3px] text-sm">
                                                    Sửa
                                                </button>
                                            </div>
                                            <div className="">
                                                <button type="button" onClick={() => deleteTourSchedule(tourSchedule.id)} className="bg-[#dc3545] border-[1px] border-[#dc3545] hover:bg-white hover:text-black text-white px-2 py-[2px] rounded-[3px] text-sm">
                                                    Xóa
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        {tourSchedule.schedule}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center">Chưa có dữ liệu lịch trình cho tour.</p>
                        )}
                    </div>
                    <div>
                        <div className="font-semibold text-lg mb-3 text-center">
                            Lịch trình khởi hành
                        </div>
                        <div>
                            <table className="mx-auto border-[1px] border-gray-200">
                                <thead>
                                    <tr className="border-[1px] border-b-gray-200 bg-gray-200">
                                        <th className="border-r-gray-200 border-[1px] px-2">Ngày khởi hành</th>
                                        <th className="border-r-gray-200 border-[1px] px-2">SL đơn đặt tour</th>
                                        <th className="border-r-gray-200 border-[1px] px-2">Tùy chỉnh</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tourDepart && tourDepart.length > 0 ? (
                                        tourDepart.map((tourDepart) => (
                                            <tr key={tourDepart.id} className="border-b-[1px] border-gray-200">
                                                <td className="border-r-gray-200 border-[1px]"><FormatTime date={tourDepart.day_depart} /></td>
                                                <td className="border-r-gray-200 border-[1px]">{tourDepart.order}</td>
                                                <td>
                                                    <div className="flex gap-x-2 justify-center">
                                                        <div className="">
                                                            <button type='button' onClick={() => ModalUpdateDepart(tourDepart.id)} className='bg-[#0dcaf0] rounded-md font-semibold text-[10px]'><i className="fa-solid fa-pen-to-square px-[6px] py-[1px] text-white"></i></button>
                                                        </div>
                                                        <div className=" ">
                                                            <button type="button" onClick={() => deleteTourDepart(tourDepart.id)} className='bg-[#dc3545] rounded-md font-semibold text-[10px]'><i className="fa-solid fa-trash text-white px-[6px] py-[1px]"></i></button>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr className="border-[1px] border-gray-200">
                                            <td className="text-center" colSpan="3">Chưa có lịch khởi hành</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="mt-5">
                        <div className="text-lg font-semibold mb-3">Phương tiện</div>
                        <div className="flex items-center">
                            <div>Chọn ngày khởi hành</div>
                            <div>
                                <select className="border-[1px] border-gray-400 mx-2 rounded-[3px]"
                                    value={selectedTour}
                                    onChange={handleSelectChange}
                                >
                                    <option value="">Chọn ngày</option>
                                    {tourDepart && Array.isArray(tourDepart) && tourDepart.length > 0 ? (
                                        tourDepart
                                            .filter((tour) => new Date(tour.day_depart) > new Date()) // Lọc chỉ ngày > ngày hiện tại
                                            .map((tour) => (
                                                <option key={tour.id} value={tour.id}>{tour.day_depart}</option>
                                            ))
                                    ) : (
                                        <option value="">Chưa được lên lịch</option> /* Tùy chọn mặc định */
                                    )}
                                </select>
                            </div>
                        </div>
                        {vehicle && Array.isArray(vehicle) && vehicle.length > 0 ? (
                            vehicle.map((vehicle) => (
                                <div className="w-full mt-3">
                                    <div className="mx-auto border-[1px] border-gray-300 py-2 px-3 rounded-lg" style={{ boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', }}>
                                        <div className="flex gap-x-2 justify-end">
                                            <div className="">
                                                <button type='button' className='bg-[#0dcaf0] rounded-md font-semibold text-[10px]'><i className="fa-solid fa-pen-to-square px-[6px] py-[1px] text-white"></i></button>
                                            </div>
                                            <div className=" ">
                                                <button type="button" className='bg-[#dc3545] rounded-md font-semibold text-[10px]'><i className="fa-solid fa-trash text-white px-[6px] py-[1px]"></i></button>
                                            </div>
                                        </div>
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
                    <div>
                        <div className="font-semibold text-lg mb-3">Nơi ở</div>
                        <div className="flex items-center">
                            <div>Chọn ngày khởi hành</div>
                            <div>
                                <select className="border-[1px] border-gray-400 mx-2 rounded-[3px]"
                                    value={selectedTour2}
                                    onChange={handleSelectChange2}
                                >
                                    <option value="">Chọn ngày</option>
                                    {tourDepart && Array.isArray(tourDepart) && tourDepart.length > 0 ? (
                                        tourDepart
                                            .filter((tour) => new Date(tour.day_depart) > new Date()) // Lọc chỉ ngày > ngày hiện tại
                                            .map((tour) => (
                                                <option key={tour.id} value={tour.id}>{tour.day_depart}</option>
                                            ))
                                    ) : (
                                        <option value="">Chưa được lên lịch</option> /* Tùy chọn mặc định */
                                    )}
                                </select>
                            </div>
                        </div>
                        <div className="my-3">
                            {depositHotel && Array.isArray(depositHotel) && depositHotel.length > 0 ? (
                                depositHotel.map((Hotel) => (
                                    <div className="mx-auto border-[1px] border-gray-300 py-2 px-3 rounded-lg" style={{ boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', }}>
                                        <div className="flex text-left">
                                            <div className="font-semibold w-[25%]">Khách sạn: </div>
                                            <div className="mx-2 w-[75%]">{Hotel.name_hotel}</div>
                                        </div>
                                        <div className="flex text-left">
                                            <div className="font-semibold w-[20%]">Địa chỉ: </div>
                                            <div className="mx-2 w-[80%]">{Hotel.address}</div>
                                        </div>
                                        <div className="flex text-left">
                                            <div className="font-semibold w-[25%]">Loại phòng: </div>
                                            <div className="mx-2 w-[675]">{Hotel.type}</div>
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
                                            <div className="font-semibold w-[20%]">Mô tả</div>
                                            <div className="mx-2 w-[80%]">{Hotel.description}</div>
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

            {/* cập nhật lịch trình tour  */}
            {isOpenModalUpdateSchule && (
                <div className="w-full bg-black bg-opacity-25 inset-0 backdrop-blur-sm fixed">
                    <div className=" mt-4 pr-4 pl-4 mx-auto bg-gray-100 rounded-md overflow-y-auto">
                        <div className="modal h-[90%] overflow-y-auto" id="add-room" tabIndex={-1}>
                            <Formik initialValues={initialValues} onSubmit={async (values) => {
                                await new Promise((r) => setTimeout(r, 500));
                                alert(JSON.stringify(values, null, 2));
                            }}
                            >
                                {({ values }) => (
                                    <Form>
                                        <FieldArray name="friends">
                                            {({ insert, remove, push }) => (
                                                <div className="bg-white">
                                                    {values.friends.length > 0 &&
                                                        values.friends.map((friend, index) => (
                                                            <div className="row" key={index}>
                                                                <div className="col text-right mr-4 my-3">
                                                                    <button type="button" className="secondary" onClick={handleModalUpdateSchedule}>
                                                                        <i className="fa-solid fa-square-xmark"></i>
                                                                    </button>
                                                                </div>
                                                                <div className="col w-[95%] text-left mb-3 ">
                                                                    {/* <div className="w-full" htmlFor={`friends.${index}.name`}>Day: </div> */}
                                                                    <Field name='id_tour' value={formUpdateSchedule.id_tour} onChange={handleUpdateScheduleChange} className='border-[1px] border-gray-200 rounded-md w-full py-2 px-2 outline-none' type="hidden" />
                                                                    <ErrorMessage name={`friends.${index}.name`} component="div" className="field-error" />
                                                                </div>
                                                                <div className="col w-[95%] text-left mx-auto mb-3">
                                                                    <div className="w-full" htmlFor={`friends.${index}.name`}>Ngày: </div>
                                                                    {/* <Field name={`friends.${index}.name`} className='border-[1px] border-gray-200 rounded-md w-full py-2 px-2' type="number" />
                                                        <ErrorMessage name={`friends.${index}.name`} component="div" className="field-error" /> */}
                                                                    <Field name='day' value={formUpdateSchedule.day} onChange={handleUpdateScheduleChange} className='border-[1px] border-gray-200 rounded-md w-full py-2 px-2 outline-none' type="number" />
                                                                    <ErrorMessage name={`friends.${index}.name`} component="div" className="field-error" />
                                                                </div>
                                                                <div className="col w-[95%] text-left mx-auto mb-3">
                                                                    <div className="w-full" htmlFor={`friends.${index}.name`}>Địa điểm: </div>
                                                                    <Field name='locations' value={formUpdateSchedule.locations} onChange={handleUpdateScheduleChange} className='border-[1px] border-gray-200 rounded-md w-full py-2 px-2 outline-none' type="text" />
                                                                    <ErrorMessage name={`friends.${index}.name`} component="div" className="field-error" />
                                                                </div>
                                                                <div className="col w-[95%] text-left mx-auto mb-3">
                                                                    <div className="w-full" htmlFor={`friends.${index}.name`}>Hình ảnh: </div>
                                                                    {/* <Field name='image' value={formSchedule.image} onChange={handleScheduleChange} className='border-[1px] border-gray-200 rounded-md w-full py-2 px-2' type="file" /> */}
                                                                    <input type="file" name="image" onChange={handleUpdateImageChange}
                                                                        className="border-[1px] border-gray-200 rounded-md w-full py-2 px-2" required=""
                                                                    />
                                                                    <ErrorMessage name={`friends.${index}.name`} component="div" className="field-error" />
                                                                </div>
                                                                <div className="col w-[95%] text-left mx-auto mb-4">
                                                                    <div htmlFor={`friends.${index}.email`}>Lịch trình trong ngày: </div>
                                                                    {/* <Field name={`friends.${index}.email`} className='h-[150px] border-[1px] border-gray-200 rounded-md w-[95%]' type="email" /> */}
                                                                    <textarea name='schedule' value={formUpdateSchedule.schedule} onChange={handleUpdateScheduleChange} className='outline-none h-[150px] px-2 py-2 border-[1px] border-gray-200 rounded-md w-full' type="email">

                                                                    </textarea>
                                                                    <ErrorMessage name={`friends.${index}.name`} component="div" className="field-error" />
                                                                </div>
                                                                {/* <div className="col">
                                                        <button type="button" className="secondary" onClick={() => remove(index)}>
                                                        X
                                                        </button>
                                                    </div> */}
                                                            </div>
                                                        ))}
                                                    {/* <div className="mt-5 mb-3 bg-[#0d6efd] text-white mx-2 inline-block align-middle text-center select-none font-normal whitespace-no-wrap rounded py-1 px-3 leading-normal no-underline border-[2px] border-[#0d6efd]  hover:text-[#0d6efd] hover:bg-white duration-100 shadow-none">
                                                        <button type="button" className="secondary" onClick={() => push({ name: '', email: '' })}>
                                                            One More Day
                                                        </button>
                                                    </div> */}
                                                </div>
                                            )}
                                        </FieldArray>
                                        <div className="flex bg-white justify-center mb-4">
                                            <div>
                                                <button type="submit" onClick={(event) => updateScheduleSetting(event)} className="bg-black hover:bg-white hover:text-black mt-3 mx-2 inline-block align-middle text-center select-none border-[1px] border-black font-normal whitespace-no-wrap rounded py-1 px-3 leading-normal no-underline custom-bg text-white shadow-none">
                                                    Cập nhật
                                                </button>
                                            </div>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </div>
                </div>
            )}

            {/* cập nhật lịch khởi hành  */}
            {isOpenModalUpdateDepart && (
                <div className="w-full bg-black bg-opacity-25 inset-0 backdrop-blur-sm fixed">
                    <div className="row w-[40%] mt-3 mx-auto border-[1px] bg-gray-100 border-gray-300 rounded-sm py-3 px-3 shadow-sm">
                        <form onSubmit={hendleDepartSubmit}>
                            <div className="flex items-center mb-3">
                                <div className="font-semibold">Ngày khởi hành:</div>
                                <input type="date"
                                    className="border-[1px] rounded-md mx-2 py-2 w-[300px] px-2"
                                    name="day"
                                    min={today}
                                    value={formDepartUpdate.day || ""}
                                    onChange={handleDepartUpdateChange}
                                />
                            </div>
                            <div className="flex items-center">
                                <div className="font-semibold">Số lượng đơn đặt tour:</div>
                                <input type="number"
                                    className="border-[1px] rounded-md mx-2 py-2 px-2"
                                    name="order"
                                    value={formDepartUpdate.order || ""}
                                    onChange={handleDepartUpdateChange}
                                />
                            </div>
                        </form>
                        <div className="flex gap-x-2 items-center justify-center mt-3">
                            <div className="">
                                <button type="button" onClick={handleModalUpdateDepart} className="bg-black w-[90px] border-[1px] border-black hover:bg-white hover:text-black text-white px-2 py-[2px] rounded-[3px] text-sm">
                                    Hủy
                                </button>
                            </div>
                            <div className="">
                                <button type="submit" onClick={(event) => updateDepartSetting(event)} className="bg-[#007aff] w-[90px] border-[1px] border-[#007aff] hover:bg-white hover:text-black text-white px-2 py-[2px] rounded-[3px] text-sm">
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
export default TourSetting;