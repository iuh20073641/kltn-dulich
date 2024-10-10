import React, { useEffect, useState } from "react";
import Chat from "../../chat/Chat"; // Đường dẫn tới file Chat.js

function CustomerChat() {
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserID] = useState(null);
  const [userName, setUserName] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      const role = user?.role || "customer"; // Gán giá trị mặc định nếu role không tồn tại
      const id = user?.id;
      const name = user?.name;
      setUserRole(role);
      setUserID(id);
      setUserName(name);

      // Kiểm tra và ghi log thông tin người dùng
      console.log("User information from localStorage:", { role, id, name });
      if (!role || !id || !name) {
        console.error("User role, ID, or name is missing");
        setError(
          "User role, ID, or name is missing. Please check your login process."
        );
      } else {
        console.log("User information:", { role, id, name });
      }
    } else {
      setError("No user information found in localStorage.");
    }
  }, []); // Chạy một lần khi component được mount

  return (
    <div className="bg-gray-100 w-full">
      <div className="container mx-auto sm:px-4 max-w-full">
        <div className="flex flex-wrap">
          <div className="lg:w-4/5 pr-4 pl-4 ms-auto p-6 overflow-hidden">
            <h3 className="mb-4 text-left font-semibold text-2xl">
              Customer Chat
            </h3>
            <div className="relative flex flex-col h-auto min-w-0 rounded break-words bg-white border-1 border-gray-300 shadowc mb-12 overflow-y-auto">
              <div className="flex-auto p-4">
                {error && <div className="error">{error}</div>}
                {userRole ? (
                  <div>
                    <p>Current Role: {userRole}</p>
                    <p>Current ID: {userId}</p>
                    <p>Current Name: {userName}</p>
                    {/* Truyền props vào component Chat */}
                    <Chat
                      userId={userId}
                      userName={userName}
                      userRole={userRole}
                    />
                  </div>
                ) : (
                  <p>Loading...</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerChat;
