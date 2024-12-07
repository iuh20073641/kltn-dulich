// import logo from './logo.svg';
import './App.css';
import { useEffect } from 'react';
import { Route, Routes,useLocation } from "react-router-dom";

import Home from './component/home/home';
import Login from './component/login/login';
import Register from './component/register/register';
import Room from './component/rooms/room';
import About from './component/about/about';
import Contact from './component/contact/contact';
import News from './component/news/news';
import NewsDetail from './component/news/NewsDetail';
import AdminLogin from './admin/admin-service/admin-service';
import LoginManager from './admin/service-manager/login-manager/login-manager';
import DashboardHotel from './admin/service-manager/dashboard/dashboard-hotel';
import RoomManager from './admin/service-manager/room/room';
import User from './admin/service-manager/user.js/user';
import FeatureFacilities from './admin/service-manager/feature-facilities/feature-facilities';
import DashboardAdminHotel from './admin/admin-staff/dashboard-hotel/dashboard-hotel';
import Settings from './admin/admin-staff/settings/settings';
import HomeTour from './component/tours/home-tour';
import TourDetails from './component/tour-details/tour-details';
import RoomDetail from './component/room_details/room_detail';
import ManagerTour from './admin/service-manager/tours/tours';
import TourSetting from './admin/service-manager/tours/tour-setting';
// import BookingTour2 from './component/booking-tour/booking-tour';
import BookingTour from './component/booking-tour/booking-tour';
import BookingSuccess from './component/booking-tour/booking-success';
import InfoBookingTour from './component/info-booking-tour/info-booking-tour';
import Profile from './component/user/profile';

// room
import ConfirmBooking from './component/booking_room/confirm_booking';
import BookingSuccessRoom from './component/booking_room/booking-success';

// tour
import LuxuryTour from './component/tours/luxury-tour';
import StandardTour from './component/tours/standard-tour';
import SaveTour from './component/tours/save-tour';
import DiscountTour from './component/tours/discount-tour';

import LoginNV from './admin/NhanVienLogin';

//quản trị viên
import CreateNV from "./admin/admin-staff/Create-NV/create-nv";
import QuanLyNV from "./admin/admin-staff/QuanLy-NV/quanly-nv";
import DashboardTours from './admin/admin-staff/dashboard-tours/dashboard-tours';
import BookingDetails from './admin/admin-staff/dashboard-tours/booking-details';
import Banner from './admin/admin-staff/banner/banner';
import AllTour from './admin/admin-staff/dashboard-tours/all-tour';
import ActivitiesTour from './admin/admin-staff/dashboard-tours/activities-tour';
import SuspendTour from './admin/admin-staff/dashboard-tours/suspend-tour';
import AllRattingtour from './admin/admin-staff/dashboard-tours/ratting-tour';
import AllBookingTour from './admin/admin-staff/dashboard-tours/all-booking';
import NewBookingTour2 from './admin/admin-staff/dashboard-tours/new-booking';
import ApprovedApplication2 from './admin/admin-staff/dashboard-tours/application-booking';
import RefundBookingTour2 from './admin/admin-staff/dashboard-tours/refund-booking';

// hướng dẫn viên
import DashboardHDV from "./admin/huongdanvien/dashboard/dashboard-hotel";
import CapNhatNV from "./admin/huongdanvien/CapNhatThongTin/cap-nhat";

// kiểm duyệt viên
import DashboardKDV from "./admin/kiemduyetvien/dashboard/dashboard-hotel";
import CapNhatNVKD from "./admin/kiemduyetvien/CapNhatThongTin/cap-nhat";
import NewBookingTour from './admin/kiemduyetvien/new-booking-tour/new-booking-tour';
import RefundBookingTour from './admin/kiemduyetvien/refund-booking-tour/refund-booking-tour';
import BookingRecord from './admin/kiemduyetvien/booking-records/booking-records';
import ApprovedApplication from './admin/kiemduyetvien/approved-application/approved-application';
import QRScannerComponent from './admin/kiemduyetvien/booking-records/qr-code';
import RatingTour from './admin/kiemduyetvien/rating-tour/rating-tour';
import CreateBookingTourByNV from './admin/kiemduyetvien/create-booking/create-booking';
import User2 from './admin/kiemduyetvien/user/user';

//nhan vien quản lí 
import QuanLyTinTuc from "./admin/service-manager/QuanLy-TinTuc/quanly-tintuc";
import NewBookingTour3 from './admin/service-manager/new-booking-tour/new-booking-tour';
import ApprovedApplication3 from './admin/service-manager/approved-application/approved-application';
import RefundBookingTour3 from './admin/service-manager/refund-booking-tour/refund-booking-tour';
import BookingRecord3 from './admin/service-manager/booking-records/booking-records';

// app.render(
//   <BrowserRouter>
//     <Routes>
//       <Route path="/" element={<Section />} />
//       <Route path="login" element={<Login />} />
//       {/* <Section /> */}
//     </Routes>
//   </BrowserRouter>
// )

function App() {
  return (
    <div className="App">
        <div className="content-wrapper max-w-screen-2xl text-base mx-auto">
            {/* <Header /> */}
            {/* <BrowserRouter> */}
            <ScrollToTop />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} /> 
                <Route path="/register" element={<Register />} /> 
                <Route path="/Profile" element={<Profile />} /> 
                <Route path="/room"  element={<Room  />} /> 
                <Route path="/about"  element={<About  />} /> 
                <Route path="/contact"  element={<Contact  />} />
                <Route path="/news" element={<News />} />
                <Route path="/news/:id" element={<NewsDetail />} /> 
                <Route path="/admin-service"  element={<AdminLogin  />} /> 
                <Route path="/login-manager"  element={<LoginManager  />} /> 
                <Route path="/dashboard-hotel"  element={<DashboardHotel  />} /> 
                <Route path="/room-manager"  element={<RoomManager  />} /> 
                <Route path="/user"  element={<User  />} /> 
                <Route path="/features-facilities"  element={<FeatureFacilities  />} /> 
                <Route path="/dashboard-admin-hotel"  element={<DashboardAdminHotel  />} /> 
                <Route path="/settings"  element={<Settings  />} /> 
                <Route path="/tours"  element={<HomeTour  />} /> 
                <Route path="/tour-details/:id"  element={<TourDetails  />} /> 
                <Route path="/room-details/:id"  element={<RoomDetail  />} /> 
                <Route path="/tours-manager"  element={<ManagerTour  />} /> 
                <Route path="/tours-setting/:id"  element={<TourSetting  />} /> 
                <Route path="/booking-tour/:id"  element={<BookingTour  />} />
                <Route path="/success/:id"  element={<BookingSuccess  />} />
                <Route path="/info-booking-tour"  element={<InfoBookingTour  />} /> 

                {/* room */}
                <Route path="/confirm-booking/:id"  element={<ConfirmBooking  />} /> 
                <Route path="/success-room/:id"  element={<BookingSuccessRoom  />} />

                {/* tour */}
                <Route path="/luxury-tour"  element={<LuxuryTour  />} />
                <Route path="/standard-tour"  element={<StandardTour  />} />
                <Route path="/save-tour"  element={<SaveTour  />} />
                <Route path="/discount-tour"  element={<DiscountTour  />} />

                <Route path="/login-nv" element={<LoginNV />} />


                {/* Quản trị viên */}
                <Route path="/create-nv" element={<CreateNV />} />
                <Route path="/quanly-nv" element={<QuanLyNV />} />
                <Route path="/dashboard-tours" element={<DashboardTours />} />
                <Route path="/dashboard-tours/booking-detail" element={<BookingDetails />} />
                <Route path="/dashboard-tours/all-tours" element={<AllTour />} />
                <Route path="/dashboard-tours/activities-tours" element={<ActivitiesTour />} />
                <Route path="/dashboard-tours/suspend-tours" element={<SuspendTour />} />
                <Route path="/dashboard-tours/all-rating-tours" element={<AllRattingtour />} />
                <Route path="/dashboard-tours/all-booking-tours" element={<AllBookingTour />} />
                <Route path="/dashboard-tours/all-new-tours" element={<NewBookingTour2 />} />
                <Route path="/dashboard-tours/all-approved-tours" element={<ApprovedApplication2 />} />
                <Route path="/dashboard-tours/all-refund-tours" element={<RefundBookingTour2 />} />
                <Route path="/banner" element={<Banner />} />

                {/* Hướng dẫn viên */}
            <Route
              path="/dashboard-huong-dan-vien"
              element={<DashboardHDV />}
            />
            <Route path="/cap-nhat" element={<CapNhatNV />} />

            {/* kiểm duyệt viên */}
            <Route
              path="/dashboard-kiem-duyet-vien"
              element={<DashboardKDV />}
            />
            <Route path="/cap-nhat-kd" element={<CapNhatNVKD />} />
            <Route path="/rating-tour" element={<RatingTour />} />
            <Route path="/new-booking-tour" element={<NewBookingTour />} />
            <Route path="/refund-booking-tour" element={<RefundBookingTour />} />
            <Route path="/booking-records" element={<BookingRecord />} />
            <Route path="/approved-application" element={<ApprovedApplication />} />
            <Route path="/qr-code" element={<QRScannerComponent />} /> 
            <Route path="/create-booking-tour" element={<CreateBookingTourByNV />} />
            <Route path="/customer-care/user" element={<User2 />} />

             {/* nhan vien quản lí */}
              <Route path="/quanly-tintuc" element={<QuanLyTinTuc />} />
              <Route path="/manager/new-booking-tour" element={<NewBookingTour3 />} />
              <Route path="/manager/approved-application" element={<ApprovedApplication3 />} />
              <Route path="/manager/refund-booking-tour" element={<RefundBookingTour3 />} />
              <Route path="/manager/booking-records" element={<BookingRecord3 />} />


            {/* khach hang */}
                {/* <Section /> */}
              </Routes>
            {/* </BrowserRouter> */}
            
            {/* <Footer /> */}
        </div>
    </div>
  );
}

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]); // Quay về đầu trang khi đường dẫn thay đổi

  return null;
};

export default App;
