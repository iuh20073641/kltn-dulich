import Header from "../header";
import Footer from "../footer/footer";
import Slider from "react-slick";
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchRoomRating } from "../api/room";
import { fetchRoomDetails } from "../api/room";
import { fetchRoomFeature } from "../api/room";
import { fetchRoomFacilities } from "../api/room";
import { fetchRoomImages } from "../api/room";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import config from "../../component/config.json";

const { SERVER_API } = config;

function RoomDetail(){

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
    const [averageRating, setAverageRating] = useState(0);
    const [totalReviews, setTotalReviews] = useState(0);
    const [roomDetails, setRoomDetails] = useState(null);
    const [roomFeatures, setRoomFeatures] = useState({});
    const [roomRating, setRoomRating] = useState([]);
    const [roomImages, setRoomImages] = useState([]);
    const [roomFacilities, setRoomFacilities] = useState({});
    const [error, setError] = useState(null);
    const navigate = useNavigate();

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

        const roomFeature = async () => {
            try {
                // Gọi API để lấy thông tin chi tiết của một phòng
                const roomFeatureResponse = await fetchRoomFeature(id);
                const roomFeatureData = roomFeatureResponse.data; 
                setRoomFeatures(roomFeatureData);
                // console.log('Dữ liệu từ API:', tourDetails);

            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Có lỗi xảy ra khi lấy dữ liệu sản phẩm.');
            }
        };

        roomFeature();

        const roomFacilities = async () => {
            try {
                // Gọi API để lấy thông tin chi tiết của một phòng
                const roomFacilitiesResponse = await fetchRoomFacilities(id);
                const roomFacilitiesData = roomFacilitiesResponse.data; 
                setRoomFacilities(roomFacilitiesData);
                // console.log('Dữ liệu từ API:', tourDetails);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Có lỗi xảy ra khi lấy dữ liệu sản phẩm.');
            }
        };

        roomFacilities();

        const fetchReviews = async () => {
            try {
              const responseRating = await fetchRoomRating(id);
              const reviewsData = responseRating.data;
              setRoomRating(reviewsData);
      
              // Tính tổng số sao và số lượng đánh giá
              const totalRating = reviewsData.reduce((sum, review) => sum + Number(review.rating), 0);
              const totalReviewsCount = reviewsData.length;
            //   const average = totalRating / totalReviewsCount;

              const average = totalReviewsCount > 0 ? totalRating / totalReviewsCount : 0;
      
              setAverageRating(average);
              setTotalReviews(totalReviewsCount);
            } catch (error) {
              console.error("Error fetching reviews:", error);
            }
          };
      
        fetchReviews();

        

    }, [id]);

    const renderStars = () => {
        const stars = [];
        const fullStars = Math.floor(averageRating); // Số sao đầy đủ
        const halfStar = averageRating % 1 >= 0.5; // Kiểm tra có sao lưng không
    
        // Thêm sao đầy đủ
        for (let i = 0; i < fullStars; i++) {
          stars.push(<span key={i} className="text-yellow-500">★</span>); // Sao đầy đủ
        }
    
        // Thêm sao lưng nếu có
        if (halfStar) {
          stars.push(<span key={fullStars} className="text-yellow-500">☆</span>); // Sao lưng
        }
    
        // Thêm sao rỗng cho đến 5 sao
        for (let i = fullStars + (halfStar ? 1 : 0); i < 5; i++) {
          stars.push(<span key={i} className="text-gray-300">☆</span>); // Sao rỗng
        }
    
        return stars;
    };

    const renderStarsReview = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating); // Số sao đầy đủ
        const halfStar = rating % 1 >= 0.5; // Kiểm tra có sao lưng không
    
        // Thêm sao đầy đủ
        for (let i = 0; i < fullStars; i++) {
          stars.push(<span key={i} className="text-yellow-500">★</span>); // Sao đầy đủ
        }
    
        // Thêm sao rỗng cho đến 5 sao
        for (let i = fullStars + (halfStar ? 1 : 0); i < 5; i++) {
          stars.push(<span key={i} className="text-gray-300">☆</span>); // Sao rỗng
        }
    
        return stars;
    };
    renderStarsReview();

    const handleBookingClick = () => {
        // Kiểm tra xem người dùng đã đăng nhập chưa
        const userData = localStorage.getItem('user');
        const user = JSON.parse(userData);

        if (user) {
            // Nếu đã đăng nhập, chuyển hướng đến trang đặt tour
            navigate(`/confirm-booking/${roomDetails.id}`);
        } else {
            // Lưu đường dẫn hiện tại vào localStorage
            localStorage.setItem('redirectPath', `/confirm-booking/${roomDetails.id}`);
            // Nếu chưa đăng nhập, chuyển hướng đến trang đăng nhập
            navigate('/login');
            toast.warning('Bạn cần đăng nhập để đặt phòng')
        }
    };

    if (error) return <p>{error}</p>;

    return(
        <div>
            <Header />

            <div className="w-full mt-[115px] h-8 bg-gray-100"></div>
            <div className="w-[96%] mx-auto">
            {roomDetails && roomDetails.id ? (
                <div className="text-left mt-14 text-3xl font-medium mb-5">{roomDetails.name}</div>
            ) : (
                <p>tên phòng...</p> 
            )}
                <div className="flex w-full mb-3 items-center">
                    <div className="flex">{renderStars()}</div> {/* Hiển thị số sao */}
                    <div className='flex justify-center items-center mx-2'>
                        <p className='font-medium '>{averageRating.toFixed(1)}</p> 
                        <p className='font-medium'>/5</p> 
                        <p className="mx-1">trong {totalReviews} đánh giá</p>
                    </div>
                    {/* <div className="ml-auto bg-[#13357B] text-white rounded-md hover:bg-black duration-100">
                        <button type="button" className="mx-2 my-1 font-medium">Tải về PDF</button>
                    </div> */}
                </div>

                {/* phần thông tin chi tiết */}
                <div className="w-full flex gap-x-3">
                    <div className="w-[70%]">
                    {Array.isArray(roomImages) && roomImages.length > 0 ? (
                    roomImages.length <2 ? (
                        
                        // Trường hợp có duy nhất một hình ảnh
                       
                                <div className="mb-10">
                                    <img src={`${SERVER_API}/Images/room/${roomImages[0].image}`} className='w-[963px] h-[490px] object-cover' alt="" />
                                </div>
                            
                        
                    ) : (
                        <Slider {...settings}>
                            {roomImages.map((image) => (
                                <div className="mb-10">
                                    <img src={`${SERVER_API}/Images/room/${image.image}`} className='w-[963px] h-[490px] object-cover' alt="" />
                                </div>
                            ))}
                        </Slider>
                        )
                    ) : (
                        <div className="w-[930px] h-[490px] flex items-center justify-center text-sm mb-3 bg-gray-100 rounded-md">
                           <p className="mx-3 mt-3">Không có hình ảnh</p>
                        </div>
                    )}
                        <div className="mt-10">
                            <div className="text-left font-semibold uppercase text-lg">Tổng quan</div>
                            {roomDetails && roomDetails.id ? (
                                <div className="text-left my-5 mx-3 text-gray-500">
                                    <div dangerouslySetInnerHTML={{ __html: roomDetails.description.replace(/\n/g, '<br/>') }} />
                                </div>
                            ) : (
                                <p>kông có dữ liệu</p> // Hiển thị thông báo đang tải khi chưa có dữ liệu
                            )}
                        </div>
                        <div>
                            <div className="text-left font-semibold uppercase text-lg mt-11 mb-2">Đánh giá & Bình luận</div>
                            <div className="w-0 h-0 ml-3 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[20px] border-gray-100"></div>
                            <div className="bg-gray-100 pt-2 px-2 rounded-md">
                            {Array.isArray(roomRating) && roomRating.length > 0 ? (
                                roomRating.map((rating) => (
                                <div className="mb-4">
                                    <div className="flex items-center">
                                        <div>
                                            <img src={`${SERVER_API}/Images/user/${rating.image_user}`} className='w-[20px] h-[20px] object-cover rounded-full' alt="" />
                                        </div>
                                        <div className="mx-2 font-medium">{rating.user_name}</div>
                                    </div>
                                    <div className="text-left">{renderStarsReview(rating.rating)}</div>
                                    <div className="w-full text-left text-sm">{rating.review}</div>
                                    {/* <div className="w-full h-[1px] bg-gray-100 mt-2 rounded-sm"></div> */}
                                </div>
                                ))
                            ) : (
                                <div className="text-left text-sm mb-3">Chưa có đánh giá nào.</div>
                            )}
                            </div>
                        </div>
                    </div>
                    {roomDetails && roomDetails.id ? (
                    <div className="w-[30%]">
                        <h5 className='text-left my-3 mx-1 font-medium text-xl'>
                            {roomDetails.name}
                        </h5>
                        {/* feature */}
                        <div>
                            <h6 className='text-left mx-1 my-2'>Đặc trưng</h6>
                            <div>
                            {Array.isArray(roomFeatures) ? (
                                <div className='flex flex-wrap'>
                                
                                {roomFeatures.map((roomFeature) => (
                                    <div className='bg-gray-100 mx-1 rounded-2xl gap-1/4' key={roomFeature.id}>
                                        <p className='px-3 py-1 text-xs'>{roomFeature.name}</p>
                                    </div>
                                ))}
                            
                                </div>
                            ) : (
                                <p className='text-xs py-2'>Không có dữ liệu đặc trưng</p> 
                            )}
                            </div>
                        </div>
                        {/* end-feature */}
                        {/* tiện ích */}
                        <div>
                            <h6 className='text-left mx-1 my-2'>Tiện ích</h6>
                            <div>
                            {Array.isArray(roomFacilities) ? (
                                <div className='flex flex-wrap'>
                                
                                {roomFacilities.map((roomFacility) => (
                                    <div className='bg-gray-100 mx-1 rounded-2xl gap-1/4' key={roomFacility.id}>
                                        <p className='px-3 py-1 text-xs'>{roomFacility.name}</p>
                                    </div>
                                ))}
                            
                                </div>
                            ) : (
                                <p className='text-xs py-2'>Không có dữ liệu tiện ích</p> 
                            )}
                            </div>
                        </div>
                        {/* end-tiện ích */}
                        {/* guest */}
                        <div>
                            <h6 className='text-left mx-1 my-2'>Khách</h6>
                            <div>
                                <div className='flex flex-wrap'>
                                    <div className='bg-gray-100 mx-1 mb-3 rounded-2xl gap-1/4'>
                                        <p className='px-3 py-1 text-xs'>{roomDetails.adult} Adult</p>
                                    </div>
                                    <div className='bg-gray-100 mx-1 mb-3 rounded-2xl gap-1/4'>
                                        <p className='px-3 py-1 text-xs'>{roomDetails.children} Children</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* end-guest */}
                        <div>
                            <h6 className='text-left mx-1 mt-2'>Khu vực</h6>
                            <div className='text-left'>
                                <p className='px-3 py-1 text-xs'>{roomDetails.area}</p>
                            </div>
                        </div>
                        <div onClick={handleBookingClick} className="uppercase mx-auto mb-1 mt-10 font-semibold bg-[#0194F3] text-white text-sm w-[95%] rounded-[5px] tracking-wider py-3 px-5 cursor-pointer hover:bg-opacity-90 hover:after:duration-200 hover:bg-white hover:text-black duration-100 border-[1px] border-[#0194F3]">
                            Đặt ngay
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
export default RoomDetail;