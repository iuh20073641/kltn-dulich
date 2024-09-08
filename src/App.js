// import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from './component/home/home';
import Login from './component/login/login';
import Register from './component/register/register';
import Room from './component/rooms/room';
import About from './component/about/about';
import Contact from './component/contact/contact';

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
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} /> 
                <Route path="/register" element={<Register />} /> 
                <Route path="/room"  element={<Room  />} /> 
                <Route path="/about"  element={<About  />} /> 
                <Route path="/contact"  element={<Contact  />} /> 
                {/* <Section /> */}
              </Routes>
            </BrowserRouter>
            
            {/* <Footer /> */}
        </div>
    </div>
  );
}

export default App;
