import './header.css';

import { Link } from 'react-router-dom';

function toggleDropdown() {
  var dropdown = document.getElementById("dropdownMenu");
  dropdown.classList.toggle("hidden");
}

function toggleDropdownService() {
  var dropdown = document.getElementById("dropdownService");
  dropdown.classList.toggle("hidden");
}

function Header(){
    return(
      <header className="">
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
            <div className="travel-header-register flex items-center mx-2 text-[rgba(255,255,255,1.00)]">
              <i className="fa-solid fa-user mx-2"></i>
              <div className="font-medium"><Link to={"/register"}>register</Link></div>
            </div>

            <div className="travel-header-login flex items-center mx-2 text-[rgba(255,255,255,1.00)]">
              <i className="fa-solid fa-right-to-bracket mx-2"></i>
              <div className="font-medium"><Link to={"/login"}>Login</Link></div>
            </div>

            <div className="travel-header-dashboard flex items-center mx-2 text-[rgba(255,255,255,1.00)]">
              <i className="fa-solid fa-house-user mx-2"></i>
              <div className="">
                <div className="relative cursor-pointer font-medium">
                  <button onClick={toggleDropdown}>My Dashboard</button>
                </div>
                <div id="dropdownMenu" className=" w-[200px] -ml-16 mr-9 hidden absolute bg-[rgba(28,41,48,1)] px-7 py-3 mt-3 rounded-2xl" >
                  <ul className="travel-header-dashboard-item text-[rgba(255,255,255,1.00)]">
                    <li>
                      <div className="flex items-center my-1">
                        <i className="fa-regular fa-user mx-2"></i> 
                        <a href="https://www.facebook.com/">My Profile</a>
                      </div>
                    </li>
                    <li>
                      <div className="flex items-center my-1">
                        <i className="fa-solid fa-bell mx-2"></i>
                        <a href="https://www.facebook.com/">Notifications</a>
                      </div>
                      </li>
                    <li>
                      <div className="flex items-center my-1">
                        <i className="fa-solid fa-arrow-right-from-bracket mx-2"></i>
                        <a href="https://www.facebook.com/">Log Out</a>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <nav className="flex flex-row justify-between items-center py-6 mx-10">
          <div className="logo basis-2/6 text-center text-xl font-semibold cursor-pointer">
            <Link to={"/"}>TravelVN.</Link> 
          </div>
          <ul className="tqd-top-menu lg:basis-3/6 hidden lg:flex lg:items-center lg:justify-end lg:gap-8 text-xs text-gray-600 uppercase">
            <li className="ct-top-menu-item">
              <Link to={"/"}>Home</Link> 
            </li>
            <li className="ct-top-menu-item">
              {/* <a href="https://www.facebook.com/">About</a> */}
              <Link to={"/about"}>About</Link> 
            </li>
            <li className="ct-top-menu-item">
              <div className='relative'>
                <button className='uppercase' onClick={toggleDropdownService}>Services</button>
                {/* <a href="https://www.facebook.com/">services</a> */}
              </div>
              <div id="dropdownService" className=" w-[200px] -ml-16 mr-9 hidden absolute bg-[rgba(28,41,48,1)] px-7 py-3 mt-3 rounded-2xl" >
                <ul className="travel-header-dashboard-item text-[rgba(255,255,255,1.00)]">
                  <li>
                    <div className="flex items-center my-3">
                      <i className="fa-regular fa-user mx-2"></i> 
                      {/* <a href="https://www.facebook.com/">Hotel</a> */}
                      <Link to={"/room"}>Hotel</Link> 
                    </div>
                  </li>
                  <li>
                    <div className="flex items-center my-1">
                      <i className="fa-solid fa-bell mx-2"></i>
                      <a href="https://www.facebook.com/">Tour</a>
                    </div>
                  </li>
                </ul>
              </div>
            </li>
            <li className="ct-top-menu-item">
              <a href="https://www.facebook.com/">Package</a>
            </li>
            <li className="ct-top-menu-item">
              {/* <a href="https://www.facebook.com/">Contact</a> */}
              <Link to={"/contact"}>Contact</Link> 
            </li>
            <li className="ct-top-menu-item">
              <a href="https://www.facebook.com/">Blog</a>
            </li>
          </ul>
          <ul className="basis-3/6 lg:basis-1/6 flex justify-end lg:justify-start ml-16 uppercase font-medium">
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
          </ul>
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