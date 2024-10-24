import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";

function HeaderCensor() {

  const [isOpenTour, setIsOpenTour] = useState(false);

  const navigate = useNavigate();

  const handleLogout = () => {
    // Xóa token và thông tin người dùng khỏi localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Kiểm tra xem thông tin người dùng đã bị xóa chưa
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    console.log("Token after logout:", token); // Nên in ra null
    console.log("User after logout:", user); // Nên in ra null

    // Chuyển hướng đến trang đăng nhập
    navigate("/login-nv");
  };

  const toggleMenuTour = () => {
    setIsOpenTour(!isOpenTour);
  };


  return (
    <div className=''>
      <div className="container mx-auto sm:px-4 max-w-full bg-gray-900 text-gray-100 p-6 flex align-items-center justify-between sticky-top">
        <h3 className="font-medium text-xl mx-5">
          <Link to="/cap-nhat-kd">VENTURE</Link>
        </h3>
        <button
          onClick={handleLogout}
          className="inline-block align-middle text-center select-none border font-normal whitespace-no-wrap rounded no-underline bg-gray-100 text-gray-800 hover:bg-gray-200 py-1 px-2 leading-tight text-xs"
        >
          LOG OUT
        </button>
      </div>
      <div
        className="lg:w-1/5 pr-4 pl-4 h-screen bg-gray-900 border-t border-3 border-gray-600"
        id="dashboard-menu"
      >
        <nav className="relative flex flex-wrap items-center content-between py-3 px-4 text-white">
          <div className="container lg:flex-col items-stretch">
            {/* <h4 className="mt-2 text-gray-100 text-2xl font-medium">ADMIN PANEL</h4> */}
            <div
              className="flex-column text-left align-items-stretch mt-2"
              id="adminDropdown"
            >
              <ul className="list-none pl-0 mb-0">
                <li className="">
                  <div className="inline-block py-2 px-4 no-underline text-white">
                    <Link to="/chat-real-time">Trò Chuyện Khách Hàng</Link>
                  </div>
                </li>
                <li className="">
                  <div className="inline-block py-2 px-4 no-underline text-white">
                    <Link to="/cap-nhat-kd">Cập Nhật Thông Tin</Link>
                  </div>
                </li>
                <li className="">
                  <button onClick={toggleMenuTour} className="align-middle text-center select-none font-normal whitespace-no-wrap rounded py-1 px-3 leading-normal no-underline text-white w-full shadow-none flex items-center justify-between" type="button">
                    <span>QL đặt tour</span>
                    <span>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                      </svg>

                    </span>
                  </button>

                  <div className={`mt-1 px-3 text-xs mb-1 transition-all duration-500 ease-in-out transform ${isOpenTour ? 'opacity-100 max-h-96 scale-100' : 'opacity-0 max-h-0 scale-95'
                    } overflow-hidden`} id="bookingLinksTour">
                    <ul className="flex flex-wrap list-none pl-0 mb-0  flex-col rounded border border-gray-600">
                      <li className="inline-block py-2 px-4 no-underline text-white">
                        <Link to="/new-booking-tour">Đơn đặt mới</Link>
                      </li>
                      <li className="inline-block py-2 px-4 no-underline text-white">
                        <Link to="/approved-application">Đơn đã duyệt</Link>
                      </li>
                      <li className="inline-block py-2 px-4 no-underline text-white">
                        <Link to="/refund-booking-tour">Đơn đã hủy</Link>
                      </li>
                      <li className="inline-block py-2 px-4 no-underline text-white">
                        <Link to="/booking-records">Lịch sử</Link>
                      </li>
                    </ul>
                  </div>

                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}

export default HeaderCensor;
