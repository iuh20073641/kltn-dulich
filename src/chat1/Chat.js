import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import styled from "styled-components";

const socket = io("https://real-time-chat-server-pq0n.onrender.com");

const PageContainer = styled.div`
  display: flex;
  height: 100vh; /* Chiều cao toàn màn hình */
  align-items: flex-start; /* Căn chỉnh các phần tử theo chiều ngang */
  padding: 20px;
`;

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1; /* Chiếm toàn bộ không gian còn lại */
  max-width: 800px; /* Giới hạn chiều rộng */
  margin: 0 auto; /* Căn giữa khung trò chuyện */
  padding: 20px; /* Thêm khoảng cách bên trong */
  border: 1px solid #ccc; /* Thêm viền */
  border-radius: 10px; /* Bo tròn góc */
  background-color: #2c2f33; /* Màu nền tổng thể */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* Thêm bóng đổ */
  height: calc(
    100vh - 40px
  ); /* Chiều cao cố định, trừ đi padding của PageContainer */
`;

const UserInfo = styled.div`
  margin-bottom: 10px;
  color: #ffffff; /* Màu chữ trên nền tối */
  text-align: left; /* Căn chỉnh văn bản bên trái */
`;

const Divider = styled.hr`
  border: 0;
  height: 1px;
  background: #ccc;
  margin: 10px 0;
`;

const Messages = styled.div`
  flex: 1;
  overflow-y: auto;
  margin-bottom: 10px;
  padding-right: 10px; /* Đảm bảo có khoảng cách cho thanh cuộn */
  height: calc(
    100% - 100px
  ); /* Chiều cao cố định, trừ đi chiều cao của các phần tử khác */
`;

const MessageWrapper = styled.div`
  display: flex;
  justify-content: ${(props) => (props.$isSent ? "flex-end" : "flex-start")};
  margin-bottom: 10px;
`;

const Message = styled.div`
  padding: 10px;
  border-radius: 10px;
  background-color: ${(props) =>
    props.$isSent ? "#7289DA" : "#99AAB5"}; /* Màu nền tin nhắn gửi và nhận */
  max-width: 60%; /* Giới hạn chiều rộng của tin nhắn */
  word-wrap: break-word; /* Đảm bảo tin nhắn không tràn ra ngoài */
  text-align: ${(props) =>
    props.$isSent ? "right" : "left"}; /* Căn chỉnh văn bản */
`;

const MessageSender = styled.div`
  font-weight: bold;
  margin-bottom: 5px;
  color: ${(props) =>
    props.$isSent ? "#FFFFFF" : "#2C2F33"}; /* Màu tên người gửi */
`;

const MessageText = styled.div`
  word-wrap: break-word;
  color: ${(props) =>
    props.$isSent ? "#FFFFFF" : "#2C2F33"}; /* Màu nội dung tin nhắn */
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  border-top: 1px solid #ccc;
  background-color: #2c2f33; /* Màu nền cho input */
`;

const Input = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-right: 10px;
  width: 70%;
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  background-color: #7289da;
  color: white;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #5a6fb8;
  }
`;

const Error = styled.div`
  color: red;
  margin-bottom: 10px;
`;

const CustomerChat1 = () => {
const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate(); // Sử dụng hook useNavigate để lấy đối tượng navigate

  const user = JSON.parse(localStorage.getItem("user"));
  const room = `customer_${user.id}`;
  const currentRoom = useRef(null);

  useEffect(() => {
    if (user && user.role === "customer") {
      if (currentRoom.current !== room) {
        if (currentRoom.current) {
          socket.emit("leaveRoom", currentRoom.current);
          console.log(`Customer left room: ${currentRoom.current}`);
        }
        socket.emit("joinRoom", room);
        console.log(`Customer joined room: ${room}`);
        currentRoom.current = room;

        const fetchMessages = async () => {
          try {
            const response = await fetch(
              `http://localhost:88/api_travel/api/admin/get_messages.php?room=${room}`
            );
            const data = await response.json();
            setMessages(data);
          } catch (error) {
            console.error("Failed to fetch messages:", error);
          }
        };

        fetchMessages();
      }
    }

    socket.on("receiveMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    });

    return () => {
      socket.off("receiveMessage");
      if (currentRoom.current) {
        socket.emit("leaveRoom", currentRoom.current);
        console.log(`Customer left room: ${currentRoom.current}`);
      }
    };
  }, [room, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === "") {
      setError("Message cannot be empty");
      return;
    }
    const message = {
      id: Date.now(),
      userId: user.id,
      userName: user.name,
      userRole: user.role, // Thêm thông tin vai trò của người dùng
      text: newMessage,
      room,
      timestamp: new Date().toISOString(),
    };
    socket.emit("sendMessage", message);

    try {
      await fetch(
        "http://localhost:88/api_travel/api/admin/save_message.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(message),
        }
      );
    } catch (error) {
      console.error("Failed to save message:", error);
    }

    setNewMessage("");
    setError(null);
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleBackClick = () => {
    navigate(-1); // Sử dụng navigate để quay lại trang trước đó
  };

  return (
    <PageContainer>
      <Button onClick={handleBackClick}>Trở về</Button>
      <ChatContainer>
<UserInfo>
          {/* <p>{user.name}</p> */}
          <p>Nhân viên chăm sóc khách hàng</p>
        </UserInfo>
        <Divider />
        {error && <Error>{error}</Error>}
        <Messages>
          {messages.map((message, index) => (
            <MessageWrapper
              key={`${message.id}-${message.userId}-${index}`}
              $isSent={message.userId === user.id}
            >
              <Message $isSent={message.userId === user.id}>
                <MessageSender $isSent={message.userId === user.id}>
                  {message.userId === user.id
                    ? message.userName
                    : message.userRole}
                </MessageSender>
                <MessageText $isSent={message.userId === user.id}>
                  {message.text}
                </MessageText>
              </Message>
            </MessageWrapper>
          ))}
          <div ref={messagesEndRef} />
        </Messages>
        <InputContainer>
          <Input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <Button type="submit" onClick={handleSendMessage}>
            Send
          </Button>
        </InputContainer>
      </ChatContainer>
    </PageContainer>
  );
};

export default CustomerChat1;
