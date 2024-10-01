import { Link } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import { fetchTours } from "../../api/tours";
import PriceDisplay from "../../service/money";

function TourList() {

    const [tours, setTours] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Hàm để gọi API và cập nhật state
        const fetchData = async () => {
            try {
                // Gọi API để lấy danh sách phòng
                const toursResponse = await fetchTours();
                const toursData = toursResponse.data; // Giả sử API trả về mảng các tour
                setTours(toursData);


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
                        <div className="h-[210px] overflow-hidden bg-[url(https://images.unsplash.com/photo-1523345863760-5b7f3472d14f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHRvdXJpc218ZW58MHx8MHx8fDA%3D)] bg-no-repeat bg-center bg-cover transform">
                            <a href="https://www.facebook.com/">
                                <div className="absolute inset-0 bg-black opacity-0 hover:opacity-50 transition duration-300">
                                    <p className="text-white text-left text-sm mx-2 my-2 leading-6 line-clamp-4">
                                       Lịch trình:{tour.timeTour} ngày Khởi hành{tour.depart}
                                    </p>
                                </div>
                            </a>
                        </div>

                    </div>
                    <div className="text-left px-2 py-2 bg-gray-200">
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
                            <div className="text-right mr-2 font-medium text-lg text-[#FF5E1F]"><PriceDisplay price={tour.price} /></div>
                        </div>
                    </div>
                </div>
                ))}
            </div>
        </div>
    );
}
export default TourList;