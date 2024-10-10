import React from 'react';
import { Link } from 'react-router-dom';

function HeaderAdmin(){

    // // khai báo usestate trạng thái menu
    // const [isOpenHotel, setIsOpenHotel] = useState(false);
    // const [isOpenTour, setIsOpenTour] = useState(false);
 
    // // Sự kiện mở menu con
    // const toggleMenuHotel = () => {
    //     setIsOpenHotel(!isOpenHotel);
    // };
 
    // const toggleMenuTour = () => {
    //     setIsOpenTour(!isOpenTour);
    // };

    return(
        <div>
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
                                    <li className="">
                                        {/* <a className="inline-block py-2 px-4 no-underline text-white" href="dashboard.php">
                                            Dashboard Hotel
                                        </a> */}
                                        <div className="inline-block py-2 px-4 no-underline text-white">
                                            <Link to={"/dashboard-admin-hotel"}>Dashboard Hotel</Link>
                                        </div>
                                    </li>
                                    <li className="">
                                        <a className="inline-block py-2 px-4 no-underline text-white" href="dashboard1.php">
                                            Dashboard Tour
                                        </a>
                                    </li>
                                    <li className="">
                                        {/* <a className="inline-block py-2 px-4 no-underline text-white" href="setting.php">
                                            Setttings
                                        </a> */}
                                        <div className="inline-block py-2 px-4 no-underline text-white">
                                            <Link to={"/settings"}>Setttings</Link>
                                        </div>
                                    </li>
                                    <li className="">
                                        <a className="inline-block py-2 px-4 no-underline text-white" href="dashboard1.php">
                                            personnel management
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </nav>
                </div>
            </div>
        </div>
    );
}
export default HeaderAdmin;