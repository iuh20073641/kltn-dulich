import Header from "../header";
import Footer from "../footer/footer";
import { useParams } from 'react-router-dom';
import { fetchTourDetails } from "../api/tours";
import { fetchTourSchedule } from "../api/tours";
import { fetchTourRating } from "../api/tours";
import React, { useEffect, useState } from 'react';
import PriceDisplay from "../service/money";
import DiscountDisplay from "../service/discount";

function TourDetails(){

    const { id } = useParams();  // Lấy ID từ URL
    const [tourDetails, setTourDetails] = useState(null);
    const [tourSchedule, setTourSchedule] = useState([]);
    // const [reviews, setReviews] = useState([]);
    const [tourRating, setTourRating] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [totalReviews, setTotalReviews] = useState(0);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Hàm để gọi API và cập nhật state
        const tourDetail = async () => {
            try {
                // Gọi API để lấy thông tin chi tiết của một phòng
                const toursResponse = await fetchTourDetails(id);
                const toursData = toursResponse.data; 
                setTourDetails(toursData);
                // console.log('Dữ liệu từ API:', tourDetails);

                // Nếu API trả về mảng, hãy lấy phần tử đầu tiên
                if (Array.isArray(toursData) && toursData.length > 0) {
                    setTourDetails(toursData[0]);
                } else {
                    setTourDetails(null); // Xử lý nếu không có dữ liệu hợp lệ
                }

                // Gọi API để lấy thông tin chi tiết của một phòng
                const toursScheduleResponse = await fetchTourSchedule(id);
                const toursScheduleData = toursScheduleResponse.data; 
                setTourSchedule(toursScheduleData);
                // console.log('Dữ liệu từ API:', tourDetails);

            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Có lỗi xảy ra khi lấy dữ liệu sản phẩm.');
            }
        };

        tourDetail();

        const fetchReviews = async () => {
            try {
              const responseRating = await fetchTourRating(id);
              const reviewsData = responseRating.data;
              setTourRating(reviewsData);
      
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

    if (error) return <p>{error}</p>;

    return(
        <div>
            <Header />
            <div className="w-full mt-[115px] h-8 bg-gray-100"></div>
            <div className="tour-details w-[96%] mx-auto">
            {tourDetails && tourDetails.id ? (
                <div className="text-left mt-14 text-3xl font-medium mb-5">{tourDetails.name}</div>
            ) : (
                <p>tên tour...</p> 
            )}
                <div className="flex w-full mb-3 items-center">
                    <div className="flex">{renderStars()}</div> {/* Hiển thị số sao */}
                    <div className='flex justify-center items-center mx-2'>
                        <p className='font-medium '>{averageRating.toFixed(1)}</p> 
                        <p className='font-medium'>/5</p> 
                        <p className="mx-1">trong {totalReviews} đánh giá</p>
                    </div>
                    <div className="ml-auto bg-[#13357B] text-white rounded-md hover:bg-black duration-100">
                        <button type="button" className="mx-2 my-1 font-medium">Tải về PDF</button>
                    </div>
                </div>

                {/* phần thông tin chi tiết */}
                <div className="w-full flex gap-x-3">
                    {tourDetails && tourDetails.id ? (
                    <div className="w-[70%]">
                        <div className="mb-10">
                            <img src="https://plus.unsplash.com/premium_photo-1690960644375-6f2399a08ebc?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" className='w-[963px] h-[490px] object-cover' alt="" />
                        </div>
                        {/* điểm nhấn hành trình */}
                        <div>
                            <div className="flex items-center">
                                <div>
                                    <i className="fa-solid fa-circle-info text-[#0194F3]"></i>
                                </div>
                                <div className="text-left font-medium text-xl mx-2">
                                    Điểm nhấn hành trình
                                </div>
                            </div>
                            <div className="h-[1px] bg-gray-300 my-3"></div>
                            <div>
                                <div className="flex text-left my-3 text-gray-700">
                                    <div className="w-[20%] ml-2 font-medium">
                                        Hành trình
                                    </div>
                                    <div className="w-[80%]">
                                        {tourDetails.itinerary}
                                    </div>
                                </div>
                                <div className="flex text-left my-3 text-gray-700">
                                    <div className="w-[20%] ml-2 font-medium">
                                        Lịch trình
                                    </div>
                                    <div className="w-[80%]">
                                    {tourDetails.timeTour - 1 > 0 ? (
                                        <div className="">
                                            {tourDetails.timeTour} ngày {tourDetails.timeTour - 1} đêm
                                        </div>  
                                    ) : (
                                        <div className="">
                                            {tourDetails.timeTour} ngày 
                                        </div> 
                                    )}
                                    </div>
                                </div>
                                <div className="flex text-left my-3 text-gray-700">
                                    <div className="w-[20%] ml-2 font-medium">
                                        Khởi hành
                                    </div>
                                    <div className="w-[80%]">
                                        {tourDetails.depart}
                                    </div>
                                </div>
                                <div className="flex text-left my-3 text-gray-700">
                                    <div className="w-[20%] ml-2 font-medium">
                                        Vận chuyển
                                    </div>
                                    <div className="w-[80%]">
                                        {tourDetails.vehicle}
                                    </div>
                                </div>
                            </div>
                            <div className="text-left text-sm mb-16">
                                <div dangerouslySetInnerHTML={{ __html: tourDetails.description.replace(/\n/g, '<br/>') }} />
                            </div>
                            <div className="flex items-center">
                                <div>
                                    <i className="fa-regular fa-map text-[#0194F3]"></i>
                                </div>
                                <div className="text-left font-medium text-xl mx-2">
                                    Lịch trình
                                </div>
                            </div>
                            <div className="h-[1px] bg-gray-300 my-3"></div>
                            <div>
                            {tourSchedule.map((tourSchedule) => (
                                <div key={tourSchedule.id}>
                                    <div className="text-left flex bg-[#0194F3] text-white rounded-md items-center">
                                        <p className="mr-1 py-1 ml-3 font-medium text-lg">Ngày {tourSchedule.date}</p>
                                        <p className="py-1 font-normal text-base"> | {tourSchedule.locations}</p>
                                    </div>
                                    <div className="w-0 h-0 ml-3 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[20px] border-gray-100"></div>
                                    <div className="text-left bg-gray-100 rounded-md mb-4">
                                        <div className="text-sm mx-3 py-4">
                                            {tourSchedule.schedule}
                                        </div>
                                        <div className="w-[95%] mx-auto pb-7">
                                            <img src={`/${tourSchedule.image}`} className='w-full h-full object-cover' alt={tourSchedule.image} />
                                            {/* <img src={tourSchedule.schedule} alt="hình" className="h-[300px] w-full object-cover rounded-xl" /> */}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            </div>
                            <div className="w-full">
                                <div className="text-left font-semibold uppercase text-lg mt-11 mb-2">Đánh giá & Bình luận</div>
                                {tourRating.map((rating) => (
                                <div className="mb-4">
                                    <div className="flex items-center">
                                        <div>
                                            <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" className='w-[20px] h-[20px] object-cover rounded-full' alt="" />
                                        </div>
                                        <div className="mx-2 font-medium">{rating.user_name}</div>
                                    </div>
                                    <div className="text-left">{renderStarsReview(rating.rating)}</div>
                                    <div className="w-full text-left text-sm">{rating.review}</div>
                                    {/* <div className="w-full h-[1px] bg-gray-100 mt-2 rounded-sm"></div> */}
                                </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    ) : (
                        <p>Đang tải...</p> // Hiển thị thông báo đang tải khi chưa có dữ liệu
                    )}
                    {tourDetails && tourDetails.id ? (
                    <div className="w-[30%]">
                        <div className="border-[1px] border-gray-300">
                            <div className="text-left mx-3 font-medium text-lg mt-4 mb-3">
                                {tourDetails.name}
                            </div>
                            <div className="h-[1px] mx-3 bg-gray-200"></div>
                            <div className="flex text-left my-3">
                                <div className="w-[30%] ml-3 font-medium">
                                    Mã tour:
                                </div>
                                <div className="w-[70%]">
                                    {tourDetails.id}
                                </div>
                            </div>
                            <div className="h-[1px] mx-3 bg-gray-200"></div>
                            <div className="flex text-left my-3">
                                <div className="w-[30%] ml-3 font-medium">
                                    Thời gian:
                                </div>
                                <div className="w-[70%]">
                                {tourDetails.timeTour - 1 > 0 ? (
                                    <div className="text-sm">
                                        {tourDetails.timeTour} ngày {tourDetails.timeTour - 1} đêm
                                    </div>  
                                ) : (
                                    <div className="text-sm">
                                        {tourDetails.timeTour} ngày 
                                    </div> 
                                )}
                                </div>
                            </div>
                            <div className="h-[1px] mx-3 bg-gray-200"></div>
                            <div className="flex text-left my-3">
                                <div className="w-[30%] ml-3 font-medium">
                                    Khởi hành:
                                </div>
                                <div className="w-[70%]">
                                    {tourDetails.depart}   
                                </div>
                            </div>
                            <div className="h-[1px] mx-3 bg-gray-200"></div>
                            <div className="flex text-left my-3">
                                <div className="w-[30%] ml-3 font-medium">
                                    Vận Chuyển:
                                </div>
                                <div className="w-[70%]">
                                    {tourDetails.vehicle}   
                                </div>
                            </div>
                            <div className="h-[1px] mx-3 bg-gray-200"></div>
                            <div className="flex text-left mt-3 mb-4">
                                <div className="w-[30%] ml-3 font-medium">
                                    Xuất phát:
                                </div>
                                <div className="w-[70%]">
                                    Từ {tourDetails.departurelocation}      
                                </div>
                            </div>
                        </div>
                        <div className="bg-[rgba(28,41,48,1)] text-white my-5">
                            <div className="flex mx-3 py-5 items-center">
                                <p className="mr-1">
                                    Giá từ:
                                </p>
                                <div className="mr-1 text-2xl font-medium"><DiscountDisplay originalPrice={tourDetails.price} discountPercent={tourDetails.discount} /></div>
                                <div className="line-through"><PriceDisplay price={tourDetails.price} /></div>
                            </div>
                            <div className="w-full pb-4 text-black">
                                <select className="w-[95%] rounded-md h-9 outline-none">
                                    <option value='1'>22-12-2024</option>
                                    <option value='1'>22-12-2024</option>
                                </select>
                            </div>
                            <div className='flex justify-center pb-4'>
                                <div className="uppercase font-semibold bg-[#0194F3] text-white text-sm w-[95%] rounded-[5px] tracking-wider py-3 px-5 cursor-pointer hover:bg-opacity-90 hover:after:duration-200 hover:bg-white hover:text-black duration-100 border-[1px] border-black">
                                    Đặt tour
                                </div>
                            </div>
                        </div>
                    </div>
                    ) : (
                        <p>Đang tải...</p> // Hiển thị thông báo đang tải khi chưa có dữ liệu
                    )}
                  
                </div>
                
            </div>
            <Footer />
        </div>
    );
}
export default TourDetails;