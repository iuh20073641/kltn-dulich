import React, { useEffect, useState } from 'react';
// import { getAllRooms } from '../service/room';
// import ProductItem from './ProductItem';
import { fetchRoomFeature } from '../api/room';
import { fetchRooms } from '../api/room';
import { fetchRoomFacilities } from '../api/room';

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
    const [error, setError] = useState(null);

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

            } catch (err) {
                console.error('Error fetching data:', err);
                setError(err);
            }
        };

        fetchData();
    }, []); // Chạy một lần khi component được mount

    if({})

    if (error) return <div>Error: {error.message}</div>;
    return (
        <div className=''>
          {rooms.map((room) => (
          <div className='block bg-white my-3' key={room.id}>
            <div className='flex items-center justify-center gap-2'>
              <div className='basis-2/5 mx-3 my-3'>
                <img src='https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aG90ZWx8ZW58MHx8MHx8fDA%3D' alt="Hotel 1" className='w-[407px] h-[231px] rounded-md object-cover' />
              </div>
              <div className='basis-3/5'>
                <h5 className='text-left my-3 mx-1 font-medium text-xl'>
                  {room.name}
                </h5>
                {/* feature */}
                <div>
                  <h6 className='text-left mx-1 my-2'>Đặc trưng</h6>
                  <div>
                  {roomFeatures[room.id] && Array.isArray(roomFeatures[room.id]) ? (
                        <div className='flex flex-wrap'>
                            
                            {roomFeatures[room.id].map((feature) => (
                                <div className='bg-gray-100 mx-1 rounded-2xl gap-1/4' key={feature.id}>
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
            </div>
          </div>
           ))}
        </div>
    );
};

export default HotelRooms;