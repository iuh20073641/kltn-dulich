import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function HeaderManager(){

    // khai báo usestate trạng thái menu
    const [isOpenHotel, setIsOpenHotel] = useState(false);
    const [isOpenTour, setIsOpenTour] = useState(false);

    // Sự kiện mở menu con
    const toggleMenuHotel = () => {
        setIsOpenHotel(!isOpenHotel);
    };

    const toggleMenuTour = () => {
        setIsOpenTour(!isOpenTour);
    };


    return(
        <div className=''>
            <div className="container mx-auto sm:px-4 max-w-full bg-gray-900 text-gray-100 p-6 flex align-item-center justify-between sticky-top">
                <h3 className="font-medium text-xl mx-5">VENTURE</h3>
                <a className="inline-block align-middle text-center select-none border font-normal whitespace-no-wrap rounded  no-underline bg-gray-100 text-gray-800 hover:bg-gray-200 py-1 px-2 leading-tight text-xs " href="logout.php">
                    LOG OUT
                </a>
            </div>
            <div className="lg:w-1/5 pr-4 pl-4 h-screen bg-gray-900 border-t border-3 border-gray-600" id="dashboard-menu">
                <nav className="relative flex flex-wrap items-center content-between py-3 px-4  text-white">
                    <div className="container lg:flex-col items-stretch">
                        <h4 className="mt-2 text-gray-100 text-2xl font-medium">ADMIN PANEL</h4>
                        {/* <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#adminDropdown" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon" />
                        </button> */}
                        <div className="flex-column text-left align-items-stretch mt-2" id="adminDropdown">
                            <ul className="list-none pl-0 mb-0">
                                {/* <li className="">
                                    <a className="inline-block py-2 px-4 no-underline text-white" href="dashboard.php">
                                        Dashboard Hotel
                                    </a>
                                </li>
                                <li className="">
                                    <a className="inline-block py-2 px-4 no-underline text-white" href="dashboard1.php">
                                        Dashboard Tour
                                    </a>
                                </li> */}
                                <li className="">
                                    <button id="menuButton" onClick={toggleMenuHotel} className="align-middle text-center select-none font-normal whitespace-no-wrap rounded py-1 px-3 leading-normal no-underline text-white w-full shadow-none flex items-center justify-between">
                                        <span>Bookings Hotel</span>
                                        <span>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                            </svg>
                                        </span>
                                    </button>
                                  
                                    <div className={`mt-1 px-3 text-xs mb-1 transition-all duration-500 ease-in-out transform ${
                                        isOpenHotel ? 'opacity-100 max-h-96 scale-100' : 'opacity-0 max-h-0 scale-95'
                                      } overflow-hidden`} id="bookingLinksHotel">
                                        <ul className="flex flex-wrap list-none pl-0 mb-0  flex-col rounded border border-gray-600">
                                            <li className="">
                                                <a className="inline-block py-2 px-4 no-underline text-white" href="new_bookings.php">
                                                    New Bookings
                                                </a>
                                            </li>
                                            <li className="">
                                                <a className="inline-block py-2 px-4 no-underline text-white" href="refund_bookings.php">
                                                    Refund Bookings
                                                </a>
                                            </li>
                                            <li className="">
                                                <a className="inline-block py-2 px-4 no-underline text-white" href="booking_records.php">
                                                    Booking Records
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                   
                                </li>
                                <li className="">
                                    <button onClick={toggleMenuTour} className="align-middle text-center select-none font-normal whitespace-no-wrap rounded py-1 px-3 leading-normal no-underline text-white w-full shadow-none flex items-center justify-between" type="button">
                                        <span>Bookings Tour</span>
                                        <span>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                            </svg>

                                        </span>
                                    </button>
                                  
                                    <div className={`mt-1 px-3 text-xs mb-1 transition-all duration-500 ease-in-out transform ${
                                        isOpenTour ? 'opacity-100 max-h-96 scale-100' : 'opacity-0 max-h-0 scale-95'
                                      } overflow-hidden`} id="bookingLinksTour">
                                        <ul className="flex flex-wrap list-none pl-0 mb-0  flex-col rounded border border-gray-600">
                                            <li className="">
                                                <a className="inline-block py-2 px-4 no-underline text-white" href="new_bookings1.php">
                                                    New Bookings
                                                </a>
                                            </li>
                                            <li className="">
                                                <a className="inline-block py-2 px-4 no-underline text-white" href="refund_bookings1.php">
                                                    Refund Bookings
                                                </a>
                                            </li>
                                            <li className="">
                                                <a className="inline-block py-2 px-4 no-underline text-white" href="booking_records1.php">
                                                    Booking Records
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                   
                                </li>
                                <li className="">
                                    {/* <a className="inline-block py-2 px-4 no-underline text-white" href="users.php">
                                        User
                                    </a> */}
                                    <div className="inline-block py-2 px-4 no-underline text-white">
                                        <Link to={"/user"}>User</Link>
                                    </div>
                                </li>
                                <li className="">
                                    <a className="inline-block py-2 px-4 no-underline text-white" href="user_queries.php">
                                        User Queries
                                    </a>
                                </li>
                                <li className="">
                                    <a className="inline-block py-2 px-4 no-underline text-white" href="rate_review.php">
                                        Rating &amp; Reviews Hotel
                                    </a>
                                </li>
                                <li className="">
                                    <a className="inline-block py-2 px-4 no-underline text-white" href="rate_review1.php">
                                        Rating &amp; Reviews Tour
                                    </a>
                                </li>
                                <li className="">
                                    <div className="inline-block py-2 px-4 no-underline text-white">
                                        <Link to={"/room-manager"}>Rooms</Link>
                                    </div>
                                    {/* <a className="inline-block py-2 px-4 no-underline text-white" href="rooms.php">
                                        Rooms
                                    </a> */}
                                </li>
                                <li className="">
                                    <div className="inline-block py-2 px-4 no-underline text-white" href="tours.php">
                                        <Link to={"/tours-manager"}>Tours</Link>
                                    </div>
                                </li>
                                <li className="">
                                     <div className="inline-block py-2 px-4 no-underline text-white">
                                        <Link to={"/features-facilities"}>Features &amp; Facilities</Link>
                                    </div>
                                </li>
                                {/* <li className="">
                                    <a className="inline-block py-2 px-4 no-underline text-white" href="carousel.php">
                                        Carousel
                                    </a>
                                </li> */}
                                {/* <li className="">
                                    <a className="inline-block py-2 px-4 no-underline text-white" href="setting.php">
                                        Setttings
                                    </a>
                                </li> */}
                            </ul>
                        </div>
                    </div>
                </nav>
            </div>
        </div>
    );
}
export default HeaderManager;