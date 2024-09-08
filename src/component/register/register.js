import './register.css';
import { Link } from 'react-router-dom';
import React, { useState } from 'react';
// import axios from 'axios';
// import config from "../config.json";
import { checkUser } from '../api/user';
import { register } from '../api/user';

import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const initFormValue = {
    name: "",
    mail: "",
    phone: "",
    image: null,
    address: "",
    birthDate: "",
    pass: "",
    rePass: "",
};

// const { SERVER_API } = config;

function Register(){

    // Sử dụng state để quản lý trạng thái của các nút
    const [isButtonBasic, setIsButtonBasic] = useState(true);
    const [isButtonBusines, setIsButtonBusines] = useState(false);
    
    const [formValue, setFormValue] = useState(initFormValue)
    const [message, setMessage] = useState('');
    const navigate = useNavigate(); // Khai báo hook useNavigate
    // const [userCheck, setUserCheck] = useState('');
    // const [ setIsEmpty] = useState(false);
    const handleChange = (event) => {
        const { value, name } = event.target;
        setFormValue({
            ...formValue,
            [name]: value,
        });
    };

    // Hàm xử lý thay đổi cho ô tải lên hình ảnh
    const handleImageChange = (e) => {
        setFormValue({ ...formValue, image: e.target.files[0] });
    };

    // const formData = new FormData();
    //     formData.append('name', formValue.name);
    //     formData.append('mail', formValue.mail);
    //     formData.append('phone', formValue.phone);
    //     formData.append('address', formValue.address);
    //     formData.append('birthDate', formValue.birthDate);
    //     formData.append('pass', formValue.pass);
    //     // formData.append('rePass', formValue.rePass);
    // if (formValue.image) {
    //     formData.append('imageName', formValue.image.name);
    // }

    const hendleSubmit = async (event) => {
        event.preventDefault(); //để không tự động reset
        console.log("formValue", formValue);
        try {
            // Gọi API để kiểm tra tài khoản user
            const userResponse = await checkUser(formValue.mail, formValue.phone);
            const userData = userResponse.data; // Giả sử API trả về mảng các user
            if ( userData.length > 0) {
                // setIsEmpty(false);
                // console.log("formUser",userData)
                toast.error('Tài khoản đã tồn tại!');
            } else {
                // setIsEmpty(true);
                // const response = await axios.post(`${SERVER_API}/register.php?name=${formValue.name}&mail=${formValue.mail}&phone=${formValue.phone}&image=${formValue.image.name}&address=${formValue.address}&birthDate=${formValue.birthDate}&pass=${formValue.pass}`);
                const response = await register(formValue.name, formValue.mail, formValue.phone, formValue.image.name, formValue.address, formValue.birthDate, formValue.pass);
                setMessage(response.data.message);
                toast.success('Tạo tài khoản thành công');
                // Chuyển hướng đến trang đăng nhập
                navigate('/login');
            }
          } catch (error) {
            setMessage('Registration failed');
            console.error('There was an error!', error);
          }
    };

    const handleBasicClick = () => {
        setIsButtonBasic(true);
        setIsButtonBusines(false);

        // // Khởi tạo state cho màu chữ
        // const [isRed, setIsRed] = useState(false);

        // // Hàm để thay đổi màu chữ
        // const toggleColor = () => {
        //     setIsRed(!isRed);
        // }
    };

    const handleBusinessClick = () => {
        setIsButtonBasic(false);
        setIsButtonBusines(true);

        // // Khởi tạo state cho màu chữ
        // const [isRed, setIsRed] = useState(false);

        // // Hàm để thay đổi màu chữ
        // const toggleColor = () => {
        //     setIsRed(!isRed);
        // }
    };

    

    return(
        <div className="travel-login min-h-screen bg-center bg-no-repeat bg-cover">
            <div className='text-left mx-7 py-5 font-semibold text-3xl'>
                <Link to={"/"}>TravelVN.</Link> 
            </div>
            <div className='signin w-[95%] mx-auto bg-slate-50 rounded-2xl'>
                <div className='text-3xl font-semibold text-left pb-7 pt-14 px-16'>
                    Sign Up
                </div>
                <div className='flex ml-16'>
                    <div className='basis-2/5'>
                        <div className='flex mb-7'>
                            <div className='mx-3'>
                                <button id='login-basis' onClick={handleBasicClick} 
                                className={isButtonBasic ? 'active' : ''}>
                                    <p>Basic</p>
                                </button>
                            </div>
                            <div className='mx-3'>
                                <button id='login-business' onClick={handleBusinessClick} 
                                className={isButtonBusines ? 'active' : ''}>
                                    <p >Business</p>
                                </button>
                            </div>
                        </div>

                        <form id='basis-form' onSubmit={hendleSubmit} className={isButtonBasic ? '' : 'hidden'}>
                            <div className='flex gap-5'>
                                    
                                <div className='border-[1px] border-gray-300 mb-6 w-[240px] h-10 rounded-md '>
                                    <input type='text' placeholder='Name' name='name' value={formValue.name} onChange={handleChange} className='w-[200px] bg-slate-50 mt-2 outline-none' required></input>
                                </div>

                                <div className='border-[1px] border-gray-300 mb-6 w-[240px] h-10 rounded-md '>
                                    <input type='text' placeholder='Email Address' name='mail' value={formValue.mail} onChange={handleChange} className='bg-slate-50 w-[200px] mt-2 outline-none' required></input>
                                </div>
                            </div>

                            <div className='flex gap-5'>
                                    
                                <div className='border-[1px] border-gray-300 mb-6 w-[240px] h-10 rounded-md '>
                                    <input type='text' placeholder='Phone' name='phone' value={formValue.phone} onChange={handleChange} className='w-[200px] bg-slate-50 mt-2 outline-none' required></input>
                                </div>

                                <div className='mb-6 w-[240px] h-10 '>
                                    {/* <input type='text' placeholder='Email Address' className='bg-slate-50 w-[200px] mt-2 outline-none'></input> */}
                                    <input type='file' name='image' onChange={handleImageChange} className='bg-slate-50 w-[200px] mt-2 outline-none' required></input>
                                </div>
                            </div>

                            <div className='border-[1px] border-gray-300 mb-6 w-[500px] h-10 rounded-md'>
                                <input type='text' name='address' placeholder='Address' value={formValue.address} onChange={handleChange} className='bg-slate-50 w-[450px] mt-2 outline-none' required></input>
                            </div>

                            <div className='border-[1px] border-gray-300 mb-6 w-[500px] h-10 rounded-md'>
                                <input type='date' name='birthDate' value={formValue.birthDate} onChange={handleChange} className='bg-slate-50 w-[450px] mt-2 outline-none' required></input>
                            </div>

                            <div className='flex gap-5'>
                                    
                                <div className='border-[1px] border-gray-300 mb-6 w-[240px] h-10 rounded-md '>
                                    <input type='text' name='pass' placeholder='Password' value={formValue.pass} onChange={handleChange} className='w-[200px] bg-slate-50 mt-2 outline-none' required></input>
                                </div>

                                <div className='border-[1px] border-gray-300 mb-6 w-[240px] h-10 rounded-md '>
                                    <input type='text' name='rePass' placeholder='Re-enter Password' value={formValue.rePass} onChange={handleChange} className='bg-slate-50 w-[200px] mt-2 outline-none' required></input>
                                </div>
                            </div>

                            <div className='bg-[#FFD000] mb-10 rounded-md'>
                                <button type='submit' className='py-3 font-semibold text-xl'><p>Creact a New Account</p></button>
                            </div>

                        </form>
                        {message && <p>{message}</p>}

                        <form id='business-form' className={isButtonBusines ? '' : 'hidden'}>
                            <div className='border-[1px] border-gray-300 mb-6 w-[400px] h-10 rounded-md '>
                                <input type='text' placeholder='Email Address' className='mt-2 -ml-36 outline-none'></input>
                            </div>

                            <div className='border-[1px] border-gray-300 mb-6 w-[400px] h-10 rounded-md '>
                                <input type='text' placeholder='Business Name' className='mt-2 -ml-36 outline-none'></input>
                            </div>

                            <div className='border-[1px] border-gray-300 mb-6 w-[400px] h-10 rounded-md'>
                                <input type='text' placeholder='Password' className='mt-2 -ml-36 outline-none'></input>
                            </div>

                            <div className='border-[1px] border-gray-300 mb-6 w-[400px] h-10 rounded-md'>
                                <input type='text' placeholder='Re-enter Password' className='mt-2 -ml-36 outline-none'></input>
                            </div>
                        </form>

                        {/* <div className='bg-[#FFD000] mb-10 rounded-md'>
                            <button type='submit' className='py-3 font-semibold text-xl'><p>Creact a New Account</p></button>
                        </div> */}

                        <div className='flex text-xs text-left text-gray-400 mb-14'>
                            <div className='mr-2'>
                                <input type='checkbox'></input>
                            </div>
                            <div>
                                <p>
                                    I'd like to recieve amazing exclusive deals from LY.COM.
                                </p>
                            </div>
                        </div>

                    </div>
                    <div className='basis-1/5'>
                        <div className='w-[2px] h-[300px] bg-gray-300 mx-auto' />
                    </div>
                    <div className='basis-2/5 text-left'>
                        <div className="text-xl font-semibold mx-2 mt-4 pb-4 tracking-wider">
                            Why they choose TravelVN?
                        </div>
                        <div className="flex flex-row items-center my-4">
                            <i className="fa-solid fa-money-bill-1-wave mx-3 text-[#F8BB00]"></i>
                            <p className="font-light">Good Price</p>
                        </div>
                        <div className="flex flex-row items-center my-4">
                            <i className="fa-solid fa-headphones mx-3 text-[#F8BB00]"></i>
                            <p className="font-light">Top-notch Services</p>
                        </div>
                        <div className="flex flex-row items-center my-4">
                            <i className="fa-solid fa-shield-halved mx-3 text-[#F8BB00]"></i>
                            <p className="font-light">Secure Payment</p>
                        </div>
                        <div className="flex flex-row items-center my-4">
                            <i className="fa-solid fa-user-group mx-3 text-[#F8BB00]"></i>
                            <p className="font-light">Trustworthy</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Register;