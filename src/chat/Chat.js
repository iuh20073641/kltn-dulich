import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import {
  collection,
  addDoc,
  query,
  orderBy,
  where,
  onSnapshot,
} from "firebase/firestore";
//import "./Chat.css";

function Chat({ userId, userName, userRole }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [error, setError] = useState(null);

  // Tải tin nhắn theo vai trò của người dùng
  useEffect(() => {
    if (!userId || !userRole) {
      console.error("User ID or role is missing");
      return; // Không thực hiện truy vấn nếu userId hoặc userRole là undefined
    }

    let q;

    if (userRole === "kiểm duyệt viên") {
      // Kiểm duyệt viên thấy tất cả tin nhắn
      q = query(collection(db, "messages"), orderBy("timestamp"));
    } else {
      // Khách hàng thấy tin nhắn của chính họ và của nhân viên kiểm duyệt
      q = query(
        collection(db, "messages"),
        where("userId", "in", [userId, "moderator"]),
        orderBy("timestamp")
      );
    }

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messages = [];
      querySnapshot.forEach((doc) => {
        messages.push({ ...doc.data(), id: doc.id });
      });
      setMessages(messages);
    });

    return () => unsubscribe();
  }, [userId, userRole]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    // Kiểm tra giá trị của userId, userName và userRole trước khi gửi tin nhắn
    if (!userId || !userName || !userRole) {
      console.error("User ID, name, or role is missing");
      setError("User ID, name, or role is missing. Cannot send message.");
      return;
    }

    try {
      await addDoc(collection(db, "messages"), {
        text: newMessage,
        timestamp: new Date(),
        userId: userId,
        userName: userName,
        userRole: userRole, // Lưu vai trò của người gửi
      });
      setNewMessage(""); // Đặt lại tin nhắn mới sau khi gửi
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Failed to send message. Please try again.");
    }
  };

  return (
    <div className="chat-container">
      {error && <div className="error">{error}</div>}
      <div className="messages">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${
              message.userId === userId ? "sent" : "received"
            } ${message.userRole === "kiểm duyệt viên" ? "admin" : ""}`}
          >
            <span className="message-sender">
              {message.userRole === "kiểm duyệt viên"
                ? message.userName // Sử dụng userName của kiểm duyệt viên
                : message.userName}{" "}
            </span>
            <span>{message.text}</span>
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Nhập tin nhắn..."
        />
        <button type="submit">Gửi</button>
      </form>
    </div>
  );
}

export default Chat;
