import Header from "../header";
import Footer from "../footer/footer";
import { Link } from "react-router-dom";
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
                    
                    <div className="w-[50%] flex mx-auto gap-10 justify-center items-center">
                        <Link to={"/luxury-tour"}>
                            <div className="text-[#007aff] w-[80px] bg-[#daefff] px-4 py-4 rounded-md mx-auto cursor-pointer">
                                <i className="fa-regular fa-gem text-4xl"></i>
                            </div>
                            <div className="font-semibold my-3">Tour cao cấp</div>
                        </Link>
                        <Link to={"/standard-tour"}>
                            <div className="text-[#007aff] w-[80px] bg-[#daefff] px-4 py-4 rounded-md mx-auto cursor-pointer">
                                <i className="fa-solid fa-award text-4xl"></i>
                            </div>
                            <div className="font-semibold my-3">Tour tiêu chuẩn</div>
                        </Link>
                        <Link to={"/save-tour"}>
                            <div className="text-[#007aff] w-[80px] bg-[#daefff] px-4 py-4 rounded-md mx-auto cursor-pointer">
                                <i className="fa-solid fa-piggy-bank text-4xl"></i>
                            </div>
                            <div className="font-semibold my-3">Tour tiết kiệm</div>
                        </Link>
                        <Link to={"/discount-tour"}>
                            <div className="text-[#007aff] w-[80px] bg-[#daefff] px-4 py-4 rounded-md mx-auto cursor-pointer">
                                <i className="fa-solid fa-percent text-4xl"></i>
                            </div>
                            <div className="font-semibold my-3">Tour khuyến mãi</div>
                        </Link>
                    </div>

                    <TourList />
                       
                </div>
            </div>
            <Footer />
        </div>
    );
}
export default HomeTour;