import './footer.css';
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer className=" mx-auto pb-24 bg-[rgba(28,41,48,1)]">
            <div className="w-[95%] mx-auto pt-11">
                <div className="flex gap-8">
                    <div className="basis-2/6">
                        <div className="font-semibold text-2xl mb-8 text-[rgba(255,255,255,1.00)]">TravelVN</div>
                        <div className="text-gray-400 text-sm">
                            Delivering the best coffee life since 1996. From coffee geeks to the
                            real ones.
                        </div>
                        <div className="text-gray-300 mb-4">Hung Inc. © 1996</div>
                    </div>
                    <div className="basis-2/6" />
                    <div className="basis-1/6">
                        <div className="uppercase font-semibold mb-4 text-[rgba(255,255,255,1.00)] text-left">Menu</div>
                        <div className="travel-footer-menu text-gray-400 text-left mx-auto tracking-wide">
                            <ul>
                                <li>
                                    <Link to={"/"}>Trang chủ</Link>
                                </li>
                                <li className="relative group">
                                    <button className=''>Dịch vụ</button>
                                    <div
                                        id="dropdownService2"
                                        className="z-20 w-[150px] -ml-[152px] -mt-[35px] mr-9 hidden absolute bg-[#19242b] px-7 py-3 rounded-2xl group-hover:block"
                                    >
                                        <ul className="travel-header-dashboard-item text-[rgba(255,255,255,1.00)]">
                                            <li className='relative group'>
                                                <div className="flex items-center mb-3">
                                                    <Link to={"/room"}>Khách sạn</Link>
                                                </div>
                                            </li>
                                            <li className='relative group'>
                                                <Link to={"/tours"}>Tours</Link>
                                                <div
                                                    className="z-20 w-[150px] -ml-[190px] -mt-[35px] mr-9 hidden absolute bg-[#19242b] px-7 py-3 rounded-2xl group-hover:block"
                                                >
                                                    <ul className="travel-header-dashboard-item text-[rgba(255,255,255,1.00)]">
                                                        <li>
                                                            <div className="flex items-center mb-3">
                                                                <Link to={"/room"}>Khuyến mãi</Link>
                                                            </div>
                                                        </li>
                                                        <li>
                                                            <div className="flex items-center my-1">
                                                                <Link to={"/tours"}>Cao cấp</Link>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </li>

                                <li>
                                    <Link to={"/about"}>Giới thiệu</Link>
                                </li>
                                <li>
                                    <Link to={"/contact"}>Liên hệ</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="basis-1/6">
                        <div className="uppercase font-semibold mb-4 text-[rgba(255,255,255,1.00)] text-left">Theo dõi chúng tôi</div>
                        <div className="travel-footer-flollow text-gray-400 text-left">
                            <div>
                                <a href="https://www.facebook.com/">
                                    <span className='mr-2'>
                                        <i className="fa-brands fa-facebook"></i>
                                    </span>
                                    Facebook
                                </a>
                            </div>
                            <div>
                                <a href="https://www.facebook.com/">
                                    <span className='mr-2'>
                                        <i className="fa-brands fa-instagram"></i>
                                    </span>
                                    Instagram
                                </a>
                            </div>
                            <div>
                                <a href="https://www.facebook.com/">
                                    <span className='mr-2'>
                                        <i className="fa-brands fa-twitter"></i>
                                    </span>
                                    Twitter
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>

    );
}
export default Footer;