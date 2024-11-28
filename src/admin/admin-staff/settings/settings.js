import HeaderAdmin from "../header-admin/header-admin";
import React, { useEffect, useState } from 'react';
import { fetchSettings } from "../../../component/api/settings";
import { getAllInfoContact } from "../../../component/api/contact";
import { toast } from 'react-toastify';
import Modal from "react-modal";
import config from "../../../component/config.json";

const { SERVER_API } = config;

Modal.setAppElement("#root"); // Thiết lập phần tử gốc cho modal

const settingValue = [
    {
        site_title: "",
        site_about: ""
    },
];

const contactsValue = [
    {
        address: "",
        map_link: "",
        phone1: "",
        phone2: "",
        email: "",
        fb: "",
        tw: "",
        insta: "",
        jframe: ""
    },
];

function Settings() {

    const [infoContact, setInfoContact] = useState([]);
    const [infoSettings, setInfoSettings] = useState([]);
    const [isOpenModalSettings, setIsOpenModalSettings] = useState(false);
    const [formSettingValue, setFormSettingValue] = useState(settingValue);
    const [isOpenModalContacts, setIsOpenModalContacts] = useState(false);
    const [formContactsValue, setFormContactValue] = useState(contactsValue);

    const handleChange = (event) => {
        const { value, name } = event.target;
        setFormSettingValue({
            ...formSettingValue,
            [name]: value,
        });
    };

    const clickModalSettings = () => {
        setIsOpenModalSettings(!isOpenModalSettings);
        if (infoSettings.length > 0) {
            setFormSettingValue({
                site_title: infoSettings[0].site_title,
                site_about: infoSettings[0].site_about
            });
        }
    };

    const handleContactChange = (event) => {
        const { value, name } = event.target;
        setFormContactValue({
            ...formContactsValue,
            [name]: value,
        });
    };

    const clickModalContacts = () => {
        setIsOpenModalContacts(!isOpenModalContacts);
        if (infoContact.length > 0) {
            setFormContactValue({
                address: infoContact[0].address,
                map_link: infoContact[0].gmap,
                phone1: infoContact[0].pn1,
                phone2: infoContact[0].pn2,
                email: infoContact[0].email,
                fb: infoContact[0].fb,
                tw: infoContact[0].tw,
                insta: infoContact[0].insta,
                jframe: infoContact[0].jframe
            });
        }
    };


    useEffect(() => {
        // Hàm để gọi API và cập nhật state
        const fetchData = async () => {
            try {

                const contactsResponse = await getAllInfoContact();
                const contactsData = contactsResponse.data;
                console.log(contactsData);
                // Nếu API trả về mảng, hãy lấy phần tử đầu tiên
                if (Array.isArray(contactsData) && contactsData.length > 0) {
                    setInfoContact([contactsData[0]]);
                } else {
                    setInfoContact(null); // Xử lý nếu không có dữ liệu hợp lệ
                }

                const settingResponse = await fetchSettings();
                const settingData = settingResponse.data;
                // Nếu API trả về mảng, hãy lấy phần tử đầu tiên
                if (Array.isArray(settingData) && settingData.length > 0) {
                    setInfoSettings([settingData[0]]);
                } else {
                    setInfoSettings(null); // Xử lý nếu không có dữ liệu hợp lệ
                }

            } catch (err) {
                // console.error('Error fetching data:', err);
                // setError(err);
            }
        };

        fetchData();
    }, []); // Chạy một lần khi component được mount

    // update general setting
    const updateGeneralSetting = () => {
        console.log(formSettingValue.site_title, formSettingValue.site_about)
        fetch(`${SERVER_API}/admin/update_settings.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title_web: formSettingValue.site_title,
                about_web: formSettingValue.site_about
            }),
        })
            .then(response => response.json())
            .then(data => {
                // console.log('Đang gửi dữ liệu:', { room_id: roomId, image_id: imageId });
                if (data.status === 'success') {
                    toast.success(data.message);
                     // Cập nhật trực tiếp vào state infoSettings
                    setInfoSettings([
                        {
                            site_title: formSettingValue.site_title,
                            site_about: formSettingValue.site_about,
                        }
                    ]);
                } else if (data.status === 'error') {
                    toast.error(data.message);
                }
            })
            .catch(error => {
                toast.error('lỗi.');
                console.log(error);
            });

    };

    // update contacts setting
    const updateContactSetting = () => {
        console.log(formContactsValue);
        fetch(`${SERVER_API}/admin/update_contacts.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                address: formContactsValue.address,
                map_link: formContactsValue.map_link,
                phone1: formContactsValue.phone1,
                phone2: formContactsValue.phone2,
                email: formContactsValue.email,
                fb: formContactsValue.fb,
                tw: formContactsValue.tw,
                insta: formContactsValue.insta,
                jframe: formContactsValue.jframe,
            }),
        })
            .then(response => response.json())
            .then(data => {
                // console.log('Đang gửi dữ liệu:', { room_id: roomId, image_id: imageId });
                if (data.status === 'success') {
                    toast.success(data.message);
                     // Cập nhật trực tiếp vào state infoSettings
                     setInfoContact([
                        {
                            address: formContactsValue.address,
                            gmap: formContactsValue.map_link,
                            pn1: formContactsValue.phone1,
                            pn2: formContactsValue.phone2,
                            email: formContactsValue.email,
                            fb: formContactsValue.fb,
                            tw: formContactsValue.tw,
                            insta: formContactsValue.insta,
                            jframe: formContactsValue.jframe
                        }
                    ]);
                } else if (data.status === 'error') {
                    toast.error(data.message);
                }
            })
            .catch(error => {
                toast.error('lỗi.');
                console.log(error);
            });

    };


    return (
        <div className="bg-gray-100 w-full">
            <HeaderAdmin />

            <div className="container mx-auto h-[600px] sm:px-4 w-[80%] -mt-[650px] float-right overflow-auto">
                <h3 className="mb-4 text-left font-semibold text-2xl uppercase">Cài đặt</h3>
                {/* general settings section */}
                <div className="relative flex flex-col min-w-0 rounded break-words border bg-white border-1 border-gray-300 shadow mb-4">
                    <div className="flex-auto p-2">
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
                        {infoSettings.map((setting) => (
                            <div key={setting.sr_no}>
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
                </div>

                <div className="relative flex flex-col min-w-0 rounded break-words border bg-white border-1 border-gray-300 shadow mb-4">
                    <div className="flex-auto p-2">
                        <div className="flex align-item-center justify-between mb-3">
                            <h5 className="mb-3 font-medium text-xl mx-2">Thông tin liên hệ</h5>
                            <button
                                type="button"
                                className="inline-block align-middle text-center select-none border font-normal whitespace-no-wrap rounded  no-underline bg-gray-900 text-white hover:bg-gray-900 shadow-none py-1 px-2 leading-tight text-xs "
                                onClick={clickModalContacts}
                            >
                                <i className="bi bi-pencil-square" /> Chỉnh sửa
                            </button>
                        </div>
                        {infoContact.map((contact) => (
                            <div className="flex flex-wrap" key={contact.sr_no}>
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

            {/* model general setting */}
            <Modal
                isOpen={isOpenModalSettings}
                onRequestClose={() => setIsOpenModalSettings(false)}
                className="modal"
                overlayClassName="modal-overlay"
            >

                <div className="bg-white w-full mx-auto h-[50%] rounded-[5px]">
                    <div className="text-left font-medium text-xl mb-4 mt-2">Cài đặt chung</div>
                    <div className="w-full h-[1px] bg-gray-300 rounded-md"></div>
                        <div>
                            <div className="text-left mx-2 mt-4 mb-3 font-medium">Tiêu đề web</div>
                            <div>
                                <input
                                    type="text"
                                    name="site_title"
                                    value={formSettingValue.site_title}
                                    onChange={handleChange}
                                    className="border-[1px] outline-none border-gray-200 w-full px-2 py-[3px] rounded-[3px] focus:border-[#7dacf1]"
                                />
                            </div>
                            <div className="text-left mx-2 mt-4 mb-3 font-medium">Giới thiệu</div>
                            <div>
                                <textarea
                                    type="text"
                                    name="site_about"
                                    value={formSettingValue.site_about}
                                    onChange={handleChange}
                                    className="border-[1px] outline-none border-gray-200 h-[100px] w-full px-2 py-[3px] rounded-[3px] focus:border-[#7dacf1]"
                                />
                            </div>
                        </div>
                    <div className="flex gap-3 justify-center mt-3">
                        <div className="">
                            <button type="button" onClick={() => setIsOpenModalSettings(false)} className="bg-slate-200 px-2 py-[2px] rounded-[5px] w-[100px] font-medium">
                                Hủy
                            </button>
                        </div>
                        <div>
                            <button type="button" onClick={(event) => updateGeneralSetting(event)} className="bg-[#2ec1ac] text-white px-2 py-[2px] rounded-[5px] w-[100px] font-medium">
                                Cập nhật
                            </button>
                        </div>
                    </div>
                </div>

            </Modal>

            {/* modal contact settings */}
            <Modal
                isOpen={isOpenModalContacts}
                onRequestClose={() => setIsOpenModalContacts(false)}
                className="modal "
                overlayClassName="modal-overlay"
                style={{
                    content: {
                        width: '80%',
                        maxWidth: '800px',
                        height: '80%',
                        maxHeight: '600px',
                        padding: '20px',
                        borderRadius: '8px',
                    },
                }}
            >

                <div className="bg-white w-full mx-auto h-[50%] rounded-[5px]">
                    <div className="text-left font-medium text-xl mb-4 mt-2">Thông tin liên hệ</div>
                    <div className="w-full h-[1px] bg-gray-300 rounded-md"></div>
    
                        <div className="flex gap-5">
                            <div className="w-[50%]">
                                <div>
                                    <div className="text-left mt-4 mb-3 font-medium">Địa chỉ</div>
                                    <div>
                                        <input
                                            type="text"
                                            name="address"
                                            value={formContactsValue.address}
                                            onChange={handleContactChange}
                                            className="border-[1px] outline-none border-gray-200 w-full px-2 py-[3px] rounded-[3px] focus:border-[#7dacf1]"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="text-left mt-4 mb-3 font-medium">Google map link</div>
                                    <div>
                                        <input
                                            type="text"
                                            name="map_link"
                                            value={formContactsValue.map_link}
                                            onChange={handleContactChange}
                                            className="border-[1px] outline-none border-gray-200 w-full px-2 py-[3px] rounded-[3px] focus:border-[#7dacf1]"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="text-left mt-4 mb-3 font-medium">Số điện thoại</div>
                                    <div>
                                        <input
                                            type="text"
                                            name="phone1"
                                            value={formContactsValue.phone1}
                                            onChange={handleContactChange}
                                            className="border-[1px] outline-none border-gray-200 w-full px-2 py-[3px] rounded-[3px] focus:border-[#7dacf1]"
                                        />
                                    </div>
                                    <div className="mt-3">
                                        <input
                                            type="text"
                                            name="phone2"
                                            value={formContactsValue.phone2}
                                            onChange={handleContactChange}
                                            className="border-[1px] outline-none border-gray-200 w-full px-2 py-[3px] rounded-[3px] focus:border-[#7dacf1]"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="text-left mt-4 mb-3 font-medium">Email</div>
                                    <div>
                                        <input
                                            type="text"
                                            name="email"
                                            value={formContactsValue.email}
                                            onChange={handleContactChange}
                                            className="border-[1px] outline-none border-gray-200 w-full px-2 py-[3px] rounded-[3px] focus:border-[#7dacf1]"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="w-[50%]">
                                <div>
                                    <div className="text-left mt-4 mb-3 font-medium">Mạng xã hội</div>
                                    <div className="flex">
                                        <div className="w-[10%] bg-gray-200 flex items-center justify-center rounded-tl-[3px] rounded-bl-[3px] border-[1px] border-gray-200">
                                            <span>
                                                <i className="fa-brands fa-facebook"></i>
                                            </span>
                                        </div>
                                       
                                        <input
                                            type="text"
                                            name="fb"
                                            value={formContactsValue.fb}
                                            onChange={handleContactChange}
                                            className="w-[90%] border-[1px] outline-none border-gray-200 px-2 py-[3px] rounded-tr-[3px] rounded-br-[3px] focus:border-[#7dacf1]"
                                        />
                                    </div>
                                    <div className="flex mt-3">
                                        <div className="w-[10%] bg-gray-200 flex items-center justify-center rounded-tl-[3px] rounded-bl-[3px] border-[1px] border-gray-200">
                                            <span>
                                                <i className="fa-brands fa-instagram"></i>
                                            </span>
                                        </div>
                                       
                                        <input
                                            type="text"
                                            name="insta"
                                            value={formContactsValue.insta}
                                            onChange={handleContactChange}
                                            className="w-[90%] border-[1px] outline-none border-gray-200 px-2 py-[3px] rounded-tr-[3px] rounded-br-[3px] focus:border-[#7dacf1]"
                                        />
                                    </div>
                                    <div className="flex mt-3">
                                        <div className="w-[10%] bg-gray-200 flex items-center justify-center rounded-tl-[3px] rounded-bl-[3px] border-[1px] border-gray-200">
                                            <span>
                                                <i className="fa-brands fa-twitter"></i>
                                            </span>
                                        </div>
                                       
                                        <input
                                            type="text"
                                            name="tw"
                                            value={formContactsValue.tw}
                                            onChange={handleContactChange}
                                            className="w-[90%] border-[1px] outline-none border-gray-200 px-2 py-[3px] rounded-tr-[3px] rounded-br-[3px] focus:border-[#7dacf1]"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="text-left mt-4 mb-3 font-medium">Jframe src</div>
                                    <div>
                                        <input
                                            type="text"
                                            name="jframe"
                                            value={formContactsValue.jframe}
                                            onChange={handleContactChange}
                                            className="border-[1px] outline-none border-gray-200 w-full px-2 py-[3px] rounded-[3px] focus:border-[#7dacf1]"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                   
                    <div className="w-full h-[1px] bg-gray-200 mt-5 rounded-md"></div>
                    <div className="flex gap-3 justify-center mt-3">
                        <div className="">
                            <button type="button" onClick={() => setIsOpenModalContacts(false)} className="bg-slate-200 px-2 py-[2px] rounded-[5px] w-[100px] font-medium">
                                Hủy
                            </button>
                        </div>
                        <div>
                            <button type="button" onClick={(event) => updateContactSetting(event)} className="bg-[#2ec1ac] text-white px-2 py-[2px] rounded-[5px] w-[100px] font-medium">
                                Cập nhật
                            </button>
                        </div>
                    </div>
                </div>

            </Modal>

        </div>
    );
}
export default Settings;