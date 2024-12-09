import React, { useEffect, useState } from "react";
import HeaderAdmin from "../header-admin/header-admin";
import { toast } from "react-toastify";
import config from "../../../component/config.json";

const { SERVER_API } = config;

function QuanLyNV() {
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [noResults, setNoResults] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null); // Thêm trạng thái để lưu trữ nhân viên được chọn
  const [showModal, setShowModal] = useState(false); // Thêm trạng thái để hiển thị modal

  useEffect(() => {
    // Hàm để gọi API và cập nhật state
    const fetchData = async () => {
      try {
        // Gọi API để lấy danh sách nhân viên
        const response = await fetch(
          `${SERVER_API}/admin/get_dsnv.php`
        );
        const data = await response.json();
        setEmployees(Array.isArray(data) ? data : []);
        setNoResults(false); // Reset noResults khi có dữ liệu
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err);
      }
    };

    fetchData();
  }, []); // Chạy một lần khi component được mount

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === "") {
      // Nếu từ khóa tìm kiếm trống, lấy lại danh sách nhân viên ban đầu
      const response = await fetch(
        `${SERVER_API}/admin/get_dsnv.php`
      );
      const data = await response.json();
      setEmployees(Array.isArray(data) ? data : []);
      setNoResults(false); // Reset noResults khi có dữ liệu
      return;
    }

    try {
      const response = await fetch(
        `${SERVER_API}/admin/search_employee.php?query=${query}`
      );
      if (response.status === 404) {
        setEmployees([]);
        setNoResults(true);
      } else {
        const data = await response.json();
        setEmployees(Array.isArray(data) ? data : []);
        setNoResults(data.length === 0); // Cập nhật noResults nếu không có kết quả
      }
    } catch (err) {
      console.error("Error searching data:", err);
      setError(err);
    }
  };

  const deleteEmployee = (employeeId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa nhân viên này?")) {
      fetch(
        `${SERVER_API}/admin/delete_employee.php`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ employee_id: employeeId }),
        }
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          if (data.status === "success") {
setEmployees(
              employees.filter((employee) => employee.id !== employeeId)
            );
            toast.success("Nhân viên đã được xóa thành công");
          } else if (data.status === "error") {
            toast.error(data.message);
          } else {
            toast.error("Xóa nhân viên thất bại. Vui lòng thử lại.");
          }
        })
        .catch((error) => {
          toast.error("Lỗi API.");
          console.error("Có lỗi xảy ra:", error);
        });
    }
  };

  const openUpdateModal = (employee) => {
    setSelectedEmployee({ ...employee, originalPassword: employee.password });
    setShowModal(true);
  };

  const closeUpdateModal = () => {
    setSelectedEmployee(null);
    setShowModal(false);
  };

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setSelectedEmployee((prevEmployee) => ({
      ...prevEmployee,
      [name]: value,
    }));
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const updatedEmployee = {
      ...selectedEmployee,
      password: selectedEmployee.password || selectedEmployee.originalPassword, // Giữ nguyên mật khẩu cũ nếu không thay đổi
    };

    // Thêm console.log để kiểm tra dữ liệu trước khi gửi đi
    console.log("Updated employee data:", updatedEmployee);

    try {
      const response = await fetch(
        `${SERVER_API}/admin/update_employeead.php`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedEmployee),
        }
      );
      const data = await response.json();
      if (data.status === "success") {
        toast.success("Thông tin nhân viên đã được cập nhật thành công");
        setEmployees((prevEmployees) =>
          prevEmployees.map((employee) =>
            employee.id === selectedEmployee.id ? selectedEmployee : employee
          )
        );
        closeUpdateModal();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error("Error updating data:", err);
      toast.error("Cập nhật thông tin nhân viên thất bại. Vui lòng thử lại.");
    }
  };

  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="bg-gray-100 w-full">
      <HeaderAdmin />

      <div
        className="container mx-auto sm:px-4 max-w-full -mt-[650px]"
        id="main-content"
      >
        <div className="flex flex-wrap ">
          <div className="lg:w-4/5 pr-4 pl-4 ms-auto p-6 overflow-hidden">
            <h3 className="mb-4 text-left font-semibold text-2xl ">
              QUẢN LÝ NHÂN VIÊN
            </h3>
            <div className="relative flex flex-col h-[500px] min-w-0 rounded break-words bg-white border-1 border-gray-300 shadowc mb-12 overflow-y-auto">
              <div className="flex-auto p-4">
                <div className="text-end mb-4">
<input
                    type="text"
                    className="block w-[20%] appearance-none  py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded shadow-none ms-auto"
                    placeholder="Tìm kiếm"
                    value={searchQuery}
                    onChange={handleSearch}
                  />
                </div>
                <div className="block w-full overflow-auto scrolling-touch">
                  <table className="w-full max-w-full mb-4 bg-transparent table-hover border text-center text-sm">
                    <thead>
                      <tr className="bg-gray-900 text-gray-100 h-9">
                        <th scope="col">MANV</th>
                        <th scope="col">Name</th>
                        <th scope="col">Email</th>
                        <th scope="col">Phone no</th>
                        <th scope="col">Address</th>
                        <th scope="col">Role</th>
                        <th scope="col">Action</th>
                      </tr>
                    </thead>
                    <tbody id="employees-data">
                      {noResults ? (
                        <tr>
                          <td colSpan="7">Không tìm thấy nhân viên nào.</td>
                        </tr>
                      ) : (
                        employees.map((employee) => (
                          <tr className="h-16 border-b-2" key={employee.id}>
                            <td>{employee.username}</td>
                            <td>{employee.tennhanvien}</td>
                            <td>{employee.email}</td>
                            <td>{employee.phoneNumber}</td>
                            <td>{employee.address}</td>
                            <td>{employee.role}</td>
                            <td>
                              <div className="flex justify-center space-x-2">
                                <div className="bg-[#dc3545] w-[30px] rounded-md">
                                  <button
                                    onClick={() => deleteEmployee(employee.id)}
                                    className="py-1 font-semibold text-sm"
                                  >
                                    <i className="fa-solid fa-trash text-white"></i>
                                  </button>
                                </div>
                                <div className="bg-[#007bff] w-[30px] rounded-md">
                                  <button
                                    onClick={() => openUpdateModal(employee)}
                                    className="py-1 font-semibold text-sm"
                                  >
                                    <i className="fa-solid fa-pen text-white"></i>
                                  </button>
                                </div>
                              </div>
</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-1/2">
            <h2 className="text-2xl mb-4">Cập nhật thông tin nhân viên</h2>
            <form onSubmit={handleUpdateSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Họ và Tên
                </label>
                <input
                  type="text"
                  name="tennhanvien"
                  value={selectedEmployee?.tennhanvien || ""}
                  onChange={handleUpdateChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Mật khẩu
                </label>
                <input
                  type="password"
                  name="password"
                  value={
                    selectedEmployee?.password ||
                    selectedEmployee.originalPassword ||
                    ""
                  }
                  onChange={handleUpdateChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Nhập mật khẩu mới nếu muốn thay đổi"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={selectedEmployee?.email || ""}
                  onChange={handleUpdateChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Số điện thoại
                </label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={selectedEmployee?.phoneNumber || ""}
                  onChange={handleUpdateChange}
className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Địa chỉ
                </label>
                <input
                  type="text"
                  name="address"
                  value={selectedEmployee?.address || ""}
                  onChange={handleUpdateChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Chức vụ
                </label>
                <select
                  name="role"
                  value={selectedEmployee?.role || ""}
                  onChange={handleUpdateChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                >
                  <option value="" disabled>
                    Chọn chức vụ
                  </option>
                  <option value="hướng dẫn viên">Hướng dẫn viên</option>
                  <option value="kiểm duyệt viên">Kiểm duyệt viên</option>
                  <option value="nhân viên quản lý dịch vụ">
                    Nhân viên quản lý dịch vụ
                  </option>
                </select>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={closeUpdateModal}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Cập nhật
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuanLyNV;