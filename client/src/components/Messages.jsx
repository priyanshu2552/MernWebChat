import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/chat.scss";
import toast from "react-hot-toast";
import io from "socket.io-client";

const Messages = ({ chat_id }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const loggedInUserId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const imageurl = localStorage.getItem("img");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/users/chats/get/${chat_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (res.status === 200) {
          setMessages(res.data);
          console.log(res.data);
        } else {
          toast.error(res.data.message);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [chat_id, token]);

  useEffect(() => {
    const socket = io("http://localhost:5000");

    socket.emit("join_chat", chat_id);

    socket.on("receive_message", (message) => {
      console.log(message);
      setMessages((oldmsg) => [...oldmsg, message]);
    });

    return () => {
      socket.disconnect();
    };
  }, [chat_id]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === "") {
      return;
    }

    try {
      const res = await axios.post(
        `http://localhost:5000/users/chats/send/${chat_id}`,
        {
          content: newMessage,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const socket = io("http://localhost:5000");
      if (res.status === 201) {
        socket.emit("send_message", {
          _id: chat_id,
          sender: { _id: loggedInUserId, image: imageurl },

          content: newMessage,
        });
        setNewMessage("");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Error sending message");
    }
  };

  return (
    <div className="messages_container">
      <div className="messages">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`message_item ${
              message.sender._id === loggedInUserId ? "right" : "left"
            }`}
          >
            <div className="senderProfile">
              <img src={message.sender.image} alt="" />
            </div>
            <div className="message_content">{message.content}</div>
          </div>
        ))}
      </div>
      <div className="chat_input">
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Messages;
