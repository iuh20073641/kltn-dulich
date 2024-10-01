import HeaderManager from "../header-manager/header-manager";
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { selectAllUsers } from "../../../component/api/user";
// import "./user.css";

function User(){

    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Hàm để gọi API và cập nhật state
        const fetchData = async () => {
            try {
                // Gọi API để lấy danh sách phòng
                const usersResponse = await selectAllUsers();
                const usersData = usersResponse.data; // Giả sử API trả về mảng các phòng
                setUsers(usersData);

            } catch (err) {
                console.error('Error fetching data:', err);
                setError(err);
            }
        };

        fetchData();
    }, []); // Chạy một lần khi component được mount

    const deleteUser = (userId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
          fetch('http://localhost:88/api_travel/api/admin/delete_usernd.php', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_id: userId }),
          })
          .then(response => response.json())
          .then(data => {
            if (data.status === 'success') {
                setUsers(users.filter(user => user.id !== userId));
                toast.success('Tài khoản người dùng này đã được xóa thành công');
            } else if (data.status === 'error1'){
                toast.error('Dữ liệu JSON không hợp lệ.');
            } else if (data.status === 'error2'){
                toast.error('Thiếu hoặc không hợp lệ tham số user ID.');
            } else if (data.status === 'error3'){
                toast.error('Người dùng không tồn tại.');
            } else {
                toast.error('Xóa tài khoản thất bại. Vui lòng thử lại.');
            }
          })
          .catch(error => {
            // console.error('Có lỗi xảy ra:', error);
            toast.error('lỗi api.');
            console.log('Có lỗi xảy ra:');
            console.error('Chi tiết lỗi:', error);
          });
        }
    };

    if (error) return <div>Error: {error.message}</div>;

    return(
        <div className="bg-gray-100 w-full">
            <HeaderManager />

            <div className="container mx-auto sm:px-4 max-w-full -mt-[650px]" id="main-content">
                <div className="flex flex-wrap ">
                    <div className="lg:w-4/5 pr-4 pl-4 ms-auto p-6 overflow-hidden">
                        <h3 className="mb-4 text-left font-semibold text-2xl ">USERS</h3>
                        <div className="relative flex flex-col h-[500px] min-w-0 rounded break-words bg-white border-1 border-gray-300 shadowc mb-12 overflow-y-auto">
                            <div className="flex-auto p-4">
                                <div className="text-end mb-4">
                                    <input type="text" 
                                        className="block w-[20%] appearance-none  py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded shadow-none ms-auto" 
                                        placeholder="Type to search...."
                                    />
                                </div>
                                <div className="block w-full overflow-auto scrolling-touch">
                                    <table className="w-full max-w-full mb-4 bg-transparent table-hover border text-center text-sm">
                                        <thead>
                                            <tr className="bg-gray-900 text-gray-100 h-9">
                                                <th scope="col">#</th>
                                                <th scope="col">Name</th>
                                                <th scope="col">Email</th>
                                                <th scope="col">Phone no</th>
                                                <th scope="col">Adress</th>
                                                <th scope="col">Dob</th>
                                                <th scope="col">Date</th>
                                                <th scope="col">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody id="users-data">
                                        {users.map((user) => (
                                            <tr className="h-16 border-b-2" key={user.id}>
                                                <td>{user.id}</td>
                                                <td>{user.name}</td>
                                                <td>{user.email}</td>
                                                <td>{user.phonenum}</td>
                                                <td>{user.address}</td>
                                                <td>{user.dob}</td>
                                                <td>{user.datetime}</td>
                                                <td>
                                                    <div className="bg-[#dc3545] w-[30px] rounded-md mx-auto">
                                                        <button onClick={() => deleteUser(user.id)} className='py-1 font-semibold text-sm'><i className="fa-solid fa-trash text-white"></i></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
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
export default User;