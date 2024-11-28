import HeaderAdmin from "../header-admin/header-admin";
import React, { useEffect, useState } from 'react';
import { fetchCarouselImage } from "../../../component/api/settings";
import { toast } from 'react-toastify';
import Modal from "react-modal";
import config from "../../../component/config.json";

const { SERVER_API } = config;

Modal.setAppElement("#root"); // Thiết lập phần tử gốc cho modal

function Banner() {

    const [carouselImages, setCarouselImages] = useState([]);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [formSettingValue, setFormSettingValue] = useState([{ image: null }]);

    useEffect(() => {
        // Hàm để gọi API và cập nhật state
        const fetchCarouselData = async () => {

            try {
                // Gọi API để lấy danh sách phòng
                const carouselResponse = await fetchCarouselImage();
                const imageData = carouselResponse.data; // Giả sử API trả về mảng các tour

                setCarouselImages(imageData);

            } catch (err) {
                console.error('Error fetching data:', err);
            }
        };

        fetchCarouselData();
    }, [carouselImages]); // Chạy một lần khi component được mount

    // Hàm xử lý thay đổi cho ô tải lên hình ảnh
    const handleImageChange = (e) => {
        setFormSettingValue({ ...formSettingValue, image: e.target.files[0] });
    };

    const clickModalContacts = () => {
        setIsOpenModal(!isOpenModal);
    };

    // thêm hình ảnh carousel
    const hendleImageSubmit = async (event) => {
        event.preventDefault(); //để không tự động reset
        // Tạo FormData
        const formImage = new FormData();

        // Append từng trường vào formData
            formImage.append("image", formSettingValue.image); // File sẽ được gửi dưới dạng multipart
    
            console.log("formDataCarousel", formSettingValue.image);
        fetch(`${SERVER_API}/admin/create_carousel_image.php`, {
            method: 'POST',
            body: formImage,
          })
          .then(response => response.json())
          .then(data => {
            if (data.status === 'success') {
                toast.success(data.message);
                setFormSettingValue([{ image: null }]); // Đặt lại form về rỗng nếu có lỗi
                
            } else if (data.status === 'error'){
                toast.error(data.message);
                setFormSettingValue([{ image: null }]); // Đặt lại form về rỗng nếu có lỗi
            } 
          })
          .catch(error => {

            toast.error('lỗi.');
            console.log('Có lỗi xảy ra:', error);
            setFormSettingValue([{ image: null }]); // Đặt lại form về rỗng nếu có lỗi
          });
    };

    // xóa hình ảnh carousel
    const deleteCarouselImage = (imageId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa hình ảnh này?')) {
            fetch(`${SERVER_API}/admin/delete_carousel_image.php`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ image_id: imageId }),
            })
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        setCarouselImages(carouselImages.filter(carouselImage => carouselImage.id !== imageId));
                        toast.success(data.message);
                    } else if (data.status === 'error') {
                        toast.error(data.message);
                    } 
                })
                .catch(error => {
                    toast.error('lỗi.');
                    console.log('Có lỗi xảy ra:', error);
                });
        }
    };

    return (
        <div>
            <HeaderAdmin />

            <div className="container mx-auto h-screen sm:px-4 w-[80%] -mt-[660px] float-right overflow-auto bg-gray-100">
                <h3 className="my-4 text-left font-semibold text-2xl uppercase">Banner</h3>
                {/* general settings section */}
                <div className="relative flex flex-col min-w-0 rounded break-words bg-white shadow-sm">
                    <div className="w-[97%] mx-auto max-h-[500px]">
                        <div className="flex justify-between my-4">
                            <div className="font-medium text-xl">Hình ảnh</div>
                            <div className="bg-black text-white py-[2px] px-2 rounded-[3px]">
                                <button type="button" onClick={clickModalContacts}>
                                    <span><i className="fa-solid fa-plus"></i></span>
                                    Thêm
                                </button>
                            </div>
                        </div>
                        {Array.isArray(carouselImages) && carouselImages.length > 0 ? (
                            <div className="grid grid-cols-3 gap-3 mb-4 max-h-[430px] overflow-auto">
                                {carouselImages.map((image) => (
                                    <div className="h-[150px]" key={image.id}>
                                        <div className="h-full rounded-md bg-no-repeat bg-center bg-cover" style={{
                                            backgroundImage: `url('http://localhost:88/api_travel/api/Images/carousel/${image.image}')`
                                        }}>
                                            <div className="w-full h-full hover:transition-all relative group">
                                                <button onClick={() => deleteCarouselImage(image.id)} className="absolute rounded-[3px] bg-[#dc3545] text-white font-medium py-[2px] px-2 top-3 right-3 text-center">
                                                    <span className="mr-2"><i className="fa-solid fa-trash-can"></i></span>
                                                    Xóa
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="w-full mx-auto h-[430px]">
                                <p className="text-center font-semibold text-xl">Chưa có hình ảnh quảng cáo</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* modal contact settings */}
            <Modal
                isOpen={isOpenModal}
                onRequestClose={() => setIsOpenModal(false)}
                className="modal "
                overlayClassName="modal-overlay"
            >

                <div className="bg-white w-full mx-auto h-[50%] rounded-[5px]">
                    <div className="text-left font-medium text-xl mb-4 mt-2">Thêm hình ảnh</div>
                    <div className="w-full h-[1px] bg-gray-300 rounded-md"></div>

                    <div className="my-4">
                        <div>
                            <div className="font-medium">Hình ảnh</div>
                            <div>
                                <input
                                    type="file"
                                    name="image"
                                    onChange={handleImageChange}
                                    accept=".jpg, .png, .webp, .jpeg"
                                    className="block appearance-none w-full py-1 px-2 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded shadow-none mb-3"
                                    required=""
                                />
                            </div>
                        </div>
                    </div>

                    <div className="w-full h-[1px] bg-gray-200 mt-5 rounded-md"></div>
                    <div className="flex gap-3 justify-center mt-3">
                        <div className="">
                            <button type="button" onClick={() => setIsOpenModal(false)} className="bg-slate-200 px-2 py-[2px] rounded-[5px] w-[100px] font-medium">
                                Hủy
                            </button>
                        </div>
                        <div>
                            <button type="button" onClick={(event) => hendleImageSubmit(event)} className="bg-[#2ec1ac] text-white px-2 py-[2px] rounded-[5px] w-[100px] font-medium">
                                Thêm
                            </button>
                        </div>
                    </div>
                </div>

            </Modal>
        </div>
    )
}
export default Banner;