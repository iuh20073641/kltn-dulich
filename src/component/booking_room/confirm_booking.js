import Header from "../header";
import Footer from "../footer/footer";
import Slider from "react-slick";
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// import { fetchRoomRating } from "../api/room";
import { fetchRoomDetails } from "../api/room";
import { fetchRoomImages } from "../api/room";
import PriceDisplay from "../service/money";
import { getUsersData } from "../api/user";
import { fetchCheckookingRoom } from "../api/room";
import { loadStripe } from "@stripe/stripe-js";

const formUser = 
    {
        roomid: "",
        nametk: "",
        email: "",
        dob: "",
        phone: "",
        address: "",
    };

    const formUser2 = 
    {
        namend: "",
        cccd: "",
        check_in: "",
        check_out: ""
    };

function ConfirmBooking() {

    const settings = {
        dots: true, // Hiển thị chấm tròn ở dưới để điều hướng
        infinite: true, // Vòng lặp vô hạn
        speed: 500, // Tốc độ chuyển đổi giữa các slide
        slidesToShow: 1, // Số slide hiển thị
        slidesToScroll: 1, // Số slide di chuyển mỗi lần
        autoplay: false, // Tự động chạy
        autoplaySpeed: 3000, // Thời gian giữa các slide
    };

    const { id } = useParams();  // Lấy ID từ URL
    // const [averageRating, setAverageRating] = useState(0);
    // const [totalReviews, setTotalReviews] = useState(0);
    const [roomDetails, setRoomDetails] = useState(null);
    // const [roomFeatures, setRoomFeatures] = useState({});
    // const [roomRating, setRoomRating] = useState([]);
    const [roomImages, setRoomImages] = useState([]);
    // const [roomFacilities, setRoomFacilities] = useState({});
    const [error, setError] = useState(null);
    const [userDatas, setUserData] = useState(formUser);
    const [user, setUser] = useState(formUser2);
    // const [inputValue, setInputValue] = useState(''); // State để quản lý giá trị nhập
    // const [formValue, setFormValue] = useState(formInput);
    // const [checkBooking, setCheckBooking] = useState([]); // Thông báo trạng thái
    const [message, setMessage] = useState(null); // Thông báo trạng thái
    const [numberOfDay, setNumberOfDay] = useState(null);

    useEffect(() => {
        // Hàm để gọi API và cập nhật state
        const roomDetail = async () => {
            try {
                // Gọi API để lấy thông tin chi tiết của một phòng
                const roomResponse = await fetchRoomDetails(id);
                const roomData = roomResponse.data;
                // setRoomDetails(roomData);
                // console.log('Dữ liệu từ API:', tourDetails);

                // Nếu API trả về mảng, hãy lấy phần tử đầu tiên
                if (Array.isArray(roomData) && roomData.length > 0) {
                    setRoomDetails(roomData[0]);
                } else {
                    setRoomDetails(null); // Xử lý nếu không có dữ liệu hợp lệ
                }

            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Có lỗi xảy ra khi lấy dữ liệu sản phẩm.');
            }
        };

        roomDetail();

        const getRoomImages = async () => {
            try {
                // Gọi API để lấy thông tin chi tiết của một phòng
                const roomImagesResponse = await fetchRoomImages(id);
                const roomImagesData = roomImagesResponse.data;
                setRoomImages(roomImagesData);

            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Có lỗi xảy ra khi lấy dữ liệu hình ảnh.');
            }
        };
        getRoomImages();

    }, [id]);

    // Hàm xử lý khi thay đổi dữ liệu input
    const handleInputChangeUser = (e) => {
        const { name, value } = e.target;
        setUserData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleInputChangeUser2 = (e) => {
        const { name, value } = e.target;
        setUser((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };


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

    // Hàm kiểm tra ngày với API
    const checkAvailability = async (id, check_in, check_out) => {
        console.log(id, user.check_in, user.check_out)
        const today = new Date();  // Lấy ngày hiện tại
        // Kiểm tra nếu check_in nhỏ hơn check_out
        if (new Date(check_in) >= new Date(check_out)) {
            console.log("Ngày đặt phòng phải nhỏ hơn ngày trả phòng.");
            setMessage(1);
            return; // Dừng lại nếu điều kiện không hợp lệ
        } else if(new Date(check_in) <= today){
            console.log("Ngày đặt phòng phải lớn hơn ngày hiện tại");
            setMessage(2);
            return; // Dừng lại nếu điều kiện không hợp lệ
        } else if(new Date(check_out) <= today){
            console.log("Ngày trả phòng phải lớn hơn ngày hiện tại");
            setMessage(3);
            return; // Dừng lại nếu điều kiện không hợp lệ
        } else if(new Date(check_out) <= today && new Date(check_in) <= today){
            console.log("Ngày đặt phòng và trả phòng phải lớn hơn ngày hiện tại");
            setMessage(4);
            return; // Dừng lại nếu điều kiện không hợp lệ
        }
        try {
            const response = await fetchCheckookingRoom(id, check_in, check_out);
            // setCheckBooking(response.data);
            console.log(response.data);
            if(response.data.length>0){
                console.log("phòng đã được đặt");
                setMessage(5);
            } else {
                console.log("phòng còn trống");
                setMessage(6);
                setNumberOfDay((new Date(check_out) - new Date(check_in))/ (1000 * 3600 * 24));
                // const totalPrice = numberOfDay * roomDetails.price;
            }
        } catch (error) {
            console.error("Lỗi khi kiểm tra thời gian:", error);
            // setMessage("Không thể kiểm tra thời gian. Vui lòng thử lại sau.");
        }
    };

    // Gọi API khi ngày nhận và ngày trả thay đổi
    /* eslint-disable react-hooks/exhaustive-deps */
    useEffect(() => {
        if (user.check_in && user.check_out) {
            checkAvailability(id, user.check_in, user.check_out);
        }
    }, [user.check_in, user.check_out]); // Chỉ chạy khi một trong hai ngày thay đổi

    const stripePromise = loadStripe(
        "pk_test_51Q8m79Rqz8axCXq0oW0OaP1KhZHGkV5Wl1sYMRgVPYgsZwOy78KJnDCwpHh28VRJYSvVoHDP4Jr9UGbBICFD3xxm00NkH3YI5w"
    );

    const handlePayment = async () => {
        const userData = localStorage.getItem('user');
        const user1 = JSON.parse(userData);
        const finalPrice = numberOfDay * roomDetails.price;

        try {
          const response = await fetch(
            "http://localhost:88/api_travel/api/create-checkout-session.php",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                amount: finalPrice, // Stripe expects the amount in cents
                name: "room booking",
                // id_tour: tourData.id,
                // depar_id: selectedTour,
                // participant: formValue.participant,
                // price_tour: tourData.price,
                // name_user: formValue.namend,
                // phone: userDatas.phone,
                // address: userDatas.address,
                // tour_name: tourData.name,
                success_url: `http://localhost:3000/success-room/${roomDetails.id}?user_id=${user1.id}&check_in=${user.check_in}&check_out=${user.check_out}&room_name=${encodeURIComponent(roomDetails.name)}&price=${roomDetails.price}&total_pay=${finalPrice}&user_name=${encodeURIComponent(user.namend)}&phonenum=${userDatas.phone}&cccd=${user.cccd}&address=${encodeURIComponent(userDatas.address)}`,
                // cancel_url: "http://localhost:3000/cancel",
              }),
            }
          );
    
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
    
          const { id } = await response.json();
          const stripe = await stripePromise;
          const { error } = await stripe.redirectToCheckout({ sessionId: id });
    
          if (error) {
            console.error("Error redirecting to checkout:", error);
            alert("Failed to redirect to checkout. Please try again later.");
          }
        } catch (error) {
            // console.log(tourData.id_tour);
            alert("Failed to create payment session. Please try again later.");
        }
    };

    if (error) return <p>{error}</p>;

    return (
        <div className="bg-gray-100">
            <Header />

            <div className="w-full mt-[115px] h-8 bg-gray-100"></div>
            <div className="w-[90%] mx-auto mb-7">
                {/* {roomDetails && roomDetails.id ? (
                <div className="text-left mt-14 text-3xl font-medium mb-5">{roomDetails.name}</div>
            ) : (
                <p>tên phòng...</p> 
            )} */}
                <div className="text-left mt-14 text-3xl font-semibold mb-5 uppercase">Xác nhân đặt phòng</div>
                {/* <div className="flex w-full mb-3 items-center">
                    <div className="flex">{renderStars()}</div> 
                    <div className='flex justify-center items-center mx-2'>
                        <p className='font-medium '>{averageRating.toFixed(1)}</p> 
                        <p className='font-medium'>/5</p> 
                        <p className="mx-1">trong {totalReviews} đánh giá</p>
                    </div>
                </div> */}

                {/* phần thông tin chi tiết */}
                <div className="w-full flex gap-x-3">
                    <div className="w-[60%] bg-white pb-5 border-[2px] border-gray-200 rounded-[3px] shadow-sm">
                        {Array.isArray(roomImages) && roomImages.length > 0 ? (
                            roomImages.length < 2 ? (

                                // Trường hợp có duy nhất một hình ảnh
                                <div className="mb-10 ">
                                    <img src={`http://localhost:88/api_travel/api/Images/room/${roomImages[0].image}`} className='w-[963px] h-[490px] object-cover' alt="" />
                                </div>

                            ) : (
                                <Slider {...settings}>
                                    {roomImages.map((image) => (
                                        <div key={image.id} className="mb-5 py-3 px-3 ">
                                            <img src={`http://localhost:88/api_travel/api/Images/room/${image.image}`} className='w-[763px] h-[350px] object-cover rounded-sm' alt="" />
                                        </div>
                                    ))}
                                </Slider>
                            )
                        ) : (
                            <div className="w-[930px] h-[490px] flex items-center justify-center text-sm mb-3 bg-gray-100 rounded-md">
                                <p className="mx-3 mt-3">Không có hình ảnh</p>
                            </div>
                        )}
                        <div>
                            {roomDetails && roomDetails.id ? (
                                <div>
                                    <div className="text-left mx-3 mt-7 font-medium text-xl">{roomDetails.name}</div>
                                    <div className="text-left mx-3 my-2 font-normal text-lg "><PriceDisplay price={roomDetails.price} /></div>
                                </div>
                            ) : (
                                <p>dữ liệu phòng</p>
                            )}
                        </div>
                    </div>
                    {roomDetails && roomDetails.id ? (
                        <div className="w-[40%]">
                            <div className="bg-white pb-5 border-[2px] border-gray-200 rounded-[3px] shadow-sm">
                                <div className="uppercase text-left mx-2 font-semibold my-3">Thông tin hóa đơn</div>
                                <div className="mx-2">
                                    <div className="flex text-left gap-2 my-3">
                                        <div className="w-1/2">
                                            <div className="mb-1 tracking-wide">Tài khoản</div>
                                            <div>
                                                <input type='text'
                                                    value={userDatas.nametk} 
                                                    name='nametk' 
                                                    onChange={handleInputChangeUser}
                                                    className='outline-none w-full px-2 py-1 rounded-[3px] border-[1px] border-gray-200'
                                                    required>
                                                </input>
                                            </div>
                                        </div>
                                        <div className="w-1/2">
                                            <div className="mb-1 tracking-wide">Số điện thoại</div>
                                            <div>
                                                <input type='text' 
                                                    name='phone' 
                                                    value={userDatas.phone}
                                                    onChange={handleInputChangeUser}
                                                    className='outline-none w-full px-2 py-1 rounded-[3px] border-[1px] border-gray-200'
                                                    required>
                                                </input>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-left w-full my-3">
                                        <div className="mb-1 tracking-wide">Địa chỉ</div>
                                        <div>
                                            <input type='text'
                                                name='address' 
                                                value={userDatas.address}
                                                onChange={handleInputChangeUser}
                                                className='w-full outline-none px-2 py-1 rounded-[3px] border-[1px] border-gray-200'
                                                required>
                                            </input>
                                        </div>
                                    </div>
                                    <div className="flex text-left gap-2 my-3">
                                        <div className="w-1/2">
                                            <div className="mb-1 tracking-wide">Họ tên</div>
                                            <div>
                                                <input type='text' 
                                                    name='namend' 
                                                    value={user.namend}
                                                    onChange={handleInputChangeUser2} 
                                                    className='outline-none px-2 py-1 rounded-[3px] border-[1px] border-gray-200'
                                                    required>
                                                </input>
                                            </div>
                                        </div>
                                        <div className="w-1/2">
                                            <div className="mb-1 tracking-wide">Cccd</div>
                                            <div>
                                                <input type='text' 
                                                    name='cccd' 
                                                    value={user.cccd} 
                                                    onChange={handleInputChangeUser2}
                                                    className='outline-none w-full px-2 py-1 rounded-[3px] border-[1px] border-gray-200'
                                                    required>
                                                </input>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex text-left gap-2 my-3">
                                        <div className="w-1/2">
                                            <div className="mb-1 tracking-wide">Ngày nhận</div>
                                            <div>
                                                <input type='date' 
                                                    name='check_in'
                                                    value={user.check_in} 
                                                    onChange={handleInputChangeUser2}
                                                    className='outline-none w-full px-2 py-1 rounded-[3px] border-[1px] border-gray-200'
                                                    required>
                                                </input>
                                            </div>
                                        </div>
                                        <div className="w-1/2">
                                            <div className="mb-1 tracking-wide">Ngày trả</div>
                                            <div>
                                                <input type='date' 
                                                    name='check_out'
                                                    value={user.check_out} 
                                                    onChange={handleInputChangeUser2}
                                                    className='outline-none w-full px-2 py-1 rounded-[3px] border-[1px] border-gray-200'
                                                    required>
                                                </input>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {message === 5 ? (
                                    <div className="text-[#dc3545]">
                                        phòng đã được đặt
                                    </div>
                                ) : message === 1 ? (
                                    <div className="text-[#dc3545]">
                                       Ngày đặt phòng phải nhỏ hơn ngày trả phòng
                                    </div>
                                ) : message === 2 ? (
                                    <div className="text-[#dc3545]">
                                       Ngày đặt phòng phải lớn hơn ngày hiện tại
                                    </div>
                                ) : message === 3 ? (
                                    <div className="text-[#dc3545]">
                                       Ngày trả phòng phải lớn hơn ngày hiện tại
                                    </div>
                                ) : message === 4 ? (
                                    <div className="text-[#dc3545]">
                                       Ngày đặt phòng và trả phòng phải lớn hơn ngày hiện tại
                                    </div>
                                ) : message === 6 ? (
                                    <div>
                                        <div>Phòng còn trống</div>
                                        <div className="flex mx-2">
                                            <div className="font-medium">Số ngày thuê:</div>
                                            <div className="mx-2">{numberOfDay} ngày</div>
                                        </div>
                                        <div className="flex mx-2">
                                            <div className="font-medium">Tổng giá:</div>
                                            <div className="mx-2"><PriceDisplay price={numberOfDay * roomDetails.price} /></div>
                                        </div>
                                    </div>
                                ) : null}
                                <button type="submit" onClick={handlePayment} className="uppercase mx-auto mb-1 mt-10 font-semibold bg-[#0194F3] text-white text-sm w-[95%] rounded-[5px] tracking-wider py-3 px-5 cursor-pointer hover:bg-opacity-90 hover:after:duration-200 hover:bg-white hover:text-black duration-100 border-[1px] border-[#0194F3]">
                                    Thanh toán
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p>kông có dữ liệu</p> // Hiển thị thông báo đang tải khi chưa có dữ liệu
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
}
export default ConfirmBooking;