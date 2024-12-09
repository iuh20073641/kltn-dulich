import HeaderManager from "../header-manager/header-manager";
import React, { useEffect, useState } from 'react';
import { fetchTourImages, fetchTours } from "../../../component/api/tours";
import { toast } from 'react-toastify';
// import { Formik, Form, Field } from 'formik';
// import { Formik, Field, Form, ErrorMessage, FieldArray } from 'formik';
import { Link } from "react-router-dom";
import { fetchTourDetails } from "../../../component/api/tours";
import PriceDisplay from "../../../component/service/money";
import config from "../../../component/config.json";

const { SERVER_API } = config;

const initFormValue = {
    name: "",
    type: "",
    style: "",
    min_participant: "",
    max_participant: "",
    price: "",
    price_toddlers: "",
    price_child: "",
    description: "",
    timetour: "",
    depart: "",
    departurelocation: "",
    discount: "",
    itinerary: "",
    vehicle: ""
};

const updateValue = {
    tour_id: "",
    name: "",
    type: "",
    style: "",
    min_participant: "",
    max_participant: "",
    price: "",
    price_toddlers: "",
    price_child: "",
    description: "",
    timetour: "",
    depart: "",
    departurelocation: "",
    discount: "",
    itinerary: "",
    vehicle: ""
};

// const initImage = [
//     {
//         image: null,
//     },
//     ];

const initFormSchedule = [
    {
        id_tour: "",
        day: "",
        image: null,
        schedule: "",
        locations: ""
    },
];

const selectFormValue = {
    tour_id: ""
    // name: "",
    // price: "",
    // description: "",
    // timetour: "",
    // depart: "",
    // departurelocation: "",
    // discount:"",
    // itinerary: "",
    // vehicle: ""
};

function ManagerTour() {

    const [isOpenModalAdd, setIsOpenModalAdd] = useState(false);
    const [isOpenModalUpdate, setIsOpenModalUdate] = useState(false);
    const [isOpenModalImage, setIsOpenModalImage] = useState(false);
    const [tours, setTours] = useState([]);
    const [tourId, setTourId] = useState(null);
    const [tourImages, setTourImages] = useState([]);
    const [error, setError] = useState(null);
    const [formValue, setFormValue] = useState(initFormValue);
    const [formSchedule, setFormSchedule] = useState(initFormSchedule);
    // const [image, setImage] = useState(initImage);
    const [selectedTour, setSelectedTour] = useState(selectFormValue);
    const [selectedImage, setSelectedImage] = useState(null); // Lưu hình ảnh được chọn
    const [formSettingUpdateValue, setFormSettingUpdateValue] = useState(updateValue);
    // const [tourDetails, setTourDetails] = useState([]);

    const handleUpdateChange = (event) => {
        const { value, name } = event.target;
        setFormSettingUpdateValue({
            ...formSettingUpdateValue,
            [name]: value,
        });
    };


    // Hàm xử lý thay đổi cho ô tải lên hình ảnh
    const handleImageChange = (e) => {
        setFormSchedule({ ...formSchedule, image: e.target.files[0] });
    };

    // // Hàm xử lý thay đổi cho ô tải lên hình ảnh
    // const handleImageChange = (e) => {
    //     setFormSchedule({ ...formSchedule, image: e.target.files[0] });
    // };

    // Bật của sổ thêm tour
    const handleModalClick = () => {
        setIsOpenModalAdd(!isOpenModalAdd);
    };


    // Bật của sổ update tour
    const handleModalUpdateClick = () => {
        setIsOpenModalUdate(!isOpenModalUpdate);
    };

    const handleChange = (event) => {
        const { value, name } = event.target;
        setFormValue({
            ...formValue,
            [name]: value,
        });
    };

    const clickModalUpdateTour = async (tourId) => {
        setIsOpenModalUdate(!isOpenModalUpdate);

        try {
            // Gọi API để lấy danh sách Facilities
            const dataTourResponse = await fetchTourDetails(tourId);
            const tourData = dataTourResponse.data; // Giả sử API trả về mảng các Facilities
            // setTourDetails(tourData[0]);

            if (tourData.length > 0) {
                setFormSettingUpdateValue({
                    tour_id: tourData[0].id,
                    name: tourData[0].name,
                    type: tourData[0].type,
                    style: tourData[0].style,
                    min_participant: tourData[0].min_participant,
                    max_participant: tourData[0].max_participant,
                    price: tourData[0].price,
                    price_toddlers: tourData[0].toddlers_price_percen,
                    price_child: tourData[0].child_price_percen,
                    description: tourData[0].description,
                    timetour: tourData[0].timeTour,
                    depart: tourData[0].depart,
                    departurelocation: tourData[0].departurelocation,
                    discount: tourData[0].discount,
                    itinerary: tourData[0].itinerary,
                    vehicle: tourData[0].vehicle
                });
            }

        } catch (err) {
            console.error('Error fetching data:', err);
            // setError(err);
        }

    };

    const updateTourSetting = (event) => {
        event.preventDefault(); //để không tự động reset
        if (formSettingUpdateValue.min_participant >= formSettingUpdateValue.max_participant) {
            toast.warning('Số lượng người tham gia tối thiểu phải nhỏ hơn số lượng tối đa');
            return;
        }

        console.log(formSettingUpdateValue);
        fetch(`${SERVER_API}/admin/update_tour.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id_tour: formSettingUpdateValue.tour_id,
                name: formSettingUpdateValue.name,
                type: formSettingUpdateValue.type,
                style: formSettingUpdateValue.style,
                price_toddlers: formSettingUpdateValue.price_toddlers,
                price_child: formSettingUpdateValue.price_child,
                min_participant: formSettingUpdateValue.min_participant,
                max_participant: formSettingUpdateValue.max_participant,
                price: formSettingUpdateValue.price,
                description: formSettingUpdateValue.description,
                timetour: formSettingUpdateValue.timetour,
                depart: formSettingUpdateValue.depart,
                departurelocation: formSettingUpdateValue.departurelocation,
                discount: formSettingUpdateValue.discount,
                itinerary: formSettingUpdateValue.itinerary,
                vehicle: formSettingUpdateValue.vehicle
            }),
        })
            .then(response => response.json())
            .then(data => {
                // console.log('Đang gửi dữ liệu:', { room_id: roomId, image_id: imageId });
                if (data.status === 'success') {
                    toast.success(data.message);   
                    setFormSettingUpdateValue(updateValue);
                    fetchData();
                } else if (data.status === 'error') {
                    toast.error(data.message);
                }
            })
            .catch(error => {
                toast.error('lỗi.');
                console.log(error);
            });

    };

    // thêm tour
    const hendleSubmit = async (event) => {
        event.preventDefault(); //để không tự động reset
        if (formValue.min_participant >= formValue.max_participant) {
            toast.warning('Số lượng người tham gia tối thiểu phải nhỏ hơn số lượng tối đa');
            return;
        }
        console.log("formValue", formValue);
        fetch(`${SERVER_API}/admin/create-tour.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: formValue.name,
                type: formValue.type,
                style: formValue.style,
                price_toddlers: formValue.price_toddlers,
                price_child: formValue.price_child,
                min_participant: formValue.min_participant,
                max_participant: formValue.max_participant,
                price: formValue.price,
                description: formValue.description,
                timetour: formValue.timetour,
                depart: formValue.depart,
                departurelocation: formValue.departurelocation,
                discount: formValue.discount,
                itinerary: formValue.itinerary,
                vehicle: formValue.vehicle
            }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    toast.success(data.message);
                    setFormValue(initFormValue);
                    fetchData();
                } else if (data.status === 'error') {
                    toast.error(data.message);
                    // setFormValue(initFormValue); // Đặt lại form về rỗng nếu có lỗi
                }
            })
            .catch(error => {

                toast.error('lỗi.');
                console.log('Có lỗi xảy ra:', error);
                // setFormValue(initFormValue); // Đặt lại form về rỗng nếu có lỗi
            });
    };

    const handleScheduleChange = (event) => {
        const { value, name } = event.target;
        setFormSchedule({
            ...formSchedule,
            [name]: value,
        });
    };

    // Hàm để thêm một tour mới vào mảng
    // const addTour = (newTour) => {
    //     setScheduleList([...scheduleList, newTour]);
    // };

    // const handleAddTour = () => {
    //     const newTour = {
    //       id_tour: formSchedule.id_tour,
    //       day: formSchedule.day,
    //       image: formSchedule.image,
    //       schedule: formSchedule.schedule,
    //       locations: formSchedule.locations,
    //     };

    //     setScheduleList([...scheduleList, newTour]);
    // };

    // thêm hình ảnh tour
    const hendleImageSubmit = async (event) => {
        event.preventDefault(); //để không tự động reset
        // Tạo FormData
        const formImage = new FormData();

        // Append từng trường vào formData
        // initFormSchedule.forEach((tour, index) => {
        formImage.append("id_tour", selectedTour);
        formImage.append("image", formSchedule.image); // File sẽ được gửi dưới dạng multipart
        // });
        console.log("formDataSchedule", formSchedule.image);
        fetch(`${SERVER_API}/admin/create_tour_image.php`, {
            method: 'POST',
            // headers: {
            //   'Content-Type': 'application/json',
            // },
            body: formImage,
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    toast.success(data.message);
                    setFormSchedule(initFormSchedule); // Đặt lại form về rỗng nếu có lỗi
                    getDataImage(tourId);

                } else if (data.status === 'error') {
                    toast.error(data.message);
                    setFormSchedule(initFormSchedule); // Đặt lại form về rỗng nếu có lỗi
                }
            })
            .catch(error => {

                toast.error('lỗi.');
                console.log('Có lỗi xảy ra:', error);
                setFormSchedule(initFormSchedule); // Đặt lại form về rỗng nếu có lỗi
            });
    };

    // Hàm để gọi API và cập nhật state
    const fetchData = async () => {
        try {
            // Gọi API để lấy danh sách phòng
            const toursResponse = await fetchTours();
            const toursData = toursResponse.data; // Giả sử API trả về mảng các tour
            setTours(toursData);

        } catch (err) {
            console.error('Error fetching data:', err);
            setError(err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []); // Chạy một lần khi component được mount

    // hiện modal thêm image
    const handleModalImage = (tour) => {
        console.log('Tour ID:', tour.id);
        // setLoading(true);
        setSelectedTour(tour.id); // Lưu thông tin tour được chọn
        // console.log(tour);
        setIsOpenModalImage(!isOpenModalImage);
        getDataImage(tour.id);
    };

    // Ẩn modal image
    const handleSutdownModalImage = () => {
        setIsOpenModalImage(!isOpenModalImage);
    };

    // Xử lý khi người dùng chọn checkbox
    const handleCheckboxChange = (imageId) => {
        setSelectedImage(imageId); // Cập nhật hình ảnh được chọn
    };


    const getDataImage = async (tourId) => {

        try {
            // Gọi API để lấy danh sách Facilities
            const ImageResponse = await fetchTourImages(tourId);
            const imagesData = ImageResponse.data; // Giả sử API trả về mảng các Facilities
            setTourImages(imagesData);

            // Kiểm tra nếu có hình ảnh nào có `thumb === 1`, chọn hình đó
            const thumbImage = Array.isArray(imagesData) ? imagesData.find(image => image.thumb > 0) : null;
            if (thumbImage) {
                setSelectedImage(thumbImage.id); // Lưu ID của hình ảnh có `thumb === 1`
            }
            setTourId(tourId);
        } catch (err) {
            console.error('Error fetching data:', err);
            // setError(err);
        }
    };



    // update room thumb
    const updateTourThumb = (tourId, imageId) => {
        // console.log(roomId, imageId);
        // if (window.confirm('Bạn có chắc chắn muốn xóa phòng này?')) {
        fetch(`${SERVER_API}/admin/update_tour_thumb.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                tour_id: tourId,
                image_id: imageId
            }),
        })
            .then(response => response.json())
            .then(data => {
                // console.log('Đang gửi dữ liệu:', { room_id: roomId, image_id: imageId });
                if (data.status === 'success') {
                    // setTourImages(tourImages.filter(tourImage => tourImage.id !== imageId));
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

    };

    const deleteRoomImage = (imageId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa hình ảnh này?')) {
            fetch(`${SERVER_API}/admin/delete_tour_image.php`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ tour_image_id: imageId }),
            })
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        setTourImages(tourImages.filter(tourImage => tourImage.id !== imageId));
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

    const deleteTour = (tourId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa phòng này?')) {
            fetch(`${SERVER_API}/admin/delete_tour.php`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ tour_id: tourId }),
            })
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        setTours(tours.filter(tour => tour.id !== tourId));
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


    if (error) return <div>Error: {error.message}</div>;

    return (
        <div>
            <HeaderManager />

            <div className="container mx-auto sm:px-4 -mt-[650px] max-w-full z-20" id="main-content">
                <div className="">
                    <div className="lg:w-4/5 pr-4 pl-4 ms-auto p-6 overflow-hidden">
                        <h3 className="mb-4 text-left text-2xl font-medium">Tours</h3>
                        <div className="bg-white card border-0 shadow mb-4 rounded-lg">
                            <div className="card-body p-6">
                                <div className="text-end mb-4">
                                    <button id="openModalBtn" type="button" onClick={handleModalClick} className="inline-block align-middle text-center select-none border font-normal whitespace-no-wrap rounded  no-underline bg-gray-900 text-white hover:bg-gray-900 shadow-none py-1 px-2 leading-tight text-xs ">
                                        <i className="fa-regular fa-square-plus"></i> Thêm
                                    </button>
                                </div>
                                <div className="block w-full overflow-auto scrolling-touch" style={{ height: 450, overflowY: "scroll" }}>
                                    <table className="w-[1700px] mb-4 bg-transparent table-hover border text-center">
                                        <thead>
                                            <tr className="bg-gray-900 text-gray-100 h-9">
                                                <th scope="col" className="">ID</th>
                                                <th scope="col" className="w-[300px]">Tên</th>
                                                <th scope="col" className="w-[150px]">Loại tour</th>
                                                <th scope="col" className="w-[150px]">Giá</th>
                                                <th scope="col" className="w-[150px]">Số lượng khách tối thiểu</th>
                                                <th scope="col" className="w-[150px]">Số lượng khách tối đa</th>
                                                <th scope="col" className="w-[150px]">Xuất phát</th>
                                                <th scope="col" className="w-[100px]">Thời gian</th>
                                                <th scope="col" className="w-[200px]">Khởi hành</th>
                                                <th scope="col" className="w-[100px]">Status</th>
                                                <th scope="col" className="w-[170px]">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody id="room-data" className="">
                                            {tours.map((tour) => (
                                                <tr className="h-16" key={tour.id}>
                                                    <td>{tour.id}</td>
                                                    <td>{tour.name}</td>
                                                    <td>{tour.type}</td>
                                                    <td><PriceDisplay price={tour.price} /></td>
                                                    <td>{tour.min_participant}</td>
                                                    <td>{tour.max_participant}</td>
                                                    <td>{tour.departurelocation}</td>
                                                    <td>{tour.timeTour}</td>
                                                    <td>{tour.depart}</td>
                                                    <td>
                                                        <div className='bg-black text-white rounded-md'>
                                                            <button type='submit' className='py-1 font-semibold text-sm'><p>Active</p></button>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        {/* <form> */}
                                                        <div className="flex justify-center gap-2">
                                                            <div className="bg-[#0d6efd] px-2 rounded-md">
                                                                <button type="button" onClick={() => clickModalUpdateTour(tour.id)} className='py-1 font-semibold text-sm'><i className="fa-solid fa-pen-to-square text-white"></i></button>
                                                            </div>
                                                            <div className="bg-[#0dcaf0] px-2 rounded-md">
                                                                <button type='button' onClick={() => handleModalImage(tour)} className='py-1 font-semibold text-sm'><i className="fa-solid fa-image"></i></button>
                                                            </div>
                                                            <div className="bg-[#dc3545] px-2 rounded-md">
                                                                <button type="button" onClick={() => deleteTour(tour.id)} className='py-1 font-semibold text-sm'><i className="fa-solid fa-trash text-white"></i></button>
                                                            </div>
                                                            {/* <div className="bg-[#FF6600] px-2 rounded-md">
                                                                    <button onClick={() => addTourSchedule(tour)} className='py-1 font-semibold text-sm'><i className="fa-solid fa-gears text-white"></i></button>
                                                                </div> */}
                                                            <div className="bg-[#FF6600] px-2 rounded-md">
                                                                <Link to={`/tours-setting/${tour.id}`}>
                                                                    <i className="fa-solid fa-gears text-white py-1 font-semibold text-sm"></i>
                                                                </Link>
                                                            </div>
                                                        </div>
                                                        {/* </form> */}
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

            {/* Add tour modal  */}
            {isOpenModalAdd && (
                <div className="w-full bg-black bg-opacity-25 inset-0 backdrop-blur-sm fixed">
                    <div className="lg:w-3/5 mt-4 pr-4 pl-4 mx-auto bg-white rounded-md overflow-y-auto">
                        <div className="modal h-[90%] overflow-y-auto" id="add-room" tabIndex={-1}>
                            <div className="modal-dialog modal-lg">
                                <form id="add_room_form" onSubmit={hendleSubmit}>
                                    <div className="modal-content">
                                        <div className="modal-header mb-5">
                                            <h5 className="modal-title text-left font-medium text-xl">Tạo tour</h5>
                                        </div>
                                        <div className="h-[1px] w-full bg-gray-300"></div>
                                        <div className="modal-body my-3">
                                            <div className="flex flex-wrap ">
                                                <div className="w-full pr-4 pl-4 mb-3 text-left">
                                                    <label className="form-label font-semibold">Tên tour</label>
                                                    <input type="text" name="name" value={formValue.name} onChange={handleChange} className="block appearance-none w-full py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded shadow-none" required="" />
                                                </div>
                                                <div className="w-full pr-4 pl-4 mb-3 text-left">
                                                    <div className="form-label font-semibold">Kiểu tour</div>
                                                    {/* <input type="text" name="type" value={formValue.type} onChange={handleChange} className="block appearance-none w-full py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded shadow-none" required="" /> */}
                                                    <select className="w-full rounded-md outline-none border-[1px] border-gray-200 px-2 py-1"
                                                        name='type'
                                                        value={formValue.type}
                                                        onChange={handleChange}
                                                    >
                                                        <option value="">Chọn kiểu tour</option> {/* Tùy chọn mặc định */}
                                                        <option value="Theo đoàn">Theo đoàn</option>
                                                        <option value="Theo nhóm nhỏ">Theo nhóm nhỏ</option>
                                                        <option value="Gia đình">Gia đình</option>

                                                    </select>
                                                </div>
                                                <div className="w-full pr-4 pl-4 mb-3 text-left">
                                                    <div className="form-label font-semibold">Loại tour</div>
                                                    {/* <input type="text" name="type" value={formValue.type} onChange={handleChange} className="block appearance-none w-full py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded shadow-none" required="" /> */}
                                                    <select className="w-full rounded-md outline-none border-[1px] border-gray-200 px-2 py-1"
                                                        name='style'
                                                        value={formValue.style}
                                                        onChange={handleChange}
                                                    >
                                                        <option value="">Chọn loại tour</option> {/* Tùy chọn mặc định */}
                                                        <option value="Cao cấp">Cao cấp</option>
                                                        <option value="Tiêu chuẩn">Tiêu chuẩn</option>
                                                        <option value="Tiết kiệm">Tiết kiệm</option>

                                                    </select>
                                                </div>

                                                <div className="w-full pr-4 pl-4 mb-3 text-left">
                                                    <label className="form-label font-semibold">SL người tham gia tối thiểu</label>
                                                    <input type="number" name="min_participant" value={formValue.min_participant} onChange={handleChange} className="block appearance-none w-full py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded shadow-none" required="" />
                                                </div>
                                                <div className="w-full pr-4 pl-4 mb-3 text-left">
                                                    <label className="form-label font-semibold">SL người tham gia tối đa</label>
                                                    <input type="number" name="max_participant" value={formValue.max_participant} onChange={handleChange} className="block appearance-none w-full py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded shadow-none" required="" />
                                                </div>
                                                <div className="w-full pr-4 pl-4 mb-3 text-left">
                                                    <label className="form-label font-semibold">Địa điểm khởi hành</label>
                                                    <input type="text" name="departurelocation" value={formValue.departurelocation} onChange={handleChange} className="block appearance-none w-full py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded shadow-none" required="" />
                                                </div>
                                                <div className="md:w-1/2 pr-4 pl-4 mb-3 text-left">
                                                    <label className="form-label font-semibold">Giá tiền</label>
                                                    <input type="number" min={1} name="price" value={formValue.price} onChange={handleChange} className="block appearance-none w-full py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded shadow-none" required="" />
                                                </div>
                                                <div className="md:w-1/2 pr-4 pl-4 mb-3 text-left">
                                                    <label className="form-label font-semibold">Khuyến mãi &#40;%&#41;</label>
                                                    <input type="number" min={1} name="discount" value={formValue.discount} onChange={handleChange} className="block appearance-none w-full py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded shadow-none" required="" />
                                                </div>
                                                <div className="md:w-1/2 pr-4 pl-4 mb-3 text-left">
                                                    <label className="form-label font-semibold">Giá trẻ em &#40;% giá gốc&#41;</label>
                                                    <input type="number" min={1} name="price_child" value={formValue.price_child} onChange={handleChange} className="block appearance-none w-full py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded shadow-none" required="" />
                                                </div>
                                                <div className="md:w-1/2 pr-4 pl-4 mb-3 text-left">
                                                    <label className="form-label font-semibold">Giá trẻ nhỏ &#40;% giá gốc&#41;</label>
                                                    <input type="number" min={1} name="price_toddlers" value={formValue.price_toddlers} onChange={handleChange} className="block appearance-none w-full py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded shadow-none" required="" />
                                                </div>
                                                <div className="md:w-1/2 pr-4 pl-4 mb-3 text-left">
                                                    <label className="form-label font-semibold">Thời gian diễn ra tour &#40;ngày&#41;</label>
                                                    <input type="number" min={1} name="timetour" value={formValue.timetour} onChange={handleChange} className="block appearance-none w-full py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded shadow-none" required="" />
                                                </div>
                                                <div className="md:w-1/2 pr-4 pl-4 mb-3 text-left">
                                                    <label className="form-label font-semibold">Những ngày tour bắt đầu</label>
                                                    <input type="text" min={1} name="depart" value={formValue.depart} onChange={handleChange} placeholder="07,14,17,21,28/09/2024" className="block appearance-none w-full py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded shadow-none" required="" />
                                                </div>
                                                <div className="md:w-1/2 pr-4 pl-4 mb-3 text-left">
                                                    <label className="form-label font-semibold">Phương tiện</label>
                                                    <input type="text" min={1} name="vehicle" value={formValue.vehicle} onChange={handleChange} className="block appearance-none w-full py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded shadow-none" required="" />
                                                </div>
                                                <div className="md:w-1/2 pr-4 pl-4 mb-3 text-left">
                                                    <label className="form-label font-semibold">Hành trình</label>
                                                    <input type="text" min={1} name="itinerary" value={formValue.itinerary} onChange={handleChange} placeholder="Hà Nội - Vịnh Hạ Long " className="block appearance-none w-full py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded shadow-none" required="" />
                                                </div>
                                                <div className="w-full pr-4 pl-4 mb-3 text-left">
                                                    <label className="form-label font-semibold">Mô tả</label>
                                                    <textarea name="description" value={formValue.description} onChange={handleChange} className="w-full h-[100px] block appearance-none py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded shadow-none">

                                                    </textarea>
                                                </div>

                                                {/* <div className="w-full mb-3 text-left">
                                                <label className="form-label font-semibold">Description</label>
                                                <textarea
                                                    name="description"
                                                    rows={4}
                                                    value={formValue.description} onChange={handleChange}
                                                    className="block appearance-none w-full py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded shadow-none"
                                                    required=""
                                                />
                                            </div> */}
                                            </div>
                                        </div>
                                        <div className="modal-footer">
                                            <button type="reset" onClick={handleModalClick} className="mx-2 inline-block align-middle text-center select-none border font-normal whitespace-no-wrap rounded py-1 px-3 leading-normal no-underline text-gray-600 shadow-none" >
                                                Hủy
                                            </button>
                                            <button type="submit" onClick={(event) => hendleSubmit(event)} className="bg-black mx-2 inline-block align-middle text-center select-none border font-normal whitespace-no-wrap rounded py-1 px-3 leading-normal no-underline custom-bg text-white shadow-none">
                                                Thêm
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Update tour modal */}
            {isOpenModalUpdate && (
                <div className="w-full bg-black bg-opacity-25 inset-0 backdrop-blur-sm fixed">
                    <div className="lg:w-3/5 mt-4 pr-4 pl-4 mx-auto bg-white rounded-md overflow-y-auto">
                        <div className="modal h-[90%] overflow-y-auto" id="add-room" tabIndex={-1}>
                            <div className="modal-dialog modal-lg">
                                <form id="add_room_form">
                                    <div className="modal-content">
                                        <div className="modal-header mb-5">
                                            <h5 className="modal-title text-left font-medium text-xl">Cập nhật tour</h5>
                                        </div>
                                        <div className="h-[1px] w-full bg-gray-300"></div>
                                        <div className="modal-body my-3">
                                            <div className="flex flex-wrap ">
                                                <div className="w-full pr-4 pl-4 mb-3 text-left">
                                                    <label className="form-label font-semibold">Tên tour</label>
                                                    <input type="text" name="name" value={formSettingUpdateValue.name} onChange={handleUpdateChange} className="block appearance-none w-full py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded shadow-none" required="" />
                                                </div>
                                                <div className="w-full pr-4 pl-4 mb-3 text-left">
                                                    <div className="form-label font-semibold">Kiểu tour</div>
                                                    {/* <input type="text" name="type" value={formValue.type} onChange={handleChange} className="block appearance-none w-full py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded shadow-none" required="" /> */}
                                                    <select className="w-full rounded-md outline-none border-[1px] border-gray-200 px-2 py-1"
                                                        name='type'
                                                        value={formSettingUpdateValue.type}
                                                        onChange={handleUpdateChange}
                                                    >
                                                        <option value="">Chọn kiểu tour</option> {/* Tùy chọn mặc định */}
                                                        <option value="Theo đoàn">Theo đoàn</option>
                                                        <option value="Theo nhóm nhỏ">Theo nhóm nhỏ</option>
                                                        <option value="Gia đình">Gia đình</option>

                                                    </select>
                                                </div>
                                                <div className="w-full pr-4 pl-4 mb-3 text-left">
                                                    <div className="form-label font-semibold">Loại tour</div>
                                                    {/* <input type="text" name="type" value={formValue.type} onChange={handleChange} className="block appearance-none w-full py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded shadow-none" required="" /> */}
                                                    <select className="w-full rounded-md outline-none border-[1px] border-gray-200 px-2 py-1"
                                                        name='style'
                                                        value={formSettingUpdateValue.style}
                                                        onChange={handleUpdateChange}
                                                    >
                                                        <option value="">Chọn loại tour</option> {/* Tùy chọn mặc định */}
                                                        <option value="Cao cấp">Cao cấp</option>
                                                        <option value="Tiêu chuẩn">Tiêu chuẩn</option>
                                                        <option value="Tiết kiệm">Tiết kiệm</option>

                                                    </select>
                                                </div>

                                                <div className="w-full pr-4 pl-4 mb-3 text-left">
                                                    <label className="form-label font-semibold">SL người tham gia tối thiểu</label>
                                                    <input type="number" name="min_participant" value={formSettingUpdateValue.min_participant} onChange={handleUpdateChange} className="block appearance-none w-full py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded shadow-none" required="" />
                                                </div>
                                                <div className="w-full pr-4 pl-4 mb-3 text-left">
                                                    <label className="form-label font-semibold">SL người tham gia tối đa</label>
                                                    <input type="number" name="max_participant" value={formSettingUpdateValue.max_participant} onChange={handleUpdateChange} className="block appearance-none w-full py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded shadow-none" required="" />
                                                </div>
                                                <div className="w-full pr-4 pl-4 mb-3 text-left">
                                                    <label className="form-label font-semibold">Địa điểm khởi hành</label>
                                                    <input type="text" name="departurelocation" value={formSettingUpdateValue.departurelocation} onChange={handleUpdateChange} className="block appearance-none w-full py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded shadow-none" required="" />
                                                </div>
                                                <div className="md:w-1/2 pr-4 pl-4 mb-3 text-left">
                                                    <label className="form-label font-semibold">Giá tiền</label>
                                                    <input type="number" min={1} name="price" value={formSettingUpdateValue.price} onChange={handleUpdateChange} className="block appearance-none w-full py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded shadow-none" required="" />
                                                </div>
                                                <div className="md:w-1/2 pr-4 pl-4 mb-3 text-left">
                                                    <label className="form-label font-semibold">Khuyến mãi &#40;%&#41;</label>
                                                    <input type="number" min={1} name="discount" value={formSettingUpdateValue.discount} onChange={handleUpdateChange} className="block appearance-none w-full py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded shadow-none" />
                                                </div>
                                                <div className="md:w-1/2 pr-4 pl-4 mb-3 text-left">
                                                    <label className="form-label font-semibold">Giá trẻ em &#40;% giá gốc&#41;</label>
                                                    <input type="number" min={1} name="price_child" value={formSettingUpdateValue.price_child} onChange={handleUpdateChange} className="block appearance-none w-full py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded shadow-none" required="" />
                                                </div>
                                                <div className="md:w-1/2 pr-4 pl-4 mb-3 text-left">
                                                    <label className="form-label font-semibold">Giá trẻ nhỏ &#40;% giá gốc&#41;</label>
                                                    <input type="number" min={1} name="price_toddlers" value={formSettingUpdateValue.price_toddlers} onChange={handleUpdateChange} className="block appearance-none w-full py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded shadow-none" required="" />
                                                </div>
                                                <div className="md:w-1/2 pr-4 pl-4 mb-3 text-left">
                                                    <label className="form-label font-semibold">Thời gian diễn ra tour &#40;ngày&#41;</label>
                                                    <input type="number" min={1} name="timetour" value={formSettingUpdateValue.timetour} onChange={handleUpdateChange} className="block appearance-none w-full py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded shadow-none" required="" />
                                                </div>
                                                <div className="md:w-1/2 pr-4 pl-4 mb-3 text-left">
                                                    <label className="form-label font-semibold">Những ngày tour bắt đầu</label>
                                                    <input type="text" min={1} name="depart" value={formSettingUpdateValue.depart} onChange={handleUpdateChange} placeholder="07,14,17,21,28/09/2024" className="block appearance-none w-full py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded shadow-none" required="" />
                                                </div>
                                                <div className="md:w-1/2 pr-4 pl-4 mb-3 text-left">
                                                    <label className="form-label font-semibold">Phương tiện</label>
                                                    <input type="text" min={1} name="vehicle" value={formSettingUpdateValue.vehicle} onChange={handleUpdateChange} className="block appearance-none w-full py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded shadow-none" required="" />
                                                </div>
                                                <div className="md:w-1/2 pr-4 pl-4 mb-3 text-left">
                                                    <label className="form-label font-semibold">Hành trình</label>
                                                    <input type="text" min={1} name="itinerary" value={formSettingUpdateValue.itinerary} onChange={handleUpdateChange} placeholder="Hà Nội - Vịnh Hạ Long " className="block appearance-none w-full py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded shadow-none" required="" />
                                                </div>
                                                <div className="w-full pr-4 pl-4 mb-3 text-left">
                                                    <label className="form-label font-semibold">Mô tả</label>
                                                    <textarea name="description" value={formSettingUpdateValue.description} onChange={handleUpdateChange} className="w-full h-[100px] block appearance-none py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded shadow-none">

                                                    </textarea>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="modal-footer">
                                            <button type="reset" onClick={handleModalUpdateClick} className="mx-2 inline-block align-middle text-center select-none border font-normal whitespace-no-wrap rounded py-1 px-3 leading-normal no-underline text-gray-600 shadow-none" >
                                                Hủy
                                            </button>
                                            <button type="submit" onClick={(event) => updateTourSetting(event)} className="bg-black mx-2 inline-block align-middle text-center select-none border font-normal whitespace-no-wrap rounded py-1 px-3 leading-normal no-underline custom-bg text-white shadow-none">
                                                Cập nhật
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* cài đặt hình ảnh của phòng */}
            {isOpenModalImage && (
                <div className="w-full bg-black bg-opacity-25 inset-0 backdrop-blur-sm fixed overflow-y-auto flex items-center">
                    <div className="bg-white modal w-[70%] mx-auto h-[95%] rounded-sm" id="room-images" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog modal-lg w-full">
                            <div className="modal-content w-full px-2">
                                <div className="modal-header flex w-full justify-between mt-3 mb-5">
                                    {Array.isArray(tourImages) && tourImages.length > 0 ? (
                                        <h5 className="modal-title font-medium text-xl">{tourImages[0].tour_name}</h5>
                                    ) : (
                                        <h5 className="modal-title font-medium text-xl">không có tên</h5>
                                    )}
                                    <div className="mr-3">
                                        <button type="submit" onClick={handleSutdownModalImage} className="">
                                            <span className=""><i className="fa-solid fa-xmark"></i></span>
                                        </button>
                                    </div>
                                </div>
                                <div className="h-[1px] bg-gray-200"></div>
                                <div className="modal-body">
                                    <div id="image-alert"></div>
                                    <div className="border-b border-3 pb-3 mb-3 text-left mt-5">
                                        <form id="add_image_form" onSubmit={hendleImageSubmit}>
                                            <div className="form-label fw-bold font-semibold mb-2">Add Image</div>
                                            <input
                                                type="file"
                                                name="image"
                                                onChange={handleImageChange}
                                                accept=".jpg, .png, .webp, .jpeg"
                                                className="block appearance-none w-full py-1 px-2 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded shadow-none mb-3"
                                                required=""
                                            />
                                            <button onClick={(event) => hendleImageSubmit(event)} className="inline-block bg-[#0d6efd] hover:bg-[#0d49fd] align-middle text-center select-none border font-normal whitespace-no-wrap rounded py-1 px-3 leading-normal no-underline custom-bg text-white shadow-none">
                                                ADD
                                            </button>
                                            <input type="hidden" value={formSchedule.id_tour} onChange={handleScheduleChange} name="id_tour" />
                                        </form>
                                    </div>
                                    <div
                                        className="block w-full overflow-auto scrolling-touch"
                                        style={{ height: 350, overflowY: "scroll" }}
                                    >
                                        {Array.isArray(tourImages) && tourImages.length > 0 ? (
                                            <table className="w-full max-w-full mb-4 bg-transparent table-hover border text-center">
                                                <thead>
                                                    <tr className="bg-gray-900 text-gray-100 sticky-top h-[40px]">
                                                        <th scope="col" width="60%">
                                                            Image
                                                        </th>
                                                        <th scope="col">Thumb</th>
                                                        <th scope="col">Delete</th>
                                                    </tr>
                                                </thead>
                                                {tourImages.map((image) => (
                                                    <tbody id="room-image-data" key={image.id}>
                                                        <tr className="">
                                                            <td><img src={`http://localhost:88/api_travel/api/Images/tour/${image.image}`} className='w-full h-[300px] object-cover' alt="" /></td>
                                                            <td><input type="checkbox"
                                                                className="cursor-pointer"
                                                                name="thumb"
                                                                checked={selectedImage === image.id} // Nếu ID hình ảnh bằng `selectedImage` thì checkbox được chọn
                                                                onChange={() => handleCheckboxChange(image.id)} // Cập nhật trạng thái khi chọn hình ảnh 
                                                                onClick={() => updateTourThumb(image.tour_id, image.id)}
                                                            />
                                                            </td>
                                                            <td>
                                                                <button onClick={() => deleteRoomImage(image.id)}><i className="fa-solid fa-trash text-[#dc3545] cursor-pointer"></i></button>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                ))}
                                            </table>
                                        ) : (
                                            <div className="w-full h-[200px] flex items-center justify-center text-sm mb-3">Chưa có hình ảnh.</div>
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
export default ManagerTour;