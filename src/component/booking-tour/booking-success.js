import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import config from "../../component/config.json";

const { SERVER_API } = config;

function BookingSuccess(){

    const location = useLocation();
    const { id } = useParams();  // Lấy ID từ URL
    const queryParams = new URLSearchParams(location.search);
    
    // Lấy và giải mã từng giá trị từ query string
    const userId = queryParams.get('user_id');
    const deparId = queryParams.get('depar_id');
    const participant = queryParams.get('participant');
    const priceTour = queryParams.get('price_tour');
    const totalPay = queryParams.get('total_pay');
    const nameUser = decodeURIComponent(queryParams.get('name_user'));
    const phone = queryParams.get('phone');
    const address = decodeURIComponent(queryParams.get('address'));
    const tourName = decodeURIComponent(queryParams.get('tour_name'));
    const cccd = queryParams.get('cccd');
    // Do dữ liệu customers bị mã hóa thành chuỗi, cần xử lý lại
    const customers = JSON.parse(decodeURIComponent(queryParams.get('customers'))); 
    const toddlers = JSON.parse(decodeURIComponent(queryParams.get('toddlers'))); 
    const children = JSON.parse(decodeURIComponent(queryParams.get('children'))); 
    const baby = JSON.parse(decodeURIComponent(queryParams.get('baby'))); 
    // Log các giá trị đã lấy
    console.log({
        userId,
        deparId,
        participant,
        priceTour,
        totalPay,
        nameUser,
        phone,
        address,
        tourName,
        cccd,
        customers,
        toddlers,
        children,
        baby,
        id
    });

    useEffect(() => {
        // Hàm gọi API
        const insertBookingTour = async () => {
        
            fetch(`${SERVER_API}/create_booking_tour_online.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: userId,
                    id_tour: id,
                    depar_id: deparId,
                    participant: participant,
                    totalPrice: totalPay,
                    price_tour: priceTour,
                    name_user: nameUser,
                    cccd: cccd,
                    phone: phone,
                    address: address,
                    tour_name: tourName,
                    customers: customers,
                    toddlers: toddlers,
                    children: children,
                    baby: baby
                }),
            })
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        console.log(data.message);
                       
                    } else if (data.status === 'error'){
                        console.log(data.message);
                    }
                  })
                .catch(error => {
                    
                    console.log('Có lỗi xảy ra:', error);
                });
        };

        insertBookingTour();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Gọi lại khi userId thay đổi

    return(
        <div>
            
            <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
                <svg className="mx-auto mb-4 w-16 h-16 text-green-500" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 10-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <h2 className="text-2xl font-bold mb-2 text-gray-800">Thanh toán thành công!</h2>
                <p className="text-gray-600 mb-4">Cảm ơn bạn đã thanh toán. Chúng tôi đã nhận được đơn hàng của bạn.</p>
                <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                    <Link to={"/info-booking-tour"}>Xem trạng thái đặt tour</Link> 
                </button>
            </div>
        </div>
        </div>
    )
}
export default BookingSuccess;