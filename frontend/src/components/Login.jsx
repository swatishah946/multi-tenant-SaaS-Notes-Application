import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";   // Import useNavigate
import { AuthContext } from "../context/authcontext.jsx";
import  COLORS  from "../theme.js";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();   // Initialize navigate
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tenant, setTenant] = useState("acme");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/login`,
        { email, password },
        { headers: { "x-tenant": tenant } }
      );
      login(res.data.token, res.data.tenant, res.data.role);
      navigate("/dashboard");    // Redirect to dashboard
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div
      style={{
        background: COLORS.offwhite,
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: COLORS.beige,
          padding: "2rem",
          borderRadius: "10px",
          boxShadow: "0 2px 8px rgba(35, 55, 71, 0.08)",
          width: "270px",
        }}
      >
        <h2 style={{ color: COLORS.navy, marginBottom: "1rem" }}>Login</h2>
        {/* Tenant selector, email, password inputs remain unchanged */}
        <label style={{ color: COLORS.slate, fontSize: "0.95rem" }}>
          Tenant:{" "}
          <select
            value={tenant}
            onChange={(e) => setTenant(e.target.value)}
            style={{
              background: COLORS.offwhite,
              border: "1px solid " + COLORS.slate,
              borderRadius: "4px",
              padding: "3px",
              marginBottom: "10px",
              color: COLORS.navy,
              outline: "none",
            }}
          >
            <option value="acme">Acme</option>
            <option value="globex">Globex</option>
          </select>
        </label>
        <br />
        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: "7px",
            marginTop: "8px",
            marginBottom: "10px",
            borderRadius: "4px",
            border: "1px solid " + COLORS.slate,
            background: COLORS.offwhite,
            color: COLORS.navy,
            outline: "none",
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "7px",
            marginBottom: "14px",
            borderRadius: "4px",
            border: "1px solid " + COLORS.slate,
            background: COLORS.offwhite,
            color: COLORS.navy,
            outline: "none",
          }}
        />
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "9px",
            borderRadius: "4px",
            background: COLORS.navy,
            color: COLORS.offwhite,
            border: "none",
            fontWeight: "bold",
          }}
        >
          Login
        </button>
        {error && (
          <p style={{ color: "crimson", marginTop: "0.7rem", textAlign: "center" }}>
            {error}
          </p>
        )}
      </form>
    </div>
  );
};

export default Login;
