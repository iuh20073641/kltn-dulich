import './register.css';
import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import { checkUser} from '../api/user';
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

function Register() {
    const [isButtonBasic, setIsButtonBasic] = useState(true);
    const [isButtonBusines, setIsButtonBusines] = useState(false);
    const [formValue, setFormValue] = useState(initFormValue);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (event) => {
        const { value, name } = event.target;
        setFormValue({
            ...formValue,
            [name]: value,
        });
    };

    const handleImageChange = (e) => {
        setFormValue({ ...formValue, image: e.target.files[0] });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        //console.log("formValue", formValue);
    
        if (formValue.pass !== formValue.rePass) {
            toast.error('Mật khẩu không khớp!');
            return;
        }
    
        try {
            const userResponse = await checkUser(formValue.mail, formValue.phone);
            const userData = userResponse.data;
            if (userData.length > 0) {
                toast.error('Tài khoản đã tồn tại!');
            } else {
                const formData = new FormData();
                formData.append('name', formValue.name);
                formData.append('mail', formValue.mail);
                formData.append('phone', formValue.phone);
                formData.append('address', formValue.address);
                formData.append('birthDate', formValue.birthDate);
                formData.append('pass', formValue.pass);
                formData.append('image', formValue.image);
    
                const response = await fetch('http://localhost:88/api_travel/api/register.php', {
                    method: 'POST',
                    body: formData
                });
    
                // Kiểm tra phản hồi từ máy chủ
                const text = await response.text();
                try {
                    const data = JSON.parse(text);
                    if (data.status === 'success') {
                        setMessage('Tạo tài khoản thành công');
                        toast.success('Tạo tài khoản thành công');
                        navigate('/login');
                    } else {
                        setMessage(`Error: ${data.message}`);
                        toast.error(`Đăng ký thất bại: ${data.message}`);
                    }
                } catch (error) {
                    console.error('Phản hồi không phải là JSON hợp lệ:', text);
                    setMessage('Đăng ký thất bại, vui lòng thử lại!');
                    toast.error('Đăng ký thất bại, vui lòng thử lại!');
                }
            }
        } catch (error) {
            setMessage('Registration failed');
            toast.error('Đăng ký thất bại, vui lòng thử lại!');
            console.error('There was an error!', error);
        }
    };

    const handleBasicClick = () => {
        setIsButtonBasic(true);
        setIsButtonBusines(false);
    };

    const handleBusinessClick = () => {
        setIsButtonBasic(false);
        setIsButtonBusines(true);
    };

    return (
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
                                <button id='login-basis' onClick={handleBasicClick} className={isButtonBasic ? 'active' : ''}>
                                    <p>Basic</p>
                                </button>
                            </div>
                            <div className='mx-3'>
                                <button id='login-business' onClick={handleBusinessClick} className={isButtonBusines ? 'active' : ''}>
                                    <p>Business</p>
                                </button>
                            </div>
                        </div>

                        <form id='basis-form' onSubmit={handleSubmit} className={isButtonBasic ? '' : 'hidden'}>
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
                                    <input type='password' name='pass' placeholder='Password' value={formValue.pass} onChange={handleChange} className='w-[200px] bg-slate-50 mt-2 outline-none' required></input>
                                </div>
                                <div className='border-[1px] border-gray-300 mb-6 w-[240px] h-10 rounded-md '>
                                    <input type='password' name='rePass' placeholder='Re-enter Password' value={formValue.rePass} onChange={handleChange} className='bg-slate-50 w-[200px] mt-2 outline-none' required></input>
                                </div>
                            </div>
                            <div className='bg-[#FFD000] mb-10 rounded-md'>
                                <button type='submit' className='py-3 font-semibold text-xl'><p>Create a New Account</p></button>
                            </div>
                        </form>
                        {message && <p>{message}</p>}
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