import React, { useEffect, useState } from "react";
import { FaBell, FaSearch, FaUser } from "react-icons/fa";
import axios from "axios";
import "../styles/chat.scss";
import SearchBox from "../components/SearchBox";

import Messages from "../components/Messages";
import GroupForm from "../components/GroupForm";
import ProfileDisplay from "../components/ProfileDisplay";
const profileImg = localStorage.getItem("img");

const Chat = () => {
  const [isOpen, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [isGroup, setIsGroup] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const loggedInUserId = localStorage.getItem("userId");
  const [chatProfileUser, setChatProfileUser] = useState(null);

  const openSearch = () => {
    setOpen(true);
  };

  const closeSearch = () => {
    setOpen(false);
  };

  const fetchUserProfile = async () => {
    const username = localStorage.getItem("username");
    const email = localStorage.getItem("email");
    const image = localStorage.getItem("img");
    setUserProfile({ username, email, image });
  };

  useEffect(() => {
    if (isProfileOpen && !chatProfileUser) {
      fetchUserProfile();
    }
  }, [isProfileOpen, chatProfileUser]);

  const selectUser = (user) => {
    setSelectedUser(user);
    setChatProfileUser(null);
    setIsProfileOpen(false); // Close profile if open

    // Check if it's a group chat or a one-on-one chat
    if (!user.isGroupChat) {
      const profileUser = user.members.find(
        (member) => member._id !== loggedInUserId
      );
      setChatProfileUser(profileUser);
    }
  };

  useEffect(() => {
    const fetchChats = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(
          "http://localhost:5000/users/chats/getallchats",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (res.status === 200) {
          setChats(res.data);
        } else {
          console.error("Failed to fetch chats");
        }
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };

    fetchChats();
  }, [isOpen, isGroup, isProfileOpen]);

  return (
    <div className="chat_container">
      <div className="navbar">
        <div className="searchfield" onClick={openSearch}>
          <FaSearch className="search-icon" />
          <p>search user</p>
        </div>
        <p>Talk-A-Tive</p>
        <div className="profile">
          <FaBell className="notification-bell" />
          <img
            src={profileImg}
            alt="Profile"
            className="profile-photo"
            onClick={() => {
              setIsProfileOpen(!isProfileOpen);
              setChatProfileUser(null); // Ensure chat profile user is null
            }}
          />
        </div>
      </div>
      {isOpen && <SearchBox isOpen={isOpen} onClose={closeSearch} />}
      {isProfileOpen && userProfile && (
        <ProfileDisplay
          userProfileId={userProfile}
          onClose={() => setIsProfileOpen(false)}
        />
      )}
      <div className="chat_box">
        <div className="left">
          <div className="header">
            <p>My Chats</p>
            <div className="g" onClick={() => setIsGroup(!isGroup)}>
              <p>
                New Group Chat <span>+</span>
              </p>
            </div>
          </div>
          <div className="user_list">
            {chats.map((chat) => (
              <div
                key={chat._id}
                className="user_item"
                onClick={() => selectUser(chat)}
              >
                <FaUser className="user_icon" />
                <p>
                  {!chat.isGroupChat
                    ? chat.members?.find(
                        (member) => member._id !== loggedInUserId
                      )?.username
                    : chat.name}
                </p>
              </div>
            ))}
          </div>
          {isGroup && <GroupForm setIsGroup={setIsGroup} />}
        </div>
        <div className="right">
          <div className="chat_header">
            {selectedUser ? (
              <>
                <h2>
                  {selectedUser.isGroupChat
                    ? selectedUser.name
                    : selectedUser.members.find(
                        (member) => member._id !== loggedInUserId
                      ).username}
                </h2>
                <FaUser
                  className="user_icon"
                  onClick={() => {
                    setChatProfileUser(
                      selectedUser.members.find(
                        (member) => member._id !== loggedInUserId
                      )
                    );
                    setIsProfileOpen(true);
                  }}
                />
              </>
            ) : (
              <h2>Select a chat to start messaging</h2>
            )}
          </div>
          {selectedUser ? (
            <Messages chat_id={selectedUser._id} />
          ) : (
            <div className="chat_placeholder">
              Click on a user to start the chat
            </div>
          )}
        </div>
      </div>
      {isProfileOpen && chatProfileUser && (
        <ProfileDisplay
          userProfileId={chatProfileUser}
          onClose={() => setIsProfileOpen(false)}
        />
      )}
    </div>
  );
};

export default Chat;
