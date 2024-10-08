import Header from "../header";
import Footer from "../footer/footer";
import { useParams } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import { fetchTourDetails } from "../api/tours";
import { fetchDayDepart } from "../api/tours";
import { getUsersData } from "../api/user";
import TotalDisplay from "../service/total-price";
// import { fetchTourSchedule } from "../api/tours";
// import { fetchTourRating } from "../api/tours";
// import { fetchTourImages } from "../api/tours";
// import { fetchTourDepart } from "../api/tours";
import React, { useEffect, useState } from 'react';
// import PriceDisplay from "../service/money";
// import DiscountDisplay from "../service/discount";

const formTour = {
    id_tour: "",
    nametour: "",
    type: "",
    participant: "",
    price: "",
    timeTour: "",
    depart: "",
    departurelocation: "",
    discount:"",
    itinerary: "",
    vehicle: "",
    name: "",
    cccd: "",
};

const dayDepart = {
    day: ""
};

function BookingTour(){


    const { id } = useParams();  // Lấy ID từ URL
    // const [tourDetails, setTourDetails] = useState(null);
    const [tourData, setTourData] = useState({formTour});
    const [departData, setDepartData] = useState({dayDepart});
    const [userData, setUserData] = useState({});
    // const [tourSchedule, setTourSchedule] = useState([]);
    // const [tourDepart, setTourDepart] = useState([]);
    // // const [reviews, setReviews] = useState([]);
    // const [tourRating, setTourRating] = useState([]);
    // const [tourImages, setTourImages] = useState([]);
    // const [averageRating, setAverageRating] = useState(0);
    // const [totalReviews, setTotalReviews] = useState(0);
    const [error, setError] = useState(null);

    const [searchParams] = useSearchParams();
    // Lấy giá trị của selectedTour từ URL
    const selectedTour = searchParams.get('selectedTour');
    // console.log("Selected Tour:", selectedTour);

    // State để lưu số người và tổng giá
    // const [numPeople, setNumPeople] = useState(1);  // Mặc định 1 người
    // const [totalPrice, setTotalPrice] = useState(0);  // Giá mặc định cho 1 người
    const [inputValue, setInputValue] = useState(''); // State để quản lý giá trị nhập


    useEffect(() => {
        // Hàm để gọi API và cập nhật state
        const tourDetail = async () => {
            try {
                // Gọi API để lấy thông tin chi tiết của một phòng
                const toursResponse = await fetchTourDetails(id);
                const toursData = toursResponse.data; 
                setTourData(toursData);
                console.log('Dữ liệu từ API:', toursData);

                // Nếu API trả về mảng, hãy lấy phần tử đầu tiên
                if (Array.isArray(toursData) && toursData.length > 0) {
                    setTourData(toursData[0]);
                } else {
                    setTourData(null); // Xử lý nếu không có dữ liệu hợp lệ
                }

                // // Gọi API để lấy thông tin chi tiết của một phòng
                // const toursScheduleResponse = await fetchTourSchedule(id);
                // const toursScheduleData = toursScheduleResponse.data; 
                // setTourSchedule(toursScheduleData);
                // // console.log('Dữ liệu từ API:', tourDetails);

                // // Gọi API để lấy thông tin chi tiết của một phòng
                // const tourDepartResponse = await fetchTourDepart(id);
                // const toursDepartData = tourDepartResponse.data; 
                // setTourDepart(toursDepartData);
                // console.log('Dữ liệu từ API:', toursDepartData);

            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Có lỗi xảy ra khi lấy dữ liệu sản phẩm.');
            }
        };

        tourDetail();
        
    }, [id]);

    useEffect(() => {
        const tourDepart = async () => {
            try {
                // Gọi API để lấy thông tin chi tiết của một phòng
                const departResponse = await fetchDayDepart(selectedTour);
                const departData = departResponse.data; 
                setDepartData(departData);
                // console.log('Dữ liệu từ API:', tourDetails);

                // Nếu API trả về mảng, hãy lấy phần tử đầu tiên
                if (Array.isArray(departData) && departData.length > 0) {
                    setDepartData(departData[0]);
                } else {
                    setDepartData(null); // Xử lý nếu không có dữ liệu hợp lệ
                }

            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Có lỗi xảy ra khi lấy dữ liệu sản phẩm.');
            }
        };

        tourDepart();
        
    }, [selectedTour]);

    useEffect(() => {
        const user = async () => {
            const userData = localStorage.getItem('user');
           
            const user = JSON.parse(userData);
            console.log("User ID:", user.id); // Lấy ID người dùng 
           
            try {
                // Gọi API để lấy thông tin chi tiết của một phòng
                const userResponse = await getUsersData(user.id);
                const userData = userResponse.data; 
                setUserData(userData);
                // console.log('Dữ liệu từ API:', tourDetails);

                // Nếu API trả về mảng, hãy lấy phần tử đầu tiên
                if (Array.isArray(userData) && userData.length > 0) {
                    setUserData(userData[0]);
                } else {
                    setUserData(null); // Xử lý nếu không có dữ liệu hợp lệ
                }

            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Có lỗi xảy ra khi lấy dữ liệu sản phẩm.');
            }
        };

        user();
        
    }, []);

    // Hàm xử lý khi thay đổi dữ liệu input
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTourData({ ...tourData, [name]: value });
        setInputValue(value);
    };


    if (error) return <p>{error}</p>;

    return(
        <div>
            <Header />
            <div className="w-full">
                <div className="w-[80%] mt-[150px] mx-auto">
                    <div className="font-semibold uppercase text-2xl text-center mb-5">Thông tin đặt tour</div>
                    <div className="w-[60%] mx-auto bg-gray-100 px-2 py-3 rounded-md mb-4">
                    {userData && userData.id ? (
                        <div className="mt-5 pl-3">
                            <div className="text-left text-lg font-medium mb-5">Thông tin người dùng</div>
                            <div className="flex gap-x-3">
                                <div className="text-left mb-2 w-1/2">
                                    <div>Tên tài khoản</div>
                                    <div>
                                        <input type='text' value={userData.nametk} name='name_tk' className='w-[300px] bg-white outline-none px-2 py-1 rounded-md' disabled></input>
                                    </div>
                                </div>
                                <div className="text-left mb-2 w-1/2">
                                    <div>Email</div>
                                    <div>
                                        <input type='text' name='email' value={userData.email} className='w-[300px] bg-white outline-none px-2 py-1 rounded-md' disabled></input>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-x-3 mb-2">
                                <div className="text-left mb-2 w-1/2">
                                    <div>Ngày sinh</div>
                                    <div>
                                        <input type='text' name='dob' value={userData.dob} className='w-[300px] bg-white outline-none px-2 py-1 rounded-md' disabled></input>
                                    </div>
                                </div>
                                <div className="text-left w-1/2">
                                    <div>Số điện thoại</div>
                                    <div>
                                        <input type='text' name='phonenum' value={userData.phone} className='w-[300px] bg-white outline-none px-2 py-1 rounded-md' disabled></input>
                                    </div>
                                </div>
                            </div>
                            <div className="text-left mb-2">
                                <div>Địa chỉ</div>
                                <div>
                                    <input type='text' name='address' value={userData.address} className='w-[97%] bg-white outline-none px-2 py-1 rounded-md' disabled></input>
                                </div>
                            </div>
                            <div className="flex gap-x-3 mb-2">
                                <div className="text-left mb-2 w-1/2">
                                    <div>Họ tên</div>
                                    <div>
                                        <input type='text' name='name' className='w-[300px] outline-none px-2 py-1 rounded-md' required></input>
                                    </div>
                                </div>
                                <div className="text-left mb-2 w-1/2">
                                    <div>CCCD/CMND</div>
                                    <div>
                                        <input type='text' name='cccd' className='w-[300px] outline-none px-2 py-1 rounded-md' required></input>
                                    </div>
                                </div>
                            </div>
                        </div>
                        ) : (
                            <p>Đang tải...</p> // Hiển thị thông báo đang tải khi chưa có dữ liệu
                        )}
                        {tourData && tourData.id ? (
                        <div className="mt-5 pl-3">
                            <div className="text-left text-lg font-medium mb-5">Thông tin tour</div>
                            <div className="flex gap-x-3">
                                <div className="text-left mb-2 w-1/2">
                                    <div>Mã tour</div>
                                    <div>
                                        <input type='text' 
                                            name='id_tour'
                                            value={tourData.id}
                                            onChange={handleInputChange}
                                            className='w-[300px] bg-white outline-none px-2 py-1 rounded-md' disabled>
                                        </input>
                                    </div>
                                </div>
                                <div className="text-left mb-2 w-1/2">
                                    <div>Kiểu tour</div>
                                    <div>
                                        <input type='text' 
                                            name='type' 
                                            value={tourData.type}
                                            onChange={handleInputChange}
                                            className='w-[300px] bg-white outline-none px-2 py-1 rounded-md' disabled>
                                        </input>
                                    </div>
                                </div>
                            </div>
                            <div className="text-left mb-2">
                                <div>Tên tour</div>
                                <div>
                                    <input type='text' 
                                        name='nametour' 
                                        value={tourData.name}
                                        onChange={handleInputChange}
                                        className='w-[97%] bg-white outline-none px-2 py-1 rounded-md' disabled>
                                    </input>
                                </div>
                            </div>
                            <div className="flex gap-x-3">
                                <div className="text-left mb-2 w-1/2">
                                    <div>Số người tham gia</div>
                                    <div>
                                        <input type='number' 
                                            name='participant' 
                                            value={tourData.participant}
                                            onChange={handleInputChange}
                                            className='w-[300px] outline-none px-2 py-1 rounded-md' required>
                                        </input>
                                    </div>
                                </div>
                                {departData && departData.id ? (
                                <div className="text-left mb-2 w-1/2">
                                    <div>Thời gian khởi hành</div>
                                    <div>
                                        <input type='date' 
                                            name='day_tour' 
                                            value={departData.day_depart}
                                            onChange={handleInputChange}
                                            className='w-[300px] bg-white outline-none px-2 py-1 rounded-md' disabled>
                                        </input>
                                    </div>
                                </div>
                                ) : (
                                    <p>Đang tải...</p> // Hiển thị thông báo đang tải khi chưa có dữ liệu
                                )}
                            </div>
                            <div className="text-left mb-2 w-1/2">
                                <div>Thời gian diễn ra tour &#40;ngày&#41;</div>
                                <div>
                                    <input type='number' 
                                        name='timeTour'
                                        value={tourData.timeTour}
                                        onChange={handleInputChange}
                                        className='w-[300px] bg-white outline-none px-2 py-1 rounded-md' disabled>
                                    </input>
                                </div>
                            </div>
                        </div>
                        ) : (
                            <p>Đang tải...</p> // Hiển thị thông báo đang tải khi chưa có dữ liệu
                        )}
                        {tourData && tourData.id ? (
                        <div className="mt-5">
                            <div className="w-[35%] ml-auto text-left">
                                <div className="text-lg font-semibold">Tổng tiền</div>
                                <div>
                                    {/* <input type='number' name='total_price' value='1000000' className='w-[300px] outline-none px-2 py-1 rounded-md' disabled></input> */}
                                    <TotalDisplay  originalPrice={tourData.price} discountPercent={tourData.discount} numberOfPeople={inputValue} />
                                </div>
                            </div>
                        </div>
                        ) : (
                            <p>Đang tải...</p> // Hiển thị thông báo đang tải khi chưa có dữ liệu
                        )}
                    </div>
                    <div className="w-[60%] mx-auto mb-6">
                        <div className="flex justify-center">
                            <div>
                                <button type="submit"  className="bg-black mx-2 inline-block align-middle text-center select-none border font-normal whitespace-no-wrap rounded py-1 px-3 leading-normal no-underline custom-bg text-white shadow-none">
                                    Thanh toán online
                                </button>
                            </div>
                            <div>
                                <button type="submit" className="bg-black mx-2 inline-block align-middle text-center select-none border font-normal whitespace-no-wrap rounded py-1 px-3 leading-normal no-underline custom-bg text-white shadow-none">
                                    Đặt giữ chỗ
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}
export default BookingTour;