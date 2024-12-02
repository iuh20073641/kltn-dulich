
import HeaderCensor from "../header-admin/header-admin";
import { fetchCheckBookingOrder } from "../../../component/api/tours";
import { fetchTourDetails } from "../../../component/api/tours";
import { fetchDayDepart } from "../../../component/api/tours";
import { fetchTourDepart } from "../../../component/api/tours";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
// import { loadStripe } from "@stripe/stripe-js";
import React, { useEffect, useState } from 'react';
import PriceDisplay from "../../../component/service/money";
import { getUsersDataByKey } from "../../../component/api/user";
import config from "../../../component/config.json";

const { SERVER_API } = config;
// const { SERVER_HOST } = config;

const formTour = {
    id: "",
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
    nam_tk: "",
    namend: "",
    cccd: "",
    phone: "",
    address: "",
};

const formUser = {
    id: '',
    nametk: '',
    email: '',
    dob: '',
    phone: '',
    address: '',
    namend: '',
    cccd: ''
};

const formInput = {
    namend: '',
    cccd: '',
    participant: 0,
    toddlers: 0,
    children: 0,
    baby: 0,
};


// const dayDepart = {
//     day: ""
// };

function CreateBookingTourByNV() {


    // const { id } = useParams();  // Lấy ID từ URL
    const navigate = useNavigate();
    const [tourData, setTourData] = useState({ formTour });
    const [departData, setDepartData] = useState([]);
    const [userDatas, setUserData] = useState({ formUser });
    const [formValue, setFormValue] = useState(formInput);
    const [error, setError] = useState(null);

    // const [searchParams] = useSearchParams();
    // Lấy giá trị của selectedTour từ URL
    const [order, setOrder] = useState([]);
    const [order2, setOrder2] = useState([]);
    const [selectKey, setSelectKey] = useState({ key: "", tour_id: "" });
    const [customers, setCustomers] = useState([]);
    const [toddlers, setToddlers] = useState([]);
    const [children, setChildren] = useState([]);
    const [baby, setBaby] = useState([]);
    const [priceAdult, setPriceAdult] = useState(0);
    const [priceToddlers, setPriceToddlers] = useState(0);
    const [priceChildren, setPriceChildren] = useState(0);
    const [participant, setParticipant] = useState(0);
    const [errorsUser, setErrorsUser] = useState({
        user: "",
        cccd: "",
    });
    const [errors, setErrors] = useState({
        customers: [],
        toddlersData: [],
        childrenData: [],
        babyData: [],
    });
    const today = new Date().toISOString().split("T")[0]; // Lấy ngày hiện tại dưới định dạng YYYY-MM-DD

    // Hàm để xử lý thay đổi thông tin của từng khách hàng
    const handleCustomerChange = (index, event) => {
        const { name, value } = event.target;
        const updatedCustomers = [...customers];
        updatedCustomers[index][name] = value;
        setCustomers(updatedCustomers);
    };

    // Hàm để xử lý thay đổi thông tin của từng trẻ nhỏ
    const handletoddlersChange = (index, event) => {
        const { name, value } = event.target;
        const updatedToddlers = [...toddlers];
        updatedToddlers[index][name] = value;
        setToddlers(updatedToddlers);
    };

    // Hàm để xử lý thay đổi thông tin của từng trẻ em
    const handleChildrennChange = (index, event) => {
        const { name, value } = event.target;
        const updatedChildren = [...children];
        updatedChildren[index][name] = value;
        setChildren(updatedChildren);
    };

    // Hàm để xử lý thay đổi thông tin của từng em bé
    const handleBabyChange = (index, event) => {
        const { name, value } = event.target;
        const updatedBaby = [...baby];
        updatedBaby[index][name] = value;
        setBaby(updatedBaby);
    };


    // Hàm để gọi API và cập nhật state
    const tourDetail = async () => {
        try {
            // Gọi API để lấy thông tin chi tiết của một phòng
            const toursResponse = await fetchTourDetails(selectKey.tour_id);
            const toursData = toursResponse.data;
            setTourData(toursData);
            console.log('Dữ liệu từ API:', toursData);

            // Nếu API trả về mảng, hãy lấy phần tử đầu tiên
            if (Array.isArray(toursData) && toursData.length > 0) {
                setTourData(toursData[0]);
                const priceAdult = toursData[0].price / 100 * (100 - toursData[0].discount)
                setPriceAdult(priceAdult);

                const departResponse = await fetchTourDepart(selectKey.tour_id);
                const departData = departResponse.data;
                // setDepartData(departData);
                console.log('Dữ liệu từ API:', departData);

                // Nếu API trả về mảng, hãy lấy phần tử đầu tiên
                if (Array.isArray(departData) && departData.length > 0) {
                    setDepartData(departData);
                } else {
                    setDepartData(null); // Xử lý nếu không có dữ liệu hợp lệ
                }
            } else {
                setTourData(null); // Xử lý nếu không có dữ liệu hợp lệ
                toast.warning('Không tìm thấy tour')
            }

        } catch (err) {
            console.error('Error fetching data:', err);
            setError('Có lỗi xảy ra khi lấy dữ liệu sản phẩm.');
        }
    };

    const user = async () => {

        try {
            // Gọi API để lấy thông tin chi tiết của một phòng
            const userResponse = await getUsersDataByKey(selectKey.key);
            const userData = userResponse.data;
            // setUserData(userData);
            // console.log('Dữ liệu từ API:', tourDetails);

            // Nếu API trả về mảng, hãy lấy phần tử đầu tiên
            if (Array.isArray(userData) && userData.length > 0) {
                setUserData(userData[0]);
            } else {
                setUserData(null); // Xử lý nếu không có dữ liệu hợp lệ
                toast.warning('Không tìm thấy người dùng')
            }

        } catch (err) {
            console.error('Error fetching data:', err);
            setError('Có lỗi xảy ra khi lấy dữ liệu sản phẩm.');
        }
    };





    // Hàm xử lý khi thay đổi dữ liệu input
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTourData({ ...tourData, [name]: value });
        // setInputValue(value);
    };

    // Hàm xử lý khi thay đổi dữ liệu input
    const handleKeyChange = (event) => {
        const { value, name } = event.target;
        setSelectKey({ ...selectKey, [name]: value });
    };

    // Hàm xử lý khi thay đổi dữ liệu input
    const handleInputChangeUser = (e) => {
        const { name, value } = e.target;
        userDatas({ ...userDatas, [name]: value });
        // setInputValue(value);
    };

    const handleChangeInput = (event) => {
        const { value, name } = event.target;

        const fieldsToInclude = ['participant', 'toddlers', 'children', 'baby'];

        // Tính tổng số người hiện tại từ form
        const currentTotal =
            (isNaN(parseInt(formValue.participant, 10)) ? 0 : parseInt(formValue.participant, 10)) +
            (isNaN(parseInt(formValue.toddlers, 10)) ? 0 : parseInt(formValue.toddlers, 10)) +
            (isNaN(parseInt(formValue.children, 10)) ? 0 : parseInt(formValue.children, 10)) +
            (isNaN(parseInt(formValue.baby, 10)) ? 0 : parseInt(formValue.baby, 10));

        // Giá trị mới của trường đang chỉnh sửa
        const newValue = fieldsToInclude.includes(name)
            ? (isNaN(parseInt(value, 10)) ? 0 : parseInt(value, 10))
            : 0;

        // Tính tổng số người tham gia mới sau khi thay đổi
        const newTotal = currentTotal - (isNaN(parseInt(formValue[name], 10)) ? 0 : parseInt(formValue[name], 10)) + newValue + 1;
        setParticipant(newTotal);

        // Kiểm tra nếu tổng số người vượt quá giới hạn
        if (newTotal > tourData.max_participant) {
            toast.warning(`Tổng số người tham gia không thể vượt quá ${tourData.max_participant}!`);
            return;
        }

        setFormValue((prevState) => ({
            ...prevState,
            [name]: value,
        }));


        // Nếu field name là "participants", thì cập nhật danh sách khách hàng
        if (name === 'participant') {
            const participantCount = parseInt(value, 10);

            const totalAdult = (participantCount + 1) *
                (tourData.price - (tourData.price / 100 * tourData.discount));
            setPriceAdult(totalAdult);

            // Nếu participantCount không hợp lệ, thoát sớm
            if (isNaN(participantCount) || participantCount < 0) return;

            // Tạo bản sao của danh sách hiện tại
            const updatedCustomers = [...customers];

            // Nếu số lượng người tham gia tăng, thêm khách hàng mới
            if (participantCount > updatedCustomers.length) {
                const additionalCustomers = Array.from(
                    { length: participantCount - updatedCustomers.length },
                    () => ({
                        name: '',
                        sex: 'nam',
                        dob: ''
                    })
                );
                setCustomers([...updatedCustomers, ...additionalCustomers]);
            }
            // Nếu số lượng người tham gia giảm, cắt bớt danh sách
            else if (participantCount < updatedCustomers.length) {
                setCustomers(updatedCustomers.slice(0, participantCount));
            }
        } else if (name === 'toddlers') {
            const toddlersCount = parseInt(value, 10);

            const totalToddlers = (toddlersCount) *
                (((tourData.price / 100 * tourData.toddlers_price_percen) / 100 * (100 - tourData.discount)));
            setPriceToddlers(totalToddlers);

            // Nếu participantCount không hợp lệ, thoát sớm
            if (isNaN(toddlersCount) || toddlersCount < 0) return;

            // // Tính số lượng khách hàng cần nhập
            // const requiredCustomers = participantCount - 1;

            // Tạo bản sao của danh sách hiện tại
            const updatedToddlers = [...toddlers];

            // Nếu số lượng người tham gia tăng, thêm khách hàng mới
            if (toddlersCount > updatedToddlers.length) {
                const additionalToddlers = Array.from(
                    { length: toddlersCount - updatedToddlers.length },
                    () => ({
                        name: '',
                        sex: 'nam',
                        dob: '',
                    })
                );
                setToddlers([...updatedToddlers, ...additionalToddlers]);
            }
            // Nếu số lượng người tham gia giảm, cắt bớt danh sách
            else if (toddlersCount < updatedToddlers.length) {
                setToddlers(updatedToddlers.slice(0, toddlersCount));
            }
        } else if (name === 'children') {
            const childrenCount = parseInt(value, 10);

            const totalChildren = (childrenCount) *
                (((tourData.price / 100 * tourData.child_price_percen) / 100 * (100 - tourData.discount)));
            setPriceChildren(totalChildren);

            // Nếu participantCount không hợp lệ, thoát sớm
            if (isNaN(childrenCount) || childrenCount < 0) return;

            // // Tính số lượng khách hàng cần nhập
            // const requiredCustomers = participantCount - 1;

            // Tạo bản sao của danh sách hiện tại
            const updatedChildren = [...children];

            // Nếu số lượng người tham gia tăng, thêm khách hàng mới
            if (childrenCount > updatedChildren.length) {
                const additionalchildren = Array.from(
                    { length: childrenCount - updatedChildren.length },
                    () => ({
                        name: '',
                        sex: 'nam',
                        dob: '',
                    })
                );
                setChildren([...updatedChildren, ...additionalchildren]);
            }
            // Nếu số lượng người tham gia giảm, cắt bớt danh sách
            else if (childrenCount < updatedChildren.length) {
                setChildren(updatedChildren.slice(0, childrenCount));
            }
        } else if (name === 'baby') {
            const babyCount = parseInt(value, 10);

            // Nếu participantCount không hợp lệ, thoát sớm
            if (isNaN(babyCount) || babyCount < 0) return;

            // // Tính số lượng khách hàng cần nhập
            // const requiredCustomers = participantCount - 1;

            // Tạo bản sao của danh sách hiện tại
            const updatedBaby = [...baby];

            // Nếu số lượng người tham gia tăng, thêm khách hàng mới
            if (babyCount > updatedBaby.length) {
                const additionalBaby = Array.from(
                    { length: babyCount - updatedBaby.length },
                    () => ({
                        name: '',
                        sex: 'nam',
                        dob: '',
                    })
                );
                setBaby([...updatedBaby, ...additionalBaby]);
            }
            // Nếu số lượng người tham gia giảm, cắt bớt danh sách
            else if (babyCount < updatedBaby.length) {
                setBaby(updatedBaby.slice(0, babyCount));
            }
        }
    };

    // const stripePromise = loadStripe(
    //     "pk_test_51Q8m79Rqz8axCXq0oW0OaP1KhZHGkV5Wl1sYMRgVPYgsZwOy78KJnDCwpHh28VRJYSvVoHDP4Jr9UGbBICFD3xxm00NkH3YI5w"
    // );

    const validateForm = () => {
        let newErrors = { customers: [], toddlersData: [], childrenData: [], babyData: [] };
        let isValid = true;

        if (formValue.namend === "") {
            setErrorsUser((prevErrors) => ({
                ...prevErrors,
                user: "Họ tên không được để trống", // Cập nhật lỗi vào thuộc tính `user`
            }));
            return;
        }
        if (formValue.cccd === "") {
            setErrorsUser((prevErrors) => ({
                ...prevErrors,
                cccd: "Cccd không được để trống", // Cập nhật lỗi vào thuộc tính `user`
            }));
            return;
        }

        customers.forEach((customer, index) => {
            let customerErrors = {};
            if (!customer.name) {
                customerErrors.name = "Tên không được để trống.";
                isValid = false;
            }
            if (!customer.dob) {
                customerErrors.dob = "Ngày sinh không được để trống.";
                isValid = false;
            }
            newErrors.customers[index] = customerErrors;
        });


        toddlers.forEach((toddler, index) => {
            let toddlerErrors = {};
            if (!toddler.name) {
                toddlerErrors.name = "Tên không được để trống.";
                isValid = false;
            }
            if (!toddler.dob) {
                toddlerErrors.dob = "Ngày sinh không được để trống.";
                isValid = false;
            }
            newErrors.toddlersData[index] = toddlerErrors;
        });

        children.forEach((children, index) => {
            let childrenErrors = {};
            if (!children.name) {
                childrenErrors.name = "Tên không được để trống.";
                isValid = false;
            }
            if (!children.dob) {
                childrenErrors.dob = "Ngày sinh không được để trống.";
                isValid = false;
            }
            newErrors.childrenData[index] = childrenErrors;
        });

        baby.forEach((baby, index) => {
            let babyErrors = {};
            if (!baby.name) {
                babyErrors.name = "Tên không được để trống.";
                isValid = false;
            }
            if (!baby.dob) {
                babyErrors.dob = "Ngày sinh không được để trống.";
                isValid = false;
            }
            newErrors.babyData[index] = babyErrors;
        });

        setErrors(newErrors);
        return isValid;
    };

    const getCheckOrder = async (selectedTour) => {
        try {
            console.log(selectedTour);

            const orderResponse = await fetchCheckBookingOrder(selectedTour);
            const orderData = orderResponse.data;
            setOrder(orderData);


        } catch (err) {
            console.error('Error fetching data:', err);
        }
    };

    const getCheckOrderByDepart = async (selectedTour) => {
        try {
            console.log(selectedTour);

            const orderDepartResponse = await fetchDayDepart(selectedTour);
            const orderDepartData = orderDepartResponse.data;
            setOrder2(orderDepartData[0]);


        } catch (err) {
            console.error('Error fetching data:', err);
        }
    };

    useEffect(() => {
        getCheckOrder(tourData.depart);
        getCheckOrderByDepart(tourData.depart);

    }, [tourData.depart]);

    const hendleDepartSubmit = async (event) => {

        if (order.length >= order2.order) {
            toast.warning("Tour trong ngày này đã đủ số lượng đặt");
            return;
        }

        if (validateForm()) {
            // Xử lý logic submit nếu không có lỗi
            console.log("Form hợp lệ, gửi dữ liệu.");
        } else {
            console.log("Form không hợp lệ.");
            return;
        }

        // Kiểm tra nếu tổng số người đã đủ số lượng tối thiểu chưa
        if ((participant) < tourData.min_participant) {
            toast.warning(`Tổng số người tham gia chưa đặt giá trị tối thiểu là ${tourData.min_participant}!`);
            return;
        }
        event.preventDefault(); //để không tự động reset
        console.log(tourData.depart, userDatas.id, tourData.id);
        fetch(`${SERVER_API}/create_booking_tour_online.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: userDatas.id,
                id_tour: tourData.id,
                depar_id: tourData.depart,
                participant: participant,
                totalPrice: priceAdult + priceToddlers + priceChildren + 0,
                price_tour: tourData.price,
                name_user: formValue.namend,
                cccd: formValue.cccd,
                phone: userDatas.phone,
                address: userDatas.address,
                tour_name: tourData.name,
                customers: customers,
                toddlers: toddlers,
                children: children,
                baby: baby
            }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    toast.success(data.message);
                    navigate('/new-booking-tour');

                } else if (data.status === 'error') {
                    toast.error(data.message);

                }
            })
            .catch(error => {

                toast.error('lỗi.');
                console.log('Có lỗi xảy ra:', error);

            });
    };

    if (error) return <p>{error}</p>;

    return (
        <div>
            <HeaderCensor />

            <div className="w-full bg-gray-100 -mt-[660px] lg:w-4/5 pr-4 pl-4 ms-auto min-h-screen">
                <div className="mx-auto">
                    <div className="font-semibold uppercase text-2xl text-center mb-5 pt-5">Thông tin đặt tour</div>
                    <div className="w-[80%] mx-auto bg-white px-2 py-3 rounded-md mb-4 max-h-[500px] overflow-y-auto">
                        <div className="flex px-2 py-3 items-center">
                            <div className="mr-2 font-semibold text-base text-left">Nhập sdt/mail:</div>
                            <div className=" text-left">
                                <input type='text'
                                    name='key'
                                    value={selectKey.key}
                                    onChange={handleKeyChange}
                                    className='w-[300px] border-[1px] border-gray-200 bg-white outline-none px-2 py-1 rounded-md'>
                                </input>
                            </div>
                            <div>
                                <button type="submit" onClick={(event) => user(event)} className="bg-[#0d6efd] text-white mx-2 inline-block align-middle text-center select-none border-[1px] border-[#0d6efd] font-normal whitespace-no-wrap rounded py-1 px-3 leading-normal no-underline custom-bg shadow-none hover:bg-white hover:text-[#0d6efd]">
                                    Tìm kiếm
                                </button>
                            </div>
                        </div>
                        {userDatas && userDatas.id ? (
                            <div className="mt-5 pl-3">
                                <div className="text-left text-lg font-medium mb-5">Thông tin người dùng</div>
                                <div className="flex gap-x-3">

                                    <input type='number' value={userDatas.id} name='id' onChange={handleInputChangeUser} className='w-[300px] border-[1px] border-gray-200 bg-white outline-none px-2 py-1 rounded-md' hidden></input>

                                    <div className="text-left mb-2 w-1/2">
                                        <div>Tên tài khoản</div>
                                        <div>
                                            <input type='text' value={userDatas.nametk} name='nametk' onChange={handleInputChangeUser} className='w-[300px] border-[1px] border-gray-200 bg-white outline-none px-2 py-1 rounded-md' readOnly></input>
                                        </div>
                                    </div>
                                    <div className="text-left mb-2 w-1/2">
                                        <div>Email</div>
                                        <div>
                                            <input type='text' name='email' value={userDatas.email} className='w-[300px] border-[1px] border-gray-200 bg-white outline-none px-2 py-1 rounded-md' disabled></input>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-x-3 mb-2">
                                    <div className="text-left mb-2 w-1/2">
                                        <div>Ngày sinh</div>
                                        <div>
                                            <input type='text' name='dob' value={userDatas.dob} className='w-[300px] border-[1px] border-gray-200 bg-white outline-none px-2 py-1 rounded-md' disabled></input>
                                        </div>
                                    </div>
                                    <div className="text-left w-1/2">
                                        <div>Số điện thoại</div>
                                        <div>
                                            <input type='text' name='phonenum' value={userDatas.phone} className='w-[300px] border-[1px] border-gray-200 bg-white outline-none px-2 py-1 rounded-md' disabled></input>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-left mb-2">
                                    <div>Địa chỉ</div>
                                    <div>
                                        <input type='text' name='address' value={userDatas.address} onChange={handleInputChangeUser} className='w-[97%] border-[1px] border-gray-200 bg-white outline-none px-2 py-1 rounded-md' disabled></input>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex gap-x-3 mb-2">
                                        <div className="text-left mb-2 w-1/2">
                                            <div>Họ tên</div>
                                            <div>
                                                <input type='text' name='namend' value={formValue.namend}
                                                    onChange={handleChangeInput}
                                                    className='w-[300px] border-[1px] border-gray-200 outline-none px-2 py-1 rounded-md'
                                                    required>
                                                </input>
                                            </div>
                                        </div>
                                        <div className="text-left mb-2 w-1/2">
                                            <div>CCCD/CMND</div>
                                            <div>
                                                <input type='text' name='cccd' value={formValue.cccd} onChange={handleChangeInput} className='w-[300px] border-[1px] border-gray-200 outline-none px-2 py-1 rounded-md' required></input>
                                            </div>
                                        </div>
                                    </div>
                                    {errorsUser.user && (
                                        <p className="text-red-500 text-sm text-center">{errorsUser.user}</p>
                                    )}
                                    {errorsUser.cccd && (
                                        <p className="text-red-500 text-sm text-center">{errorsUser.cccd}</p>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div></div>
                        )}

                        <div className="flex px-2 py-3 items-center">
                            <div className="mr-2 font-semibold text-base">Nhập mã tour:</div>
                            <div>
                                <input type='number'
                                    name='tour_id'
                                    value={selectKey.tour_id}
                                    onChange={handleKeyChange}
                                    className='w-[300px] border-[1px] border-gray-200 bg-white outline-none px-2 py-1 rounded-md'>
                                </input>
                            </div>
                            <div>
                                <button type="submit" onClick={(event) => tourDetail(event)} className="bg-[#0d6efd] text-white mx-2 inline-block align-middle text-center select-none border-[1px] border-[#0d6efd] font-normal whitespace-no-wrap rounded py-1 px-3 leading-normal no-underline custom-bg shadow-none hover:bg-white hover:text-[#0d6efd]">
                                    Tìm kiếm
                                </button>
                            </div>
                        </div>

                        {tourData && tourData.id ? (
                            <div className="mt-5 pl-3">
                                <div className="text-left text-lg font-medium mb-5">Thông tin tour</div>
                                <div className="flex gap-x-3">
                                    <div className="text-left mb-2 w-1/2">
                                        <div>Mã tour</div>
                                        <div>
                                            <input type='text'
                                                name='id'
                                                value={tourData.id}
                                                onChange={handleInputChange}
                                                className='w-[300px] border-[1px] border-gray-200 bg-white outline-none px-2 py-1 rounded-md' disabled>
                                            </input>
                                        </div>
                                    </div>
                                    <div className="text-left mb-2 w-1/2">
                                        <div>Kiểu tour</div>
                                        <div>
                                            <input type='text'
                                                name='type'
                                                value={tourData.type}
                                                onChange={handleInputChange}
                                                className='w-[300px] border-[1px] border-gray-200 bg-white outline-none px-2 py-1 rounded-md' disabled>
                                            </input>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-left mb-2">
                                    <div>Tên tour</div>
                                    <div>
                                        <input type='text'
                                            name='nametour'
                                            value={tourData.name}
                                            onChange={handleInputChange}
                                            className='w-[97%] border-[1px] border-gray-200 bg-white outline-none px-2 py-1 rounded-md' disabled>
                                        </input>
                                    </div>
                                </div>
                                <div className="text-left mb-2">
                                    {/* <div>giá tour</div> */}
                                    <div>
                                        <input type='number'
                                            name='nametour'
                                            value={tourData.price}
                                            // onChange={(e) => setOriginalPrice(parseFloat(e.target.value))}
                                            onChange={handleInputChange}
                                            className='w-[97%] border-[1px] border-gray-200 bg-white outline-none px-2 py-1 rounded-md' hidden>
                                        </input>
                                    </div>
                                </div>
                                <div className="text-left mb-2">
                                    {/* <div>Tỉ lệ khuyến mãi</div> */}
                                    <div>
                                        <input type='number'
                                            name='nametour'
                                            // value={tourData.discount}
                                            // onChange={(e) => setDiscountPercent(parseFloat(e.target.value))}
                                            className='w-[97%] border-[1px] border-gray-200 bg-white outline-none px-2 py-1 rounded-md' hidden>
                                        </input>
                                    </div>
                                </div>
                                <div className="flex gap-x-3">
                                    {/* <div className="text-left mb-2 w-1/2">
                                    <div>Số người tham gia cùng</div>
                                    <div>
                                        <input type='number' 
                                            name='participant' 
                                            value={formValue.participant} 
                                            onChange={handleChangeInput}
                                            className='w-[300px] outline-none px-2 py-1 rounded-md' required>
                                        </input>
                                    </div>
                                    </div> */}

                                    {/* {departData && departData.id ? ( */}
                                    <div className="text-left mb-2 w-1/2">
                                        <div>Thời gian khởi hành</div>
                                        <div>
                                            <select className="w-[300px] rounded-md outline-none border-[1px] border-gray-200 px-2 py-1"
                                                name='depart'
                                                value={tourData.depart}
                                                onChange={handleInputChange}
                                            >
                                                <option value="">Chọn ngày</option> {/* Tùy chọn mặc định */}
                                                {departData && Array.isArray(departData) && departData.length > 0 ? (
                                                    departData
                                                        .filter((tour) => new Date(tour.day_depart) > new Date()) // Lọc chỉ ngày > ngày hiện tại
                                                        .map((tour) => (
                                                            <option key={tour.id} value={tour.id}>{new Date(tour.day_depart).toLocaleDateString('vi-VN')}</option>
                                                        ))
                                                ) : (
                                                    <option value="">Chưa được lên lịch</option> /* Tùy chọn mặc định */
                                                )}
                                            </select>
                                            {/* <input type='date'
                                                    name='day_tour'
                                                    value={departData.day_depart}
                                                    onChange={handleInputChange}
                                                    className='w-[300px] border-[1px] border-gray-200 bg-white outline-none px-2 py-1 rounded-md' disabled>
                                                </input> */}
                                        </div>
                                    </div>
                                    {/* ) : (
                                        <p>Đang tải...</p> // Hiển thị thông báo đang tải khi chưa có dữ liệu
                                    )} */}
                                    <div className="text-left mb-2 w-1/2">
                                        <div>Thời gian diễn ra tour &#40;ngày&#41;</div>
                                        <div>
                                            <input type='number'
                                                name='timeTour'
                                                value={tourData.timeTour}
                                                onChange={handleInputChange}
                                                className='w-[300px] border-[1px] border-gray-200 bg-white outline-none px-2 py-1 rounded-md' disabled>
                                            </input>
                                        </div>
                                    </div>

                                </div>
                                <div className="mt-7 mx-auto">
                                    {order && Array.isArray(order) ? (
                                        <div className="flex justify-center items-center">
                                            <div className="font-semibold text-base">Tour này đã có:</div>
                                            <div className="mx-2">{order.length}/{order2.order} lượt đặt</div>
                                        </div>
                                    ) : (
                                        <div></div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div></div>
                        )}

                        <div className="mx-3 mt-5">
                            <div className="text-left text-lg font-medium mb-5">Thông tin thành viên tham gia cùng</div>
                            <div>
                                <div className="grid grid-cols-2 items-center gap-5">
                                    <div className="flex  items-center border-[1px] border-gray-300 px-3 py-3 rounded-md">
                                        <div className="text-left w-[70%]">
                                            <p className="font-semibold text-xl">Người lớn</p>
                                            <span className="text-sm">Từ 12 trở lên</span>
                                        </div>
                                        <div className="w-[30%]">
                                            <input type='number'
                                                name='participant'
                                                value={formValue.participant}
                                                onChange={handleChangeInput}
                                                min={0} // Giá trị nhỏ nhất là 0
                                                className='w-full border-[1px] bg-gray-100 outline-none px-2 py-1 rounded-md'>
                                            </input>
                                        </div>
                                    </div>
                                    <div className="flex  items-center border-[1px] border-gray-300 px-3 py-3 rounded-md">
                                        <div className="text-left w-[70%]">
                                            <p className="font-semibold text-xl">Trẻ nhỏ</p>
                                            <span className="text-sm">Từ 2 - 4 tuổi</span>
                                        </div>
                                        <div className="w-[30%]">
                                            <input type='number'
                                                name='toddlers'
                                                value={formValue.toddlers}
                                                onChange={handleChangeInput}
                                                min={0}
                                                className='w-full border-[1px] bg-gray-100 outline-none px-2 py-1 rounded-md'>
                                            </input>
                                        </div>
                                    </div>
                                    <div className="flex  items-center border-[1px] border-gray-300 px-3 py-3 rounded-md">
                                        <div className="text-left w-[70%]">
                                            <p className="font-semibold text-xl">Trẻ em</p>
                                            <span className="text-sm">Từ 5 - 11 tuổi</span>
                                        </div>
                                        <div className="w-[30%]">
                                            <input type='number'
                                                name='children'
                                                value={formValue.children}
                                                onChange={handleChangeInput}
                                                min={0}
                                                className='w-full border-[1px] bg-gray-100 outline-none px-2 py-1 rounded-md'>
                                            </input>
                                        </div>
                                    </div>
                                    <div className="flex  items-center border-[1px] border-gray-300 px-3 py-3 rounded-md">
                                        <div className="text-left w-[70%]">
                                            <p className="font-semibold text-xl">Em bé</p>
                                            <span className="text-sm">Dưới 2 tuổi</span>
                                        </div>
                                        <div className="w-[30%]">
                                            <input type='number'
                                                name='baby'
                                                value={formValue.baby}
                                                onChange={handleChangeInput}
                                                min={0}
                                                className='w-full border-[1px] bg-gray-100 outline-none px-2 py-1 rounded-md'>
                                            </input>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {formValue.participant > 0 ? (
                                <div>
                                    <div className="mt-3 font-semibold text-xl">Người lớn</div>
                                    {customers.map((customer, index) => (
                                        <div key={index} className="customer-form text-left mt-4 bg-white rounded-md py-3">
                                            <h3 className="font-medium mb-3 mx-2">Người lớn {index + 1}</h3>
                                            <div className="flex gap-4 mx-2">
                                                <div>
                                                    <label>Tên:</label>
                                                    <input
                                                        type="text"
                                                        className="mx-2 border-[1px] border-gray-200 rounded-sm px-1 py-[2px] outline-none focus:border-gray-400 focus:border-[2px]"
                                                        name="name"
                                                        value={customer.name}
                                                        onChange={(e) => handleCustomerChange(index, e)}
                                                        required
                                                    />
                                                </div>
                                                <div className="">
                                                    <label>Giới tính:</label>
                                                    <select
                                                        className="border-[1px] border-gray-200 px-2 py-[2px] rounded-sm"
                                                        name="sex"
                                                        value={customer.sex}
                                                        onChange={(e) => handleCustomerChange(index, e)}
                                                    >
                                                        <option value={'nam'}>Nam</option>
                                                        <option value={'Nữ'}>Nữ</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label>Ngày sinh</label>
                                                    <input
                                                        type="date"
                                                        className="mx-2 border-[1px] border-gray-200 rounded-sm px-1 py-[2px] outline-none focus:border-gray-400 focus:border-[2px]"
                                                        name="dob"
                                                        value={customer.dob}
                                                        onChange={(e) => handleCustomerChange(index, e)}
                                                        max={today} // Giới hạn ngày tối đa
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            {errors.customers[index]?.name && (
                                                <p className="text-red-500 text-sm text-center">{errors.customers[index].name}</p>
                                            )}
                                            {errors.customers[index]?.dob && (
                                                <p className="text-red-500 text-sm text-center">{errors.customers[index].dob}</p>
                                            )}
                                        </div>
                                    ))}
                                    <div className="h-[1px] w-full bg-gray-300"></div>
                                </div>
                            ) : (
                                <div></div>
                            )}
                            {formValue.toddlers > 0 ? (
                                <div>
                                    <div className="mt-3 font-semibold text-xl">Trẻ nhỏ</div>
                                    {toddlers.map((toddler, index) => (
                                        <div key={index} className="customer-form text-left mt-2 bg-white rounded-md py-3">
                                            <h3 className="font-medium mb-3 mx-2">Trẻ nhỏ {index + 1}</h3>
                                            <div className="flex gap-4 mx-2">
                                                <div>
                                                    <label>Tên:</label>
                                                    <input
                                                        type="text"
                                                        className="mx-2 border-[1px] border-gray-200 rounded-sm px-1 py-[2px] outline-none focus:border-gray-400 focus:border-[2px]"
                                                        name="name"
                                                        value={toddler.name}
                                                        onChange={(e) => handletoddlersChange(index, e)}
                                                        required
                                                    />
                                                </div>
                                                <div className="">
                                                    <label>Giới tính:</label>
                                                    <select
                                                        className="border-[1px] border-gray-200 px-2 py-[2px] rounded-sm"
                                                        name="sex"
                                                        value={toddler.sex}
                                                        onChange={(e) => handletoddlersChange(index, e)}
                                                    >
                                                        <option value={'nam'}>Nam</option>
                                                        <option value={'Nữ'}>Nữ</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label>Ngày sinh</label>
                                                    <input
                                                        type="date"
                                                        className="mx-2 border-[1px] border-gray-200 rounded-sm px-1 py-[2px] outline-none focus:border-gray-400 focus:border-[2px]"
                                                        name="dob"
                                                        value={toddler.dob}
                                                        onChange={(e) => handletoddlersChange(index, e)}
                                                        max={today} // Giới hạn ngày tối đa
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            {errors.toddlersData[index]?.name && (
                                                <p className="text-red-500 text-sm text-center">{errors.toddlersData[index].name}</p>
                                            )}
                                            {errors.toddlersData[index]?.dob && (
                                                <p className="text-red-500 text-sm text-center">{errors.toddlersData[index].dob}</p>
                                            )}
                                        </div>
                                    ))}
                                    <div className="h-[1px] w-full bg-gray-300"></div>
                                </div>
                            ) : (
                                <div></div>
                            )}
                            {formValue.children > 0 ? (
                                <div>
                                    <div className="mt-3 font-semibold text-xl">Trẻ em</div>
                                    {children.map((children, index) => (
                                        <div key={index} className="customer-form text-left mt-2 bg-white rounded-md py-3">
                                            <h3 className="font-medium mb-3 mx-2">Trẻ em {index + 1}</h3>
                                            <div className="flex gap-4 mx-2">
                                                <div>
                                                    <label>Tên:</label>
                                                    <input
                                                        type="text"
                                                        className="mx-2 border-[1px] border-gray-200 rounded-sm px-1 py-[2px] outline-none focus:border-gray-400 focus:border-[2px]"
                                                        name="name"
                                                        value={children.name}
                                                        onChange={(e) => handleChildrennChange(index, e)}
                                                        required
                                                    />
                                                </div>
                                                <div className="">
                                                    <label>Giới tính:</label>
                                                    <select
                                                        className="border-[1px] border-gray-200 px-2 py-[2px] rounded-sm"
                                                        name="sex"
                                                        value={children.sex}
                                                        onChange={(e) => handleChildrennChange(index, e)}
                                                    >
                                                        <option value={'nam'}>Nam</option>
                                                        <option value={'Nữ'}>Nữ</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label>Ngày sinh</label>
                                                    <input
                                                        type="date"
                                                        className="mx-2 border-[1px] border-gray-200 rounded-sm px-1 py-[2px] outline-none focus:border-gray-400 focus:border-[2px]"
                                                        name="dob"
                                                        value={children.dob}
                                                        onChange={(e) => handleChildrennChange(index, e)}
                                                        max={today} // Giới hạn ngày tối đa
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            {errors.childrenData[index]?.name && (
                                                <p className="text-red-500 text-sm text-center">{errors.childrenData[index].name}</p>
                                            )}
                                            {errors.childrenData[index]?.dob && (
                                                <p className="text-red-500 text-sm text-center">{errors.childrenData[index].dob}</p>
                                            )}
                                        </div>
                                    ))}
                                    <div className="h-[1px] w-full bg-gray-300"></div>
                                </div>
                            ) : (
                                <div></div>
                            )}
                            {formValue.baby > 0 ? (
                                <div>
                                    <div className="mt-3 font-semibold text-xl">Em bé</div>
                                    {baby.map((baby, index) => (
                                        <div key={index} className="customer-form text-left mt-2 bg-white rounded-md py-3">
                                            <h3 className="font-medium mb-3 mx-2">Em bé {index + 1}</h3>
                                            <div className="flex gap-4 mx-2">
                                                <div>
                                                    <label>Tên:</label>
                                                    <input
                                                        type="text"
                                                        className="mx-2 border-[1px] border-gray-200 rounded-sm px-1 py-[2px] outline-none focus:border-gray-400 focus:border-[2px]"
                                                        name="name"
                                                        value={baby.name}
                                                        onChange={(e) => handleBabyChange(index, e)}
                                                        required
                                                    />
                                                </div>
                                                <div className="">
                                                    <label>Giới tính:</label>
                                                    <select
                                                        className="border-[1px] border-gray-200 px-2 py-[2px] rounded-sm"
                                                        name="sex"
                                                        value={baby.sex}
                                                        onChange={(e) => handleBabyChange(index, e)}
                                                    >
                                                        <option value={'nam'}>Nam</option>
                                                        <option value={'Nữ'}>Nữ</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label>Ngày sinh</label>
                                                    <input
                                                        type="date"
                                                        className="mx-2 border-[1px] border-gray-200 rounded-sm px-1 py-[2px] outline-none focus:border-gray-400 focus:border-[2px]"
                                                        name="dob"
                                                        value={baby.dob}
                                                        onChange={(e) => handleBabyChange(index, e)}
                                                        max={today} // Giới hạn ngày tối đa
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            {errors.babyData[index]?.name && (
                                                <p className="text-red-500 text-sm text-center">{errors.babyData[index].name}</p>
                                            )}
                                            {errors.babyData[index]?.dob && (
                                                <p className="text-red-500 text-sm text-center">{errors.babyData[index].dob}</p>
                                            )}
                                        </div>
                                    ))}
                                    <div className="h-[1px] w-full bg-gray-300"></div>
                                </div>
                            ) : (
                                <div></div>
                            )}
                        </div>
                        {tourData && tourData.id ? (
                            <div className="mt-5">
                                <div className="w-[50%] ml-auto text-left">

                                    {priceAdult > 0 ? (
                                        <div className="flex w-full justify-between">
                                            <div className="font-semibold text-left">Người lớn:</div>
                                            <div className="flex">
                                                <div className="ml-2">{parseInt(formValue.participant, 10) + 1} x</div>
                                                <div className="mx-2"><PriceDisplay price={tourData.price / 100 * (100 - tourData.discount)} /></div>
                                            </div>
                                        </div>
                                    ) : (
                                        // <div className="flex">
                                        //     <div className="font-semibold">Người lớn:</div>
                                        //     <div className="mx-2"><DiscountDisplay originalPrice={tourData.price} discountPercent={tourData.discount} /></div>
                                        // </div>
                                        <div></div>
                                    )}
                                    {priceToddlers > 0 ? (
                                        <div className="flex justify-between">
                                            <div className="font-semibold">Trẻ nhỏ:</div>
                                            <div className="flex">
                                                <div className="ml-2">{parseInt(formValue.toddlers, 10)} x</div>
                                                <div className="mx-2"><PriceDisplay price={((tourData.price / 100 * tourData.toddlers_price_percen) / 100 * (100 - tourData.discount))} /></div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div></div>
                                    )}
                                    {priceChildren > 0 ? (
                                        <div className="flex justify-between">
                                            <div className="font-semibold">Trẻ em:</div>
                                            <div className="flex">
                                                <div className="ml-2">{parseInt(formValue.children, 10)} x</div>
                                                <div className="mx-2"><PriceDisplay price={((tourData.price / 100 * tourData.child_price_percen) / 100 * (100 - tourData.discount))} /></div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div></div>
                                    )}
                                    {formValue.baby > 0 ? (
                                        <div className="flex justify-between">
                                            <div className="font-semibold">Em bé:</div>
                                            <div className="flex">
                                                <div className="ml-2">{parseInt(formValue.baby, 10)} x</div>
                                                <div className="mx-2"><PriceDisplay price={0} /></div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div></div>
                                    )}
                                    <div className="my-3 h-[2px] w-full bg-gray-300 rounded-md"></div>
                                    <div className="flex justify-between">
                                        <div className="font-semibold text-xl">Tổng tiền:</div>
                                        <div className="mx-2 text-lg font-semibold text-[#e01600]"><PriceDisplay price={priceAdult + priceToddlers + priceChildren + 0} /></div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div></div>
                        )}
                    </div>
                    <div className="w-[60%] mx-auto mb-6">
                        <div className="flex justify-center">
                            {/* <div>
                                <button type="submit" onClick={handlePayment} className="bg-black mx-2 inline-block align-middle text-center select-none border font-normal whitespace-no-wrap rounded py-1 px-3 leading-normal no-underline custom-bg text-white shadow-none">
                                    Thanh toán online
                                </button>
                            </div> */}
                            <div>
                                <button type="submit" onClick={(event) => hendleDepartSubmit(event)} className="bg-black mx-2 inline-block align-middle text-center select-none border font-normal whitespace-no-wrap rounded py-1 px-3 leading-normal no-underline custom-bg text-white shadow-none">
                                    Đặt tour
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}
export default CreateBookingTourByNV;