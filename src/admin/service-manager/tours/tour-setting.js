import HeaderManager from "../header-manager/header-manager";
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchTourDetails } from "../../../component/api/tours";
import { fetchTourSchedule } from "../../../component/api/tours";
import { Formik, Field, Form, ErrorMessage, FieldArray } from 'formik';
import { toast } from 'react-toastify';

const initFormSchedule = [
    {
        // id_tour: "",
        day: "",
        image: null,
        schedule: "",
        locations: ""
    },
    ];

const initFormDepart = {
    day: "",
    order: ""
};

function TourSetting(){

    const { id } = useParams();  // Lấy ID từ URL
    const [tourDetails, setTourDetails] = useState(null);
    const [tourSchedule, setTourSchedule] = useState([]);
    const [error, setError] = useState(null);
    const [formSchedule, setFormSchedule] = useState(initFormSchedule);
    const [formDepart, setFormDepart] = useState(initFormDepart);

    useEffect(() => {
        // Hàm để gọi API và cập nhật state
        const tourDetail = async () => {
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
                // console.log('Dữ liệu từ API:', tourDetails);

            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Có lỗi xảy ra khi lấy dữ liệu sản phẩm.');
            }
        };

        tourDetail();
        
    }, [id]);

     // Hàm xử lý thay đổi cho ô tải lên hình ảnh
     const handleImageChange = (e) => {
        setFormSchedule({ ...formSchedule, image: e.target.files[0] });
    };

    const handleScheduleChange = (event) => {
        const { value, name } = event.target;
        setFormSchedule({
            ...formSchedule,
            [name]: value,
        });
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
        fetch('http://localhost:88/api_travel/api/admin/create-schedule.php', {
            method: 'POST',
            // headers: {
            //   'Content-Type': 'application/json',
            // },
            body: formDataSchedule,
          })
          .then(response => response.json())
          .then(data => {
            if (data.status === 'success') {
                toast.success('Lịch trình tour đã được thêm thành công');
                setFormSchedule(initFormSchedule); // Đặt lại form về rỗng nếu có lỗi
            } else if (data.status === 'error1'){
                toast.error('Không có file hình ảnh hoặc có lỗi xảy ra.');
                setFormSchedule(initFormSchedule); // Đặt lại form về rỗng nếu có lỗi
            } else if (data.status === 'error2'){
                toast.error('Thiếu hoặc không hợp lệ các tham số');
                setFormSchedule(initFormSchedule); // Đặt lại form về rỗng nếu có lỗi
            } else if (data.status === 'error3'){
                toast.error('id_tour không tồn tại');
                setFormSchedule(initFormSchedule); // Đặt lại form về rỗng nếu có lỗi
            }else if (data.status === 'error4'){
                toast.error('File không phải là hình ảnh hợp lệ');
                setFormSchedule(initFormSchedule); // Đặt lại form về rỗng nếu có lỗi
            }else if (data.status === 'error5'){
                toast.error('Kích thước file quá lớn');
                setFormSchedule(initFormSchedule); // Đặt lại form về rỗng nếu có lỗi
            }else if (data.status === 'error6'){
                toast.error('Thư mục tải lên không tồn tại');
                setFormSchedule(initFormSchedule); // Đặt lại form về rỗng nếu có lỗi
            } else{
                toast.error('Tải lên hình ảnh thất bại');
                setFormSchedule(initFormSchedule); // Đặt lại form về rỗng nếu có lỗi
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

     // thêm ngày tổ chức tour
    //  const hendleDepartSubmit = async (event) => {
    //     event.preventDefault(); //để không tự động reset
    //     console.log("formValue", id);
    //     fetch('http://localhost:88/api_travel/api/admin/create_departure_tour.php', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({
    //             id_tour: id,
    //             day_depar: formDepart.name,
    //             orders: formDepart.order
    //         }),
    //     })
    //         .then(response => response.json())
    //         .then(data => {
    //             if (data.status === 'success') {
    //                 toast.success(data.message);
    //                 // setRooms([...rooms, data.newRoom]);
    //                 setFormDepart(initFormDepart); // Đặt lại form về rỗng nếu có lỗi
    //             } else if (data.status === 'error') {
    //                 toast.error(data.message);
    //                 setFormDepart(initFormDepart); // Đặt lại form về rỗng nếu có lỗi
    //             } 
    //         })
    //         .catch(error => {
    //             // console.error('Có lỗi xảy ra:', error);
    //             toast.error('lỗi.');
    //             console.log('Có lỗi xảy ra:');
    //             setFormDepart(initFormDepart); // Đặt lại form về rỗng nếu có lỗi
    //         });
    // };
    const hendleDepartSubmit = async (event) => {
        event.preventDefault(); //để không tự động reset
        console.log("formValue", id);
        fetch('http://localhost:88/api_travel/api/admin/create_departure_tour.php', {
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
            } else if (data.status === 'error'){
                toast.error(data.message);
                setFormDepart(initFormDepart); // Đặt lại form về rỗng nếu có lỗi
            }
          })
          .catch(error => {

            toast.error('lỗi.');
            console.log('Có lỗi xảy ra:', error);
            setFormDepart(initFormDepart); // Đặt lại form về rỗng nếu có lỗi
          });
    };

    if (error) return <p>{error}</p>;

    return(
        <div className="">
            <HeaderManager />

            <div className="w-[80%] h-screen -mt-[660px] float-right flex">
                <div className="w-[60%]">
                    <div className="modal w-full px-3 h-[95%] mb-5 mt-6 mx-auto overflow-auto bg-white rounded-md" id="edit-room" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
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
                                                    <div className="col text-right mr-4 my-3">
                                                        <button type="button" className="secondary" onClick={() => remove(index)}>
                                                            <i className="fa-solid fa-square-xmark"></i>
                                                        </button>
                                                    </div>
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
                                                        <input type="file" name="image"  onChange={handleImageChange} 
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
                                            <div className="mt-5 mb-3 bg-[#0d6efd] text-white mx-2 inline-block align-middle text-center select-none font-normal whitespace-no-wrap rounded py-1 px-3 leading-normal no-underline border-[2px] border-[#0d6efd]  hover:text-[#0d6efd] hover:bg-white duration-100 shadow-none">
                                                <button type="button" className="secondary" onClick={() => push({ name: '', email: '' })}>
                                                    One More Day
                                                </button>
                                            </div>
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
                                            <button type="submit" onClick={(event) => hendleScheduleSubmit(event)} className="bg-black mx-2 inline-block align-middle text-center select-none border font-normal whitespace-no-wrap rounded py-1 px-3 leading-normal no-underline custom-bg text-white shadow-none">
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
                        <div className="font-semibold mb-3">
                            Lịch trình cụ thể
                        </div>
                        {tourSchedule.map((tourSchedule) => (
                        <div className="mb-2" key={tourSchedule.id}>
                            <div className="flex">
                                <div className="font-medium">Ngày {tourSchedule.date}</div>
                                <div className="mx-2">
                                    | {tourSchedule.locations}
                                </div>
                            </div> 
                            <div>
                                {tourSchedule.schedule}
                            </div>
                        </div>
                        ))}
                    </div>
                    
                </div>
            </div>
        </div>
    )
}
export default TourSetting;