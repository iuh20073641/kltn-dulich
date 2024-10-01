import HeaderManager from "../header-manager/header-manager";
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { fetchRooms } from "../../../component/api/room";
import { fetchFeatures } from "../../../component/api/room";
import { fetchFacilities } from "../../../component/api/room";
// import { fetchRoomFeature } from "../../../component/api/room";
// import { fetchRoomDetails } from "../../../component/api/room";
// import { fetchRoomFacilities } from "../../../component/api/room";

const initFormValue = {
    name: "",
    area: "",
    price: "",
    quantity: "",
    adult: "",
    childrent: "",
    description: "",
    feature: [],
    facilities: [],
};

const selectFormValue = {
    name: "",
    area: "",
    price: "",
    quantity: "",
    adult: "",
    childrent: "",
    description: "",
    feature: [],
    facilities: [],
};

function RoomManager(){

    const [isOpenModalAdd, setIsOpenModalAdd] = useState(false);
    const [isOpenModalUpdate, setIsOpenModalUpdate] = useState(false);
    const [formValue, setFormValue] = useState(initFormValue);
    const [rooms, setRooms] = useState([]);
    const [features, setFeatures] = useState([]);
    const [facilities, setFacilities] = useState([]);
    // const [roomDetail, setRoomDetail] = useState([]);
    // const [selectedRoomFacility, setSelectedRoomFacility] = useState([]);
    // const [selectedRoomFeature, setSelectedRoomFeature] = useState([]);
    // const [selectedFeatures, setSelectedFeatures] = useState([]);
    // const [selectedFacilities, setSelectedFacilities] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(selectFormValue);
    // const details = selectedProduct?.details || [];
    // const [roomFeatures, setRoomFeatures] = useState({});
    // const [roomFacilities, setRoomFacilities] = useState({});
    const [error, setError] = useState(null);
    // const isSelected = (facilitiesId) => selectedRoomFacility.includes(facilitiesId);

    // Ẩn/hiện modal thêm room 
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

    // lưu dữ liệu features để thêm room
    const handleFeatureChange = (featureId) => {
        setFormValue((prevValues) => {
          const updatedFeatures = prevValues.feature.includes(featureId)
            ? prevValues.feature.filter((id) => id !== featureId) // Bỏ chọn nếu đã có
            : [...prevValues.feature, featureId]; // Thêm vào nếu chưa có
    
          return {
            ...prevValues,
            feature: updatedFeatures, // Cập nhật danh sách feature
          };
        });
    //     console.log(selectFormValue.feature);
    //     if (selectedRoom.feature.includes(featureId)) {
    //         // Nếu đã chọn, bỏ chọn
    //         setSelectedRoom({
    //             ...selectedRoom,
    //             features: selectedRoom.feature.filter(id => id !== featureId) // Bỏ ID khỏi mảng
    //         });
    //     } else {
    //         // Nếu chưa chọn, thêm chọn
    //         setSelectedRoom({
    //             ...selectedRoom,
    //             features: [...selectedRoom.feature, featureId] // Thêm ID vào mảng
    //         });
    //     }
    };

    // lưu dữ liệu facilities để thêm room
    const handleFacilityChange = (facilityId) => {
        setFormValue((prevValues) => {
          const updatedfacilities = prevValues.facilities.includes(facilityId)
            ? prevValues.facilities.filter((id) => id !== facilityId) // Bỏ chọn nếu đã có
            : [...prevValues.facilities, facilityId]; // Thêm vào nếu chưa có
    
          return {
            ...prevValues,
            facilities: updatedfacilities, // Cập nhật danh sách feature
          };
        });
    };

    // thêm room
    const hendleSubmit = async (event) => {
        event.preventDefault(); //để không tự động reset
        console.log("formValue", formValue);
        fetch('http://localhost:88/api_travel/api/admin/create-room.php', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                name: formValue.name, 
                area: formValue.area, 
                price: formValue.price,
                quantity: formValue.quantity, 
                adult: formValue.adult, 
                children: formValue.childrent, 
                description: formValue.description, 
                features: formValue.feature, 
                facilities: formValue.facilities
             }),
          })
          .then(response => response.json())
            // .then(response => {
            //     console.log("Response status:", response.status); // Kiểm tra mã phản hồi HTTP
            //     return response.json();
            // })
          .then(data => {
            if (data.status === 'success') {
                toast.success('Phòng đã được thêm thành công');
                // setRooms([...rooms, data.newRoom]);
                setFormValue(initFormValue); // Đặt lại form về rỗng nếu có lỗi
            } else if (data.status === 'error1'){
                toast.error('Dữ liệu JSON không hợp lệ');
                setFormValue(initFormValue); // Đặt lại form về rỗng nếu có lỗi
            } else if (data.status === 'error2'){
                toast.error('Thiếu hoặc không hợp lệ các tham số');
                setFormValue(initFormValue); // Đặt lại form về rỗng nếu có lỗi
            } else if (data.status === 'error3'){
                toast.error('Phòng đã tồn tại');
                setFormValue(initFormValue); // Đặt lại form về rỗng nếu có lỗi
            } else{
                toast.error('Thêm phòng thất bại. Vui lòng thử lại.');
                setFormValue(initFormValue); // Đặt lại form về rỗng nếu có lỗi
            }
          })
          .catch(error => {
            // console.error('Có lỗi xảy ra:', error);
            toast.error('lỗi.');
            console.log('Có lỗi xảy ra:');
            setFormValue(initFormValue); // Đặt lại form về rỗng nếu có lỗi
          });
    };

    // Ẩn modal update room 
        const handleModalUpdate = () => {
            setIsOpenModalUpdate(!isOpenModalUpdate);
    };


    useEffect(() => {
        // Hàm để gọi API và cập nhật state
        const fetchData = async () => {
            try {
                // Gọi API để lấy danh sách phòng
                const roomsResponse = await fetchRooms();
                const roomsData = roomsResponse.data; // Giả sử API trả về mảng các phòng
                setRooms(roomsData);

                // // Tự động gọi API khác để lấy thông tin chi tiết (feature) của từng phòng
                // const featurePromises = roomsData.map(async (room) => {
                //     const featureResponse = await fetchRoomFeature(room.id);
                //     // console.log(`Feature Response for Room ID ${room.id}: `, featureResponse);  
                //     return { roomId: room.id, features: featureResponse.data };
                // });

                // // Đợi tất cả các lời gọi API hoàn tất
                // const allFeatures = await Promise.all(featurePromises);

                // // Chuyển đổi kết quả thành một đối tượng để dễ dàng truy xuất thông tin chi tiết(feature)
                // const featuresMap = {};
                // allFeatures.forEach(item => {
                //     featuresMap[item.roomId] = item.features;
                // });
                // setRoomFeatures(featuresMap);


            } catch (err) {
                console.error('Error fetching data:', err);
                setError(err);
            }
        };
        fetchData();

        const fetchDataFeatures = async () => {
            try {
                // Gọi API để lấy danh sách Features
                const featureResponse = await fetchFeatures();
                const featureData = featureResponse.data; // Giả sử API trả về mảng các Features
                setFeatures(featureData);

            } catch (err) {
                console.error('Error fetching data:', err);
                setError(err);
            }
        };
        fetchDataFeatures();

        const fetchDataFacilities = async () => {
            try {
                // Gọi API để lấy danh sách Facilities
                const facilitiesResponse = await fetchFacilities();
                const facilitiesData = facilitiesResponse.data; // Giả sử API trả về mảng các Facilities
                setFacilities(facilitiesData);

            } catch (err) {
                console.error('Error fetching data:', err);
                setError(err);
            }
        };
        fetchDataFacilities();
        
    }, []); // Chạy một lần khi component được mount
    
    // Hàm để xóa phòng
    // const deleteRoom = async (room_id) => {
    //     try {
    //     await deleteRoom(room_id); // API xóa phòng 
    //     // Cập nhật lại danh sách phòng sau khi xóa thành công
    //     // setRooms(rooms.filter((room) => room.id !== room_id));
    //     toast.success('Phòng đã được xóa thành công');
    //     } catch (error) {
    //     console.error('Lỗi khi xóa phòng:', error);
    //     toast.error('Xóa phòng thất bại. Vui lòng thử lại.');
    //     }
    // };

    // Hàm gọi API lấy chi tiết thông tin room theo ID
    const fetchRoomtFeature = async (room) => {
        // setLoading(true);
        setSelectedRoom(room); // Lưu thông tin room được chọn
        setIsOpenModalUpdate(!isOpenModalUpdate);

        /*try {
            const responseRoomDetail = await fetchRoomDetails(productId);
            setRoomDetail(responseRoomDetail.data);
        } catch (error) {
            console.error("lỗi tim kiếm thông tin phòng", error);
        }

        try {
            const response = await fetchRoomFeature(productId);
            setSelectedRoomFeature(response.data);
        } catch (error) {
        console.error("lỗi tim kiếm thông tin feature", error);
        }*/

        // setLoading(false);
    };

    const deleteRoom = (roomId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa phòng này?')) {
          fetch('http://localhost:88/api_travel/api/admin/delete_room.php', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ room_id: roomId }),
          })
          .then(response => response.json())
          .then(data => {
            if (data.status === 'success') {
                setRooms(rooms.filter(room => room.id !== roomId));
                toast.success('Phòng đã được xóa thành công');
            } else if(data.status === 'error1'){
                toast.error('Dữ liệu JSON không hợp lệ.');
            } else if(data.status === 'error2'){
                toast.error('Thiếu hoặc không hợp lệ tham số phòng ID.');
            } else {
                toast.error('Xóa phòng thất bại. Vui lòng thử lại.');
            }
          })
          .catch(error => {
            // console.error('Có lỗi xảy ra:', error);
            toast.error('lỗi.');
            console.log('Có lỗi xảy ra:');
          });
        }
    };

    // const handleChange = (event) => {
    //     const { value, name } = event.target;
    //     setFormValue({
    //         ...formValue,
    //         [name]: value,
    //     });
    // };

    // const handleCheckboxChange = (event) => {
    //     setInputValue(event.target.value);
    // };

    const handleFeatureChange2 = (id) => {
        setSelectedRoom((prevRoom) => {
            const features = prevRoom.features.includes(id)
                ? prevRoom.features.filter((featureId) => featureId !== id) // Bỏ chọn
                : [...prevRoom.features, id]; // Chọn
    
            return { ...prevRoom, features }; // Cập nhật state
        });
    };
    
    

    // if({})

    if (error) return <div>Error: {error.message}</div>;

    return(
        <div className="bg-gray-100 w-full">
            <HeaderManager />
            
            <div className="container mx-auto sm:px-4 -mt-[650px] max-w-full z-20" id="main-content">
                <div className="">
                    <div className="lg:w-4/5 pr-4 pl-4 ms-auto p-6 overflow-hidden">
                        <h3 className="mb-4 text-left text-2xl font-medium">Rooms</h3>
                        <div className="bg-white card border-0 shadow mb-4 rounded-lg">
                            <div className="card-body p-6">
                                <div className="text-end mb-4">
                                    <button id="openModalBtn" onClick={handleModalClick} type="button" className="inline-block align-middle text-center select-none border font-normal whitespace-no-wrap rounded  no-underline bg-gray-900 text-white hover:bg-gray-900 shadow-none py-1 px-2 leading-tight text-xs ">
                                        <i className="fa-regular fa-square-plus"></i> Add
                                    </button> 
                                </div>
                                <div className="block w-full overflow-auto scrolling-touch" style={{ height: 450, overflowY: "scroll" }}>
                                    <table className="w-full max-w-full mb-4 bg-transparent table-hover border text-center">
                                        <thead className="">
                                            <tr className="bg-gray-900 text-gray-100 h-9">
                                                <th scope="col">#</th>
                                                <th scope="col">Name</th>
                                                <th scope="col">Area</th>
                                                <th scope="col">Guests</th>
                                                <th scope="col">Price (VNĐ)</th>
                                                <th scope="col">Quantity</th>
                                                <th scope="col">Status</th>
                                                <th scope="col">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody id="room-data">
                                            {rooms.map((room) => (
                                            <tr className="h-16" key={room.id}>
                                                <td>{room.id}</td>
                                                <td>{room.name}</td>
                                                <td>{room.area}</td>
                                                <td>
                                                    Adult:{room.adult}
                                                    <br></br>
                                                    Childrent:{room.children}
                                                </td>
                                                <td>{room.price}</td>
                                                <td>{room.quantity}</td>
                                                <td>
                                                    <div className='bg-black text-white rounded-md'>
                                                        <button type='submit' className='py-1 font-semibold text-sm'><p>Active</p></button>
                                                    </div>
                                                </td>
                                                <td>
                                                    {/* <form> */}
                                                        <div className="flex justify-center gap-2">
                                                                <div className="bg-[#0d6efd] px-2 rounded-md">
                                                                    <button type="button" onClick={() => fetchRoomtFeature(room)} className='py-1 font-semibold text-sm'><i className="fa-solid fa-pen-to-square text-white"></i></button>
                                                                </div>
                                                                <div className="bg-[#0dcaf0] px-2 rounded-md">
                                                                    <button type='submit' className='py-1 font-semibold text-sm'><i className="fa-solid fa-image"></i></button>
                                                                </div>
                                                                <div className="bg-[#dc3545] px-2 rounded-md">
                                                                    <button onClick={() => deleteRoom(room.id)} className='py-1 font-semibold text-sm'><i className="fa-solid fa-trash text-white"></i></button>
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
                <div className="lg:w-3/5 mt-6 pr-4 pl-4 mx-auto p-6 bg-white overflow-hidden rounded-md overflow-y-auto">
                    <div className="modal " id="add-room" tabIndex={-1}>
                        <div className="modal-dialog modal-lg">
                            <form id="add_room_form" onSubmit={hendleSubmit}>
                                <div className="modal-content">
                                    <div className="modal-header mb-5">
                                        <h5 className="modal-title text-left font-medium text-xl">Add Room</h5>
                                    </div>
                                    <div className="h-[1px] w-full bg-gray-300"></div>
                                    <div className="modal-body my-3">
                                        <div className="flex flex-wrap ">
                                            <div className="md:w-1/2 pr-4 pl-4 mb-3 text-left">
                                                <label className="form-label font-semibold">Name</label>
                                                <input type="text" name="name" value={formValue.name} onChange={handleChange} className="block appearance-none w-full py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded shadow-none" required="" />
                                            </div>
                                            <div className="md:w-1/2 pr-4 pl-4 mb-3 text-left">
                                                <label className="form-label font-semibold">Area</label>
                                                <input type="text" min={1} name="area" value={formValue.area} onChange={handleChange} className="block appearance-none w-full py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded shadow-none" required="" />
                                            </div>
                                            <div className="md:w-1/2 pr-4 pl-4 mb-3 text-left">
                                                <label className="form-label font-semibold">Price</label>
                                                <input type="number" min={1} name="price" value={formValue.price} onChange={handleChange} className="block appearance-none w-full py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded shadow-none" required="" />
                                            </div>
                                            <div className="md:w-1/2 pr-4 pl-4 mb-3 text-left">
                                                <label className="form-label font-semibold">Quantity</label>
                                                <input type="number" min={1} name="quantity" value={formValue.quantity} onChange={handleChange} className="block appearance-none w-full py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded shadow-none" required="" />
                                            </div>
                                            <div className="md:w-1/2 pr-4 pl-4 mb-3 text-left">
                                                <label className="form-label font-semibold">Adult (Max.)</label>
                                                <input type="number" min={1} name="adult" value={formValue.adult} onChange={handleChange} className="block appearance-none w-full py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded shadow-none" required="" />
                                            </div>
                                            <div className="md:w-1/2 pr-4 pl-4 mb-3 text-left">
                                                <label className="form-label font-semibold">Children (Max.)</label>
                                                <input type="number" min={1} name="childrent" value={formValue.childrent} onChange={handleChange} className="block appearance-none w-full py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded shadow-none" required="" />
                                            </div>
                                            <div className="w-full mb-3 text-left">
                                                <label className="form-label font-semibold">Features</label>
                                                <div className="flex flex-wrap mt-2">
                                                    {features.map((feature) => (
                                                    <div className='col-md-3 mb-1 w-1/5' key={feature.id}>
                                                        <div className="flex gap-1 items-center">
                                                            <input type='checkbox' name='features' onChange={() => handleFeatureChange(feature.id)} checked={formValue.feature.includes(feature.id)} className='form-check-input shadow-none' />
                                                            {feature.name}
                                                        </div>
                                                    </div>
                                                    ))} 
                                                
                                                </div>
                                            </div>
                                            <div className="w-full mb-3 text-left">
                                                <label className="form-label font-semibold">Facilities</label>
                                                <div className="flex flex-wrap ">
                                                    {facilities.map((facility) => (
                                                    <div className='col-md-3 mb-1 w-1/5' key={facility.id}>
                                                        <div className="flex gap-1 items-center">
                                                            <input type='checkbox' name='facilities' onChange={() => handleFacilityChange(facility.id)} checked={formValue.facilities.includes(facility.id)} className='form-check-input shadow-none' />
                                                            {facility.name}
                                                        </div>
                                                    </div>
                                                    ))} 
                                                </div>
                                            </div>
                                            <div className="w-full mb-3 text-left">
                                                <label className="form-label font-semibold">Description</label>
                                                <textarea
                                                    name="description"
                                                    rows={4}
                                                    value={formValue.description} onChange={handleChange}
                                                    className="block appearance-none w-full py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded shadow-none"
                                                    required=""
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="reset"  onClick={handleModalClick} className="mx-2 inline-block align-middle text-center select-none border font-normal whitespace-no-wrap rounded py-1 px-3 leading-normal no-underline text-gray-600 shadow-none" >
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

            {/* Edit room modal  */}
            {isOpenModalUpdate && (
            <div className="w-full bg-black bg-opacity-25 inset-0 backdrop-blur-sm fixed overflow-y-auto">
                <div className="modal overflow-y-auto lg:w-3/5 mt-6 mx-auto bg-white rounded-md" id="edit-room" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-lg">
                        <form id="edit_room_form">
                            <div className="modal-content">
                                <div className="modal-header mb-5 mx-3 pt-5">
                                    <h5 className="modal-title text-left font-semibold text-xl">Edit Room</h5>
                                </div>
                                <div className="h-[1px] w-full bg-gray-300"></div>
                                <div className="modal-body">
                                    {/* {roomDetail.map((detail) => ( */}
                                    <div className="flex flex-wrap">
                                        <div className="md:w-1/2 pr-4 pl-4 my-3 text-left">
                                            <label className="form-label fw-bold">Name</label>
                                            <input type="text" name="name"   value={selectedRoom?.name || ''}
                                                onChange={(e) => setSelectedRoom({ ...selectedRoom, name: e.target.value })} 
                                                className="block appearance-none w-full py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded shadow-none" required="" 
                                            />
                                        </div>
                                        <div className="md:w-1/2 pr-4 pl-4 my-3 text-left">
                                            <label className="form-label fw-bold">Area</label>
                                            <input type="text" min={1} 
                                                name="area" 
                                                value={selectedRoom?.area || ''}
                                                onChange={(e) => setSelectedRoom({ ...selectedRoom, area: e.target.value })} 
                                                className="block appearance-none w-full py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded shadow-none" required="" 
                                            />
                                        </div>
                                        <div className="md:w-1/2 pr-4 pl-4 mb-3 text-left">
                                            <label className="form-label fw-bold">Price</label>
                                            <input type="number" min={1} 
                                                name="price"  
                                                value={selectedRoom?.price || ''}
                                                onChange={(e) => setSelectedRoom({ ...selectedRoom, price: e.target.value })} 
                                                className="block appearance-none w-full py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded shadow-none" required="" 
                                            />
                                        </div>
                                        <div className="md:w-1/2 pr-4 pl-4 mb-3 text-left">
                                            <label className="form-label fw-bold">Quantity</label>
                                            <input type="number" min={1} 
                                                name="quantity"  
                                                value={selectedRoom?.quantity || ''}
                                                onChange={(e) => setSelectedRoom({ ...selectedRoom, quantity: e.target.value })} 
                                                className="block appearance-none w-full py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded shadow-none" required="" 
                                            />
                                        </div>
                                        <div className="md:w-1/2 pr-4 pl-4 mb-3 text-left">
                                            <label className="form-label fw-bold">Adult (Max.)</label>
                                            <input type="number" min={1} 
                                                name="adult"  
                                                value={selectedRoom?.adult || ''}
                                                onChange={(e) => setSelectedRoom({ ...selectedRoom, adult: e.target.value })} 
                                                className="block appearance-none w-full py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded shadow-none" required="" 
                                            />
                                        </div>
                                        <div className="md:w-1/2 pr-4 pl-4 mb-3 text-left">
                                            <label className="form-label fw-bold">Children (Max.)</label>
                                            <input type="number" min={1} 
                                                name="children"  
                                                value={selectedRoom?.children || ''}
                                                onChange={(e) => setSelectedRoom({ ...selectedRoom, children: e.target.value })} 
                                                className="block appearance-none w-full py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded shadow-none" required="" 
                                            />
                                        </div>
                                        <div className="w-full mx-4 mb-3 text-left">
                                            <label className="form-label fw-bold">Features</label>
                                            <div className="flex flex-wrap w-full">
                                                <div className='col-md-3 mb-1 w-1/5'>
                                                {features.map((feature) => (
                                                    <div className="flex gap-1 items-center" key={feature.id}>
                                                        {/* <input type='checkbox' 
                                                            name='features' 
                                                            value={feature.id}
                                                            onChange={() => handleFeatureChange(feature.id)} 
                                                            checked={selectedRoom.features && selectedRoom.features.includes(feature.id)}
                                                            className='form-check-input shadow-none' 
                                                        /> {feature.name} */}
                                                        <input
                                                            type="checkbox"
                                                            name="features"
                                                            value={feature.id}
                                                            onChange={() => handleFeatureChange2(feature.id)}
                                                            checked={selectFormValue.features && selectFormValue.features.includes(feature.id)} // Kiểm tra xem ID có trong mảng không
                                                            className='form-check-input shadow-none'
                                                        /> {feature.name}
                                                    </div>
                                                ))} 
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-full mx-4 mb-3 text-left">
                                            <label className="form-label fw-bold">Facilities</label>
                                            {/* <div className="flex flex-wrap">
                                            {Array.isArray(selectedRoomFacility) ? (
                                                <div className='col-md-3 mb-1'>
                                                {selectedRoomFacility.map((roomFacility) => (
                                                    <div className="flex gap-1 items-center">
                                                        <input type='checkbox' name='features' value={roomFacility.id} className='form-check-input shadow-none' />
                                                        <p>{roomFacility.name}</p>
                                                    </div>
                                                ))}
                                                </div>
                                            ) : (
                                                <p>Không có facilities</p>
                                            )}
                                            </div> */}
                                            <div className="flex flex-wrap ">
                                                    {/* {facilities.map((facilitie) => (
                                                    <div className='col-md-3 mb-1 w-1/5' key={facilitie.id}>
                                                        <div className="flex gap-1 items-center">
                                                            <input type='checkbox' name='features' checked={selectedRoomFacility.includes(facilitie.id)} value={facilitie.id} onChange={handleCheckboxChange} className='form-check-input shadow-none' />
                                                            {facilitie.name}
                                                        </div>
                                                    </div>
                                                    ))}  */}
                                            </div>
                                        </div>
                                        <div className="w-full mb-3 text-left">
                                            <label className="form-label fw-bold">Description</label>
                                            <textarea
                                                name="desc"
                                                rows={4}
                                                className="block appearance-none w-full py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded shadow-none"
                                                required=""
                                                defaultValue={""}
                                            />
                                        </div>
                                        <input type="hidden" name="room_id" />
                                    </div>
                                    {/* ))}  */}
                                </div>
                                <div className="modal-footer pb-4">
                                    <button type="reset" onClick={handleModalUpdate} className="mx-2 inline-block align-middle text-center select-none border font-normal whitespace-no-wrap rounded py-1 px-3 leading-normal no-underline text-gray-600 shadow-none" data-bs-dismiss="modal">
                                        CANCEL
                                    </button>
                                    <button type="submit" className="bg-black mx-2 inline-block align-middle text-center select-none border font-normal whitespace-no-wrap rounded py-1 px-3 leading-normal no-underline custom-bg text-white shadow-none">
                                        SUBMIT
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
             )}

        </div>
    );
}
export default RoomManager;