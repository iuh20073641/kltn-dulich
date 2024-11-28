import './login.css';
import { Link, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { login } from '../api/user'; // Import hàm login từ user.js

const initFormValue = {
    mailPhone: "",
    pass: ""
};

function Login() {
    const [isButtonBasic, setIsButtonBasic] = useState(true);
    const [isButtonBusines, setIsButtonBusines] = useState(false);

    const [formValue, setFormValue] = useState(initFormValue);
    const navigate = useNavigate(); 

    const handleChange = (event) => {
        const { value, name } = event.target;
        setFormValue({
            ...formValue,
            [name]: value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault(); 
        //console.log("formValue", formValue);
    
        try {
            // Gọi API đăng nhập
            const response = await login(formValue.mailPhone, formValue.pass);
            const userData = response.data;
            //console.log("Phản hồi từ API đăng nhập:", userData);
    
            // Kiểm tra nếu userData có tồn tại và có thuộc tính id
            if (userData && userData.id) {
                // Lưu thông tin người dùng vào localStorage
                localStorage.setItem('user', JSON.stringify(userData));
                toast.success('Đăng nhập thành công!');
                // navigate('/'); 
                // Lấy đường dẫn từ localStorage
                const redirectPath = localStorage.getItem('redirectPath') || '/';
                localStorage.removeItem('redirectPath'); // Xóa để tránh chuyển hướng không mong muốn
                navigate(redirectPath); // Chuyển hướng
            } else {
                toast.error('Tài khoản hoặc mật khẩu không đúng!');
            }
        } catch (error) {
            toast.error('Đăng nhập thất bại, vui lòng thử lại!');
            console.error('There was an error!', error);
        }
    };

    const handleBasicClick = () => {
        setIsButtonBasic(true);
        setIsButtonBusines(false);
    };

    // const handleBusinessClick = () => {
    //     setIsButtonBasic(false);
    //     setIsButtonBusines(true);
    // };

    return (
        <div className="travel-login min-h-screen bg-center bg-no-repeat bg-cover">
            <div className='text-left mx-7 py-5 font-semibold text-3xl'>
                <Link to={"/"}>TravelVN.</Link>
            </div>
            <div className='signin w-[95%] mx-auto bg-slate-50 rounded-2xl'>
                <div className='text-3xl font-semibold text-left pb-7 pt-14 px-16'>
                    Sign In
                </div>
                <div className='flex ml-16'>
                    <div className='basis-2/5'>
                        <div className='flex mb-7'>
                            <div className='mx-3'>
                                <button id='login-basis' onClick={handleBasicClick}
                                    className={isButtonBasic ? 'active' : ''}>
                                    <p>Customer</p>
                                </button>
                            </div>
                            <div className='mx-3'>
                                {/* <button id='login-business'> */}
                                    {/* className={isButtonBusines ? 'active' : ''} */}
                                    {/* <p>Business</p> */}
                                    <Link to={"/login-nv"}><p>Business</p></Link> 
                                {/* </button> */}
                            </div>
                        </div>

                        <form id='basis-form' onSubmit={handleSubmit} className={isButtonBasic ? '' : 'hidden'}>
                            <div className='border-[1px] border-gray-300 mb-6 w-[400px] h-10 rounded-md '>
                                <input 
                                    type='text' 
                                    placeholder='Email / Phone' 
                                    name='mailPhone' 
                                    value={formValue.mailPhone} 
                                    onChange={handleChange} 
                                    className='mt-2 outline-none w-[350px] bg-slate-50' 
                                    required 
                                    autoComplete="off"
                                />
                            </div>

                            <div className='border-[1px] border-gray-300 mb-6 w-[400px] h-10 rounded-md'>
                                <input 
                                    type='password' 
                                    placeholder='Password' 
                                    name='pass' 
                                    value={formValue.pass} 
                                    onChange={handleChange} 
                                    className='mt-2 outline-none w-[350px] bg-slate-50' 
                                    required 
                                    autoComplete="off"
                                />
                            </div>

                            <div className='bg-[#FFD000] mb-10 rounded-md'>
                                <button type='submit' className='py-3 font-semibold text-xl'><p>Sign In</p></button>
                            </div>
                        </form>

                        <form id='business-form' className={isButtonBusines ? '' : 'hidden'}>
                            <div className='border-[1px] border-gray-300 mb-6 w-[400px] h-10 rounded-md '>
                                <input type='text' placeholder='Email Address' className='mt-2 -ml-36 outline-none'></input>
                            </div>

                            <div className='border-[1px] border-gray-300 mb-6 w-[400px] h-10 rounded-md'>
                                <input type='text' placeholder='Password' className='mt-2 -ml-36 outline-none'></input>
                            </div>

                            <div className='border-[1px] border-gray-300 mb-6 w-[400px] h-10 rounded-md'>
                                <input type='text' placeholder='Business Code' className='mt-2 -ml-36 outline-none'></input>
                            </div>
                        </form>

                        <div className='flex w-[80%]'>
                            <div className='basis-1/2 my-8 text-left text-xs text-gray-400 hover:text-gray-500 hover:font-medium duration-300 tracking-wider'>
                                <Link to={"/register"}>I do not have an account</Link>
                            </div>

                            <div className='basis-1/2 my-8 text-right text-xs text-gray-400 hover:text-gray-500 hover:font-medium duration-300 tracking-wider'>
                                <a href='https://www.facebook.com/'>Forgot password</a>
                            </div>
                        </div>

                        <div className='text-xs text-left text-gray-400 mb-14'>
                            <p>
                                By signing up as a LY.com member, you have read and agree to the TravelVn
                                <a href="https://www.ly.com/terms" className="text-black"> <u>Terms and Conditions</u></a> & 
                                <a href="https://www.ly.com/privacy" className="text-black"> <u>Privacy Policy</u></a>.
                            </p>
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

export default Login;