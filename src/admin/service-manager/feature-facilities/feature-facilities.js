import HeaderManager from "../header-manager/header-manager";
import { toast } from 'react-toastify';
import React, { useEffect, useState } from 'react';

import { fetchFeatures } from "../../../component/api/room";
import { fetchFacilities } from "../../../component/api/room";

const initFormValueFeature = {
    // id:"",
    feature_name: ""
};

function FeatureFacilities(){

    const [isOpenModalFeatureAdd, setIsOpenModalFeatureAdd] = useState(false);
    const [isOpenModalFacilitiesAdd, setIsOpenModalFacilitiesAdd] = useState(false);
    const [formValueFeatures, setFormValueFeatures] = useState(initFormValueFeature);
    const [features, setFeatues] = useState([]);
    const [facilities, setFacilities] = useState([]);
    const [error, setError] = useState(null);


    // Ẩn/hiện modal thêm feature
    const handleModalFeatureClick = () => {
        setIsOpenModalFeatureAdd(!isOpenModalFeatureAdd);
    };

    const handleChange = (event) => {
        const { value, name } = event.target;
        setFormValueFeatures({
            ...formValueFeatures,
            [name]: value,
        });
    };

    // thêm features
    const hendleSubmitFeature = async (event) => {
        event.preventDefault(); //để không tự động reset
        console.log("formValue", formValueFeatures);
        fetch('http://localhost:88/api_travel/api/admin/create_features.php', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                name: formValueFeatures.feature_name
             }),
          })
          .then(response => response.json())
            // .then(response => {
            //     console.log("Response status:", response.status); // Kiểm tra mã phản hồi HTTP
            //     return response.json();
            // })
          .then(data => {
            if (data.status === 'success') {
                toast.success('Features đã được thêm thành công.');
                setFormValueFeatures(initFormValueFeature); // Đặt lại form về rỗng
                // setFeatues([...features, data.newFeature]);
                // Gọi lại hàm fetchFeatures để load lại danh sách features
                 // Thêm feature mới vào danh sách features
                // const newFeature = { id: features.id, name: formValueFeatures.feature_name }; // Giả sử API trả về `id` của feature mới
                // setFeatues([...features, newFeature]); // Thêm feature mới vào state hiện tại

            } else if (data.status === 'error1'){
                toast.error('Dữ liệu JSON không hợp lệ');
                setFormValueFeatures(initFormValueFeature); // Đặt lại form về rỗng nếu có lỗi
            } else if (data.status === 'error2'){
                toast.error('Thiếu hoặc không hợp lệ tham số name.');
                setFormValueFeatures(initFormValueFeature); // Đặt lại form về rỗng nếu có lỗi
            } else if (data.status === 'error3'){
                toast.error('Features đã tồn tại.');
                setFormValueFeatures(initFormValueFeature); // Đặt lại form về rỗng nếu có lỗi
            } else{
                toast.error('Thêm features không thành công.');
                setFormValueFeatures(initFormValueFeature); // Đặt lại form về rỗng nếu có lỗi
            }
          })
          .catch(error => {
            // console.error('Có lỗi xảy ra:', error);
            toast.error('lỗi.');
            console.log('Có lỗi xảy ra:');
            setFormValueFeatures(initFormValueFeature); // Đặt lại form về rỗng nếu có lỗi
          });
    };

    const deleteFeature = (featureId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
          fetch('http://localhost:88/api_travel/api/admin/delete_features.php', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ feature_id: featureId }),
          })
          .then(response => response.json())
          .then(data => {
            if (data.status === 'success') {
                setFeatues(features.filter(feature => feature.id !== featureId));
                toast.success('Feature đã được xóa thành công.');
            } else if (data.status === 'error1'){
                toast.error('Dữ liệu JSON không hợp lệ.');
            } else if (data.status === 'error2'){
                toast.error('Thiếu hoặc không hợp lệ tham số feature_id.');
            } else if (data.status === 'error3'){
                toast.error('Feature không tồn tại.');
            } else if (data.status === 'error4'){
                toast.error('Feature này đang được liên kết với phòng. Không thể xóa feature.');
            } else {
                toast.error('Xóa feature không thành công.');
            }
          })
          .catch(error => {
            // console.error('Có lỗi xảy ra:', error);
            toast.error('lỗi api.');
            console.log('Có lỗi xảy ra:');
            console.error('Chi tiết lỗi:', error);
          });
        }
    };

    // Ẩn/hiện modal thêm facilities
    const handleModalFacilitiesClick = () => {
        setIsOpenModalFacilitiesAdd(!isOpenModalFacilitiesAdd);
    };

    const deleteFacilities = (facilityId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
          fetch('http://localhost:88/api_travel/api/admin/delete_facilities.php', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ facility_id: facilityId }),
          })
          .then(response => response.json())
          .then(data => {
            if (data.status === 'success') {
                setFacilities(facilities.filter(facilitie => facilitie.id !== facilityId));
                toast.success('Facility đã được xóa thành công.');
            } else if (data.status === 'error1'){
                toast.error('Dữ liệu JSON không hợp lệ.');
            } else if (data.status === 'error2'){
                toast.error('Thiếu hoặc không hợp lệ tham số facility_id.');
            } else if (data.status === 'error3'){
                toast.error('Facility không tồn tại.');
            } else if (data.status === 'error4'){
                toast.error('Facility này đang được liên kết với phòng. Không thể xóa facility.');
            } else {
                toast.error('Xóa facility không thành công.');
            }
          })
          .catch(error => {
            // console.error('Có lỗi xảy ra:', error);
            toast.error('lỗi api.');
            console.log('Có lỗi xảy ra:');
            console.error('Chi tiết lỗi:', error);
          });
        }
    };


    useEffect(() => {
        // Hàm để gọi API và cập nhật state
        const fetchData = async () => {
            try {
                // Gọi API để lấy danh sách feature
                const featuresResponse = await fetchFeatures();
                const featuresData = featuresResponse.data; // Giả sử API trả về mảng các feature
                setFeatues(featuresData);

            } catch (err) {
                console.error('Error fetching data:', err);
                setError(err);
            }
        };

        fetchData();

        const fetchDataFacilities = async () => {
            try {
                // Gọi API để lấy danh sách facilities
                const facilitiesResponse = await fetchFacilities();
                const facilitiesData = facilitiesResponse.data; // Giả sử API trả về mảng các facilities
                setFacilities(facilitiesData);

            } catch (err) {
                console.error('Error fetching data:', err);
                setError(err);
            }
        };

        fetchDataFacilities();
    }, []); // Chạy một lần khi component được mount

    if (error) return <div>Error: {error.message}</div>;
    return(
        <div className="bg-gray-100 w-full">
            <HeaderManager />

            <div className="container mx-auto sm:px-4 max-w-full h-screen -mt-[650px] overflow-y-auto" id="main-content">
                <div className="flex flex-wrap ">
                    <div className="lg:w-4/5 pr-4 pl-4 ms-auto p-6 overflow-hidden">
                        <h3 className="mb-4 text-left font-semibold text-2xl">Features &amp; Facilities</h3>
                        <div className="relative flex flex-col min-w-0 rounded break-words bg-white border-1 border-gray-300 border-0 shadow mb-4">
                            <div className="flex-auto p-6">
                                <div className="flex align-item-center justify-between mb-3">
                                    <h5 className="mb-3 m-0 text-xl font-medium">Features</h5>
                                    <button
                                        type="button"
                                        onClick={handleModalFeatureClick}
                                        className="inline-block align-middle text-center select-none border font-normal whitespace-no-wrap rounded  no-underline bg-gray-900 text-white hover:bg-gray-900 shadow-none py-1 px-2 leading-tight text-xs "
                                        data-bs-toggle="modal"
                                        data-bs-target="#feature-s"
                                    >
                                    <i className="fa-regular fa-square-plus"></i> Add
                                    </button>
                                </div>
                                <div className="block w-full overflow-auto scrolling-touch" style={{ height: 350, overflowY: "scroll" }}>
                                    <table className="w-full max-w-full mb-4 bg-transparent table-hover border text-left">
                                        <thead>
                                            <tr className="bg-gray-900 text-gray-100 h-9">
                                                <th scope="col" className="px-2">#</th>
                                                <th scope="col">Name</th>
                                                <th scope="col">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody id="features-data">
                                        {features.map((feature) => (
                                            <tr className="h-10 border-b-[1px]" key={feature.id}>
                                                <td className="px-2">{feature.id}</td>
                                                <td>{feature.name}</td>
                                                <td>
                                                    <div className="bg-[#dc3545] w-14 rounded-md flex justify-center">
                                                        <button onClick={() => deleteFeature(feature.id)} className='py-1 font-semibold text-sm'><i className="fa-solid fa-trash text-white"></i></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div className="relative flex flex-col min-w-0 rounded break-words border bg-white border-1 border-gray-300 shadow mb-4">
                            <div className="flex-auto p-6">
                                <div className="flex align-item-center justify-between mb-3">
                                    <h5 className="mb-3 m-0">Facilities</h5>
                                    <button
                                        type="button"
                                        onClick={handleModalFacilitiesClick}
                                        className="inline-block align-middle text-center select-none border font-normal whitespace-no-wrap rounded  no-underline bg-gray-900 text-white hover:bg-gray-900 shadow-none py-1 px-2 leading-tight text-xs "
                                        data-bs-toggle="modal"
                                        data-bs-target="#facility-s"
                                    >
                                        <i className="fa-regular fa-square-plus"></i> Add
                                    </button>
                                </div>
                                <div className="block w-full overflow-auto scrolling-touch" style={{ height: 350, overflowY: "scroll" }}>
                                    <table className="w-full max-w-full mb-4 bg-transparent table-hover border text-left">
                                        <thead>
                                            <tr className="bg-gray-900 text-gray-100">
                                                <th scope="col" className="px-2">#</th>
                                                <th scope="col">Icon</th>
                                                <th scope="col">Name</th>
                                                <th scope="col" width="40%">
                                                    Description
                                                </th>
                                                <th scope="col">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody id="facilities-data">
                                        {facilities.map((facilitie) => (
                                            <tr className="h-10 border-b-[1px]" key={facilitie.id}>
                                                <td className="px-2">{facilitie.id}</td>
                                                <td>
                                                    <i className="fa-solid fa-martini-glass"></i>
                                                </td>
                                                <td>{facilitie.name}</td>
                                                <td>{facilitie.description}</td>
                                                <td>
                                                    <div className="bg-[#dc3545] w-14 rounded-md flex justify-center">
                                                        <button onClick={() => deleteFacilities(facilitie.id)} className='py-1 font-semibold text-sm'><i className="fa-solid fa-trash text-white"></i></button>
                                                    </div>
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

            {/* Features modal  */}
            {isOpenModalFeatureAdd && (
            <div className="w-full bg-black bg-opacity-25 inset-0 backdrop-blur-sm fixed">
                <div className="modal w-[30%] mx-auto bg-white mt-8 rounded-md" id="feature-s" tabIndex={-1}>
                    <div className="modal-dialog">
                        <form id="feature_s_form" onSubmit={hendleSubmitFeature}>
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title font-medium text-lg text-left mx-3 pt-3 mb-3 tracking-normal">Add Feature</h5>
                                </div>
                                <div className="w-full h-[1px] bg-gray-200"></div>
                                <div className="modal-body">
                                    <div className="mb-3 text-left">
                                        <div className="form-label font-medium mx-3 mt-4 mb-2">Name</div>
                                        <input
                                            type="text"
                                            name="feature_name"
                                            value={formValueFeatures.feature_name} 
                                            onChange={handleChange}
                                            className="block appearance-none w-[95%] mx-auto py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded shadow-none focus:border-blue-200 focus:border-[2px] outline-none"
                                            required=""
                                        />
                                    </div>
                                </div>
                                <div className="w-full h-[1px] bg-gray-200 mt-6"></div>
                                <div className="modal-footer mt-4 pb-4">
                                    <button
                                        type="reset"
                                        onClick={handleModalFeatureClick}
                                        className="inline-block mx-1 align-middle text-center select-none border font-normal whitespace-no-wrap rounded py-1 px-3 leading-normal no-underline text-gray-600 shadow-none"
                                        data-bs-dismiss="modal"
                                    >
                                        CANCEL
                                    </button>
                                    <button
                                        type="submit"
                                        className="inline-block bg-[#2ec1ac] mx-1 align-middle text-center select-none border font-normal whitespace-no-wrap rounded py-1 px-3 leading-normal no-underline custom-bg text-white shadow-none"
                                    >
                                        SUBMIT
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            )}

            {/* Facilities modal  */}
            {isOpenModalFacilitiesAdd && (
            <div className="w-full bg-black bg-opacity-25 inset-0 backdrop-blur-sm fixed">
                <div className="modal bg-white w-[35%] mx-auto mt-8 rounded-md" id="facility-s" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <form id="facility_s_form">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title font-medium text-lg text-left mx-3 pt-3 mb-3 tracking-normal">Add Facility</h5>
                                </div>
                                <div className="modal-body text-left">
                                    <div className="mb-3">
                                        <div className="form-label font-medium mx-3 mt-4 mb-2">Name</div>
                                        <input
                                            type="text"
                                            name="facility_name"
                                            className="block appearance-none w-[95%] mx-auto py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 focus:border-blue-200 focus:border-[2px] outline-none rounded shadow-none"
                                            required=""
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <div className="form-label font-medium mx-3 mt-4 mb-2">Icon</div>
                                        <input
                                            type="file"
                                            name="facility_icon"
                                            accept=".svg"
                                            className="block appearance-none w-[95%] mx-auto py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded shadow-none"
                                            required=""
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <div className="form-label font-medium mx-3 mt-4 mb-2">Description</div>
                                        <textarea
                                            name="facility_desc"
                                            className="block appearance-none w-[95%] mx-auto py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 focus:border-blue-200 focus:border-[2px] outline-none rounded shadow-none"
                                            rows={3}
                                            defaultValue={""}
                                        />
                                    </div>
                                </div>
                                <div className="w-full h-[1px] bg-gray-200 mt-6"></div>
                                <div className="modal-footer mt-4 pb-4">
                                    <button
                                        type="reset"
                                        onClick={handleModalFacilitiesClick}
                                        className="inline-block mx-1 align-middle text-center select-none border font-normal whitespace-no-wrap rounded py-1 px-3 leading-normal no-underline text-gray-600 shadow-none"
                                        data-bs-dismiss="modal"
                                    >
                                        CANCEL
                                    </button>
                                    <button
                                        type="submit"
                                        className="inline-block mx-1 bg-[#2ec1ac] align-middle text-center select-none border font-normal whitespace-no-wrap rounded py-1 px-3 leading-normal no-underline custom-bg text-white shadow-none"
                                    >
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
export default FeatureFacilities;