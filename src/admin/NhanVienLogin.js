import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import config from "../component/config.json";

const { SERVER_API } = config;

const LoginNV = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${SERVER_API}/admin/loginnv.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        }
      );

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      if (data.status === "success") {
        const userRole = data.data.role;
        const token = data.data.token;
        const userId = data.data.id;
        const userName = data.data.username;
        const userPass = data.data.password;
        const userEmail = data.data.email;
        const userNumber = data.data.phoneNumber;
        const userAddress = data.data.address;
        // Lưu thông tin vào localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("userId", userId);
        localStorage.setItem("userName", userName);
        localStorage.setItem("userPass", userPass);
        localStorage.setItem("userEmail", userEmail);
        localStorage.setItem("userNumber", userNumber);
        localStorage.setItem("userAddress", userAddress);
        localStorage.setItem("userRole", userRole);
        // Truy xuất thông tin người dùng từ localStorage để kiểm tra
        const storedUserId = localStorage.getItem("userId");
        const storedUserRole = localStorage.getItem("userRole");

        // Kiểm tra ID và vai trò của nhân viên
        console.log("User ID:", storedUserId);
        console.log("User Role:", storedUserRole);
        // Điều hướng dựa trên vai trò của người dùng
        switch (userRole) {
          case "quản trị viên":
            navigate("/dashboard-admin-hotel");
            break;
          case "hướng dẫn viên":
            navigate("/dashboard-huong-dan-vien");
            break;
          case "kiểm duyệt viên": // nhân viên chăm soc khach hàng
            navigate("/customer-care/user");
            break;
          case "nhân viên quản lý dịch vụ":
            navigate("/user");
            break;
          default:
            navigate("/dashboard-default");
            break;
        }
      } else {
        setErrorMessage(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("Đăng nhập thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <div>
      <style>
        {`
          .login-form {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 400px;
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            padding: 20px;
          }
          .bg-dark {
            background-color: #343a40;
            color: white;
            padding: 10px 0;
          }
          .custom-bg {
            background-color: #007bff;
            border: none;
            border-radius: 5px;
            padding: 10px 15px;
            cursor: pointer;
          }
          .custom-bg:hover {
            background-color: #0056b3;
          }
          .form-control {
            border: 1px solid #ced4da;
            border-radius: 5px;
            padding: 10px;
            width: 100%;
          }
          .form-control:focus {
            border-color: #007bff;
            box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
          }
        `}
      </style>
      <div className="login-form text-center rounded overflow-hidden">
        <form method="POST" onSubmit={handleLogin}>
          <h4 className="bg-dark">HỆ THỐNG QUẢN LÝ</h4>
          <div className="p-4">
            <div className="mb-3">
              <input
                name="username"
                required
                type="text"
                className="form-control shadow-none text-center"
                placeholder="Tên đăng nhập"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <input
                name="password"
                required
                type="password"
                className="form-control shadow-none text-center"
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            <button
              name="login"
              type="submit"
              className="btn custom-bg shadow-none"
            >
              ĐĂNG NHẬP
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginNV;
