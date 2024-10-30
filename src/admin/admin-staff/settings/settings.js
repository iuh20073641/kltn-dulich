import HeaderAdmin from "../header-admin/header-admin";
import React, { useEffect, useState } from 'react';
import { fetchSettings } from "../../../component/api/settings";
import { getAllInfoContact } from "../../../component/api/contact";

function Settings(){

    const [infoContact, setInfoContact] = useState([]);
    const [infoSettings, setInfoSettings] = useState([]);
    const [isOpenModalSettings, setIsOpenModalSettings] = useState(false);

    const clickModalSettings = () => {
        setIsOpenModalSettings(!isOpenModalSettings);
    };

    useEffect(() => {
        // Hàm để gọi API và cập nhật state
        const fetchData = async () => {
            try {
               
                const contactsResponse = await getAllInfoContact();
                const contactsData = contactsResponse.data; 
                // Nếu API trả về mảng, hãy lấy phần tử đầu tiên
                if (Array.isArray(contactsData) && contactsData.length > 0) {
                    setInfoContact(contactsData[0]);
                } else {
                    setInfoContact(null); // Xử lý nếu không có dữ liệu hợp lệ
                }

                const settingResponse = await fetchSettings();
                const settingData = settingResponse.data; 
                setInfoSettings(settingData);

            } catch (err) {
                // console.error('Error fetching data:', err);
                // setError(err);
            }
        };

        fetchData();
    }, [infoContact, infoSettings]); // Chạy một lần khi component được mount

    return(
        <div className="bg-gray-100 w-full">
            <HeaderAdmin /> 
            
            <div className="container mx-auto h-[600px] sm:px-4 w-[80%] -mt-[650px] float-right overflow-auto">
                <h3 className="mb-4 text-left font-semibold text-2xl uppercase">Cài đặt</h3>
                {/* general settings section */}
                <div className="relative flex flex-col min-w-0 rounded break-words border bg-white border-1 border-gray-300 shadow mb-4">
                {infoSettings.map((setting) => (
                    <div className="flex-auto p-2" key={setting.sr_no}>
                        <div className="flex align-item-center justify-between mb-3">
                            <h5 className="mb-3 font-medium text-xl mx-2">Cài đặt chung</h5>
                            <button
                                type="button"
                                className="inline-block align-middle text-center select-none border font-normal whitespace-no-wrap rounded  no-underline bg-gray-900 text-white hover:bg-gray-900 shadow-none py-1 px-2 leading-tight text-xs "
                                onClick={clickModalSettings}
                            >
                                <i className="bi bi-pencil-square" /> Chỉnh sửa
                            </button>
                        </div>
                        <h6 className="-mt-2 mx-2 text-left font-semibold">Tiêu đề web</h6>
                        <p className="text-left mx-2">{setting.site_title}</p>
                        <h6 className="mt-2 mx-2 text-left font-semibold">Giới thiệu</h6>
                        <p className="text-left mx-2">{setting.site_about}</p>
                        {/* <p className="text-left mx-2">
                            Venture  Top choice when booking hotels online
                            As the leading hotel booking agency in Southeast Asia, since its launch, all you need to do is three steps: search, book a hotel room and pay. Venture took care of everything else.
                        </p> */}
                    </div>
                ))}
                </div> 

                <div className="relative flex flex-col min-w-0 rounded break-words border bg-white border-1 border-gray-300 shadow mb-4">
                    <div className="flex-auto p-2">
                        <div className="flex align-item-center justify-between mb-3">
                            <h5 className="mb-3 font-medium text-xl mx-2">Thông tin liên hệ</h5>
                            <button
                                type="button"
                                className="inline-block align-middle text-center select-none border font-normal whitespace-no-wrap rounded  no-underline bg-gray-900 text-white hover:bg-gray-900 shadow-none py-1 px-2 leading-tight text-xs "
                                data-bs-toggle="modal"
                                data-bs-target="#contacts-s"
                            >
                                <i className="bi bi-pencil-square" /> Chỉnh sửa
                            </button>
                        </div>
                        {infoContact.map((contact) => (
                        <div className="flex flex-wrap ">
                            <div className="lg:w-1/2">
                                <div className="mb-4">
                                    <h6 className="-mt-2 mx-2 text-left font-semibold">Địa chỉ</h6>
                                    <p className="mb-0 mx-2 text-left">{contact.address}</p>
                                </div>
                                <div className="mb-4">
                                    <h6 className="-mt-2 mx-2 text-left font-semibold">Google Map</h6>
                                    <p className="mb-0 mx-2 text-left">{contact.gmap}</p>
                                </div>
                                <div className="mb-4">
                                    <h6 className="-mt-2 mx-2 text-left font-semibold">Số điện thoại</h6>
                                    <p className="mb-1 mx-2 text-left">
                                        <i className="fa-solid fa-phone mr-2"></i>
                                        {contact.pn1}
                                    </p>
                                    <p className="mb-1 mx-2 text-left">
                                        <i className="fa-solid fa-phone mr-2"></i>
                                        {contact.pn2}
                                    </p>
                                </div>
                                <div className="mb-4">
                                    <h6 className="-mt-2 mx-2 text-left font-semibold">E-mail</h6>
                                    <p className="mb-0 mx-2 text-left">{contact.email}</p>
                                </div>
                            </div>
                            <div className="lg:w-1/2 pr-4 pl-4">
                                <div className="mb-4">
                                    <h6 className="-mt-2 mx-2 text-left font-semibold">Địa chỉ mạng xã hội</h6>
                                    <p className="mb-0 mx-2 text-left">
                                        <i className="fa-brands fa-twitter mr-2"></i>
                                        {contact.tw}
                                    </p>
                                    <p className="mb-0 mx-2 text-left">
                                        <i className="fa-brands fa-facebook mr-2"></i>
                                        {contact.fb}
                                    </p>
                                    <p className="mb-0 mx-2 text-left">
                                        <i className="fa-brands fa-instagram mr-2"></i>
                                        {contact.insta}
                                    </p>
                                </div>
                                <div className="mb-4">
                                    <h6 className="-mt-2 mx-2 text-left font-semibold">jFrame</h6>
                                    <iframe className="w-full rounded mb-4" height="200px" title="bản đồ" src={contact.jframe} loading="lazy"></iframe>
                                </div>
                            </div>
                        </div>
                        ))}
                    </div>
                </div>
            </div>

              {/* cài đặt hình ảnh của phòng */}
            {isOpenModalSettings && (
            <div className="w-full bg-black bg-opacity-25 inset-0 backdrop-blur-sm fixed overflow-y-auto flex items-center">
                <div className="bg-white modal w-[70%] mx-auto h-[95%] rounded-sm" id="room-images" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
                    
                </div>
            </div>
            )}

        </div>
    );
}
export default Settings;