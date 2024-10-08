import { Link } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import { fetchTours } from "../../api/tours";
import { fetchTourImages } from "../../api/tours";
// import PriceDisplay from "../../service/money";
import DiscountDisplay from "../../service/discount";

function TourList() {

    const [tours, setTours] = useState([]);
    const [error, setError] = useState(null);
    const [tourImages, setTourImages] = useState([]);

    useEffect(() => {
        // Hàm để gọi API và cập nhật state
        const fetchData = async () => {
            try {
                // Gọi API để lấy danh sách phòng
                const toursResponse = await fetchTours();
                const toursData = toursResponse.data; // Giả sử API trả về mảng các tour
                setTours(toursData);

                // Tự động gọi API khác để lấy thông tin chi tiết (image) của từng phòng
                const imagePromises = toursData.map(async (tour) => {
                    const imageResponse = await fetchTourImages(tour.id);
                    // console.log(`Feature Response for Room ID ${room.id}: `, featureResponse);  
                    return { tourId: tour.id, image: imageResponse.data };
                });

                // Đợi tất cả các lời gọi API hoàn tất
                const allImages = await Promise.all(imagePromises);

                // Chuyển đổi kết quả thành một đối tượng để dễ dàng truy xuất thông tin chi tiết(Image)
                const imageMap = {};
                allImages.forEach(item => {
                  imageMap[item.tourId] = item.image;
                });
                setTourImages(imageMap);

            } catch (err) {
                console.error('Error fetching data:', err);
                setError(err);
            }
        };

        fetchData();
    }, []); // Chạy một lần khi component được mount

    

    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="lg:w-3/4 md:w-full pr-4 pl-4 px-4" id="rooms-data">
            <div className="grid grid-cols-3 gap-x-6 gap-y-4">
                {/* đây là nơi chứa sản phẩm */}
                {tours.map((tour) => (
                <div className="w-full tqd-products border-[1px] border-b-gray-200" key={tour.id}>
                    <div className='h-[210px] overflow-hidden'>
                    {tourImages[tour.id] && Array.isArray(tourImages[tour.id]) && tourImages[tour.id].length > 0 ? (
                        <div className="h-[210px] overflow-hidden bg-no-repeat bg-center bg-cover transform" style={{
                            backgroundImage: `url('http://localhost:88/api_travel/api/Images/tour/${tourImages[tour.id][0].image}')`
                          }}>
                            <Link to={`/tour-details/${tour.id}`}>
                                <div className="absolute inset-0 bg-black opacity-0 hover:opacity-50 transition duration-300">
                                    <p className="text-white text-left text-sm mx-2 my-2 leading-6 line-clamp-4">
                                       Lịch trình:{tour.timeTour} ngày Khởi hành{tour.depart}
                                    </p>
                                </div>
                            </Link>
                        </div>
                    ) : (
                        <div className='basis-5/12 mx-3 my-3'>
                          <div className='w-[375px] h-[231px] flex items-center text-xs py-2 bg-gray-100 rounded-md'>
                            <p className="text-center">Không có hình ảnh</p>
                          </div> 
                        </div>
                    )}
                    </div>
                    <div className="text-left h-[70px] px-2 py-2 bg-gray-200">
                        {/* <a href="https://www.facebook.com/" className="text-lg font-normal cursor-pointer hover:text-[#13357B]">
                                            Du lịch Đà Nẵng 3 ngày 2 đêm: Lịch trình chi tiết 
                                        </a> */}
                        <Link to={`/tour-details/${tour.id}`}><p className="text-lg font-normal line-clamp-2 cursor-pointer hover:text-[#13357B]">
                            {tour.name}
                        </p></Link>
                    </div>
                    <div className="flex flex-wrap ">
                        <div className="my-3 pl-2 w-1/2">
                            <div className="flex items-center">
                                <div className="mr-2">
                                    <i className="fa-regular fa-clock text-sm"></i>
                                </div>
                                {tour.timeTour - 1 > 0 ? (
                                    <div className="text-sm">
                                        {tour.timeTour} ngày {tour.timeTour - 1} đêm
                                    </div>  
                                ) : (
                                    <div className="text-sm">
                                        {tour.timeTour} ngày 
                                    </div> 
                                )}
                            </div>
                            <div className="flex items-center">
                                <div className="mr-2">
                                    <i className="fa-regular fa-calendar text-sm"></i>
                                </div>
                                <div className="text-sm truncate">
                                    {tour.depart}
                                </div>
                            </div>
                        </div>
                        <div className="w-1/2 my-3 flex items-end justify-end">
                            <div className="text-right mr-2 font-medium text-lg text-[#FF5E1F]"><DiscountDisplay originalPrice={tour.price} discountPercent={tour.discount} /></div>
                        </div>
                    </div>
                </div>
                ))}
            </div>
        </div>
    );
}
export default TourList;