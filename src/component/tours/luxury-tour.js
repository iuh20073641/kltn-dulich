import Header from "../header";
import Footer from "../footer/footer";
import { Link } from "react-router-dom";
import LuxuryTourList from "../ajax/tours/luxury-tour";


function LuxuryTour(){
    return(
        <div>
            <Header />

            <div className="container mt-[100px] mx-auto sm:px-4 max-w-full bg-gray-100 pb-20">
                <div className="">
                    <div className="py-10 px-4">
                        <h2 className="font-semibold text-2xl text-center">Tours</h2>
                        <div className="h-[2px] w-[150px] my-2 mx-auto bg-gray-900" />
                    </div>
                    {/* <div className="w-[80%] mb-10 h-[100px] mx-auto bg-white rounded-md flex items-center">
                        <div className="ml-7 my-3 w-2/5 text-left ">
                            <div className="font-semibold text-base ml-3">Bạn muốn đi đâu?</div>
                            <div>
                                <input type="text" className="w-full px-3 py-2 outline-none" placeholder="Tìm kiếm địa danh bạn yêu thích" />
                            </div>
                        </div>
                        <div className="h-[70px] w-[1px] bg-gray-200"></div>
                        <div className="ml-2 my-3 w-1/5 text-left ">
                            <div className="font-semibold text-base ml-3">Ngày đi</div>
                            <div>
                                <input type="date" className="w-full px-3 py-2" placeholder="Tìm kiếm địa danh bạn yêu thích" />
                            </div>
                        </div>
                        <div className="h-[70px] w-[1px] bg-gray-200"></div>
                        <div className="ml-2 my-3 w-1/5 text-left ">
                            <div className="font-semibold text-base ml-3">Ngân sách</div>
                            <div>
                            <Select
                                className="w-[90%] border-none"
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                // value={age}
                                // onChange={handleChange}
                                // label="Age"
                                variant="standard"
                                >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                <MenuItem value={10}>Ten</MenuItem>
                                <MenuItem value={20}>Twenty</MenuItem>
                                <MenuItem value={30}>Thirty</MenuItem>
                            </Select>
                            </div>
                        </div>
                        <div className="mx-auto">
                            <div className="bg-[#0194F3] text-white px-5 py-3 cursor-pointer rounded-md">
                                <i className="fa-solid fa-magnifying-glass"></i>
                            </div>
                        </div>
                    </div> */}
                    <div className="w-[50%] flex mx-auto gap-10 justify-center items-center">
                        <Link to={"/luxury-tour"}>
                            <div className="text-[#007aff] w-[80px] bg-[#daefff] px-4 py-4 rounded-md mx-auto cursor-pointer">
                                <i className="fa-regular fa-gem text-4xl"></i>
                            </div>
                            <div className="font-semibold my-3 text-[#007aff]">Tour cao cấp</div>
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

                   <LuxuryTourList />
                       
                </div>
            </div>
            <Footer />
        </div>
    )
}
export default LuxuryTour;