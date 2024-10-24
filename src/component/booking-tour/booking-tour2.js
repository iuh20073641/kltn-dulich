import Header from "../header";
import Footer from "../footer/footer";
import { useParams } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { fetchTourDetails } from "../api/tours";
import { fetchDayDepart } from "../api/tours";
import { getUsersData } from "../api/user";
import { toast } from "react-toastify";
import TotalDisplay from "../service/total-price";
import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";

const formTour = {
  id_tour: "",
  nametour: "",
  type: "",
  participant: "",
  price: "",
  timeTour: "",
  depart: "",
  departurelocation: "",
  discount: "",
  itinerary: "",
  vehicle: "",
  name: "",
  cccd: "",
};

const dayDepart = {
  day: "",
};

function BookingTour2() {
  const { id } = useParams(); // Lấy ID từ URL
  const [tourData, setTourData] = useState({
    ...formTour,
    participant: "", // Khởi tạo giá trị mặc định cho participant
  });
  const [departData, setDepartData] = useState({ dayDepart });
  const [userData, setUserData] = useState({});
  const [error, setError] = useState(null);

  const [searchParams] = useSearchParams();
  const selectedTour = searchParams.get("selectedTour");

  const [inputValue, setInputValue] = useState(""); // State để quản lý giá trị nhập
  const [originalPrice, setOriginalPrice] = useState(0); // Giá gốc
  const [discountPercent, setDiscountPercent] = useState(0); // Tỷ lệ giảm giá
  // const [totalPrice, setTotalPrice] = useState(0); 
  useEffect(() => {
    const tourDetail = async () => {
      try {
        const toursResponse = await fetchTourDetails(id);
        const toursData = toursResponse.data;
        setTourData(toursData);

        if (Array.isArray(toursData) && toursData.length > 0) {
          setTourData(toursData[0]);
        } else {
          setTourData(null);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Có lỗi xảy ra khi lấy dữ liệu sản phẩm.");
      }
    };

    tourDetail();
  }, [id]);

  useEffect(() => {
    const tourDepart = async () => {
      try {
        const departResponse = await fetchDayDepart(selectedTour);
        const departData = departResponse.data;
        setDepartData(departData);

        if (Array.isArray(departData) && departData.length > 0) {
          setDepartData(departData[0]);
        } else {
          setDepartData(null);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Có lỗi xảy ra khi lấy dữ liệu sản phẩm.");
      }
    };

    tourDepart();
  }, [selectedTour]);

  useEffect(() => {
    const user = async () => {
      const userData = localStorage.getItem("user");
      const user = JSON.parse(userData);

      try {
        const userResponse = await getUsersData(user.id);
        const userData = userResponse.data;
        setUserData(userData);

        if (Array.isArray(userData) && userData.length > 0) {
          setUserData(userData[0]);
        } else {
          setUserData(null);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Có lỗi xảy ra khi lấy dữ liệu sản phẩm.");
      }
    };

    user();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTourData({ ...tourData, [name]: value });
    setInputValue(value);
  };

  const calculateDiscountedPrice = (originalPrice, discountPercent) => {
    if (!originalPrice || !discountPercent) {
      return originalPrice;
    }
    const discountAmount = (originalPrice * discountPercent) / 100;
    return originalPrice - discountAmount;
  };

  const discountedPrice = calculateDiscountedPrice(
    originalPrice,
    discountPercent
  );

  const finalPrice = discountedPrice * inputValue;

  const stripePromise = loadStripe(
    "pk_test_51Q8m79Rqz8axCXq0oW0OaP1KhZHGkV5Wl1sYMRgVPYgsZwOy78KJnDCwpHh28VRJYSvVoHDP4Jr9UGbBICFD3xxm00NkH3YI5w"
  );

  const handlePayment = async () => {
    try {
      const response = await fetch(
        "http://localhost:88/api_travel/api/create-checkout-session.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: finalPrice * 100, // Stripe expects the amount in cents
            success_url: "http://localhost:3000/success",
            cancel_url: "http://localhost:3000/cancel",
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const { id } = await response.json();
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({ sessionId: id });

      if (error) {
        console.error("Error redirecting to checkout:", error);
        alert("Failed to redirect to checkout. Please try again later.");
      }
    } catch (error) {
      console.error("Error creating payment session:", error);
      alert("Failed to create payment session. Please try again later.");
    }
  };

  const hendleDepartSubmit = async (event) => {
    const userData = localStorage.getItem("user");
    const user = JSON.parse(userData);
    event.preventDefault();
    fetch(
      "http://localhost/api-dulich-main/api-dulich/api/Admin/create_booking_tour.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.id,
          id_tour: id,
          depar_id: selectedTour,
          participant: tourData.participant,
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          toast.success(data.message);
        } else if (data.status === "error") {
          toast.error(data.message);
        }
      })
      .catch((error) => {
        toast.error("lỗi.");
        console.log("Có lỗi xảy ra:", error);
      });
  };

  if (error) return <p>{error}</p>;

  return (
    <div>
      <Header />
      <div className="w-full">
        <div className="w-[80%] mt-[150px] mx-auto">
          <div className="font-semibold uppercase text-2xl text-center mb-5">
            Thông tin đặt tour
          </div>
          <div className="w-[60%] mx-auto bg-gray-100 px-2 py-3 rounded-md mb-4">
            {userData && userData.id ? (
              <div className="mt-5 pl-3">
                <div className="text-left text-lg font-medium mb-5">
                  Thông tin người dùng
                </div>
                <div className="flex gap-x-3">
                  <div className="text-left mb-2 w-1/2">
                    <div>Tên tài khoản</div>
                    <div>
                      <input
                        type="text"
                        value={userData.nametk}
                        name="name_tk"
                        className="w-[300px] bg-white outline-none px-2 py-1 rounded-md"
                        disabled
                      ></input>
                    </div>
                  </div>
                  <div className="text-left mb-2 w-1/2">
                    <div>Email</div>
                    <div>
                      <input
                        type="text"
                        name="email"
                        value={userData.email}
                        className="w-[300px] bg-white outline-none px-2 py-1 rounded-md"
                        disabled
                      ></input>
                    </div>
                  </div>
                </div>
                <div className="flex gap-x-3 mb-2">
                  <div className="text-left mb-2 w-1/2">
                    <div>Ngày sinh</div>
                    <div>
                      <input
                        type="text"
                        name="dob"
                        value={userData.dob}
                        className="w-[300px] bg-white outline-none px-2 py-1 rounded-md"
                        disabled
                      ></input>
                    </div>
                  </div>
                  <div className="text-left w-1/2">
                    <div>Số điện thoại</div>
                    <div>
                      <input
                        type="text"
                        name="phonenum"
                        value={userData.phone}
                        className="w-[300px] bg-white outline-none px-2 py-1 rounded-md"
                        disabled
                      ></input>
                    </div>
                  </div>
                </div>
                <div className="text-left mb-2">
                  <div>Địa chỉ</div>
                  <div>
                    <input
                      type="text"
                      name="address"
                      value={userData.address}
                      className="w-[97%] bg-white outline-none px-2 py-1 rounded-md"
                      disabled
                    ></input>
                  </div>
                </div>
                <div className="flex gap-x-3 mb-2">
                  <div className="text-left mb-2 w-1/2">
                    <div>Họ tên</div>
                    <div>
                      <input
                        type="text"
                        name="name"
                        className="w-[300px] outline-none px-2 py-1 rounded-md"
                        required
                      ></input>
                    </div>
                  </div>
                  <div className="text-left mb-2 w-1/2">
                    <div>CCCD/CMND</div>
                    <div>
                      <input
                        type="text"
                        name="cccd"
                        className="w-[300px] outline-none px-2 py-1 rounded-md"
                        required
                      ></input>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p>Đang tải...</p>
            )}
            {tourData && tourData.id ? (
              <div className="mt-5 pl-3">
                <div className="text-left text-lg font-medium mb-5">
                  Thông tin tour
                </div>
                <div className="flex gap-x-3">
                  <div className="text-left mb-2 w-1/2">
                    <div>Mã tour</div>
                    <div>
                      <input
                        type="text"
                        name="id_tour"
                        value={tourData.id}
                        onChange={handleInputChange}
                        className="w-[300px] bg-white outline-none px-2 py-1 rounded-md"
                        disabled
                      ></input>
                    </div>
                  </div>
                  <div className="text-left mb-2 w-1/2">
                    <div>Kiểu tour</div>
                    <div>
                      <input
                        type="text"
                        name="type"
                        value={tourData.type}
                        onChange={handleInputChange}
                        className="w-[300px] bg-white outline-none px-2 py-1 rounded-md"
                        disabled
                      ></input>
                    </div>
                  </div>
                </div>
                <div className="text-left mb-2">
                  <div>Tên tour</div>
                  <div>
                    <input
                      type="text"
                      name="nametour"
                      value={tourData.name}
                      onChange={handleInputChange}
                      className="w-[97%] bg-white outline-none px-2 py-1 rounded-md"
                      disabled
                    ></input>
                  </div>
                </div>
                <div className="text-left mb-2">
                  <div>
                    <input
                      type="number"
                      name="nametour"
                      value={tourData.price}
                      onChange={(e) =>
                        setOriginalPrice(parseFloat(e.target.value))
                      }
                      className="w-[97%] bg-white outline-none px-2 py-1 rounded-md"
                      hidden
                    ></input>
                  </div>
                </div>
                <div className="text-left mb-2">
                  <div>
                    <input
                      type="number"
                      name="nametour"
                      value={tourData.discount}
                      onChange={(e) =>
                        setDiscountPercent(parseFloat(e.target.value))
                      }
                      className="w-[97%] bg-white outline-none px-2 py-1 rounded-md"
                      hidden
                    ></input>
                  </div>
                </div>
                <div className="flex gap-x-3">
                  <div className="text-left mb-2 w-1/2">
                    <div>Số người tham gia</div>
                    <div>
                      <input
                        type="number"
                        name="participant"
                        value={tourData.participant || ""}
                        onChange={handleInputChange}
                        className="w-[300px] outline-none px-2 py-1 rounded-md"
                        required
                      ></input>
                    </div>
                  </div>
                  {departData && departData.id ? (
                    <div className="text-left mb-2 w-1/2">
                      <div>Thời gian khởi hành</div>
                      <div>
                        <input
                          type="date"
                          name="day_tour"
                          value={departData.day_depart}
                          onChange={handleInputChange}
                          className="w-[300px] bg-white outline-none px-2 py-1 rounded-md"
                          disabled
                        ></input>
                      </div>
                    </div>
                  ) : (
                    <p>Đang tải...</p>
                  )}
                </div>
                <div className="text-left mb-2 w-1/2">
                  <div>Thời gian diễn ra tour &#40;ngày&#41;</div>
                  <div>
                    <input
                      type="number"
                      name="timeTour"
                      value={tourData.timeTour}
                      onChange={handleInputChange}
                      className="w-[300px] bg-white outline-none px-2 py-1 rounded-md"
                      disabled
                    ></input>
                  </div>
                </div>
              </div>
            ) : (
              <p>Đang tải...</p>
            )}
            {tourData && tourData.id ? (
              <div className="mt-5">
                <div className="w-[35%] ml-auto text-left">
                  <div className="text-lg font-semibold">Tổng tiền</div>
                  <div>
                    <TotalDisplay
                      originalPrice={tourData.price}
                      discountPercent={tourData.discount}
                      numberOfPeople={inputValue}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <p>Đang tải...</p>
            )}
          </div>
          <div className="w-[60%] mx-auto mb-6">
            <div className="flex justify-center">
              <div>
                <button
                  type="button"
                  onClick={handlePayment}
                  className="bg-black mx-2 inline-block align-middle text-center select-none border font-normal whitespace-no-wrap rounded py-1 px-3 leading-normal no-underline custom-bg text-white shadow-none"
                >
                  Thanh toán online
                </button>
              </div>
              <div>
                <button
                  type="submit"
                  onClick={(event) => hendleDepartSubmit(event)}
                  className="bg-black mx-2 inline-block align-middle text-center select-none border font-normal whitespace-no-wrap rounded py-1 px-3 leading-normal no-underline custom-bg text-white shadow-none"
                >
                  Đặt giữ chỗ
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default BookingTour2;
