import React, { useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/authcontext.jsx";
import  COLORS  from "../theme.js";

const UpgradeButton = () => {
  const { auth } = useContext(AuthContext); // auth.tenant gives 'acme' or 'globex'
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleUpgrade = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/tenants/${auth.tenant}/upgrade`, // auto-uses tenant slug from context
        {},
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
            "x-tenant": auth.tenant, // (OPTIONAL, not strictly required but safe)
          },
        }
      );
      setMessage(res.data.message || "Subscription upgraded to Pro");
      window.location.reload(); // Refresh dashboard state after upgrade
    } catch (err) {
      setMessage(err.response?.data?.error || "Upgrade failed");
    } finally {
      setLoading(false);
    }
  };

  if (auth.role !== "Admin") return null;

  return (
    <div style={{ marginTop: "12px" }}>
      <button
        onClick={handleUpgrade}
        disabled={loading}
        style={{
          background: COLORS.slate,
          color: COLORS.offwhite,
          border: "none",
          borderRadius: "5px",
          padding: "10px 26px",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        {loading ? "Upgrading..." : "Upgrade to Pro"}
      </button>
      {message && <p style={{ color: COLORS.navy, marginTop: "7px" }}>{message}</p>}
    </div>
  );
};

export default UpgradeButton;
