import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/authcontext.jsx";
import { COLORS } from "../theme.js";

const UserInvite = () => {
  const { auth } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Member");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  if (auth.role !== "Admin") return null; // Show only for Admin users

  const handleInvite = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/users/invite`,
        { email, role },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
            "x-tenant": auth.tenant,
          },
        }
      );
      setMessage(res.data.message);
      setEmail("");
      setRole("Member");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to invite user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleInvite}
      style={{
        marginTop: "20px",
        background: COLORS.beige,
        padding: "14px",
        borderRadius: "8px",
        boxShadow: "0 1px 5px rgba(35,55,71,0.1)",
      }}
    >
      <h3 style={{ color: COLORS.navy, marginBottom: "10px" }}>Invite User</h3>

      <input
        type="email"
        placeholder="Email (e.g. user@example.com)"
        value={email}
        required
        onChange={(e) => setEmail(e.target.value)}
        style={{
          width: "100%",
          padding: "8px",
          borderRadius: "4px",
          border: `1px solid ${COLORS.slate}`,
          marginBottom: "10px",
          color: COLORS.navy,
          outline: "none",
          background: COLORS.offwhite,
        }}
      />

      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        style={{
          width: "100%",
          padding: "8px",
          borderRadius: "4px",
          border: `1px solid ${COLORS.slate}`,
          marginBottom: "10px",
          color: COLORS.navy,
          outline: "none",
          background: COLORS.offwhite,
        }}
      >
        <option value="Member">Member</option>
        <option value="Admin">Admin</option>
      </select>

      <button
        type="submit"
        disabled={loading}
        style={{
          width: "100%",
          backgroundColor: COLORS.slate,
          color: COLORS.offwhite,
          padding: "10px",
          borderRadius: "5px",
          border: "none",
          fontWeight: "bold",
          cursor: loading ? "wait" : "pointer",
        }}
      >
        {loading ? "Inviting..." : "Invite User"}
      </button>

      {message && <p style={{ color: "green", marginTop: "10px" }}>{message}</p>}
      {error && <p style={{ color: "crimson", marginTop: "10px" }}>{error}</p>}
    </form>
  );
};

export default UserInvite;
