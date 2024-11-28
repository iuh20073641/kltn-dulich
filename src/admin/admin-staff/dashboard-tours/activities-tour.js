import { Link } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import { fetchTours } from "../../../component/api/tours";
import { fetchTourDepart } from "../../../component/api/tours";
import PriceDisplay from "../../../component/service/money";

function ActivitiesTour(){

    const [tours, setTours] = useState([]);
    const [sortTours, setSortTours] = useState("asc"); 
    const [searchQuery, setSearchQuery] = useState('');
    const [upcomingTours, setUpcomingTours] = useState([]); // Lưu tour có ngày lịch trình > ngày hiện tại

    useEffect(() => {
        // Hàm để gọi API và cập nhật state
        const fetchData = async () => {
           
            try {
                // Gọi API để lấy danh sách phòng
                const toursResponse = await fetchTours();
                const toursData = toursResponse.data; // Giả sử API trả về mảng các tour
                console.log(toursData);
                setTours(toursData);

            } catch (err) {
                console.error('Error fetching data:', err);
                
            } 
        };

        fetchData();
    }, []); // Chạy một lần khi component được mount

    
  useEffect(() => {
    // Hàm để lấy và lọc lịch trình tour
    const filterUpcomingTours = async () => {
      const today = new Date(); // Ngày hiện tại
      console.log(today);
      const filteredTours = [];

      for (const tour of tours) {
        try {
          const response = await fetchTourDepart(tour.id); // Gọi API lấy lịch trình của tour
          const schedules = response.data; // Giả sử API trả về mảng lịch trình

          // Lọc các lịch trình có ngày khởi hành > ngày hiện tại
          const upcomingSchedules = schedules.filter((schedule) => {
            
            const tourDate = new Date(schedule.day_depart);
            // console.log(tourDate);
            return tourDate > today;
          });

          // Nếu có lịch trình trong tương lai, thêm tour vào danh sách kết quả
          console.log(upcomingSchedules);
          if (upcomingSchedules.length > 0) {
            filteredTours.push({
              ...tour,
              upcomingSchedules, // Lưu các lịch trình tương lai trong tour
            });
          }
        } catch (error) {
          console.error(`Lỗi khi kiểm tra lịch trình cho tour ID ${tour.id}:`, error);
        }
      }

      setUpcomingTours(filteredTours); // Lưu các tour có lịch trình hợp lệ
    };

    if (tours.length > 0) {
      filterUpcomingTours();
    }
  }, [tours]);

    // Hàm sắp xếp danh sách theo depar_time
    const handleSortById = () => {
        const sortedTours = [...upcomingTours].sort((a, b) => {
            const id_A = a.id;
            const id_B = b.id;
            return sortTours === "asc" ? id_A - id_B : id_B - id_A;
        });

        setTours(sortedTours);
        setSortTours(sortTours === "asc" ? "desc" : "asc"); // Đổi thứ tự sắp xếp cho lần nhấn tiếp theo
    };

    const filteredTours = upcomingTours.filter((tour) => {
        
        // Tìm kiếm theo tên người dùng hoặc CCCD
        const isMatchingSearchTerm = 
            tour.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
            tour.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tour.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tour.style.toLowerCase().includes(searchQuery.toLowerCase());

        return isMatchingSearchTerm;

    });

    return(
        <div>
            <div className="flex">
                <div className="text-left mx-3 my-3">
                    <Link to="/dashboard-tours">
                        <i className="fa-solid fa-arrow-left text-2xl cursor-pointer"></i>
                    </Link>
                </div>
                <div className=" my-3 mx-auto font-semibold text-2xl uppercase">
                    Danh sách tour đang hoạt động
                </div>
            </div>
            <div className="w-[95%] mx-auto mb-4">
                <div className="w-full items-center justify-end flex gap-3">
                    <div className="w-[30%] text-end  float-right">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="block appearance-none w-full py-1 px-2 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded shadow-none ms-auto outline-none"
                            placeholder="Nhập id/tên/kiểu/loại"
                        />
                    </div>
                   
                    <button onClick={handleSortById}>
                        <div className="flex w-[100px] justify-center border-[1px] border-gray-300  rounded-[3px] bg-black text-white">
                            <div><i className={`fa-solid ${sortTours === "asc" ? "fa-arrow-down-9-1" : "fa-arrow-up-9-1"} mr-2`}></i></div>
                            <div className="">
                                {sortTours === "asc" ? "Giảm" : "Tăng"}
                            </div>
                        </div>
                    </button>
                </div>
            </div>
            <div className="w-[95%] mx-auto h-[550px] overflow-auto">
                <table className="w-[1800px] border-[1px] border-gray-300 border-collapse">
                    <thead className="">
                        <tr className="border-[1px] border-gray-300 sticky top-0 z-10 bg-gray-100 shadow-md">
                            <th className="w-[50px] border-r-[1px] border-gray-300 px-2">STT</th>
                            <th className="w-[90px] border-r-[1px] border-gray-300 px-2">Mã tour</th>
                            <th className="w-[500px] border-r-[1px] border-gray-300 px-2">Tên tour</th>
                            <th className="w-[150px] border-r-[1px] border-gray-300 px-2">Kiểu tour</th>
                            <th className="w-[200px] border-r-[1px] border-gray-300 px-2">Loại tour</th>
                            <th className="w-[150px] border-r-[1px] border-gray-300 px-2">Giá</th>
                            <th className="w-[150px] border-r-[1px] border-gray-300 px-2">Khuyến mãi(%)</th>
                            <th className="w-[120px] border-r-[1px] border-gray-300 px-2">Người TG tối thiểu</th>
                            <th className="w-[120px] border-r-[1px] border-gray-300 px-2">Người TG tối đa</th>
                            <th className="w-[200px] border-r-[1px] border-gray-300 px-2">Địa điểm khởi hành</th>
                            <th className="w-[130px] border-r-[1px] border-gray-300 px-2">Phương tiện</th>
                            <th className="w-[400px] border-r-[1px] border-gray-300 px-2">Lịch trình</th>
                            <th className="w-[100px] border-r-[1px] border-gray-300 px-2">Thời gian(ngày)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTours.map((tour, index) => (
                            <tr key={tour.id} className="border-[1px] border-b-gray-300">
                                <td className="border-r-[1px] border-gray-300 px-2">{index + 1}</td>
                                <td className="border-r-[1px] border-gray-300 px-2">{tour.id}</td>
                                <td className="border-r-[1px] border-gray-300 px-2">{tour.name}</td>
                                <td className="border-r-[1px] border-gray-300 px-2">{tour.style}</td>
                                <td className="border-r-[1px] border-gray-300 px-2 text-left">{tour.type}</td>
                                <td className="border-r-[1px] border-gray-300 px-2 text-left"><PriceDisplay price={tour.price} /></td>
                                <td className="border-r-[1px] border-gray-300 px-2 text-left">{tour.discount}</td>
                                <td className="border-r-[1px] border-gray-300 px-2 text-left">{tour.min_participant}</td>
                                <td className="border-r-[1px] border-gray-300 px-2 text-left">{tour.max_participant}</td>
                                <td className="border-r-[1px] border-gray-300 px-2 text-left">{tour.departurelocation}</td>
                                <td className="border-r-[1px] border-gray-300 px-2 text-left">{tour.vehicle}</td>
                                <td className="border-r-[1px] border-gray-300 px-2 text-left">{tour.itinerary}</td>
                                <td className="border-r-[1px] border-gray-300 px-2 text-left">{tour.timeTour}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
export default ActivitiesTour;