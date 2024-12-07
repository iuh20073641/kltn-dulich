import './header.css';

import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
// import { getUsersData } from '../api/user';

function toggleDropdown() {
  var dropdown = document.getElementById("dropdownMenu");
  dropdown.classList.toggle("hidden");
}

function toggleDropdownService() {
  var dropdown = document.getElementById("dropdownService");
  dropdown.classList.toggle("hidden");
}

function Header(){

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  // const [infoUser, setInfoUser] = useState([]);

  useEffect(() => {
    // Kiểm tra trạng thái đăng nhập
    const userData = localStorage.getItem('user');
    if (userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  // useEffect(() => {
  //   // Hàm để gọi API và cập nhật state
  //   const fetchData = async () => {
  //       const userData = localStorage.getItem('user');

  //       const user1 = JSON.parse(userData);
  //       try {

  //           const userResponse = await getUsersData(user1.id);
  //           const userData = userResponse.data;

  //           // Nếu API trả về mảng, hãy lấy phần tử đầu tiên
  //           if (userData.length > 0) {
  //               console.log(userData);
  //               setInfoUser(userData[0]);
  //               console.log(userData[0]);
  //           } else {
  //               console.log(userData);
  //           }

  //       } catch (err) {
  //           // console.error('Error fetching data:', err);
  //           // setError(err);
  //       }
  //   };

  //   fetchData();
  // }, []); // Chạy một lần khi component được mount

  const handleLogout = () => {
    localStorage.removeItem('user');
    // console.log(user);
    setIsLoggedIn(false);
    setUser(null);
  };

    return(
      <header className="fixed top-0 left-0 w-full z-50">
        <div className="flex w-full bg-[rgba(28,41,48,1)] h-10">
          <div className="travel-header-contact flex w-[10%] justify-between pl-8 items-center">
            <div className="header-contact-facebook basis-1/3">
              <a href="https://www.facebook.com/">
                <i className="fa-brands fa-facebook text-[rgba(255,255,255,1.00)]"></i>
              </a>
            </div>

            <div className="header-contact-zalo basis-1/3">
              <a href="https://www.facebook.com/">
                <i className="fa-brands fa-twitter text-[rgba(255,255,255,1.00)]"></i>
              </a>
            </div>

            <div className="header-contact-zalo basis-1/3">
              <a href="https://www.facebook.com/">
                <i className="fa-brands fa-instagram text-[rgba(255,255,255,1.00)]"></i>
              </a>
            </div>
          </div>

          <div className="w-[60%]"></div>

          <div className="travel-header-user justify-center flex w-[30%]">
            {!isLoggedIn ? (
              <>
                <div className="travel-header-register flex items-center mx-2 text-[rgba(255,255,255,1.00)]">
                  <i className="fa-solid fa-user mx-2"></i>
                  <div className="font-medium"><Link to={"/register"}>Đăng ký</Link></div>
                </div>

                <div className="travel-header-login flex items-center mx-2 text-[rgba(255,255,255,1.00)]">
                  <i className="fa-solid fa-right-to-bracket mx-2"></i>
                  <div className="font-medium"><Link to={"/login"}>Đăng nhập</Link></div>
                </div>
              </>
            ) : (
              <div className="travel-header-dashboard flex items-center mx-2 text-[rgba(255,255,255,1.00)]">
                <img src={`http://localhost:88/api_travel/api/Images/user/${user.profile}`} alt="User Avatar" className="w-8 h-8 rounded-full mx-2" />
                <div className="">
                  <div className="relative cursor-pointer font-medium">
                    <button onClick={toggleDropdown}>Tài khoản</button>
                  </div>
                  <div id="dropdownMenu" className="z-20 w-[200px] -ml-24 mr-9 hidden absolute bg-[rgba(28,41,48,1)] px-7 py-3 mt-3 rounded-2xl" >
                    <ul className="travel-header-dashboard-item text-[rgba(255,255,255,1.00)]">
                      <li>
                        <Link to={"/Profile"} className="flex items-center my-2">
                          <i className="fa-regular fa-user mx-2"></i> 
                          <p className='text-sm'>Người dùng</p>
                        </Link>
                      </li>
                      <li>
                        <div className="flex items-center my-2">
                          <i className="fa-solid fa-bell mx-2"></i>
                          <Link to={"/info-booking-tour"}><p className='text-sm'>Trạng thái đơn</p></Link>
                          {/* <a href="https://www.facebook.com/"><p className='text-sm'>Trạng thái đơn</p></a> */}
                        </div>
                      </li>
                      <li>
                        <div className="flex items-center my-2">
                          <i className="fa-solid fa-bell mx-2"></i>
                          <a href="https://www.facebook.com/"><p className='text-sm'>Thông báo</p></a>
                        </div>
                      </li>
                      <li>
                        <div className="flex items-center my-2">
                          <i className="fa-solid fa-arrow-right-from-bracket mx-2"></i>
                          <button onClick={handleLogout}><p className='text-sm'>Đăng xuất</p></button>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <nav className="w-full mx-auto flex flex-row justify-between items-center py-6 bg-white">
          <div className="logo basis-2/6 text-center text-xl font-semibold cursor-pointer">
            <Link to={"/"}>Venture</Link> 
          </div>
          <ul className="tqd-top-menu text-sm lg:basis-3/6 font-medium hidden lg:flex lg:items-center lg:justify-center lg:gap-8 text-gray-600 uppercase">
            <li className="ct-top-menu-item">
              <Link to={"/"}>Trang chủ</Link> 
            </li>
            <li className="ct-top-menu-item">
              {/* <a href="https://www.facebook.com/">About</a> */}
              <Link to={"/about"}>Giới thiệu</Link> 
            </li>
            <li className="ct-top-menu-item">
              <div className='relative'>
                <button className='uppercase' onClick={toggleDropdownService}>dịch vụ</button>
                {/* <a href="https://www.facebook.com/">services</a> */}
              </div>
              <div id="dropdownService" className="z-20 w-[200px] -ml-16 mr-9 hidden absolute bg-[rgba(28,41,48,1)] px-7 py-3 mt-3 rounded-2xl" >
                <ul className="travel-header-dashboard-item text-[rgba(255,255,255,1.00)]">
                  <li>
                    <div className="flex items-center my-3">
                      <i className="fa-regular fa-user mx-2"></i> 
                      {/* <a href="https://www.facebook.com/">Hotel</a> */}
                      <Link to={"/room"}>Khách sạn</Link> 
                    </div>
                  </li>
                  <li>
                    <div className="flex items-center my-1">
                      <i className="fa-solid fa-route mx-2"></i>
                      <Link to={"/tours"}>Tours</Link> 
                    </div>
                  </li>
                </ul>
              </div>
            </li>
            {/* <li className="ct-top-menu-item">
              <a href="https://www.facebook.com/">Thuê xe</a>
            </li> */}
            <li className="ct-top-menu-item">
              {/* <a href="https://www.facebook.com/">Contact</a> */}
              <Link to={"/contact"}>Liên hệ</Link> 
            </li>
            <li className="ct-top-menu-item">
              <Link to={"/news"}>Tin Tức</Link> 
            </li>
          </ul>
          {/* <ul className="basis-3/6 lg:basis-1/6 flex justify-end lg:justify-start ml-16 uppercase font-medium">
            <li>
              <a href="https://www.facebook.com/" className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="tqd-icon"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                  />
                </svg>
                <span className="mx-2">Booknow</span>
                <span className="tqd-circle bg-slate-400 text-white">5</span>
              </a>
            </li>
          </ul> */}
          <div className="tqd-top-menu-icon lg:hidden basis-1/6 flex items-center px-2 sm:px-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </div>
        </nav>
      </header>
      
    );
}
export default Header;