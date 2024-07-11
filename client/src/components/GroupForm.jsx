import React, { useState } from "react";
import axios from "axios";
import "../styles/chat.scss";
import "./styles/GroupForm.scss";
import toast from "react-hot-toast";

const GroupForm = ({ setIsGroup }) => {
  const [groupName, setGroupName] = useState("");
  const [members, setMembers] = useState([]);
  const [searchResult, setSearchResult] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const token = localStorage.getItem("token");

  const handleGroupNameChange = (e) => {
    setGroupName(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = async () => {
    if (searchTerm) {
      try {
        const res = await axios.get(
          `http://localhost:5000/users/getusers/${searchTerm}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setSearchResult(res.data);
      } catch (error) {
        console.error("Error searching users:", error);
        toast.error(error.response.data.message);
      }
    } else {
      setSearchResult(null);
      toast.error("Please fill in the username");
    }
  };

  const addMember = (user) => {
    if (!members.some((member) => member._id === user._id)) {
      setMembers([...members, user]);
      setSearchResult(null);
      setSearchTerm("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const memberIds = members.map((member) => member._id);

    console.log(memberIds);
    if (memberIds.length >= 1) {
      try {
        const res = await axios.post(
          "http://localhost:5000/users/chats/creategroup",
          {
            name: groupName,
            members: memberIds,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (res.status === 201) {
          toast.success("Group chat created successfully");
          setGroupName("");
          setMembers([]);
          setIsGroup(false); // Hide the form after successful creation
        } else {
          console.error("Failed to create group chat");
          toast.error(res.data.message);
        }
      } catch (error) {
        console.error("Error creating group chat:", error);
        toast.error(error.response.data.message);
      }
    } else {
      toast.error("select the user first");
    }
  };

  return (
    <div className="groupform">
      <h2>Create Group Chat</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="GroupName">Group Name</label>
        <input
          type="text"
          id="GroupName"
          value={groupName}
          onChange={handleGroupNameChange}
        />
        <div className="userselceted">
          <ul>
            {members.map((member) => (
              <li key={member._id}>{member.username}</li>
            ))}
          </ul>
        </div>
        <div className="searchuser">
          <input
            type="text"
            placeholder="Search User"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button type="button" onClick={handleSearch}>
            Go
          </button>
          <div className="displaysearch">
            {searchResult && (
              <div
                key={searchResult._id}
                className="searchresult"
                onClick={() => addMember(searchResult)}
              >
                {searchResult.username}
              </div>
            )}
          </div>
        </div>
        <button type="submit">Create Group</button>
      </form>
    </div>
  );
};

export default GroupForm;
