import { Link } from "react-router-dom";
import React, { useEffect, useState } from 'react';
// import { getAllRooms } from '../service/room';
// import ProductItem from './ProductItem';
import { fetchRoomFeature } from '../../api/room';
import { fetchRooms } from '../../api/room';
import { fetchRoomFacilities } from '../../api/room';
import { fetchRoomImages } from "../../api/room";
import DiscountDisplay from '../../service/discount';

// const RoomList = () => {
//     const [products, setProducts] = useState([]);
//     const [productDetails, setProductDetails] = useState([]);

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const roomsData = await getAllRooms();
//                 setProducts(roomsData);

//                 const detailsPromises = roomsData.map(product => 
//                     fetchRoomFeature(product.id)
//                 );
//                 // Đợi tất cả promises được giải quyết và cập nhật state
//                 const detailsResponses = await Promise.all(detailsPromises);
//                 const detailsData = detailsResponses.map(response => response.data);
//                 setProductDetails(detailsData);
//             } catch (error) {
//                 console.error('Failed to fetch products', error);
//             }
//         };

//         fetchData();
//     }, []);
const HotelRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [roomFeatures, setRoomFeatures] = useState({});
  const [roomFacilities, setRoomFacilities] = useState({});
  const [roomImages, setRoomImages] = useState([]);
  const [error, setError] = useState(null);

  const [filteredRooms, setFilteredRooms] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  // const [selectedTourTypes, setSelectedTourTypes] = useState([]);

  useEffect(() => {
    // Hàm để gọi API và cập nhật state
    const fetchData = async () => {
      try {
        // Gọi API để lấy danh sách phòng
        const roomsResponse = await fetchRooms();
        const roomsData = roomsResponse.data; // Giả sử API trả về mảng các phòng
        setRooms(roomsData);

        // Tự động gọi API khác để lấy thông tin chi tiết (feature) của từng phòng
        const featurePromises = roomsData.map(async (room) => {
          const featureResponse = await fetchRoomFeature(room.id);
          // console.log(`Feature Response for Room ID ${room.id}: `, featureResponse);  
          return { roomId: room.id, features: featureResponse.data };
        });

        // Đợi tất cả các lời gọi API hoàn tất
        const allFeatures = await Promise.all(featurePromises);

        // Chuyển đổi kết quả thành một đối tượng để dễ dàng truy xuất thông tin chi tiết(feature)
        const featuresMap = {};
        allFeatures.forEach(item => {
          featuresMap[item.roomId] = item.features;
        });
        setRoomFeatures(featuresMap);

        // Tự động gọi API khác để lấy thông tin chi tiết (facilities) của từng phòng
        const facilitiesPromises = roomsData.map(async (room) => {
          const facilitiesResponse = await fetchRoomFacilities(room.id);
          // console.log(`Feature Response for Room ID ${room.id}: `, featureResponse);  
          return { roomId: room.id, facilities: facilitiesResponse.data };
        });

        // Đợi tất cả các lời gọi API hoàn tất
        const allFacilities = await Promise.all(facilitiesPromises);

        // Chuyển đổi kết quả thành một đối tượng để dễ dàng truy xuất thông tin chi tiết (facilities)
        const facilitiesMap = {};
        allFacilities.forEach(item => {
          facilitiesMap[item.roomId] = item.facilities;
        });
        setRoomFacilities(facilitiesMap);

        // Tự động gọi API khác để lấy thông tin chi tiết (image) của từng phòng
        const imagePromises = roomsData.map(async (room) => {
          const imageResponse = await fetchRoomImages(room.id);
          // console.log(`Feature Response for Room ID ${room.id}: `, featureResponse);  
          return { roomId: room.id, image: imageResponse.data };
        });

        // Đợi tất cả các lời gọi API hoàn tất
        const allImages = await Promise.all(imagePromises);

        // Chuyển đổi kết quả thành một đối tượng để dễ dàng truy xuất thông tin chi tiết(Image)
        const imageMap = {};
        allImages.forEach(item => {
          imageMap[item.roomId] = item.image;
        });
        setRoomImages(imageMap);

      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err);
      }
    };

    fetchData();

  }, []); // Chạy một lần khi component được mount

  // const handleFilterChange = (event) => {
  //   const value = event.target.value;
  //   const checked = event.target.checked;

  //   if (checked) {
  //       setFilterLocation([...filterLocation, value]);
  //   } else {
  //       setFilterLocation(filterLocation.filter((location) => location !== value));
  //   }
  // };

  const handleSearchInputChange = (event) => {
    setSearchTerm(event.target.value);
};

  useEffect(() => {
    let filtered = rooms;

    // Lọc theo từ khóa tìm kiếm
    if (searchTerm) {
      filtered = filtered.filter((room) => 
          room.area.toLowerCase().includes(searchTerm.toLowerCase()) // Thay "name" bằng trường phù hợp trong dữ liệu của bạn
      );
    }
    setFilteredRooms(filtered);
    // // Lọc theo kiểu tour nếu có
    // if (selectedTourTypes.length > 0) {
    //     filtered = filtered.filter((room) => selectedTourTypes.includes(room.type));
    // }

    // setFilteredRooms(filtered); // Cập nhật lại danh sách các tour đã được lọc
}, [searchTerm, rooms]); // Chạy khi filterLocation, selectedTourTypes hoặc tours thay đổi

  if ({})

    if (error) return <div>Error: {error.message}</div>;
  return (
    <div className='flex'>
      <div className="lg:w-1/4 md:w-full pr-4 pl-4 lg:mb-0 mb-4 ps-4">
        <nav className="relative flex flex-wrap items-center content-between py-3 px-4  text-black bg-white rounded shadow">
          <div className="container max-w-full mx-auto sm:px-4 lg:flex-col items-stretch">
            <h4 className="mt-2 font-semibold text-left text-xl uppercase">Tìm kiếm</h4>
            <div className="flex-grow items-center flex-col mt-2" id="filterDropdown">
              {/* check availablity */}
              <div className="border bg-gray-100 p-6 rounded mb-3">
                <h5 className="flex items-center justify-between mb-3">
                  <span className="uppercase">Kiểm tra ngày đặt</span>
                  <button id="chk_avail_btn" className="align-middle text-center select-none border font-normal whitespace-no-wrap rounded  no-underline shadow-none py-1 px-2 leading-tight text-xs  text-gray-600 hidden">
                    Reset
                  </button>
                </h5>
                <div className="text-left">Ngày nhận phòng</div>
                <input type="date" className="block appearance-none w-full py-1 px-2 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded shadow-none mb-3" id="checkin" />
                <div className="form-label text-left">Ngày trả phòng</div>
                <input
                  type="date"
                  className="block appearance-none w-full py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded shadow-none"

                  id="checkout"
                />
              </div>
              {/* Facilities  */}
              <div className="border bg-gray-100 p-6 rounded mb-3">
                <h5 className="flex items-center justify-between mb-3" style={{ fontSize: 18 }}>
                  <span>Địa điểm</span>
                  <button id="facilities_btn" className="inline-block align-middle text-center select-none border font-normal whitespace-no-wrap rounded  no-underline shadow-none py-1 px-2 leading-tight text-xs  text-gray-600">
                    Reset
                  </button>
                </h5>
                <input
                  type="text"
                  className="block appearance-none w-full py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded shadow-none"
                  value={searchTerm} 
                  onChange={handleSearchInputChange}
                  id="checkout"
                />
              </div>
              {/* Guests  */}
              <div className="border bg-gray-100 p-6 rounded mb-3">
                <h5 className="flex items-center justify-between mb-3" style={{ fontSize: 18 }}>
                  <span>KHÁCH</span>
                  <button
                    id="guests_btn"

                    className="inline-block align-middle text-center select-none border font-normal whitespace-no-wrap rounded  no-underline shadow-none py-1 px-2 leading-tight text-xs  text-gray-600"
                  >
                    Reset
                  </button>
                </h5>
                <div className="flex">
                  <div className="me-3">
                    <label className="form-label ">Người lớn</label>
                    <input
                      type="number"
                      min={1}
                      id="adults"
                      defaultValue="<?php echo $adult_default ?>"

                      className="block appearance-none w-full py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded shadow-none"
                    />
                  </div>
                  <div>
                    <label className="form-label ">Trẻ em</label>
                    <input type="number" min={1} id="children" className="block appearance-none w-full py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded shadow-none" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>
      <div className="lg:w-3/4 md:w-full pr-4 pl-4 px-4" id="rooms-data">
        {filteredRooms.map((room) => (
          <div className='block bg-white my-3' key={room.id}>
            <div className='flex w-full items-center gap-2'>
              {roomImages[room.id] && Array.isArray(roomImages[room.id]) && roomImages[room.id].length > 0 ? (
                <div className='basis-5/12 mx-3 my-3'>
                  <img src={`http://localhost:88/api_travel/api/Images/room/${roomImages[room.id][0].image}`} alt="Hotel" className='w-[400px] h-[231px] rounded-md object-cover' />
                </div>
              ) : (
                <div className='basis-5/12 mx-3 my-3'>
                  <div className='w-[375px] h-[231px] flex items-center justify-center text-xs py-2 bg-gray-100 rounded-md'>
                    <p>Không có hình ảnh</p>
                  </div>
                </div>
              )}
              <div className='basis-5/12 flex-grow-0 flex-shrink-0'>
                <h5 className='text-left my-3 mx-1 font-medium text-xl'>
                  {room.name}
                </h5>
                {/* feature */}
                <div>
                  <h6 className='text-left mx-1 my-2'>Đặc trưng</h6>
                  <div>
                    {roomFeatures[room.id] && Array.isArray(roomFeatures[room.id]) ? (
                      <div className='flex flex-wrap gap-1'>

                        {roomFeatures[room.id].map((feature) => (
                          <div className='bg-gray-100 mx-1 rounded-2xl' key={feature.id}>
                            <p className='px-3 py-1 text-xs'>{feature.name}</p>
                          </div>
                        ))}

                      </div>
                    ) : (
                      <p className='text-xs py-2'>Không có đặc trưng</p>
                    )}
                  </div>
                </div>
                {/* end-feature */}
                {/* tiện ích */}
                <div>
                  <h6 className='text-left mx-1 my-2'>Tiện ích</h6>
                  <div>
                    {roomFacilities[room.id] && Array.isArray(roomFacilities[room.id]) ? (
                      <div className='flex flex-wrap'>

                        {roomFacilities[room.id].map((facilities) => (
                          <div className='bg-gray-100 mx-1 rounded-2xl gap-1/4' key={facilities.id}>
                            <p className='px-3 py-1 text-xs'>{facilities.name}</p>
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
                        <p className='px-3 py-1 text-xs'>{room.adult} Adult</p>
                      </div>
                      <div className='bg-gray-100 mx-1 mb-3 rounded-2xl gap-1/4'>
                        <p className='px-3 py-1 text-xs'>{room.children} Children</p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* end-guest */}
              </div>
              <div className='basis-2/12 flex-grow-0 flex-shrink-0'>
                <div className='w-full text-lg font-medium text-[#FF5E1F] mb-5'>
                  <DiscountDisplay originalPrice={room.price} discountPercent={room.discount} />
                </div>
                <div className="uppercase my-1 font-semibold bg-[#0194F3] text-white text-sm w-[95%] rounded-[5px] tracking-wider py-3 px-5 cursor-pointer hover:bg-opacity-90 hover:after:duration-200 hover:bg-white hover:text-black duration-100 border-[1px] border-[#0194F3]">
                  Đặt ngay
                </div>
                {/* <Link to={`/room-details/${room.id}`}>
                    <div className="uppercase my-1 font-semibold bg-[#0194F3] text-white text-sm w-[95%] rounded-[5px] tracking-wider py-3 px-5 cursor-pointer hover:bg-opacity-90 hover:after:duration-200 hover:bg-white hover:text-black duration-100 border-[1px] border-[#0194F3]">
                      Đặt ngay
                    </div>
                  </Link> */}
                <Link to={`/room-details/${room.id}`}>
                  <div className="uppercase my-1 font-normal hover:text-white text-sm w-[95%] rounded-[5px] tracking-wider py-3 px-5 cursor-pointer hover:bg-opacity-90 hover:after:duration-200 hover:border-[rgba(28,41,48,1)] hover:bg-[rgba(28,41,48,1)] text-black duration-100 border-[1px] border-[#0194F3]">
                    Xem chi tiết
                  </div>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HotelRooms;