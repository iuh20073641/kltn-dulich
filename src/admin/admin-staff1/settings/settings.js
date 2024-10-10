import HeaderAdmin from "../header-admin/header-admin";
import React, { useEffect, useState } from 'react';

import { getAllInfoContact } from "../../../component/api/contact";

function Settings(){

    const [infoContact, setInfoContact] = useState([]);

    useEffect(() => {
        // Hàm để gọi API và cập nhật state
        const fetchData = async () => {
            try {
                // Gọi API để lấy danh sách thông tin công ty
                const roomsResponse = await getAllInfoContact();
                const roomsData = roomsResponse.data; // Giả sử API trả về mảng các thông tin công ty
                setInfoContact(roomsData);

            } catch (err) {
                // console.error('Error fetching data:', err);
                // setError(err);
            }
        };

        fetchData();
    }, []); // Chạy một lần khi component được mount

    return(
        <div className="bg-gray-100 w-full">
            <HeaderAdmin /> 
            
            <div className="container mx-auto h-screen sm:px-4 w-[80%] -mt-[650px] float-right overflow-y-auto">
                <h3 className="mb-4 text-left font-semibold text-2xl">SETTINGS</h3>
                {/* general settings section */}
                <div className="relative flex flex-col min-w-0 rounded break-words border bg-white border-1 border-gray-300 shadow mb-4">
                    <div className="flex-auto p-2">
                        <div className="flex align-item-center justify-between mb-3">
                            <h5 className="mb-3 font-medium text-xl mx-2">General Settings</h5>
                            <button
                                type="button"
                                className="inline-block align-middle text-center select-none border font-normal whitespace-no-wrap rounded  no-underline bg-gray-900 text-white hover:bg-gray-900 shadow-none py-1 px-2 leading-tight text-xs "
                                data-bs-toggle="modal"
                                data-bs-target="#general-s"
                            >
                                <i className="bi bi-pencil-square" /> Edit
                            </button>
                        </div>
                        <h6 className="-mt-2 mx-2 text-left font-semibold">Site Title</h6>
                        {/* <p className="mb-0" id="site_title" /> */}
                        <p className="text-left mx-2">Venture</p>
                        <h6 className="mt-2 mx-2 text-left font-semibold">About us</h6>
                        {/* <p className="mb-0" id="site_about" /> */}
                        <p className="text-left mx-2">
                            Venture  Top choice when booking hotels online
                            As the leading hotel booking agency in Southeast Asia, since its launch, all you need to do is three steps: search, book a hotel room and pay. Venture took care of everything else.
                        </p>
                    </div>
                </div> 

                <div className="relative flex flex-col min-w-0 rounded break-words border bg-white border-1 border-gray-300 shadow mb-4">
                    <div className="flex-auto p-2">
                        <div className="flex align-item-center justify-between mb-3">
                            <h5 className="mb-3 font-medium text-xl mx-2">Contacts Settings</h5>
                            <button
                                type="button"
                                className="inline-block align-middle text-center select-none border font-normal whitespace-no-wrap rounded  no-underline bg-gray-900 text-white hover:bg-gray-900 shadow-none py-1 px-2 leading-tight text-xs "
                                data-bs-toggle="modal"
                                data-bs-target="#contacts-s"
                            >
                                <i className="bi bi-pencil-square" /> Edit
                            </button>
                        </div>
                        {infoContact.map((contact) => (
                        <div className="flex flex-wrap ">
                            <div className="lg:w-1/2">
                                <div className="mb-4">
                                    <h6 className="-mt-2 mx-2 text-left font-semibold">Address</h6>
                                    <p className="mb-0 mx-2 text-left">{contact.address}</p>
                                </div>
                                <div className="mb-4">
                                    <h6 className="-mt-2 mx-2 text-left font-semibold">Google Map</h6>
                                    <p className="mb-0 mx-2 text-left">{contact.gmap}</p>
                                </div>
                                <div className="mb-4">
                                    <h6 className="-mt-2 mx-2 text-left font-semibold">Phones Numbers</h6>
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
                                    <h6 className="-mt-2 mx-2 text-left font-semibold">Social Links</h6>
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
        </div>
    );
}
export default Settings;