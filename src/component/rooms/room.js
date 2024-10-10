import Header from "../header";
import Footer from "../footer/footer";

import React from 'react';
// import ReactDOM from 'react-dom';
// import ProductList from "../api/room";
// import RoomList from "../ajax/roomlist";
import HotelRooms from "../ajax/rooms/roomlist";

function Room() {

    return (
        <div className="Travel-room">
            {/* <div className="content-wrapper max-w-screen-2xl text-base mx-auto"> */}
                <Header />
                <div className="container mt-[100px] mx-auto sm:px-4 max-w-full bg-gray-100">
                    <div className="">
                        {/* Our Room  */}
                        <div className="py-10 px-4">
                            <h2 className="font-semibold text-2xl text-center">KHÁCH SẠN</h2>
                            <div className="h-[2px] w-[150px] my-2 mx-auto bg-gray-900" />
                        </div>
                        <div className="">
                            
                            <HotelRooms />
                            
                        </div>
                    </div>
                </div>
                <Footer />
            {/* </div> */}
        </div>
       
    );
}
// ReactDOM.render(<Room />, document.getElementById('root'));
export default Room;