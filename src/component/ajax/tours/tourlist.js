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

    const [filteredTours, setFilteredTours] = useState([]);
    const [filterLocation, setFilterLocation] = useState([]);
    const [selectedTourTypes, setSelectedTourTypes] = useState([]);

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

    const handleFilterChange = (event) => {
        const value = event.target.value;
        const checked = event.target.checked;

        if (checked) {
            setFilterLocation([...filterLocation, value]);
        } else {
            setFilterLocation(filterLocation.filter((location) => location !== value));
        }
    };

    const handleTourTypeChange = (event) => {
        const value = event.target.value;
        setSelectedTourTypes(prev => 
            prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]
        );
    };

    // useEffect(() => {
    //     if (filterLocation.length > 0) {
    //         const filtered = tours.filter((tour) => filterLocation.includes(tour.departurelocation));
    //         setFilteredTours(filtered);
    //     } else {
    //         setFilteredTours(tours); // Nếu không có bộ lọc nào thì hiển thị tất cả các tour
    //     }
    // }, [filterLocation, tours]);

    useEffect(() => {
        let filtered = tours;
    
        // Lọc theo địa điểm nếu có
        if (filterLocation.length > 0) {
            filtered = filtered.filter((tour) => filterLocation.includes(tour.departurelocation));
        }
    
        // Lọc theo kiểu tour nếu có
        if (selectedTourTypes.length > 0) {
            filtered = filtered.filter((tour) => selectedTourTypes.includes(tour.type));
        }
    
        setFilteredTours(filtered); // Cập nhật lại danh sách các tour đã được lọc
    }, [filterLocation, selectedTourTypes, tours]); // Chạy khi filterLocation, selectedTourTypes hoặc tours thay đổi

    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="flex">
            <div className="w-[25%] pr-4 pl-4 lg:mb-0 mb-4 ps-4">
                <nav className="relative flex flex-wrap items-center content-between py-3 px-2  text-black">
                    <div className="container max-w-full mx-auto sm:px-4 lg:flex-col items-stretch bg-[#008fea]">
                        <h4 className="my-2 font-semibold text-left text-white">Bạn muốn khởi hành từ đâu?</h4>
                        {/* <button className="py-1 px-2 text-md leading-normal bg-transparent border border-transparent rounded" type="button" data-bs-toggle="collapse" data-bs-target="#filterDropdown" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                                            <span className="px-5 py-1 border border-gray-600 rounded" />
                                        </button> */}

                        {/* Area  */}
                        <div className="bg-[#008fea] font-medium mb-3">
                            <div className="w-full text-left bg-white rounded-md mb-1">
                                <input type="checkbox" onChange={handleFilterChange} value='Hồ Chí Minh' className="mx-2 my-3" />Hồ Chí Minh
                            </div>
                            <div className="w-full text-left bg-white rounded-md mb-1">
                                <input type="checkbox" value="Hà Nội"
                                    onChange={handleFilterChange} className="mx-2 my-3" />Hà Nội
                            </div>
                            <div className="w-full text-left bg-white rounded-md mb-1">
                                <input type="checkbox" value="Đà Nẵng"
                                    onChange={handleFilterChange} className="mx-2 my-3" />Đà Nẵng
                            </div>
                        </div>

                    </div>

                    <div className="container max-w-full mx-auto sm:px-4 lg:flex-col items-stretch bg-[#008fea]">
                        <h4 className="my-2 font-semibold text-left text-white">Kiểu tour?</h4>
                        {/* <button className="py-1 px-2 text-md leading-normal bg-transparent border border-transparent rounded" type="button" data-bs-toggle="collapse" data-bs-target="#filterDropdown" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                                            <span className="px-5 py-1 border border-gray-600 rounded" />
                                        </button> */}

                        {/* Area  */}
                        <div className="bg-[#008fea] font-medium mb-3">
                            <div className="w-full text-left bg-white rounded-md mb-1">
                                <input type="checkbox" onChange={handleTourTypeChange} value='Gia đình' className="mx-2 my-3" />Gia đình
                            </div>
                            <div className="w-full text-left bg-white rounded-md mb-1">
                                <input type="checkbox" value="Theo đoàn"
                                    onChange={handleTourTypeChange} className="mx-2 my-3" />Theo đoàn
                            </div>
                            <div className="w-full text-left bg-white rounded-md mb-1">
                                <input type="checkbox" value="Theo nhóm nhỏ"
                                    onChange={handleTourTypeChange} className="mx-2 my-3" />Theo nhóm nhỏ
                            </div>
                        </div>

                    </div>
                </nav>
            </div>
            <div className="w-[75%] pr-4 pl-4 px-4" id="rooms-data">
                <div className="grid grid-cols-3 gap-x-6 gap-y-4">
                    {/* đây là nơi chứa sản phẩm */}
                    {filteredTours.map((tour) => (
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
        </div>
    );
}
export default TourList;