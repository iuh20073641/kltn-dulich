import React, { useEffect, useState } from "react";
import HeaderAdmin from "../header-admin/header-admin";
import { toast } from "react-toastify";

function QuanLyNV() {
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [noResults, setNoResults] = useState(false);

  useEffect(() => {
    // Hàm để gọi API và cập nhật state
    const fetchData = async () => {
      try {
        // Gọi API để lấy danh sách nhân viên
        const response = await fetch(
          "http://localhost:88/api_travel/api/admin/get_dsnv.php"
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
        "http://localhost:88/api_travel/api/admin/get_dsnv.php"
      );
      const data = await response.json();
      setEmployees(Array.isArray(data) ? data : []);
      setNoResults(false); // Reset noResults khi có dữ liệu
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:88/api_travel/api/admin/search_employee.php?query=${query}`
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
        "http://localhost:88/api_travel/api/admin/delete_employee.php",
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
                    placeholder="Type to search...."
                    value={searchQuery}
                    onChange={handleSearch}
                  />
                </div>
                <div className="block w-full overflow-auto scrolling-touch">
                  <table className="w-full max-w-full mb-4 bg-transparent table-hover border text-center text-sm">
                    <thead>
                      <tr className="bg-gray-900 text-gray-100 h-9">
                        <th scope="col">ID</th>
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
                            <td>{employee.id}</td>
                            <td>{employee.username}</td>
                            <td>{employee.email}</td>
                            <td>{employee.phoneNumber}</td>
                            <td>{employee.address}</td>
                            <td>{employee.role}</td>
                            <td>
                              <div className="bg-[#dc3545] w-[30px] rounded-md mx-auto">
                                <button
                                  onClick={() => deleteEmployee(employee.id)}
                                  className="py-1 font-semibold text-sm"
                                >
                                  <i className="fa-solid fa-trash text-white"></i>
                                </button>
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
    </div>
  );
}

export default QuanLyNV;
