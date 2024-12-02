import HeaderCensor from "../header-admin/header-admin";
import { fetchAllTourRating } from "../../../component/api/tours";
import React, { useEffect, useState } from 'react';
// import CustomPieChart from "../../../component/service/chart";

function RatingTour(){

    const [rattings, setRattings] = useState([]);
    const [filterOption, setFilterOption] = useState('7days'); // Mặc định là 7 ngày
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [searchQuery, setSearchQuery] = useState(''); // Thêm trạng thái để lưu giá trị tìm kiếm

    useEffect(() => {
        // Hàm để gọi API và cập nhật state
        const rattingData = async () => {
            try {
                // Gọi API để lấy danh sách phòng
                const rattingResponse = await fetchAllTourRating();
                const rattingData = rattingResponse.data; // Giả sử API trả về mảng các tour
                setRattings(rattingData);

            } catch (err) {
                console.error('Error fetching data:', err);
            }
        };

        rattingData();
    }, []); // Chạy một lần khi component được mount

    // Cập nhật startDate và endDate khi filterOption thay đổi
    useEffect(() => {
        const currentDate = new Date();
        const formattedEndDate = currentDate.toISOString().split('T')[0]; // Định dạng YYYY-MM-DD
        let calculatedStartDate;

        if (filterOption === '1day') {
            calculatedStartDate = new Date();
            calculatedStartDate.setDate(currentDate.getDate() - 1);
        } else if (filterOption === '7days') {
            calculatedStartDate = new Date();
            calculatedStartDate.setDate(currentDate.getDate() - 7);
        } else if (filterOption === '1month') {
            calculatedStartDate = new Date();
            calculatedStartDate.setMonth(currentDate.getMonth() - 1);
        }

        const formattedStartDate = calculatedStartDate.toISOString().split('T')[0];

        setStartDate(formattedStartDate);
        setEndDate(formattedEndDate);
    }, [filterOption]);

     // Hàm lọc dữ liệu dựa trên khoảng thời gian
     const filteredRattings = rattings.filter((ratting) => {
        const rattingDate = new Date(ratting.date);

        const rattingDateOnly = new Date(rattingDate.getFullYear(), rattingDate.getMonth(), rattingDate.getDate()); // Chỉ lấy ngày, tháng, năm

        const start = startDate ? new Date(new Date(startDate).setHours(0, 0, 0, 0)) : null;
        const end = endDate ? new Date(new Date(endDate).setHours(0, 0, 0, 0)) : null;
       
        // Lọc theo thời gian
        const isWithinDateRange = (!start || rattingDateOnly >= start) && (!end || rattingDateOnly <= end);

        console.log('Search Query:', ratting.tour_id);
        const matchesSearchQuery = searchQuery
        ? (ratting.id && ratting.id.toString().toLowerCase().includes(searchQuery.toLowerCase())) ||
        (ratting.tour_id && ratting.tour_id.toString().toLowerCase().includes(searchQuery.toLowerCase())) ||
        (ratting.user_name && ratting.user_name.toLowerCase().includes(searchQuery.toLowerCase()))
        : true; // Không lọc nếu không có searchQuery

        return isWithinDateRange && matchesSearchQuery;
    });


    return(
        <div>
            <HeaderCensor />

            
            <div className="container -mt-[603px] mx-auto sm:px-4 max-w-full" id="main-content">
                <div className="flex flex-wrap ">
                    <div className="lg:w-4/5 pr-4 pl-4 ms-auto p-6">
                        <h3 className="mb-4 text-left font-semibold text-2xl uppercase">Đánh giá tour</h3>
                        <div className="relative h-[490px] flex flex-col min-w-0 rounded break-words border bg-white border-1 border-gray-300 shadow mb-4">
                            <div className=" p-6">
                                <div className="flex ">
                                    <div className="w-[60%] text-end mb-4 float-left flex gap-3">
                                        <div className="flex items-center">
                                            <div className="font-medium">Ngày BĐ: </div>
                                            <input type="date" className="border-[1px] border-gray-200 px-2 py-[2px] rounded-md" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                                        </div>
                                        <div className="flex items-center">
                                            <div className="font-medium">Ngày KT: </div>
                                            <input type="date" className="border-[1px] border-gray-200 px-2 py-[2px] rounded-md" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                                        </div>
                                    </div>

                                    <div className="w-[10%] mt-[4px] mr-8">
                                        <select className="border-[1px] rounded-sm float-left border-gray-200 px-2 py-[1px]" value={filterOption} onChange={(e) => setFilterOption(e.target.value)}>
                                            <option value="1day">1 ngày</option>
                                            <option value="7days">7 ngày</option>
                                            <option value="1month">1 tháng</option>
                                        </select>
                                    </div>

                                    <div className="w-[30%] text-end mb-4 float-right">
                                        <input
                                            type="text"
                                            value={searchQuery} 
                                            onChange={(e) => setSearchQuery(e.target.value)} 
                                            className="block appearance-none w-full py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded shadow-none ms-auto"
                                            placeholder="Nhập mã đơn/người đặt"
                                        />
                                    </div>
                                </div>
                                
                                <div className="block w-full overflow-auto scrolling-touch h-[400px]">
                                    <table className="w-full max-h-[370px] text-left max-w-full mb-4 bg-transparent table-hover border-[1px] border-gray-200" style={{ minWidth: 1200 }}>
                                        <thead>
                                            <tr className="bg-gray-900 text-gray-100 h-[40px] sticky top-0 z-10">
                                                <th scope="col" className="pl-3 sticky top-0 z-10">STT</th>
                                                <th scope="col" className="sticky top-0 z-10">Mã tour</th>
                                                <th scope="col" className="sticky top-0 z-10">Tên tour</th>
                                                <th scope="col" className="sticky top-0 z-10">Tên người dùng</th>
                                                <th scope="col" className="sticky top-0 z-10">Đánh giá<i className="fa-solid fa-star text-white ml-2"></i></th>
                                                <th scope="col" className="sticky top-0 z-10">Nhận xét</th>
                                                <th scope="col" className="sticky top-0 z-10">Ngày đánh giá</th>
                                                <th scope="col" className="sticky top-0 z-10">Trạng thái</th>
                                            </tr>
                                        </thead>
                                        <tbody id="table-data" className="overflow-y-auto ">
                                            {filteredRattings.map((ratting, index) => (
                                                <tr key={ratting.id}>
                                                    <td>{index + 1}</td>
                                                    <td>{ratting.tour_id}</td>
                                                    <td>{ratting.tour_name}</td>
                                                    <td>{ratting.user_name}</td>
                                                    <td>{ratting.rating}</td>
                                                    <td>{ratting.review}</td>
                                                    <td>{ratting.date}</td>
                                                </tr>  
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RatingTour;