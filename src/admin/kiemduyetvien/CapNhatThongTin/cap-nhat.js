import React, { useState, useEffect } from "react";
import HeaderAdmin from "../header-admin/header-admin";
//import Chat from "../../../chat/Chat"; // Đường dẫn tới file Chat.js
import { toast } from "react-toastify";

function CapNhatNVKD() {
  const [employee, setEmployee] = useState({
    id: "",
    username: "",
    password: "",
    email: "",
    phoneNumber: "",
    address: "",
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const id = localStorage.getItem("userId") || "";
    const fetchEmployee = async () => {
      try {
        const response = await fetch(
          `http://localhost:88/api_travel/api/admin/get_dsnv.php?id=${id}`
        );
        const data = await response.json();
        //console.log("Fetched employee data:", data); // In ra dữ liệu nhân viên được lấy về

        // Lọc ra nhân viên có ID khớp với ID trong localStorage
        const employeeData = data.find((emp) => emp.id === id);
        if (employeeData) {
          setEmployee({
            id: employeeData.id,
            username: employeeData.username || "",
            password: employeeData.password || "", // Đảm bảo trường password được lấy đúng cách
            email: employeeData.email || "",
            phoneNumber: employeeData.phoneNumber || "",
            address: employeeData.address || "",
          });
        }
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching employee data:", err);
        setError(err);
        setIsLoading(false);
      }
    };

    fetchEmployee();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee((prevEmployee) => ({
      ...prevEmployee,
      [name]: value,
    }));
    //console.log("Updated employee data:", { ...employee, [name]: value }); // In ra dữ liệu nhân viên sau khi thay đổi
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //console.log("Sending data:", employee); // Thêm dòng này để kiểm tra dữ liệu trước khi gửi
    try {
      const response = await fetch(
        "http://localhost:88/api_travel/api/admin/update_employee.php",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(employee),
        }
      );
      const data = await response.json();
      if (data.status === "success") {
        toast.success("Thông tin nhân viên đã được cập nhật thành công");
        setEmployee(data.updatedEmployee); // Cập nhật lại thông tin nhân viên
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      setError(err);
      toast.error("Cập nhật thông tin nhân viên thất bại. Vui lòng thử lại.");
    }
  };

  if (isLoading) return <div>Đang tải dữ liệu...</div>;

  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="bg-gray-100 w-full">
      <HeaderAdmin />
      <div
        className="container mx-auto sm:px-4 max-w-full -mt-[650px]"
        id="main-content"
      >
        <div className="flex flex-wrap">
          <div className="lg:w-4/5 pr-4 pl-4 ms-auto p-6 overflow-hidden">
            <h3 className="mb-4 text-left font-semibold text-2xl">
              CẬP NHẬT THÔNG TIN NHÂN VIÊN
            </h3>
            <div className="relative flex flex-col h-auto min-w-0 rounded break-words bg-white border-1 border-gray-300 shadowc mb-12 overflow-y-auto">
              <div className="flex-auto p-4">
                <form onSubmit={handleSubmit}>
                  <div className="flex flex-wrap -mx-2">
                    <div className="w-1/2 px-2 mb-4">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="username"
                      >
                        Tên đăng nhập
                      </label>
                      <input
                        type="text"
                        name="username"
                        id="username"
                        value={employee.username || ""} // Xử lý khi giá trị chưa load
                        onChange={handleChange}
                        required
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>
                    <div className="w-1/2 px-2 mb-4">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="password"
                      >
                        Mật khẩu
                      </label>
                      <input
                        type="password"
                        name="password"
                        id="password"
                        value={employee.password || ""} // Xử lý khi giá trị chưa load
                        onChange={handleChange}
                        required
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>
                    <div className="w-1/2 px-2 mb-4">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="email"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={employee.email || ""}
                        onChange={handleChange}
                        required
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>
                    <div className="w-1/2 px-2 mb-4">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="phoneNumber"
                      >
                        Số điện thoại
                      </label>
                      <input
                        type="text"
                        name="phoneNumber"
                        id="phoneNumber"
                        value={employee.phoneNumber || ""}
                        onChange={handleChange}
                        required
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>
                    <div className="w-1/2 px-2 mb-4">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="address"
                      >
                        Địa chỉ
                      </label>
                      <input
                        type="text"
                        name="address"
                        id="address"
                        value={employee.address || ""}
                        onChange={handleChange}
                        required
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <button
                      type="submit"
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                      Cập Nhật
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CapNhatNVKD;
