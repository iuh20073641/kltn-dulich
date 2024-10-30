// import React, { useEffect, useRef, useState } from 'react';
// import { BrowserMultiFormatReader } from '@zxing/library';
// import { fetchBookingByQrcode } from '../../../component/api/tours';
// import './qr-code.css';

// function QRScannerComponent () {
//     const [result, setResult] = useState('');
//     const [invoiceData, setInvoiceData] = useState(null);
//     const [scanStatus, setScanStatus] = useState('Đang khởi tạo máy quét...');
//     const videoRef = useRef(null);
//     const [codeReader, setCodeReader] = useState(null);
//     const [isScanning, setIsScanning] = useState(true);

//     useEffect(() => {
//         const initializeScanner = async () => {
//             // const constraints = {
//             //     video: { facingMode: 'environment' } // Sử dụng camera phía sau nếu có
//             // };
//             // Kiểm tra nếu `codeReader` đã tồn tại để tránh tạo nhiều lần
//             if (!codeReader) {
//                 const reader = new BrowserMultiFormatReader();
//                 setCodeReader(reader);

//                 try {
//                     await reader.decodeFromVideoDevice(null, videoRef.current, (error, result) => {
//                         console.log('QR Code detected:', result);
//                         if (result.text && isScanning) {
//                             console.log('QR Code detected:', result.text);
//                             setResult(result.text);
//                             setScanStatus('Quét mã thành công!');
//                             setIsScanning(false); // Dừng quét sau khi quét thành công
//                             fetchInvoiceData(result.text);
//                             reader.reset(); // Dừng camera sau khi có kết quả
//                         } else if (error) {
//                             if (error instanceof Error) {
//                                 console.error('Error during QR decoding:', error);
//                                 setScanStatus('Không quét được mã, vui lòng thử lại.');
//                             }
//                         }
//                     });
//                 } catch (err) {
//                     console.error('Error initializing scanner:', err);
//                     setScanStatus('Lỗi khởi tạo quét mã.');
//                 }
//             }
//         };

//         if (isScanning) {
//             setScanStatus('Đang bật camera và sẵn sàng quét mã...');
//             initializeScanner();
//         }

//         return () => {
//             // Dọn dẹp và dừng camera khi component bị hủy
//             if (codeReader) {
//                 codeReader.reset();
//             }
//         };
//     }, [codeReader, isScanning]);

//     const fetchInvoiceData = async (bookingid) => {
//         try {
//             const response = await fetchBookingByQrcode(bookingid);
//             console.log(response.data);
//             setInvoiceData(response.data);
//         } catch (error) {
//             console.error('Error fetching invoice data:', error);
//         }
//     };

//     return (
//         <div style={{ position: 'relative' }}>
//             <h2>QR Scanner</h2>
//             {scanStatus && <p>{scanStatus}</p>}
//             <video ref={videoRef} style={{ width: '800%', height:'500px', marginTop:'30px' }}></video>
//             <div className="qr-scanner-overlay"></div>
//             {result && <p>Kết quả: {result}</p>}
//             {invoiceData && (
//                 <div>
//                     <h3>Dữ liệu hóa đơn:</h3>
//                     <div>
//                         {invoiceData.cccd}
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default QRScannerComponent;
import React, { useEffect, useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner'; // Nhập Scanner từ thư viện
import { fetchBookingByQrcode } from '../../../component/api/tours';
import PriceDisplay from '../../../component/service/money';
import { fetchParticipantsTourByBookingid } from '../../../component/api/tours';
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';

function QRScannerComponent() {
    // const [data, setData] = useState(''); // Kết quả quét mã
    const [invoiceData, setInvoiceData] = useState(null); // Dữ liệu hóa đơn
    const [scanStatus, setScanStatus] = useState('Đang khởi tạo máy quét...'); // Trạng thái quét
    const [isCameraActive, setIsCameraActive] = useState(true); // Quản lý trạng thái camera

    const [participants, setParticipants] = useState([]);

    const handleError = (error) => {
        console.error('Lỗi quét QR Code:', error);
        setScanStatus('Không quét được mã, vui lòng thử lại.');
    };

    const handleScan = (result) => {
        if (result && result.length > 0) {
            console.log(result); // Kiểm tra cấu trúc của kết quả
            const qrCodeValue = result[0].rawValue; // Lấy giá trị từ phần tử đầu tiên của mảng

            if (qrCodeValue) {
                // setData(qrCodeValue);
                setScanStatus('Quét mã thành công!');
                console.log(qrCodeValue); // Hiển thị giá trị qrCodeValue
                fetchInvoiceData(qrCodeValue); // Gọi hàm lấy dữ liệu hóa đơn

                // Tắt camera sau khi quét thành công
                stopCamera();
            } else {
                console.error('Không tìm thấy giá trị rawValue trong kết quả quét.');
            }
        }
    };

    const stopCamera = () => {
        // Tắt camera
        setIsCameraActive(false);
    };

    const fetchInvoiceData = async (bookingid) => {
        console.log(bookingid);
        try {
            const response = await fetchBookingByQrcode(bookingid);
            console.log(response.data);
            setInvoiceData(response.data);

            const participantResponse = await fetchParticipantsTourByBookingid(bookingid);
            const participantData = participantResponse.data; // Giả sử API trả về mảng các tour
            setParticipants(participantData);

        } catch (error) {
            console.error('Error fetching invoice data:', error);
        }
    };

    useEffect(() => {
        // Bắt đầu quét khi component được mount
        setScanStatus('Đang bật camera và sẵn sàng quét mã...');
    }, []); // Chạy 1 lần khi component được mount


    const updateConfirmBooking = (bookingId) => {
        console.log(bookingId);
        // if (window.confirm('Bạn có chắc chắn muốn xóa phòng này?')) {
        fetch('http://localhost:88/api_travel/api/admin/confirm-tour.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                // assign_room: true, // Thêm biến này để kích hoạt điều kiện trong PHP
                booking_id: bookingId
            }),
        })
            .then(response => response.json())
            .then(data => {
                // console.log('Đang gửi dữ liệu:', { room_id: roomId, image_id: imageId });
                if (data.status === 'success') { // Kiểm tra 'success' thay vì 'status'
                    // setTourImages(tourImages.filter(tourImage => tourImage.id !== imageId));
                    toast.success(data.message);
                } else {
                    toast.error(data.message);
                }
            })
            .catch(error => {
                // console.error('Có lỗi xảy ra:', error);
                toast.error('Lỗi.');
                console.log('Có lỗi xảy ra:', error);
            });
    };

    // hủy đơn đặt tour
    const cancelBookingTour = (bookingId) => {
        console.log(bookingId);
        // if (window.confirm('Bạn có chắc chắn muốn xóa phòng này?')) {
        fetch('http://localhost:88/api_travel/api/admin/cancel_booking_tour.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                cancel_booking: true, // Thêm biến này để kích hoạt điều kiện trong PHP
                booking_id: bookingId
            }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') { // Kiểm tra 'success' thay vì 'status'
                    toast.success(data.message);
                } else {
                    toast.error(data.message);
                }
            })
            .catch(error => {
                toast.error('Lỗi.');
                console.log('Có lỗi xảy ra:', error);
            });
    };

    return (
        <div>
            <h2>QR Scanner</h2>
            {scanStatus && <p>{scanStatus}</p>}
            {isCameraActive && (
                <div className='w-[60%] mx-auto'>
                    <Scanner
                        onScan={handleScan} // Gọi hàm khi quét thành công
                        onError={handleError} // Gọi hàm khi có lỗi
                    // style={{ width: '300px', height: '200px' }} // Đặt chiều rộng cho video quét
                    // className="scanner-video"
                    />
                </div>
            )}

            {/* {data && <p>Kết quả quét: {data}</p>} */}
            {Array.isArray(invoiceData) && invoiceData.length > 0 ? (
                invoiceData.map((data) => (
                    <div key={data.booking_id}>
                        <h3>Dữ liệu hóa đơn:</h3>

                        <div className='w-[50%] mx-auto mt-10 mb-10'>
                            <div className='flex items-center justify-between mb-3'>
                                <div className='w-[20%]'>
                                    <Link to="/booking-records">
                                        <div className='bg-[#3d81e9] text-white w-[40%] rounded-md py-[2px] hover:bg-[#3872c9]'>
                                            <i className="fa-solid fa-arrow-left"></i>
                                        </div>
                                    </Link>
                                </div>
                                <div className='w-[70%] flex text-left items-center justify-end '>
                                    <div className='text-lg font-medium text-[#2658a4] uppercase'>Trạng thái đơn</div>
                                    <div className="w-[30%] mx-3">
                                        {data.refund === 1 && data.arrival === 0 ? (
                                            <div className="w-[100%] text-sm bg-[#dc3545] text-white rounded-md ">
                                                <p className="px-2 py-1 text-center">Đã hủy và hoàn tiền</p>
                                            </div>
                                        ) : data.refund === 0 && data.arrival === 1 ? (
                                            <div className="w-[100%] bg-[#198754] text-white rounded-md">
                                                <p className="px-2 py-1 text-center">Đã hủy, chưa hoàn tiền</p>
                                            </div>
                                        ) : data.refund === null && data.arrival === 1 ? (
                                            <div className="w-[80%] bg-[#198754] text-white rounded-md">
                                                <p className="px-2 py-1 text-center">Đã duyệt</p>
                                            </div>
                                        ) : data.refund === null && data.arrival === 2 ? (
                                            <div className="w-[100%] bg-[#198754] text-white rounded-md">
                                                <p className="px-2 py-1 text-center">Khách hàng đã nhận tour</p>
                                            </div>
                                        ) : data.refund === null && data.arrival === 0 ? (
                                            <div className="w-[80%] bg-[#198754] text-white rounded-md">
                                                <p className="px-2 py-1 text-center">Chưa duyệt</p>
                                            </div>
                                        ) : data.refund === 1 && data.arrival === 1 && (
                                            <div className="w-[70%] text-sm bg-[#dc3545] text-white rounded-md">
                                                <p className="px-2 py-1 text-center">Đã hủy</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className='text-left font-semibold text-xl text-[#2658a4] uppercase'>Thông tin đơn đặt tour</div>
                            <div className='mt-3'>
                                <div className='flex'>
                                    <div className='font-semibold'>Mã đơn:</div>
                                    <div className='mx-2'>{data.booking_id}</div>
                                </div>
                                <div className='flex'>
                                    <div className='font-semibold'>Tên tour:</div>
                                    <div className='mx-2'>{data.tour_name}</div>
                                </div>
                                <div className='flex'>
                                    <div className='font-semibold'>Số người tham gia:</div>
                                    <div className='mx-2'>{data.participant}</div>
                                </div>
                                <div className='flex'>
                                    <div className='font-semibold'>Tổng giá:</div>
                                    <div className='mx-2'><PriceDisplay price={data.total_pay} /></div>
                                </div>
                            </div>
                            <div className='mt-4 text-left font-semibold text-xl text-[#2658a4] uppercase'>Thông tin người tham gia</div>
                            <div className='mt-3'>
                                <div className='mb-3 text-left text-xl font-semibold'>Người đặt tour</div>
                                <div className='flex'>
                                    <div className='font-semibold'>Mã người dùng:</div>
                                    <div className='mx-2'>{data.user_id}</div>
                                </div>
                                <div className='flex'>
                                    <div className='font-semibold'>Tên người đặt:</div>
                                    <div className='mx-2'>{data.user_name}</div>
                                </div>
                                <div className='flex'>
                                    <div className='font-semibold'>Cccd:</div>
                                    <div className='mx-2'>{data.cccd}</div>
                                </div>
                                <div className='flex'>
                                    <div className='font-semibold'>Số điện thoại:</div>
                                    <div className='mx-2'>{data.phonenum}</div>
                                </div>
                                <div className='flex'>
                                    <div className='font-semibold'>Địa chỉ:</div>
                                    <div className='mx-2'>{data.address}</div>
                                </div>
                                <div className=' my-3 text-left text-xl font-semibold'>Thông tin người đi cùng</div>
                                <div className=''>
                                    {Array.isArray(participants) && participants.length > 0 ? (
                                        <table className='border-[1px] border-gray-400 mx-auto'>
                                            <thead>
                                                <tr className='border-[1px] border-gray-400'>
                                                    <th className='border-[1px] border-gray-400 w-[50px]'>STT</th>
                                                    <th className='border-[1px] border-gray-400 w-[300px]'>Họ tên</th>
                                                    <th className='border-[1px] border-gray-400 w-[150px]'>Cccd</th>
                                                </tr>
                                            </thead>
                                                <tbody>
                                                {participants.map((participant, index) => (
                                                    <tr key={participant.id}>
                                                        <td className='border-[1px] border-gray-400 text-left px-2'>{index + 1}</td>
                                                        <td className='border-[1px] border-gray-400 text-left px-2'>{participant.name}</td>
                                                        <td className='border-[1px] border-gray-400 text-left px-2'>{participant.cccd}</td>
                                                    </tr>
                                                ))}
                                                </tbody>
                                        </table>
                                     ) : (
                                        <div className="text-left text-sm mb-3">Chưa có đánh giá nào.</div>
                                    )}
                                </div>
                                <div>
                                    {data.refund === null && data.arrival === 1 ? (
                                        <div className='mt-10 flex gap-2 justify-center'>
                                            <div>
                                                <button type='button' onClick={() => updateConfirmBooking(data.booking_id)} className='btn text-white px-2 py-1 bg-[#2ec1ac] hover:bg-[#2c7c70] border-[1px] border-[#2ec1ac] hover:border-[#2c7c70] rounded-md text-sm custom-bg shadow-none'>
                                                    <i className="fa-regular fa-square-check"></i> Xác nhận
                                                </button>
                                            </div>
                                            <div>
                                                <button type='button' onClick={() => cancelBookingTour(data.booking_id)} className=' px-2 py-1 rounded-md btn border-[1px] border-[#dc3545] text-[#dc3545] hover:bg-[#dc3545] hover:text-white text-sm shadow-none'>
                                                    <i className='bi bi-trash'></i> Hủy đơn
                                                </button>
                                            </div>
                                        </div>
                                    ) : data.refund === 0 && (
                                        <div className="w-[70%] mx-auto mt-10 text-sm bg-[#198754] text-white rounded-md">
                                            <p className="px-2 py-1 text-center">Hoàn tiền</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>
                    </div>
                ))
            ) : (
                <div className="text-center text-sm mb-3">Quét qr để lấy dữ liệu hóa đơn.</div>
            )}
        </div>
    );
};

export default QRScannerComponent;
