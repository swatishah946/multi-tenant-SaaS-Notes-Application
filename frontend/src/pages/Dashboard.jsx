import React, { useEffect, useState, useContext } from "react";
import axios from "axios";

// Context & Components
import { AuthContext } from "../context/authcontext.jsx";
import NotesList from "../components/NotesList.jsx";
import NoteForm from "../components/NoteForm.jsx";
import UpgradeButton from "../components/UpgradeButton.jsx";
import UserInvite from "../components/UserInvite.jsx";

// Theme colors
import  COLORS  from "../theme.js";

const Dashboard = () => {
  const { auth, logout } = useContext(AuthContext);
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState(null);
  const [noteLimitReached, setNoteLimitReached] = useState(false);

  // axios instance for notes API
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL + "/notes",
    headers: { Authorization: `Bearer ${auth.token}` },
  });

  // Fetch notes for tenant
  const fetchNotes = async () => {
    try {
      const res = await api.get("/", { headers: { "x-tenant": auth.tenant } });
      setNotes(res.data);
      setNoteLimitReached(false);
    } catch (err) {
      setError("Failed to fetch notes");
    }
  };

  useEffect(() => {
    if (auth.token) fetchNotes();
  }, [auth.token]);

  // Add note handler — disabled if limit reached
  const addNote = async (content) => {
    setError(null);
    try {
      await api.post("/", { content }, { headers: { "x-tenant": auth.tenant } });
      fetchNotes();
    } catch (err) {
      if (err.response?.status === 403) {
        setNoteLimitReached(true);
        setError(err.response?.data?.error); // show limit reached message
      } else {
        setError("Failed to add note");
      }
    }
  };

  // Delete note handler
  const deleteNote = async (id) => {
    setError(null);
    try {
      await api.delete(`/${id}`, { headers: { "x-tenant": auth.tenant } });
      fetchNotes();
    } catch {
      setError("Failed to delete note");
    }
  };

  if (!auth.token) return <p>Please login to access your notes.</p>;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: COLORS.offwhite,
        paddingBottom: "44px",
      }}
    >
      <div
        style={{
          maxWidth: "400px",
          margin: "32px auto",
          background: COLORS.beige,
          borderRadius: "10px",
          boxShadow: "0 2px 10px rgba(35, 55, 71, 0.08)",
          padding: "2rem",
        }}
      >
        <h2 style={{ color: COLORS.navy, marginBottom: "1rem" }}>
          Dashboard{" "}
          <span style={{ color: COLORS.slate, fontSize: "1rem" }}>
            ({auth.tenant}, {auth.role})
          </span>
          <button
            onClick={logout}
            style={{
              float: "right",
              background: COLORS.navy,
              color: COLORS.offwhite,
              borderRadius: "4px",
              border: "none",
              padding: "4px 12px",
              fontWeight: "bold",
              cursor: "pointer",
              fontSize: "0.9rem",
            }}
          >
            Logout
          </button>
        </h2>

        {/* Note creation form (disabled if free plan limit reached) */}
        <NoteForm onAdd={addNote} disabled={noteLimitReached} />

        {/* Show upgrade button only if limit reached and user is admin */}
        {noteLimitReached && auth.role === "Admin" && <UpgradeButton />}

        {/* Show user invite form only for Admins */}
        {auth.role === "Admin" && <UserInvite />}

        {/* Show error messages */}
        {error && <p style={{ color: "crimson", marginTop: "10px" }}>{error}</p>}

        {/* List of notes */}
        <NotesList notes={notes} onDelete={deleteNote} />
      </div>
    </div>
  );
};

export default Dashboard;
