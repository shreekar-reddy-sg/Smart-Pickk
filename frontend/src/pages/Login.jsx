import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleLogin = async (e) => {
    e.preventDefault(); // stop page reload

    try {
      const res = await axios.post("http://localhost:4000/api/auth/login", {
        email,
        password
      });
      localStorage.setItem("token", res.data.data.token);

      alert("Login successful");

    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      
      <form onSubmit={handleLogin} style={{ border: "1px solid black", padding: "20px" }}>
        
        <h2>Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <br /><br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <br /><br />

        <button type="submit">Login</button>
        <br /><br />
        <Link to="/register">Don't have an account? Register here</Link>
      </form>

    </div>
  );
};

export default Login;