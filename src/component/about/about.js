import Header from "../header";
import Footer from "../footer/footer";
// import { teamDetail } from "../api/user";
// import React, { useEffect, useState } from 'react';

function About(){
    // const [teamDetailD, setTeamDetail] = useState([]);
    // const [error, setError] = useState(null);

    // useEffect(() => {
    //     // Hàm để gọi API và cập nhật state
    //     const fetchData = async () => {
    //         try {
    //             // Gọi API để lấy danh sách phòng
    //             const teamDetailResponse = await teamDetail();
    //             const teamDetailData = teamDetailResponse.data; // Giả sử API trả về mảng các phòng
    //             setTeamDetail(teamDetailData);
    //         } catch (err) {
    //             console.error('Error fetching data:', err);
    //             setError(err);
    //         }
    //     };

    //     fetchData();
    // }, []); // Chạy một lần khi component được mount

    // if (error) return <div>Error: {error.message}</div>;
    return(
        <div className="about mt-[150px]">
            <Header />
            <div className="my-10 px-4">
                <h2 className="text-4xl font-medium text-center">Giới thiệu</h2>
                <div className="h-[2px] w-[150px] my-2 mx-auto bg-gray-900" />
                <p className="text-center">
                    Khám Phá Thế Giới Cùng Venture - Nơi Hành Trình Bắt Đầu!
                </p>
            </div>
            <div className="container mx-auto sm:px-4">
                <div className="flex flex-wrap  justify-between items-center">
                <div className="lg:w-1/2 pr-4 pl-4 col-mb-5 mb-4 lg:order-1 md:order-1 order-2">
                    <h3 className="mb-3 text-left text-2xl font-medium">Chúng tôi luôn đồng hành cùng bạn</h3>
                    <p className="text-left">
                        Chào mừng bạn đến với Venture, nơi mang đến những trải nghiệm du lịch tuyệt vời và đáng nhớ! 
                        Chúng tôi tự hào là nền tảng kết nối bạn với hàng trăm tour du lịch phong phú, từ các hành trình khám phá 
                        thiên nhiên hùng vĩ, trải nghiệm văn hóa độc đáo, đến những kỳ nghỉ dưỡng sang trọng. Với giao diện thân thiện, 
                        thông tin minh bạch và hệ thống đặt chỗ nhanh chóng, Venture cam kết đem lại sự hài lòng cao nhất cho mỗi 
                        chuyến đi. Hãy để chúng tôi đồng hành cùng bạn trên hành trình khám phá thế giới!
                    </p>
                </div>
                <div className="lg:w-1/2 pr-4 pl-4 col-mb-5 mb-4 lg:order-1 md:order-2 order-1">
                    <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="ảnh minh họa" height="400px" className="w-full " />
                </div>
                </div>
            </div>
            <div className="container mx-auto sm:px-4 mt-5">
                <div className="flex flex-wrap ">
                    <div className="lg:w-1/4 pr-4 pl-4 md:w-1/2 mb-4 px-4">
                    <div className="bg-white rounded shadow p-6 border-t border-4 text-center box">
                        <img src="hotel.svg" className="mx-auto" alt="hinh" width="70px" />
                        <h4 className="mt-3">100+ Phòng</h4>
                    </div>
                    </div>
                    <div className="lg:w-1/4 pr-4 pl-4 md:w-1/2 mb-4 px-4">
                    <div className="bg-white rounded shadow p-6 border-t border-4 text-center box">
                        <img src="customers.svg" className="mx-auto" alt="hinh" width="70px" />
                        <h4 className="mt-3">200+ Khách hàng</h4>
                    </div>
                    </div>
                    <div className="lg:w-1/4 pr-4 pl-4 md:w-1/2 mb-4 px-4">
                    <div className="bg-white rounded shadow p-6 border-t border-4 text-center box">
                        <img src="rating.svg" className="mx-auto" alt="hinh" width="70px" />
                        <h4 className="mt-3">150+ Đánh giá</h4>
                    </div>
                    </div>
                    <div className="lg:w-1/4 pr-4 pl-4 md:w-1/2 mb-4 px-4">
                    <div className="bg-white rounded shadow p-6 border-t border-4 text-center box">
                        <img src="staff.svg" className="mx-auto" alt="hinh" width="70px" />
                        <h4 className="mt-3">100+ Nhân viên</h4>
                    </div>
                    </div>
                </div>
            </div>
            {/* <h3 className="my-10 font-medium text-3xl text-center">MANAGEMENT TEAM</h3>
            <div className="container px-4">
                <div className="swiper mySwiper">
                    <div className="swiper-wrapper mb-5 flex flex-wrap gap-4">
                        {teamDetailD.map((teamDetail) => (
                            <div className="swiper-slide basis-1/4" key={teamDetail.sr_no}>
                                <img src={teamDetail.picture} alt="hình" className="h-[300px] w-full object-cover rounded-xl" />
                                <h5 className="mt-2 mb-24 font-medium text-xl">{teamDetail.name}</h5>
                            </div>
                        ))}
                    </div>
                <div className="swiper-pagination" />
                </div>
            </div> */}
            <Footer />
        </div>
    );
}
export default About;