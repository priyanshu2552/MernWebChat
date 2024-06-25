import React, { useState } from "react";
import { Link } from 'react-router-dom';
import '../styles/login.css'; 

const Signup = () => {
  const [username, setUsername] = useState("");
  const [gmail, setGmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [profileImage, setProfileImage] = useState(null);

  function update(e) {
    const { name, value, files } = e.target;
    if (name === "username") setUsername(value);
    if (name === "gmail") setGmail(value);
    if (name === "password") setPassword(value);
    if (name === "confirmPassword") setConfirmPassword(value);
    if (name === "phone") setPhone(value);
    if (name === "profileImage") setProfileImage(files[0]);
  }

  return (
    <div className="container">
      <div className="form-container">
        <h1>Sign Up</h1>
        <form>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={username}
            onChange={update}
          />
          <input
            type="email"
            name="gmail"
            placeholder="Gmail"
            value={gmail}
            onChange={update}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={update}
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={update}
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={phone}
            onChange={update}
          />
          <input
            type="file"
            name="profileImage"
            placeholder="Upload Profile Image"
            value={profileImage}
            onChange={update}
          />
          <button type="submit">Sign Up</button>
        </form>
        <Link to="/login" className="signup-link">Already have an account? Login</Link>
      </div>
    </div>
  );
};

export default Signup;
