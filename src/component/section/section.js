import './section.css';
import React from "react";
import Slider from "react-slick";
import { Link } from 'react-router-dom';

function Section(){

    const settings = {
        dots: true, // Hiển thị chấm tròn ở dưới để điều hướng
        infinite: true, // Vòng lặp vô hạn
        speed: 500, // Tốc độ chuyển đổi giữa các slide
        slidesToShow: 1, // Số slide hiển thị
        slidesToScroll: 1, // Số slide di chuyển mỗi lần
        autoplay: true, // Tự động chạy
        autoplaySpeed: 3000, // Thời gian giữa các slide
    };

    return(
        <main>
            {/* slider */}
            <div className="slider-container h-auto w-[99%] mx-auto overflow-hidden">
                <Slider {...settings}>
                    <div className="bg-cover bg-no-repeat bg-bottom h-[530px] w-full">
                        <img src="https://plus.unsplash.com/premium_photo-1690960644375-6f2399a08ebc?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" className='w-full h-full object-cover' alt="" />
                        {/* <div className="w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-40">
                            <div className="mx-16 text-white text-center">
                                <div className="uppercase  text-slate-300 text-sm mb-5">
                                    Explore The World
                                </div>
                                <div className="font-medium text-5xl mb-3">Let's The World Together!</div>
                                <div className="text-lg text-slate-300">
                                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
                                </div>
                                <div className="flex justify-center mt-4">
                                    <div className="uppercase bg-white text-black text-sm w-max tracking-wider py-4 px-5 cursor-pointer hover:bg-opacity-95">
                                        Discover now
                                    </div>
                                </div>
                            </div>
                        </div> */}
                    </div>
                    <div className='h-[530px] w-full'>
                        <img src="https://images.unsplash.com/photo-1708402390319-b755d64f3181?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" className='w-full h-full object-cover' alt="" />
                    </div>
                </Slider>
            </div>
            {/* end-slider */}
            {/* about us */}
                <div className='travel-about flex w-[90%] mx-auto my-52 gap-7'>
                    <div className='travel-about-img basis-1/2 h-[490px]'>
                        <img
                            src="https://images.unsplash.com/photo-1532878056386-1e96eb5221ad?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHRvdXJpc218ZW58MHx8MHx8fDA%3D"
                            alt=""
                            className="w-[80%] h-full rounded-xl object-cover"
                        />
                    </div>
                    <div className='travel-about-decription basis-1/2 text-left mt-5'>
                        <div className="flex items-center mb-3">
                            <div className='uppercase font-medium text-xl text-[#13357B]'>giới thiệu</div>
                            <div className="w-8 h-0.5 bg-[#0d2554] ml-2"></div>
                        </div>
                        <div className=' font-semibold text-3xl text-[#2658a4] mb-7'>Chào mừng đến với Venture</div>
                        <div className='text-gray-500 mb-6 font-medium'>
                            Venbture là một website du lịch cung cấp giải pháp toàn diện cho du khách. Tại đây, người dùng có thể dễ dàng 
                            tìm kiếm và đặt tour, khách sạn với giá cả hợp lý. Website còn cung cấp thông tin chi tiết
                            về các điểm đến, review từ những du khách trước đó, và các hướng dẫn viên bản địa giúp bạn khám phá 
                            những trải nghiệm độc đáo. Với giao diện thân thiện và hỗ trợ 24/7, Venture là người bạn đồng hành 
                            đáng tin cậy trong mỗi chuyến hành trình của bạn.
                        </div>
                        {/* <div className='text-gray-500 font-medium mb-7'>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium quos voluptatem suscipit 
                            neque enim, doloribus ipsum rem eos distinctio, dignissimos nisi saepe nulla? Libero numquam 
                            perferendis provident 
                            placeat molestiae quia?</div> */}
                        <div className='flex gap-x-16 '>
                            <div className=''>
                                <div className='flex items-center mb-3'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 text-[#1f05e6]">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                    </svg>
                                    <div className='text-gray-500 ml-2'>Chuyến bay hạng nhất</div>
                                </div>
                                <div className='flex items-center mb-3'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 text-[#1f05e6]">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                    </svg>
                                    <div className='text-gray-500 ml-2'>Chỗ ở chất lượng cao</div>
                                </div>
                                <div className='flex items-center mb-3'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 text-[#1f05e6]">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                    </svg>
                                    <div className='text-gray-500 ml-2'>Dịch vụ du lịch hấp dẫn</div>
                                </div>
                            </div>
                            <div className=''>
                                <div className='flex items-center mb-3'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 text-[#1f05e6]">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                    </svg>
                                    <div className='text-gray-500 ml-2'>Nhân viên nhiệt tình</div>
                                </div>
                                <div className='flex items-center mb-3'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 text-[#1f05e6]">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                    </svg>
                                    <div className='text-gray-500 ml-2'>Dễ dàng lên lịch trình du lịch</div>
                                </div>
                                <div className='flex items-center mb-3'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 text-[#1f05e6]">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                    </svg>
                                    <div className='text-gray-500 ml-2'>Dễ sử dụng</div>
                                </div>
                            </div>
                        </div>
                        <div className='travel-about'>
                            <a href="https://www.facebook.com/">
                                <div className='flex justify-center mt-4'>
                                    <div className='uppercase font-semibold rounded-3xl bg-[#13357b] text-white border-2 border-[#13357b] text-base w-max tracking-wider py-4 px-7 cursor-pointer hover:bg-white hover:text-[#13357b] hover:bg-opacity-90 hover:after:duration-200'>Tìm hiểu thêm</div>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            {/* end-about-us */}
            {/* services */}
            <div className='bg-gray-100 mx-auto px-9 pb-20'>
                <div className='travel-services w-full'>
                    <div className="flex justify-center items-center mb-5 pt-20">
                        <div className="w-8 h-0.5 bg-[#13357B] mx-3"></div>
                        <div className="text-center text-2xl tracking-wider font-medium text-[#13357B] uppercase">
                            Dịch vụ
                        </div>
                        <div className="w-8 h-0.5 bg-[#13357B] mx-3"></div>
                    </div>
                    <div className='font-semibold text-4xl mb-9 uppercase'>danh sách dịch vụ</div>
                </div>
                <div className='grid grid-cols-2 gap-7'>
                    <a href='https://www.facebook.com/'>
                        <div className='travel-service-1 group flex rounded-xl border-[1px] border-[#13357B] items-center justify-center hover:bg-[#13357B] hover:text-white duration-300'>
                            <div className='basis-4/5'>
                                <div className='text-right my-5 mx-3 text-2xl font-medium tracking-wide'>Tours</div>
                                <div className='child group-hover:text-white text-right mx-3 mb-4 text-gray-500'>
                                    Dịch vụ tour du lịch của Venture mang đến cho du khách những hành trình được thiết kế đa dạng, 
                                    phù hợp với mọi nhu cầu và sở thích. Từ tour khám phá thiên nhiên, tour văn hóa, lịch sử đến tour nghỉ 
                                    dưỡng cao cấp.
                                </div>
                            </div>
                            <div  className='basis-1/5 child'>
                                <i className="fa-solid fa-globe fa-3x text-[#13357B] group-hover:text-white my-auto"></i>
                            </div>
                        </div>
                    </a>

                    <a href='https://www.facebook.com/'>
                        <div className='travel-service-1 group flex rounded-xl border-[1px] border-[#13357B] items-center justify-center hover:bg-[#13357B] hover:text-white duration-300'>
                            <div className='basis-1/5'>
                                <i className="fa-solid fa-hotel fa-3x text-[#13357B] group-hover:text-white my-auto"></i>
                            </div>
                            <div className='basis-4/5'>
                                <div className='text-left child my-5 mx-3 text-2xl font-medium tracking-wide'>Khách sạn</div>
                                <div className='text-left child group-hover:text-white mx-3 mb-4 text-gray-500'>
                                    Dịch vụ khách sạn của Venture cung cấp hàng ngàn lựa chọn phù hợp với mọi ngân sách và 
                                    nhu cầu. Người dùng có thể dễ dàng tìm kiếm và đặt phòng với thông tin chi tiết về 
                                    tiện nghi, vị trí và đánh giá thực tế từ khách hàng trước đó.
                                </div>
                            </div>
                        </div>
                    </a>

                    <a href='https://www.facebook.com/'>
                        <div className='travel-service-1 group flex rounded-xl border-[1px] border-[#13357B] items-center justify-center hover:bg-[#13357B] hover:text-white duration-300'>
                            <div className='basis-4/5'>
                                <div className='text-right my-5 mx-3 text-2xl font-medium tracking-wide'>Tin tức</div>
                                <div className='child group-hover:text-white text-right mx-3 mb-4 text-gray-500'>
                                    Cung cấp những tin tức mới nhất về du lịch để khách hàng không bỏ lỡ những khoảng thời 
                                    gian thích hợp cho việc du lịch, kèm theo đó là những thông tin hữu ích để sử dụng dịch 
                                    vụ.
                                </div>
                            </div>
                            <div  className='basis-1/5 child'>
                                <i className="fa-solid fa-globe fa-3x text-[#13357B] group-hover:text-white my-auto"></i>
                            </div>
                        </div>
                    </a>

                    <a href='https://www.facebook.com/'>
                        <div className='travel-service-1 group flex rounded-xl border-[1px] border-[#13357B] items-center justify-center hover:bg-[#13357B] hover:text-white duration-300'>
                            <div className='basis-1/5'>
                                <i className="fa-solid fa-pager fa-3x text-[#13357B] group-hover:text-white my-auto"></i>
                            </div>
                            <div className='basis-4/5'>
                                <div className='text-left child my-5 mx-3 text-2xl font-medium tracking-wide'>Liên hệ</div>
                                <div className='text-left child group-hover:text-white mx-3 mb-4 text-gray-500'>
                                    Dịch vụ liên hệ của Venture luôn sẵn sàng hỗ trợ khách hàng 24/7 qua nhiều kênh như 
                                    hotline, email, và chat trực tuyến. Đội ngũ tư vấn viên chuyên nghiệp, thân thiện sẽ nhanh 
                                    chóng giải đáp mọi thắc mắc.
                                </div>
                            </div>
                        </div>
                    </a>
                </div>
            </div>
            {/* end-service */}
            {/* tour */}
            <div className='travel-tour mb-28'>
                <div className="flex justify-center items-center mb-24 mt-20">
                    <div className="w-8 h-px bg-[#13357B] mx-3" />
                    <div className="text-center font-semibold text-2xl text-[#13357B] uppercase">
                    Tours
                    </div>
                    <div className="w-8 h-px bg-[#13357B] mx-3" />
                </div>
                <div className="featured-mugs w-[80%] mx-auto mb-10">
                    <div className="grid grid-cols-3 gap-x-6">
                        {/* đây là nơi chứa sản phẩm */}
                        <div className="tqd-products">
                            <div className='h-[400px] overflow-hidden rounded-xl'>
                                <div className="h-full overflow-hidden bg-[url(https://images.unsplash.com/photo-1523345863760-5b7f3472d14f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHRvdXJpc218ZW58MHx8MHx8fDA%3D)] bg-no-repeat bg-center bg-cover transform hover:scale-110 duration-300">
                                    <a href="https://www.facebook.com/">
                                        <div className="w-full h-full hover:transition-all hover:bg-gray-900 hover:bg-opacity-10 
                                                    hover:ease-in-out relative group">
                                            <div className="absolute w-[100px] bg-white text-[#a25f4b] font-medium py-2 px-4 top-3 right-3 text-center">
                                                On Sale
                                            </div>
                                            <div className="absolute button-Explore-Mug">Explore</div>
                                        </div>
                                    </a>
                                </div>
                            </div>
                            <div className="text-center my-8">
                                <a href="https://www.facebook.com/" className="text-xl font-light cursor-pointer">
                                    Adu Bhadi
                                </a>
                            </div>
                        </div>
                        {/* đây là nơi chứa sản phẩm */}

                        <div className="tqd-products">
                            <div className='h-[400px] overflow-hidden rounded-xl'>
                                <div className="h-full overflow-hidden bg-[url(https://images.unsplash.com/photo-1523906921802-b5d2d899e93b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzV8fHRvdXJpc218ZW58MHx8MHx8fDA%3D)] bg-no-repeat bg-center bg-cover transform hover:scale-110 duration-300">
                                    <a href="https://www.facebook.com/">
                                        <div className="w-full h-full hover:transition-all hover:bg-gray-900 hover:bg-opacity-10 
                                                    hover:ease-in-out relative group">
                                            <div className="absolute w-[100px] bg-white text-[#a25f4b] font-medium py-2 px-4 top-3 right-3 text-center">
                                                On Sale
                                            </div>
                                            <div className="absolute button-Explore-Mug">Explore</div>
                                        </div>
                                    </a>
                                </div>
                            </div>
                            <div className="text-center my-8">
                                <a href="https://www.facebook.com/" className="text-xl font-light cursor-pointer">
                                    Adu Bhadi
                                </a>
                            </div>
                        </div>

                        <div className="tqd-products">
                            <div className='h-[400px] overflow-hidden rounded-xl'>
                                <div className="h-full overflow-hidden bg-[url(https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzl8fHRvdXJpc218ZW58MHx8MHx8fDA%3D)] bg-no-repeat bg-center bg-cover transform hover:scale-110 duration-300">
                                    <a href="https://www.facebook.com/">
                                        <div className="w-full h-full hover:transition-all hover:bg-gray-900 hover:bg-opacity-10 
                                                    hover:ease-in-out relative group">
                                            <div className="absolute w-[100px] bg-white text-[#a25f4b] font-medium py-2 px-4 top-3 right-3 text-center">
                                                On Sale
                                            </div>
                                            <div className="absolute button-Explore-Mug">Explore</div>
                                        </div>
                                    </a>
                                </div>
                            </div>
                            <div className="text-center my-8">
                                <a href="https://www.facebook.com/" className="text-xl font-light cursor-pointer">
                                    Mumbai
                                </a>
                            </div>
                        </div>

                        <div className="tqd-products">
                            <div className='h-[400px] overflow-hidden rounded-xl'>
                                <div className="h-full overflow-hidden bg-[url(https://images.unsplash.com/photo-1533557213878-99cda20b1400?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDd8fHRvdXJpc218ZW58MHx8MHx8fDA%3D)] bg-no-repeat bg-center bg-cover transform hover:scale-110 duration-300">
                                    <a href="https://www.facebook.com/">
                                        <div className="w-full h-full hover:transition-all hover:bg-gray-900 hover:bg-opacity-10 
                                                    hover:ease-in-out relative group">
                                            <div className="absolute w-[100px] bg-white text-[#a25f4b] font-medium py-2 px-4 top-3 right-3 text-center">
                                                On Sale
                                            </div>
                                            <div className="absolute button-Explore-Mug">Explore</div>
                                        </div>
                                    </a>
                                </div>
                            </div>
                            <div className="text-center my-8">
                                <a href="https://www.facebook.com/" className="text-xl font-light cursor-pointer">
                                    United Kingdom
                                </a>
                            </div>
                        </div>

                        <div className="tqd-products">
                            <div className='h-[400px] overflow-hidden rounded-xl'>
                                <div className="h-full overflow-hidden bg-[url(https://plus.unsplash.com/premium_photo-1694475507860-2b9fbdd2de63?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzd8fHRvdXJpc20lMjBjaGluYXxlbnwwfHwwfHx8MA%3D%3D)] bg-no-repeat bg-center bg-cover transform hover:scale-110 duration-300">
                                    <a href="https://www.facebook.com/">
                                        <div className="w-full h-full hover:transition-all hover:bg-gray-900 hover:bg-opacity-10 
                                                    hover:ease-in-out relative group">
                                            <div className="absolute w-[100px] bg-white text-[#a25f4b] font-medium py-2 px-4 top-3 right-3 text-center">
                                                On Sale
                                            </div>
                                            <div className="absolute button-Explore-Mug">Explore</div>
                                        </div>
                                    </a>
                                </div>
                            </div>
                            <div className="text-center my-8">
                                <a href="https://www.facebook.com/" className="text-xl font-light cursor-pointer">
                                    Chinese Culture
                                </a>
                            </div>
                        </div>

                        <div className="tqd-products">
                            <div className='h-[400px] overflow-hidden rounded-xl'>
                                <div className="h-full overflow-hidden bg-[url(https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjN8fHRvdXJpc20lMjB2aSVFMSVCQiU4N3QlMjBuYW18ZW58MHx8MHx8fDA%3D)] bg-no-repeat bg-center bg-cover transform hover:scale-110 duration-300">
                                    <a href="https://www.facebook.com/">
                                        <div className="w-full h-full hover:transition-all hover:bg-gray-900 hover:bg-opacity-10 
                                                    hover:ease-in-out relative group">
                                            <div className="absolute w-[100px] bg-white text-[#a25f4b] font-medium py-2 px-4 top-3 right-3 text-center">
                                                On Sale
                                            </div>
                                            <div className="absolute button-Explore-Mug">Explore</div>
                                        </div>
                                    </a>
                                </div>
                            </div>
                            <div className="text-center my-8">
                                <a href="https://www.facebook.com/" className="text-xl font-light cursor-pointer">
                                    Vịnh Hạ Long
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex justify-center mt-4'>
                    <div className="uppercase font-medium bg-[#13357B] text-white text-sm w-max rounded-3xl tracking-wider py-4 px-5 cursor-pointer hover:bg-opacity-90 hover:after:duration-200">
                        Tìm hiểu thêm
                    </div>
                </div>
            </div>
            {/* end-tour */}
            {/* paralax-section  */}
            <div className="travel-paralax-section bg-cover bg-no-repeat bg-center h-[340px] mb-24 bg-fixed object-cover">

            </div>
            {/* end-paralax-section  */}
            {/* hotel */}
            <div className='travel-hotel mb-24'>
                <div className="flex justify-center items-center mb-24 mt-20">
                    <div className="w-8 h-px bg-[#13357B] mx-3" />
                    <div className="text-center font-semibold text-2xl text-[#13357B] uppercase">
                        Khách sạn
                    </div>
                    <div className="w-8 h-px bg-[#13357B] mx-3" />
                </div>
                <div id='travel-hotel-slider' className='flex mx-8 flex-wrap justify-center gap-3 relative'>
                    <div className='bg-gray-100 border-2 border-gray-100 rounded-bl-xl rounded-br-xl gap-1/4'>
                        <div className='mb-6'>
                            <div className='relative'>
                                <img src="https://plus.unsplash.com/premium_photo-1678297269980-16f4be3a15a6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8aG90ZWx8ZW58MHx8MHx8fDA%3D" 
                                alt="Hotel 1" className="w-full h-48 object-cover rounded-tl-xl rounded-tr-xl" />
                                <div className="absolute w-[80px] bg-[#ffd000] text-black font-medium py-2 bottom-0 right-0 text-center rounded-tl-xl">
                                    <div className='flex justify-center items-center'>
                                        <p className='font-semibold text-xl '>4.6</p> <p className='mt-[3px] font-light'>/5</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='pb-4 font-medium text-xl'>Royer Rattanakosin Hotel</div>
                        <div className='mt-1 font-normal'>1000000 VND</div>
                        <div className="flex justify-center mt-4 mb-8">
                            <div className="uppercase font-medium border-2 bg-black border-black text-white text-sm w-max rounded-xl tracking-wider py-3 px-7 cursor-pointer hover:text-black hover:bg-white hover:bg-opacity-95 hover:after:duration-500">
                                Booking
                            </div>
                        </div>
                    </div>

                    <div className='bg-gray-100 border-2 border-gray-100 rounded-bl-xl rounded-br-xl gap-1/4'>
                        <div className='mb-6'>
                            <div className='relative'>
                                <img src="https://plus.unsplash.com/premium_photo-1663093806285-d905ca96c661?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjl8fGhvdGVsfGVufDB8fDB8fHww" 
                                alt="Hotel 1" className="w-full h-48 object-cover rounded-tl-xl rounded-tr-xl" />
                                <div className="absolute w-[80px] bg-[#ffd000] text-black font-medium py-2 bottom-0 right-0 text-center rounded-tl-xl">
                                    <div className='flex justify-center items-center'>
                                        <p className='font-semibold text-xl '>3.5</p> <p className='mt-[3px] font-light'>/5</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='pb-4 font-medium text-xl'>Royer Rattanakosin Hotel</div>
                        <div className='mt-1 font-normal'>1000000 VND</div>
                        <div className="flex justify-center mt-4 mb-8">
                            <div className="uppercase font-medium border-2 bg-black border-black text-white text-sm w-max rounded-xl tracking-wider py-3 px-7 cursor-pointer hover:text-black hover:bg-white hover:bg-opacity-95 hover:after:duration-500">
                                Booking
                            </div>
                        </div>
                    </div>

                    <div className='bg-gray-100 border-2 border-gray-100 rounded-bl-xl rounded-br-xl gap-1/4'>
                        <div className='mb-6'>
                            <div className='relative'>
                                <img src="https://images.unsplash.com/photo-1529290130-4ca3753253ae?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGhvdGVsfGVufDB8fDB8fHww" 
                                alt="Hotel 1" className="w-full h-48 object-cover rounded-tl-xl rounded-tr-xl" />
                                <div className="absolute w-[80px] bg-[#ffd000] text-black font-medium py-2 bottom-0 right-0 text-center rounded-tl-xl">
                                    <div className='flex justify-center items-center'>
                                        <p className='font-semibold text-xl '>3</p> <p className='mt-[3px] font-light'>/5</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='pb-4 font-medium text-xl'>Royer Rattanakosin Hotel</div>
                        <div className='mt-1 font-normal'>1000000 VND</div>
                        <div className="flex justify-center mt-4 mb-8">
                            <div className="uppercase font-medium border-2 bg-black border-black text-white text-sm w-max rounded-xl tracking-wider py-3 px-7 cursor-pointer hover:text-black hover:bg-white hover:bg-opacity-95 hover:after:duration-500">
                                Booking
                            </div>
                        </div>
                    </div>

                    <div className='bg-gray-100 border-2 border-gray-100 rounded-bl-xl rounded-br-xl gap-1/4'>
                        <div className='mb-6'>
                            <div className='relative'>
                                <img src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGhvdGVsfGVufDB8fDB8fHww" 
                                alt="Hotel 1" className="w-full h-48 object-cover rounded-tl-xl rounded-tr-xl" />
                                <div className="absolute w-[80px] bg-[#ffd000] text-black font-medium py-2 bottom-0 right-0 text-center rounded-tl-xl">
                                    <div className='flex justify-center items-center'>
                                        <p className='font-semibold text-xl '>4.9</p> <p className='mt-[3px] font-light'>/5</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='pb-4 font-medium text-xl'>Royer Rattanakosin Hotel</div>
                        <div className='mt-1 font-normal'>1000000 VND</div>
                        <div className="flex justify-center mt-4 mb-8">
                            <div className="uppercase font-medium border-2 bg-black border-black text-white text-sm w-max rounded-xl tracking-wider py-3 px-7 cursor-pointer hover:text-black hover:bg-white hover:bg-opacity-95 hover:after:duration-500">
                                Booking
                            </div>
                        </div>
                    </div>

                    {/* Nút điều hướng */}
                    <button id="travel-hotel-prev" className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-400 text-white px-[17px] py-2 rounded-full text-xl">
                        <p className='hover:animate-pulse transform scale-110 text-white duration-[50ms]'>&#10094;</p>
                    </button>
                    <button id="travel-hotel-next" className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-400 text-white px-[17px] py-2 rounded-full text-xl">
                       <p className='hover:animate-pulse transform scale-110 text-white duration-[50ms]'>&#10095;</p>
                    </button>

                </div>
                <div className='flex justify-center mt-16'>
                    <div className="uppercase font-medium bg-[#13357B] text-white text-sm w-max rounded-3xl tracking-wider py-4 px-5 cursor-pointer hover:bg-opacity-90 hover:after:duration-200">
                        <Link to={"/room"}>Tìm hiểu thêm</Link> 
                    </div>
                </div>
            </div>
            {/* end-hotel */}
            {/* customer-recomment */}
            <div className='customer-recomment mb-32'>
                <div className="flex justify-center items-center mb-24 mt-20">
                    <div className="w-8 h-px bg-[#13357B] mx-3" />
                    <div className="text-center font-semibold text-2xl text-[#13357B] uppercase">
                        Customer Recomment
                    </div>
                    <div className="w-8 h-px bg-[#13357B] mx-3" />
                </div>

                <div className="swiper swiper-testimonials">
                    <div className="flex swiper-wrapper mb-5">
                        <div className="swiper-slide bg-white p-6">
                            <div className="profile mb-3 flex flex-col items-center">
                                <h6 className="mb-2 text-gray-500">Đăng Hưng</h6>
                                <div className="w-20 h-px bg-[#13357B]"></div>
                            </div>
                            <p className="text-gray-600">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti cum
                            laboriosam quos maxime provident dolorem doloremque molestiae eaque
                            consequuntur magnam!
                            </p>
                            <div className="rating mt-3">
                            <i className="fa-solid fa-star text-yellow-500 text-xs"></i>
                            <i className="fa-solid fa-star text-yellow-500 text-xs"></i>
                            <i className="fa-solid fa-star text-yellow-500 text-xs"></i>
                            <i className="fa-solid fa-star text-yellow-500 text-xs"></i>
                            <i className="fa-solid fa-star text-yellow-500 text-xs"></i>
                            </div>
                        </div>
                        <div className="swiper-slide bg-white p-6">
                            <div className="profile mb-3 flex flex-col items-center">
                                <h6 className="mb-2 text-gray-500">Hữu Quốc</h6>
                                <div className="w-20 h-px bg-[#13357B]"></div>
                            </div>
                            <p className="text-gray-600">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti cum
                            laboriosam quos maxime provident dolorem doloremque molestiae eaque
                            consequuntur magnam!
                            </p>
                            <div className="rating mt-3">
                            <i className="fa-solid fa-star text-yellow-500 text-xs"></i>
                            <i className="fa-solid fa-star text-yellow-500 text-xs"></i>
                            <i className="fa-solid fa-star text-yellow-500 text-xs"></i>
                            <i className="fa-solid fa-star text-yellow-500 text-xs"></i>
                            <i className="fa-solid fa-star text-yellow-500 text-xs"></i>
                            </div>
                        </div>
                        <div className="swiper-slide bg-white p-6">
                            <div className="profile mb-3 flex flex-col items-center">
                                <h6 className="mb-2 text-gray-500">Hồng Phong</h6>
                                <div className="w-20 h-px bg-[#13357B]"></div>
                            </div>
                            <p className="text-gray-600">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti cum
                            laboriosam quos maxime provident dolorem doloremque molestiae eaque
                            consequuntur magnam!
                            </p>
                            <div className="rating mt-3">
                            <i className="fa-solid fa-star text-yellow-500 text-xs"></i>
                            <i className="fa-solid fa-star text-yellow-500 text-xs"></i>
                            <i className="fa-solid fa-star text-yellow-500 text-xs"></i>
                            <i className="fa-solid fa-star text-yellow-500 text-xs"></i>
                            <i className="fa-solid fa-star text-yellow-500 text-xs"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* end-customer-recomment */}
        </main>
    );
}


export default Section;