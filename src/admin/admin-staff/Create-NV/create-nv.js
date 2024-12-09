import React, { useState } from "react";
import HeaderAdmin from "../header-admin/header-admin";
import { toast } from "react-toastify";
import config from "../../../component/config.json";

const { SERVER_API } = config;

const CreateNV = () => {
  const [username, setUsername] = useState("");
  const [tennhanvien, setTenNhanVien] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState(""); // Thêm email
  const [phoneNumber, setPhoneNumber] = useState(""); // Thêm số điện thoại
  const [address, setAddress] = useState(""); // Thêm địa chỉ
  const [role, setRole] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate user information
    if (
      !username ||
      !tennhanvien ||
      !password ||
      !role ||
      !email ||
      !phoneNumber ||
      !address
    ) {
      alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    // Assign permissions to the new user
    const roles = {
      "quản trị viên": "manage-employees, search-employees",
      "hướng dẫn viên": "create-tour, view-tour",
      "kiểm duyệt viên": "view-tour, approve-tour",
      "nhân viên quản lý dịch vụ": "create-service, view-service",
    };

    // Create a new user account
    const newUser = {
      username,
      tennhanvien,
      password,
      email,
      phoneNumber,
      address,
      role,
      permissions: roles[role],
    };

    try {
      const response = await fetch(
        `${SERVER_API}/admin/create_nhanvien.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newUser),
        }
      );

      const data = await response.json();

      if (response.ok && data.status !== "error") {
        console.log("Tạo tài khoản thành công", data);
        toast.success("Tạo nhân viên thành công");

        // Reset form fields
        setUsername("");
        setTenNhanVien("");
        setPassword("");
        setEmail("");
        setPhoneNumber("");
        setAddress("");
        setRole("");
      } else {
        console.error("Lỗi khi tạo tài khoản", data);
        toast.error("Thông tin đăng nhập bị trùng");
      }
    } catch (error) {
      console.error("Lỗi khi gọi API", error);
      alert("Lỗi khi gọi API: " + error.message);
    }
  };

  return (
    <div className="bg-gray-100 w-full min-h-screen">
      <HeaderAdmin />
      <div className="container mx-auto h-screen sm:px-4 w-[80%] -mt-[650px] float-right overflow-y-auto flex justify-center items-center">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-4 rounded shadow-md w-full max-w-2xl"
        >
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            TẠO TÀI KHOẢN NHÂN VIÊN
          </h2>
          <div className="flex flex-wrap -mx-2">
            <div className="w-1/2 px-2 mb-4">
<label className="block text-gray-700 text-sm font-bold mb-2">
                Mã Nhân Viên:
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full border border-gray-300 p-2 rounded"
              />
            </div>
            <div className="w-1/2 px-2 mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Tên Nhân Viên:
              </label>
              <input
                type="text"
                value={tennhanvien}
                onChange={(e) => setTenNhanVien(e.target.value)}
                className="block w-full border border-gray-300 p-2 rounded"
              />
            </div>
            <div className="w-1/2 px-2 mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Mật khẩu:
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full border border-gray-300 p-2 rounded"
              />
            </div>
            <div className="w-1/2 px-2 mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Email:
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full border border-gray-300 p-2 rounded"
              />
            </div>
            <div className="w-1/2 px-2 mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Số điện thoại:
              </label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="block w-full border border-gray-300 p-2 rounded"
              />
            </div>
            <div className="w-1/2 px-2 mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Địa chỉ:
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="block w-full border border-gray-300 p-2 rounded"
              />
            </div>
            <div className="w-1/2 px-2 mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Vai trò:
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="block w-full border border-gray-300 p-2 rounded"
              >
<option value="">Chọn vai trò</option>
                <option value="hướng dẫn viên">Hướng dẫn viên</option>
                <option value="kiểm duyệt viên">Kiểm duyệt viên</option>
                <option value="nhân viên quản lý dịch vụ">
                  Nhân viên chăm sóc khách hàng
                </option>
              </select>
            </div>
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded"
            >
              Tạo tài khoản
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateNV;