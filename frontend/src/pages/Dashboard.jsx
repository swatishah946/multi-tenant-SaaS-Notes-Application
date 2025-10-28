import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import AuthContext from "../context/authcontext.jsx";
import NotesList from "../components/NotesList.jsx";
import NoteForm from "../components/NoteForm.jsx";
import UpgradeButton from "../components/UpgradeButton.jsx";
import UserInvite from "../components/UserInvite.jsx";
import COLORS from "../theme.js";

const Dashboard = () => {
  const { auth, logout } = useContext(AuthContext);
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState(null);
  const [noteLimitReached, setNoteLimitReached] = useState(false);
  const [loading, setLoading] = useState(false);

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASEURL + "/notes",
    headers: { Authorization: `Bearer ${auth.token}` },
  });

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const res = await api.get("", {
        headers: { "x-tenant": auth.tenant },
      });
      setNotes(res.data);
      setNoteLimitReached(false);
      setError(null);
    } catch (err) {
      setError("Failed to fetch notes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth.token) fetchNotes();
  }, [auth.token]);

  const addNote = async (content) => {
    setLoading(true);
    try {
      await api.post(
        "",
        { content },
        { headers: { "x-tenant": auth.tenant } }
      );
      fetchNotes();
    } catch (err) {
      setError(err.response?.data?.error || "Could not add note");
      setNoteLimitReached(true);
    } finally {
      setLoading(false);
    }
  };

  const deleteNote = async (id) => {
    setLoading(true);
    try {
      await api.delete(`/${id}`, {
        headers: { "x-tenant": auth.tenant },
      });
      fetchNotes();
    } catch (err) {
      setError("Could not delete note");
    } finally {
      setLoading(false);
    }
  };

  // For counting notes and plan status
  const noteLimit =
    auth.plan === "free" ? `Notes: ${notes.length}/3 (Free)` : `Notes: ${notes.length}+ (Pro)`;

  return (
    <div style={{ background: COLORS.offwhite, minHeight: "100vh", padding: "30px" }}>
      <div style={{ marginBottom: "20px", padding: "10px", background: COLORS.beige, borderRadius: "8px" }}>
        <strong>{auth.tenant}</strong> | {auth.user.email} ({auth.role}) <br />
        <span>Plan: <b>{auth.plan}</b></span>
        <span style={{ marginLeft: "20px" }}>{noteLimit}</span>
      </div>
      <UpgradeButton />
      {auth.role === "Admin" && <UserInvite />}
      {error && (
        <div style={{ color: COLORS.red, background: COLORS.beige, margin: "8px 0", padding: "8px", borderRadius: "6px" }}>
          {error}
        </div>
      )}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <NoteForm onAdd={addNote} disabled={noteLimitReached} />
          <NotesList notes={notes} onDelete={deleteNote} />
        </>
      )}
      <button onClick={logout} style={{ marginTop: "20px", background: COLORS.slate, color: COLORS.offwhite }}>
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
