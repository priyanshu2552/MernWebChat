import React, { useState } from "react";
import { Link } from 'react-router-dom';
import '../styles/login.css'; 

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function update(e) {
    const { name, value } = e.target;
    if (name === "username") setUsername(value);
    if (name === "password") setPassword(value);
  }

  return (
    <div className="container">
      <div className="form-container">
        <h1>Login</h1>
        <form>
          <input
            type="text"
            name="username"
            placeholder="Enter your username or gmail"
            value={username}
            onChange={update}
          />
          <input
            type="password" 
            name="password"
            placeholder="Password"
            value={password}
            onChange={update}
          />
          <button type="submit">Login</button>
        </form>
        <Link to="/signup" className="signup-link">Don't have an account? Sign Up</Link>
      </div>
    </div>
  );
};

export default Login;
