import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

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
    const nameUser = decodeURIComponent(queryParams.get('name_user')).replace(/^'|'$/g, '');
    const phone = queryParams.get('phone');
    const address = decodeURIComponent(queryParams.get('address')).replace(/^'|'$/g, '');
    const tourName = decodeURIComponent(queryParams.get('tour_name')).replace(/^'|'$/g, '');

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
        tourName
    });

    useEffect(() => {
        // Hàm gọi API
        const insertBookingTour = () => {
        
            fetch('http://localhost:88/api_travel/api/create_booking_tour_online.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: userId,
                    id_tour: id,
                    depar_id: deparId,
                    participant: participant,
                    price_tour: priceTour,
                    name_user: nameUser,
                    phone: phone,
                    address: address,
                    tour_name: tourName,
                    totalPay: totalPay
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
                    <Link to={"/"}>Quay lại trang chủ</Link> 
                </button>
            </div>
        </div>
        </div>
    )
}
export default BookingSuccess;