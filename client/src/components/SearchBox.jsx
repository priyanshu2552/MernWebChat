import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import "./styles/searchbox.scss";
import toast from "react-hot-toast";
import axios from "axios";

const SearchBox = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState("");
  const [results, setResults] = useState([]);

  const update = (e) => {
    setUsername(e.target.value);
  };

  const searchUser = async () => {
    if (username) {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:5000/users/getusers/${username}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (res.status === 200) {
          setResults([res.data]);
        } else {
          toast.error(res.data.message);
          setResults([]);
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
        toast.error(error.response.data.message);
        setResults([]);
      }
    } else {
      toast.error("Please fill in the username to search for a user");
      setResults([]);
    }
  };

  // Example Axios POST request in SearchBox component
  const createChat = async (user2Id, username) => {
    const token = localStorage.getItem("token");

    const chatData = {
      name: username,
      user2Id,
    };

    try {
      const res = await axios.post(
        "http://localhost:5000/users/chats/createchat",
        chatData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (res.status === 201) {
        toast.success(res.data.message);
        // Optionally, update UI or navigate to chat view
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error("Error creating chat:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Error occurred while creating chat");
      }
    }
  };

  return (
    <div className={`searchbox ${isOpen ? "open" : ""}`}>
      <div className="searchbox-header">
        <input
          type="text"
          placeholder="Search"
          value={username}
          onChange={update}
        />
        <button onClick={searchUser}>Go</button>
        <FaTimes className="close-icon" onClick={onClose} />
      </div>
      <div className="searchbox-results">
        <ol>
          {results.map((user) => (
            <li
              key={user._id}
              onClick={() => createChat(user._id, user.username)}
            >
              {user.username}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default SearchBox;
