// import logo from './logo.svg';
import './App.css';
import { useEffect } from 'react';
import { BrowserRouter, Route, Routes,useLocation } from "react-router-dom";

import Home from './component/home/home';
import Login from './component/login/login';
import Register from './component/register/register';
import Room from './component/rooms/room';
import About from './component/about/about';
import Contact from './component/contact/contact';
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
import BookingTour from './component/booking-tour/booking-tour';

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
            <BrowserRouter>
            <ScrollToTop />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} /> 
                <Route path="/register" element={<Register />} /> 
                <Route path="/room"  element={<Room  />} /> 
                <Route path="/about"  element={<About  />} /> 
                <Route path="/contact"  element={<Contact  />} /> 
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
                {/* <Section /> */}
              </Routes>
            </BrowserRouter>
            
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
