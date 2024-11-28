import Header from "../header";
import Footer from "../footer/footer";
import { toast } from 'react-toastify';
import React, { useEffect, useState } from 'react';
import { getUsersData } from "../api/user";
import config from "../../component/config.json";


const { SERVER_API } = config;

const userValue =
{
    name: "",
    phone: "",
    dob: "",
    address: "",
    image: "",
};

const passValue =
{
    pass: "",
    rt_pass: ""
};

const imageValue =
{
    image: null,

};


function Profile() {

    const [infoUser, setInfoUser] = useState([]);
    const [formUserValue, setFormUserValue] = useState(userValue);
    const [formPassValue, setFormPassValue] = useState(passValue);
    const [formImageValue, setFormImageValue] = useState(imageValue);


    /* eslint-disable react-hooks/exhaustive-deps */
    useEffect(() => {
        // Hàm để gọi API và cập nhật state
        const fetchData = async () => {
            const userData = localStorage.getItem('user');

            const user = JSON.parse(userData);
            console.log("User ID:", user.id); // Lấy ID người dùng 
            try {

                const userResponse = await getUsersData(user.id);
                const userData = userResponse.data;
                setInfoUser(userData);

                // Nếu API trả về mảng, hãy lấy phần tử đầu tiên
                if (userData.length > 0) {
                    console.log(userData);
                    setFormUserValue({
                        name: userData[0].nametk,
                        phone: userData[0].phone,
                        dob: userData[0].dob,
                        address: userData[0].address,
                        image: userData[0].profile,
                    });
                } else {
                    setFormUserValue(formUserValue); // Xử lý nếu không có dữ liệu hợp lệ
                    console.log(userData);
                }

            } catch (err) {
                // console.error('Error fetching data:', err);
                // setError(err);
            }
        };

        fetchData();
    }, []); // Chạy một lần khi component được mount

    const handleUserChange = (event) => {
        const { value, name } = event.target;
        setFormUserValue((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // update user setting
    const updateUserSetting = () => {
        const userData = localStorage.getItem('user');
        const user = JSON.parse(userData);
        console.log(formUserValue.dob);
        fetch(`${SERVER_API}/update_info_user.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: user.id,
                name: formUserValue.name,
                phone: formUserValue.phone,
                dob: formUserValue.dob,
                address: formUserValue.address
            }),
        })
            .then(response => response.json())
            .then(data => {
                // console.log('Đang gửi dữ liệu:', { room_id: roomId, image_id: imageId });
                if (data.status === 'success') {
                    toast.success(data.message);
                    // Cập nhật trực tiếp vào state infoSettings
                    //  setFormUserValue(
                    //     {
                    //         name: formUserValue.name,
                    //         phone: formUserValue.phone,
                    //         dob: formUserValue.dob,
                    //         address: formUserValue.address
                    //     }
                    // );
                } else if (data.status === 'error') {
                    toast.error(data.message);
                    setFormUserValue(infoUser);
                }
            })
            .catch(error => {
                toast.error('lỗi.');
                console.log(error);
                setFormUserValue(infoUser);
            });
    };

    const handlePassChange = (event) => {
        const { value, name } = event.target;
        setFormPassValue((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // update password
    const updateUserPassword = () => {
        const userData = localStorage.getItem('user');
        const user = JSON.parse(userData);
        console.log(formPassValue.pass);
        fetch(`${SERVER_API}/update_info_user.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: user.id,
                pass: formPassValue.pass,
                rt_pass: formPassValue.rt_pass,
            }),
        })
            .then(response => response.json())
            .then(data => {
                // console.log('Đang gửi dữ liệu:', { room_id: roomId, image_id: imageId });
                if (data.status === 'success') {
                    toast.success(data.message);
                    setFormPassValue(passValue);
                } else if (data.status === 'warning') {
                    toast.error(data.message);
                } else if (data.status === 'error') {
                    toast.error(data.message);
                    setFormPassValue(passValue);
                }
            })
            .catch(error => {
                toast.error('lỗi.');
                console.log(error);
            });
    };

    const handleImageChange = (e) => {
        setFormImageValue({ ...formImageValue, image: e.target.files[0] });
    };

    // update user image
    // const updateUserImage = async (event) => {
    //     event.preventDefault();
    //     console.log(formImageValue.image);
    //     try {
    //         const userData = localStorage.getItem('user');
    //         const user = JSON.parse(userData);

    //         const formData = new FormData();
    //         formData.append('user_id', user.id);
    //         formData.append('image', formImageValue.image);

    //         const response = await fetch(`${SERVER_API}/update_user_image.php`, {
    //             method: 'POST',
    //             body: formData,
    //         });
    //         console.log(formData);
    //         const data = await response.json();

    //         if (data.status === 'success') {
    //             toast.success(data.message);

    //             // Lấy lại dữ liệu mới
    //             const imageResponse = await getUsersData(user.id);
    //             const imageData = imageResponse.data;

    //             // Cập nhật state
    //             setFormUserValue({
    //                 image: imageData[0].profile,
    //             });
    //         } else if (data.status === 'warning') {
    //             toast.error(data.message);
    //         } else if (data.status === 'error') {
    //             toast.error(data.message);
    //         }
    //     } catch (error) {
    //         toast.error('Lỗi.');
    //         console.error(error);
    //     }
    // };

    const updateUserImage = async (event) => {
        event.preventDefault();
        //console.log("formValue", formValue);

        const userData = localStorage.getItem('user');
        const user = JSON.parse(userData);

            const formData = new FormData();
            formData.append('user_id', user.id);
            formData.append('image', formImageValue.image);

            const response = await fetch(`${SERVER_API}/update_user_image.php`, {
                method: 'POST',
                body: formData
            });

            // Kiểm tra phản hồi từ máy chủ
            const text = await response.text();
            try {
                const data = JSON.parse(text);
                if (data.status === 'success') {
                    toast.success(data.message);

                    // Lấy lại dữ liệu mới
                    const imageResponse = await getUsersData(user.id);
                    const imageData = imageResponse.data;

                    // Cập nhật state
                    setFormUserValue({
                        image: imageData[0].profile,
                    });

                    setFormPassValue(passValue);

                } else if (data.status === 'warning') {
                    toast.error(data.message);
                } else if (data.status === 'error') {
                    toast.error(data.message);
                }
            } catch (error) {
                console.error('Phản hồi không phải là JSON hợp lệ:', text);
                toast.error(error);
            }
       
    };

        return (
            <div className="bg-gray-100">
                <Header />

                <div className="min-h-screen w-[90%] mx-auto">
                    <div className="text-left font-semibold text-3xl uppercase pt-[130px] pb-5">Thông tin người dùng</div>
                    <div className="bg-white shadow-sm rounded-[5px]">
                        <div className="text-left mx-3 text-xl font-semibold pt-6 pb-4">Thông tin cơ bản</div>
                        <div>
                            <div className="flex mb-4">
                                <div className="text-left mx-3 w-1/3">
                                    <div className="mb-2 tracking-wide">Tên</div>
                                    <div>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formUserValue.name}
                                            onChange={handleUserChange}
                                            className="border-[1px] outline-none border-gray-200 w-full px-2 py-[5px] rounded-[3px] focus:border-[#7dacf1]"
                                        />
                                    </div>
                                </div>
                                <div className="text-left mx-3 w-1/3">
                                    <div className="mb-2 tracking-wide">Số điện thoại</div>
                                    <div>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formUserValue.phone}
                                            onChange={handleUserChange}
                                            className="border-[1px] outline-none border-gray-200 w-full px-2 py-[5px] rounded-[3px] focus:border-[#7dacf1]"
                                        />
                                    </div>
                                </div>
                                <div className="text-left mx-3 w-1/3">
                                    <div className="mb-2 tracking-wide">Ngày sinh</div>
                                    <div>
                                        <input
                                            type="date"
                                            name="dob"
                                            value={formUserValue.dob}
                                            onChange={handleUserChange}
                                            className="border-[1px] outline-none border-gray-200 w-full px-2 py-[5px] rounded-[3px] focus:border-[#7dacf1]"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="mx-3 text-left w-2/3 pb-7">
                                <div className="mb-2 tracking-wide">Địa chỉ</div>
                                <div>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formUserValue.address}
                                        onChange={handleUserChange}
                                        className="border-[1px] outline-none border-gray-200 w-full px-2 py-[5px] rounded-[3px] focus:border-[#7dacf1]"
                                    />
                                </div>
                            </div>
                            <div className="text-left mx-3 pb-5">
                                <button type="button" onClick={(event) => updateUserSetting(event)} className="bg-[#2ec1ac] text-white px-2 py-[4px] rounded-[3px] w-[100px] font-medium">
                                    Cập nhật
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="my-10 flex gap-x-3">
                        <div className="bg-white w-[30%] shadow-sm rounded-[5px]">
                            <div className="text-left mx-3 text-xl font-semibold pt-6 pb-4">Ảnh đại diện</div>
                            <div className="flex justify-center">
                                <img src={`http://localhost:88/api_travel/api/Images/user/${formUserValue.image}`} className='w-[200px] h-[200px] rounded-full object-cover' alt="" />
                            </div>
                            <div className="w-[90%] mx-auto my-5">
                                <input
                                    type="file"
                                    name="image"
                                    onChange={handleImageChange}
                                    className="border-[1px] outline-none border-gray-200 w-full px-2 py-[5px] rounded-[3px] focus:border-[#7dacf1]"
                                />
                            </div>
                            <div className="text-left mx-3 pb-5">
                                <button type="button" onClick={(event) => updateUserImage(event)} className="bg-[#2ec1ac] text-white px-2 py-[4px] rounded-[3px] w-[100px] font-medium">
                                    Cập nhật
                                </button>
                            </div>
                        </div>
                        <div className="w-[70%]">
                            <div className="bg-white shadow-sm rounded-[5px]">
                                <div className="text-left mx-3 text-xl font-semibold pt-6 pb-4">Mật khẩu</div>
                                <div className="flex">
                                    <div className="mx-3 text-left w-1/2 pb-7">
                                        <div className="mb-2 tracking-wide">Mật khẩu mới</div>
                                        <div>
                                            <input
                                                type="password"
                                                name="pass"
                                                value={formPassValue.pass}
                                                onChange={handlePassChange}
                                                className="border-[1px] outline-none border-gray-200 w-full px-2 py-[5px] rounded-[3px] focus:border-[#7dacf1]"
                                            />
                                        </div>
                                    </div>
                                    <div className="mx-3 text-left w-1/2 pb-7">
                                        <div className="mb-2 tracking-wide">Nhập lại mật khẩu mới</div>
                                        <div>
                                            <input
                                                type="password"
                                                name="rt_pass"
                                                value={formPassValue.rt_pass}
                                                onChange={handlePassChange}
                                                className="border-[1px] outline-none border-gray-200 w-full px-2 py-[5px] rounded-[3px] focus:border-[#7dacf1]"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="text-left mx-3 pb-5">
                                    <button type="button" onClick={(event) => updateUserPassword(event)} className="bg-[#2ec1ac] text-white px-2 py-[4px] rounded-[3px] w-[100px] font-medium">
                                        Cập nhật
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Footer />
            </div>
        );
    }
    export default Profile;