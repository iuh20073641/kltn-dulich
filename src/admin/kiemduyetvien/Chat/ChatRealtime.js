import React, { useEffect, useState } from "react";
import HeaderAdmin from "../header-admin/header-admin";
import Chat from "../../../chat/Chat";

function ChatRT() {
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserID] = useState(null);
  const [userName, setUserName] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const moderatorUser = JSON.parse(localStorage.getItem("moderatorUser"));
    const storedUser = moderatorUser;
    if (storedUser) {
      const role = storedUser.role;
      const id = storedUser.id;
      const name = storedUser.name;
      setUserRole(role);
      setUserID(id);
      setUserName(name);

      // Kiểm tra và ghi log thông tin nhân viên kiểm duyệt
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
      <HeaderAdmin />
      <div
        className="container mx-auto sm:px-4 max-w-full -mt-[650px]"
        id="main-content"
      >
        <div className="flex flex-wrap">
          <div className="lg:w-4/5 pr-4 pl-4 ms-auto p-6 overflow-hidden">
            <h3 className="mb-4 text-left font-semibold text-2xl">
              Chat Realtime
            </h3>
            <div className="relative flex flex-col h-auto min-w-0 rounded break-words bg-white border-1 border-gray-300 shadowc mb-12 overflow-y-auto">
              <div className="flex-auto p-4">
                {error && <div className="error">{error}</div>}
                {userRole ? (
                  <div>
                    <p>Current Role: {userRole}</p>
                    <p>Current ID: {userId}</p>
                    <p>Current Name: {userName}</p>
                    <Chat
                      userRole={userRole}
                      userId={userId}
                      userName={userName}
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

export default ChatRT;
