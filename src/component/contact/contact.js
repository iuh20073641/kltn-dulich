import Header from "../header";
import Footer from "../footer/footer";
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { contact } from "../api/contact";
import { getAllInfoContact } from "../api/contact";

const initFormValue = {
    name: "",
    email: "",
    subject: "",
    message: ""
};

function Contact (){

    const [infoContact, setInfoContact] = useState([]);
    const [formValue, setFormValue] = useState(initFormValue);
    // const [error, setError] = useState(null);
    // const [message, setMessage] = useState('');

    const handleChange = (event) => {
        const { value, name } = event.target;
        setFormValue({
            ...formValue,
            [name]: value,
        });
    };

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

    const hendleSubmit = async (event) => {
        event.preventDefault(); //để không tự động reset
        console.log("formValue", formValue);
        try {
           
            // setIsEmpty(true);
            // const response = await axios.post(`${SERVER_API}/register.php?name=${formValue.name}&mail=${formValue.mail}&phone=${formValue.phone}&image=${formValue.image.name}&address=${formValue.address}&birthDate=${formValue.birthDate}&pass=${formValue.pass}`);
            await contact(formValue.name, formValue.email, formValue.subject, formValue.message);
            // setMessage(response.data.message);
            toast.success('Phản hồi của bạn đã được ghi nhận');
            
          } catch (error) {
            toast.error('Phản hồi của bạn chưa được ghi nhận');
          }
    };

    return(
        <div className="contact">
            <Header />
            <div className="my-5 px-4">
                <h2 className="text-3xl font-semibold text-center uppercase">Liên hệ</h2>
                <div className="h-[2px] w-[150px] my-2 mx-auto bg-gray-900" />
                <p className="text-center text-gray-500">
                    Venture luôn sẵn lòng lắng nghe và tiếp thu góp ý từ khách hàng nhằm đem lại dịch vụ với chất lượng tót nhất
                </p>
            </div>
            <div className="row flex mt-10">
            {infoContact.map((contact) => (
                <div className="lg:w-1/2 pr-4 pl-4 md:w-1/2 mb-5 px-4" key={contact.id}>
                    <div className="bg-white rounded shadow p-6 text-left">
                        {/* <iframe className="w-full rounded mb-4" height="320px" src="" loading="lazy" /> */}
                        <iframe className="w-full rounded mb-4" height="320px" title="bản đồ" src={contact.jframe} loading="lazy"></iframe>
                        <h5 className="text-left text-lg font-medium">Address</h5>
                        <a href={contact.gmap} className="inline-block text-gray-900 fs-5 me-2">
                            <div className="flex my-2 items-center">
                                <div className="">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                                    </svg>
                                </div>
                                <div className="mx-2">
                                    {contact.address}.
                                </div>
                            </div>
                        </a>
                        <h5 className="mt-4">Call us</h5>
                        <div className="flex my-2 items-center">
                            <div className="gap-1/2">
                                <i className="fa-solid fa-phone"></i>
                            </div>
                            <div className="mx-2 gap-1/2">
                                {contact.pn1}
                            </div>
                        </div>
                        <div className="flex my-2 items-center">
                            <div className="gap-1/2">
                                <i className="fa-solid fa-phone"></i>
                            </div>
                            <div className="mx-2 gap-1/2">
                                {contact.pn2}
                            </div>
                        </div>
                        <br />
                       
                        <h5 className="mt-4">Email</h5>
                        <div className="flex my-2 items-center">
                            <div className="gap-1/2">
                                <i className="fa-solid fa-envelope"></i>
                            </div>
                            <div className="mx-2 gap-1/2">
                                {contact.email}
                            </div>
                        </div>
                        <h5 className="mt-4">Follow us</h5>
                        <div className="flex">
                        
                            <br />
                            <a href={contact.fb} className="inline-block text-gray-900 fs-5 mr-1">
                                <i className="fa-brands fa-facebook"></i>
                            </a>
                            <br />
                            <a href={contact.tw} className="inline-block text-gray-900 fs-5 mx-1">
                                <i className="fa-brands fa-twitter"></i>
                            </a>
                            <br />
                            <a href={contact.insta} className="inline-block text-gray-900 fs-5 ml-1">
                                <i className="fa-brands fa-instagram"></i>
                            </a>
                        </div>
                    </div>
                </div>
                 ))}
                <div className="lg:w-1/2 pr-4 pl-4 md:w-1/2 mb-5 px-4">
                    <div className="bg-white rounded shadow p-6 text-left">
                        <form method="POST" onSubmit={hendleSubmit}>
                            <h5 className="text-left font-medium text-xl">Send a message</h5>
                            <div className="mt-3">
                                <label className="form-label" style={{ fontWeight: 500 }}>Name</label>
                                <input name="name" value={formValue.name} onChange={handleChange} className="block focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none w-full py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded shadow-none" />
                            </div>
                            <div className="mt-3">
                                <label className="form-label" style={{ fontWeight: 500 }}>Email</label>
                                <input name="email" value={formValue.email} onChange={handleChange} type="text" className="block focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none w-full py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded shadow-none" />
                            </div>
                            <div className="mt-3">
                                <label className="form-label" style={{ fontWeight: 500 }}>Subject</label>
                                <input name="subject" value={formValue.subject} onChange={handleChange} type="text" className="block focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none w-full py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded shadow-none" />
                            </div>
                            <div className="mt-3">
                                <label className="form-label" style={{ fontWeight: 500 }}>Message</label>
                                <textarea name="message" type="text" value={formValue.message} onChange={handleChange} className="block focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none w-full py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded shadow-none" rows={5} style={{ resize: "none" }} />
                            </div>
                            <button type="submit" name="send" className="inline-block align-middle text-center select-none border font-normal whitespace-no-wrap rounded py-1 px-3 leading-normal no-underline text-white custom-bg mt-3 bg-[#2ec1ac]">
                                SEND
                            </button>
                        </form>
                        {/* {message && <p>{message}</p>} */}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
export default Contact;