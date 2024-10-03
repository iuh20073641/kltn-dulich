import Header from "../header";
import Footer from "../footer/footer";
// import { Link } from "react-router-dom";
import TourList from "../ajax/tours/tourlist";

function HomeTour() {
    return (
        <div>
            <Header />

            <div className="container mt-[100px] mx-auto sm:px-4 max-w-full bg-gray-100 pb-20">
                <div className="">
                    <div className="py-10 px-4">
                        <h2 className="font-semibold text-2xl text-center">Tours</h2>
                        <div className="h-[2px] w-[150px] my-2 mx-auto bg-gray-900" />
                    </div>
                    <div className="flex">
                        <div className="lg:w-1/4 md:w-full pr-4 pl-4 lg:mb-0 mb-4 ps-4">
                            <nav className="relative flex flex-wrap items-center content-between py-3 px-2  text-black">
                                <div className="container max-w-full mx-auto sm:px-4 lg:flex-col items-stretch bg-[#008fea]">
                                    <h4 className="my-2 font-semibold text-left text-white">Bạn muốn khởi hành từ đâu?</h4>
                                    {/* <button className="py-1 px-2 text-md leading-normal bg-transparent border border-transparent rounded" type="button" data-bs-toggle="collapse" data-bs-target="#filterDropdown" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                                            <span className="px-5 py-1 border border-gray-600 rounded" />
                                        </button> */}

                                    {/* Area  */}
                                    <div className="bg-[#008fea] font-medium mb-3">
                                        <div className="w-full text-left bg-white rounded-md mb-1">
                                            <input type="checkbox" value='1' className="mx-2 my-3" />Hồ Chí Minh
                                        </div>
                                        <div className="w-full text-left bg-white rounded-md mb-1">
                                            <input type="checkbox" value='2' className="mx-2 my-3" />Hà Nội
                                        </div>
                                        <div className="w-full text-left bg-white rounded-md mb-1">
                                            <input type="checkbox" value='3' className="mx-2 my-3" />Đà Nẵng
                                        </div>
                                    </div>

                                </div>
                            </nav>
                        </div>
                        {/* danh sách tours */}
                        <TourList />
                        {/* <div className="lg:w-3/4 md:w-full pr-4 pl-4 px-4" id="rooms-data">
                            <div className="grid grid-cols-3 gap-x-6 gap-y-4">
                                
                                <div className="w-full tqd-products border-[1px] border-b-gray-200">
                                    <div className='h-[210px] overflow-hidden'>
                                        <div className="h-[210px] overflow-hidden bg-[url(https://images.unsplash.com/photo-1523345863760-5b7f3472d14f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHRvdXJpc218ZW58MHx8MHx8fDA%3D)] bg-no-repeat bg-center bg-cover transform">
                                            <a href="https://www.facebook.com/">
                                                <div className="absolute inset-0 bg-black opacity-0 hover:opacity-50 transition duration-300">
                                                    <p className="text-white text-left text-sm mx-2 my-2 leading-6 line-clamp-4">
                                                        Hành trình	Đà Nẵng - Bà Nà - Bán Đảo Sơn Trà - Ngũ Hành Sơn - Phố Cổ Hội An
                                                        Lịch trình	3 ngày 2 đêm Khởi hành	08,15,22,29/09; 06,13,20,27/10; 03,10,17,24/11; 01,08,15/12/2024
                                                        Vận chuyển	Máy bay khứ hồi & Xe du lịch đời mới
                                                    </p>
                                                </div>
                                            </a>
                                        </div>
                                        
                                    </div>
                                    <div className="text-left px-2 py-2 line-clamp-2 bg-gray-200">
                                        <Link to={"/tour-details"}><p className="text-lg font-normal cursor-pointer hover:text-[#13357B]">
                                            Du lịch Đà Nẵng 3 ngày 2 đêm: Lịch trình chi tiết 
                                        </p></Link> 
                                    </div>
                                    <div className="flex flex-wrap ">
                                        <div className="my-3 pl-2 w-1/2">
                                            <div className="flex items-center">
                                                <div className="mr-2">
                                                    <i className="fa-regular fa-clock text-sm"></i>
                                                </div>
                                                <div className="text-sm">
                                                    3 ngày 2 đêm
                                                </div>
                                            </div>
                                            <div className="flex items-center">
                                                <div className="mr-2">
                                                    <i className="fa-regular fa-calendar text-sm"></i>
                                                </div>
                                                <div className="text-sm truncate">
                                                    08,15,22,29/09; 06,13,20,27/10; 03,10,17,24/11; 01,08,15/12/2024
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-1/2 my-3 flex items-end justify-end">
                                            <p className="text-right mr-2 font-medium text-lg text-[#FF5E1F]">1000.000 VND</p>
                                        </div>
                                    </div>
                                </div>
                                

                                <div className="tqd-products border-[1px] border-b-gray-200">
                                    <div className='h-[210px] overflow-hidden rounded-tl-lg rounded-tr-lg'>
                                        <div className="h-[210px] overflow-hidden bg-[url(https://images.unsplash.com/photo-1523345863760-5b7f3472d14f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHRvdXJpc218ZW58MHx8MHx8fDA%3D)] bg-no-repeat bg-center bg-cover transform">
                                            <a href="https://www.facebook.com/">
                                                <div className="absolute inset-0 bg-black opacity-0 hover:opacity-50 transition duration-300">
                                                    <p className="text-white text-left text-sm mx-2 my-2 leading-6 line-clamp-4">
                                                        Hành trình	Đà Nẵng - Bà Nà - Bán Đảo Sơn Trà - Ngũ Hành Sơn - Phố Cổ Hội An
                                                        Lịch trình	3 ngày 2 đêm Khởi hành	08,15,22,29/09; 06,13,20,27/10; 03,10,17,24/11; 01,08,15/12/2024
                                                        Vận chuyển	Máy bay khứ hồi & Xe du lịch đời mới
                                                    </p>
                                                </div>
                                            </a>
                                        </div>
                                        
                                    </div>
                                    <div className="text-left px-2 py-2 line-clamp-2 bg-gray-200">
                                        <a href="https://www.facebook.com/" className="text-lg font-normal cursor-pointer hover:text-[#13357B]">
                                            Du lịch Đà Nẵng 3 ngày 2 đêm: Lịch trình chi tiết 
                                        </a>
                                    </div>
                                    <div className="flex flex-wrap ">
                                        <div className="my-3 pl-2 w-1/2">
                                            <div className="flex items-center">
                                                <div className="mr-2">
                                                    <i className="fa-regular fa-clock text-sm"></i>
                                                </div>
                                                <div className="text-sm">
                                                    3 ngày 2 đêm
                                                </div>
                                            </div>
                                            <div className="flex items-center">
                                                <div className="mr-2">
                                                    <i className="fa-regular fa-calendar text-sm"></i>
                                                </div>
                                                <div className="text-sm truncate">
                                                    08,15,22,29/09; 06,13,20,27/10; 03,10,17,24/11; 01,08,15/12/2024
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-1/2 my-3 flex items-end justify-end">
                                            <p className="text-right mr-2 font-medium text-lg text-[#FF5E1F]">1000.000 VND</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="tqd-products border-[1px] border-b-gray-200">
                                    <div className='h-[210px] overflow-hidden rounded-tl-lg rounded-tr-lg'>
                                        <div className="h-[210px] overflow-hidden bg-[url(https://images.unsplash.com/photo-1523345863760-5b7f3472d14f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHRvdXJpc218ZW58MHx8MHx8fDA%3D)] bg-no-repeat bg-center bg-cover transform">
                                            <a href="https://www.facebook.com/">
                                                <div className="absolute inset-0 bg-black opacity-0 hover:opacity-50 transition duration-300">
                                                    <p className="text-white text-left text-sm mx-2 my-2 leading-6 line-clamp-4">
                                                        Hành trình	Đà Nẵng - Bà Nà - Bán Đảo Sơn Trà - Ngũ Hành Sơn - Phố Cổ Hội An
                                                        Lịch trình	3 ngày 2 đêm Khởi hành	08,15,22,29/09; 06,13,20,27/10; 03,10,17,24/11; 01,08,15/12/2024
                                                        Vận chuyển	Máy bay khứ hồi & Xe du lịch đời mới
                                                    </p>
                                                </div>
                                            </a>
                                        </div>
                                        
                                    </div>
                                    <div className="text-left px-2 py-2 line-clamp-2 bg-gray-200">
                                        <a href="https://www.facebook.com/" className="text-lg font-normal cursor-pointer hover:text-[#13357B]">
                                            Du lịch Đà Nẵng 3 ngày 2 đêm: Lịch trình chi tiết 
                                        </a>
                                    </div>
                                    <div className="flex flex-wrap ">
                                        <div className="my-3 pl-2 w-1/2">
                                            <div className="flex items-center">
                                                <div className="mr-2">
                                                    <i className="fa-regular fa-clock text-sm"></i>
                                                </div>
                                                <div className="text-sm">
                                                    3 ngày 2 đêm
                                                </div>
                                            </div>
                                            <div className="flex items-center">
                                                <div className="mr-2">
                                                    <i className="fa-regular fa-calendar text-sm"></i>
                                                </div>
                                                <div className="text-sm truncate">
                                                    08,15,22,29/09; 06,13,20,27/10; 03,10,17,24/11; 01,08,15/12/2024
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-1/2 my-3 flex items-end justify-end">
                                            <p className="text-right mr-2 font-medium text-lg text-[#FF5E1F]">1000.000 VND</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="tqd-products border-[1px] border-b-gray-200">
                                    <div className='h-[210px] overflow-hidden rounded-tl-lg rounded-tr-lg'>
                                        <div className="h-[210px] overflow-hidden bg-[url(https://images.unsplash.com/photo-1523345863760-5b7f3472d14f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHRvdXJpc218ZW58MHx8MHx8fDA%3D)] bg-no-repeat bg-center bg-cover transform">
                                            <a href="https://www.facebook.com/">
                                                <div className="absolute inset-0 bg-black opacity-0 hover:opacity-50 transition duration-300">
                                                    <p className="text-white text-left text-sm mx-2 my-2 leading-6 line-clamp-4">
                                                        Hành trình	Đà Nẵng - Bà Nà - Bán Đảo Sơn Trà - Ngũ Hành Sơn - Phố Cổ Hội An
                                                        Lịch trình	3 ngày 2 đêm Khởi hành	08,15,22,29/09; 06,13,20,27/10; 03,10,17,24/11; 01,08,15/12/2024
                                                        Vận chuyển	Máy bay khứ hồi & Xe du lịch đời mới
                                                    </p>
                                                </div>
                                            </a>
                                        </div>
                                        
                                    </div>
                                    <div className="text-left px-2 py-2 line-clamp-2 bg-gray-200">
                                        <a href="https://www.facebook.com/" className="text-lg font-normal cursor-pointer hover:text-[#13357B]">
                                            Du lịch Đà Nẵng 3 ngày 2 đêm: Lịch trình chi tiết 
                                        </a>
                                    </div>
                                    <div className="flex flex-wrap ">
                                        <div className="my-3 pl-2 w-1/2">
                                            <div className="flex items-center">
                                                <div className="mr-2">
                                                    <i className="fa-regular fa-clock text-sm"></i>
                                                </div>
                                                <div className="text-sm">
                                                    3 ngày 2 đêm
                                                </div>
                                            </div>
                                            <div className="flex items-center">
                                                <div className="mr-2">
                                                    <i className="fa-regular fa-calendar text-sm"></i>
                                                </div>
                                                <div className="text-sm truncate">
                                                    08,15,22,29/09; 06,13,20,27/10; 03,10,17,24/11; 01,08,15/12/2024
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-1/2 my-3 flex items-end justify-end">
                                            <p className="text-right mr-2 font-medium text-lg text-[#FF5E1F]">1000.000 VND</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="tqd-products border-[1px] border-b-gray-200">
                                    <div className='h-[210px] overflow-hidden rounded-tl-lg rounded-tr-lg'>
                                        <div className="h-[210px] overflow-hidden bg-[url(https://images.unsplash.com/photo-1523345863760-5b7f3472d14f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHRvdXJpc218ZW58MHx8MHx8fDA%3D)] bg-no-repeat bg-center bg-cover transform">
                                            <a href="https://www.facebook.com/">
                                                <div className="absolute inset-0 bg-black opacity-0 hover:opacity-50 transition duration-300">
                                                    <p className="text-white text-left text-sm mx-2 my-2 leading-6 line-clamp-4">
                                                        Hành trình	Đà Nẵng - Bà Nà - Bán Đảo Sơn Trà - Ngũ Hành Sơn - Phố Cổ Hội An
                                                        Lịch trình	3 ngày 2 đêm Khởi hành	08,15,22,29/09; 06,13,20,27/10; 03,10,17,24/11; 01,08,15/12/2024
                                                        Vận chuyển	Máy bay khứ hồi & Xe du lịch đời mới
                                                    </p>
                                                </div>
                                            </a>
                                        </div>
                                        
                                    </div>
                                    <div className="text-left px-2 py-2 line-clamp-2 bg-gray-200">
                                        <a href="https://www.facebook.com/" className="text-lg font-normal cursor-pointer hover:text-[#13357B]">
                                            Du lịch Đà Nẵng 3 ngày 2 đêm: Lịch trình chi tiết 
                                        </a>
                                    </div>
                                    <div className="flex flex-wrap ">
                                        <div className="my-3 pl-2 w-1/2">
                                            <div className="flex items-center">
                                                <div className="mr-2">
                                                    <i className="fa-regular fa-clock text-sm"></i>
                                                </div>
                                                <div className="text-sm">
                                                    3 ngày 2 đêm
                                                </div>
                                            </div>
                                            <div className="flex items-center">
                                                <div className="mr-2">
                                                    <i className="fa-regular fa-calendar text-sm"></i>
                                                </div>
                                                <div className="text-sm truncate">
                                                    08,15,22,29/09; 06,13,20,27/10; 03,10,17,24/11; 01,08,15/12/2024
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-1/2 my-3 flex items-end justify-end">
                                            <p className="text-right mr-2 font-medium text-lg text-[#FF5E1F]">1000.000 VND</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="tqd-products border-[1px] border-b-gray-200">
                                    <div className='h-[210px] overflow-hidden rounded-tl-lg rounded-tr-lg'>
                                        <div className="h-[210px] overflow-hidden bg-[url(https://images.unsplash.com/photo-1523345863760-5b7f3472d14f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHRvdXJpc218ZW58MHx8MHx8fDA%3D)] bg-no-repeat bg-center bg-cover transform">
                                            <a href="https://www.facebook.com/">
                                                <div className="absolute inset-0 bg-black opacity-0 hover:opacity-50 transition duration-300">
                                                    <p className="text-white text-left text-sm mx-2 my-2 leading-6 line-clamp-4">
                                                        Hành trình	Đà Nẵng - Bà Nà - Bán Đảo Sơn Trà - Ngũ Hành Sơn - Phố Cổ Hội An
                                                        Lịch trình	3 ngày 2 đêm Khởi hành	08,15,22,29/09; 06,13,20,27/10; 03,10,17,24/11; 01,08,15/12/2024
                                                        Vận chuyển	Máy bay khứ hồi & Xe du lịch đời mới
                                                    </p>
                                                </div>
                                            </a>
                                        </div>
                                        
                                    </div>
                                    <div className="text-left px-2 py-2 line-clamp-2 bg-gray-200">
                                        <a href="https://www.facebook.com/" className="text-lg font-normal cursor-pointer hover:text-[#13357B]">
                                            Du lịch Đà Nẵng 3 ngày 2 đêm: Lịch trình chi tiết 
                                        </a>
                                    </div>
                                    <div className="flex flex-wrap ">
                                        <div className="my-3 pl-2 w-1/2">
                                            <div className="flex items-center">
                                                <div className="mr-2">
                                                    <i className="fa-regular fa-clock text-sm"></i>
                                                </div>
                                                <div className="text-sm">
                                                    3 ngày 2 đêm
                                                </div>
                                            </div>
                                            <div className="flex items-center">
                                                <div className="mr-2">
                                                    <i className="fa-regular fa-calendar text-sm"></i>
                                                </div>
                                                <div className="text-sm truncate">
                                                    08,15,22,29/09; 06,13,20,27/10; 03,10,17,24/11; 01,08,15/12/2024
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-1/2 my-3 flex items-end justify-end">
                                            <p className="text-right mr-2 font-medium text-lg text-[#FF5E1F]">1000.000 VND</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
export default HomeTour;