import HeaderManager from "../header-manager/header-manager";
import React, { useEffect, useState } from 'react';
import { fetchTours } from "../../../component/api/tours";
import { toast } from 'react-toastify';

const initFormValue = {
    name: "",
    price: "",
    description: "",
    timetour: "",
    depart: "",
    departurelocation: "",
    discount:"",
    itinerary: "",
    vehicle: ""
};

function ManagerTour(){

    const [isOpenModalAdd, setIsOpenModalAdd] = useState(false);
    const [tours, setTours] = useState([]);
    const [error, setError] = useState(null);
    const [formValue, setFormValue] = useState(initFormValue);

    // Bật của sổ thêm tour
    const handleModalClick = () => {
        setIsOpenModalAdd(!isOpenModalAdd);
    };

    const handleChange = (event) => {
        const { value, name } = event.target;
        setFormValue({
            ...formValue,
            [name]: value,
        });
    };

     // thêm tour
     const hendleSubmit = async (event) => {
        event.preventDefault(); //để không tự động reset
        console.log("formValue", formValue);
        fetch('http://localhost:88/api_travel/api/admin/create_tour.php', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                name: formValue.name, 
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
                toast.success('Tour đã được thêm thành công');
                setFormValue(initFormValue); // Đặt lại form về rỗng nếu có lỗi
            } else if (data.status === 'error1'){
                toast.error('Dữ liệu JSON không hợp lệ');
                setFormValue(initFormValue); // Đặt lại form về rỗng nếu có lỗi
            } else if (data.status === 'error2'){
                toast.error('Thiếu hoặc không hợp lệ các tham số');
                setFormValue(initFormValue); // Đặt lại form về rỗng nếu có lỗi
            } else if (data.status === 'error3'){
                toast.error('Tour đã tồn tại');
                setFormValue(initFormValue); // Đặt lại form về rỗng nếu có lỗi
            } else{
                toast.error('Thêm tour không thành công. Vui lòng thử lại.');
                setFormValue(initFormValue); // Đặt lại form về rỗng nếu có lỗi
            }
          })
          .catch(error => {
            // console.error('Có lỗi xảy ra:', error);
            toast.error('lỗi.');
            console.log('Có lỗi xảy ra:', error);
            setFormValue(initFormValue); // Đặt lại form về rỗng nếu có lỗi
          });
    };

    useEffect(() => {
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

        fetchData();
    }, []); // Chạy một lần khi component được mount

    if (error) return <div>Error: {error.message}</div>;

    return(
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
                                        <i className="fa-regular fa-square-plus"></i> Add
                                    </button> 
                                </div>
                                <div className="block w-full overflow-auto scrolling-touch" style={{ height: 450, overflowY: "scroll" }}>
                                    <table className="w-[1250px] mb-4 bg-transparent table-hover border text-center">
                                        <thead>
                                            <tr className="bg-gray-900 text-gray-100 h-9">
                                                <th scope="col" className="">ID</th>
                                                <th scope="col" className="w-[300px]">Tên</th>
                                                <th scope="col" className="w-[150px]">Giá</th>
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
                                                <td>{tour.price}</td>
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
                                                                    <button type="button"  className='py-1 font-semibold text-sm'><i className="fa-solid fa-pen-to-square text-white"></i></button>
                                                                </div>
                                                                <div className="bg-[#0dcaf0] px-2 rounded-md">
                                                                    <button type='submit' className='py-1 font-semibold text-sm'><i className="fa-solid fa-image"></i></button>
                                                                </div>
                                                                <div className="bg-[#dc3545] px-2 rounded-md">
                                                                    <button  className='py-1 font-semibold text-sm'><i className="fa-solid fa-trash text-white"></i></button>
                                                                </div>
                                                                <div className="bg-[#FF6600] px-2 rounded-md">
                                                                    <button  className='py-1 font-semibold text-sm'><i className="fa-solid fa-gears text-white"></i></button>
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

            {/* Add room modal  */}     
            {isOpenModalAdd && (
            <div className="w-full bg-black bg-opacity-25 inset-0 backdrop-blur-sm fixed">
                <div className="lg:w-3/5 h-[95%] mt-4 pr-4 pl-4 mx-auto p-6 bg-white overflow-hidden rounded-md overflow-y-auto">
                    <div className="modal " id="add-room" tabIndex={-1}>
                        <div className="modal-dialog modal-lg">
                            <form id="add_room_form" onSubmit={hendleSubmit}>
                                <div className="modal-content">
                                    <div className="modal-header mb-5">
                                        <h5 className="modal-title text-left font-medium text-xl">Add Tour</h5>
                                    </div>
                                    <div className="h-[1px] w-full bg-gray-300"></div>
                                    <div className="modal-body my-3">
                                        <div className="flex flex-wrap ">
                                            <div className="w-full pr-4 pl-4 mb-3 text-left">
                                                <label className="form-label font-semibold">Name</label>
                                                <input type="text" name="name" value={formValue.name} onChange={handleChange} className="block appearance-none w-full py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded shadow-none" required="" />
                                            </div>
                                            <div className="w-full pr-4 pl-4 mb-3 text-left">
                                                <label className="form-label font-semibold">Departure Location</label>
                                                <input type="text" name="departurelocation" value={formValue.departurelocation} onChange={handleChange} className="block appearance-none w-full py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded shadow-none" required="" />
                                            </div>
                                            <div className="md:w-1/2 pr-4 pl-4 mb-3 text-left">
                                                <label className="form-label font-semibold">Price</label>
                                                <input type="number" min={1} name="price" value={formValue.price} onChange={handleChange} className="block appearance-none w-full py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded shadow-none" required="" />
                                            </div>
                                            <div className="md:w-1/2 pr-4 pl-4 mb-3 text-left">
                                                <label className="form-label font-semibold">Discount</label>
                                                <input type="number" min={1} name="discount" value={formValue.discount} onChange={handleChange} className="block appearance-none w-full py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded shadow-none" required="" />
                                            </div>
                                            <div className="md:w-1/2 pr-4 pl-4 mb-3 text-left">
                                                <label className="form-label font-semibold">TimeTour(day)</label>
                                                <input type="number" min={1} name="timetour" value={formValue.timetour} onChange={handleChange} className="block appearance-none w-full py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded shadow-none" required="" />
                                            </div>
                                            <div className="md:w-1/2 pr-4 pl-4 mb-3 text-left">
                                                <label className="form-label font-semibold">Depart</label>
                                                <input type="text" min={1} name="depart" value={formValue.depart} onChange={handleChange} placeholder="07,14,17,21,28/09/2024" className="block appearance-none w-full py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded shadow-none" required="" />
                                            </div>
                                            <div className="md:w-1/2 pr-4 pl-4 mb-3 text-left">
                                                <label className="form-label font-semibold">Vehicle</label>
                                                <input type="text" min={1} name="vehicle" value={formValue.vehicle} onChange={handleChange} className="block appearance-none w-full py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded shadow-none" required="" />
                                            </div>
                                            <div className="md:w-1/2 pr-4 pl-4 mb-3 text-left">
                                                <label className="form-label font-semibold">Itinerary</label>
                                                <input type="text" min={1} name="itinerary" value={formValue.itinerary} onChange={handleChange} placeholder="Hà Nội - Vịnh Hạ Long " className="block appearance-none w-full py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded shadow-none" required="" />
                                            </div>
                                            <div className="w-full pr-4 pl-4 mb-3 text-left">
                                                <label className="form-label font-semibold">Description</label>
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
                                        <button type="reset" onClick={handleModalClick}  className="mx-2 inline-block align-middle text-center select-none border font-normal whitespace-no-wrap rounded py-1 px-3 leading-normal no-underline text-gray-600 shadow-none" >
                                            CANCEL
                                        </button>
                                        <button type="submit" onClick={(event) => hendleSubmit(event)} className="bg-black mx-2 inline-block align-middle text-center select-none border font-normal whitespace-no-wrap rounded py-1 px-3 leading-normal no-underline custom-bg text-white shadow-none">
                                            SUBMIT
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            )}
        </div>
    );
}
export default ManagerTour;