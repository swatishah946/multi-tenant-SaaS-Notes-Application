import React, { useState } from "react";
import COLORS from "../theme.js";

const NoteForm = ({ onAdd, disabled }) => {
  const [content, setContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    onAdd(content.trim());
    setContent("");
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", marginTop: "20px" }}>
      <input
        type="text"
        placeholder="New note"
        value={content}
        disabled={disabled}
        onChange={(e) => setContent(e.target.value)}
        style={{
          flex: 1,
          marginRight: "10px",
          padding: "8px",
          borderRadius: "5px",
          border: `1px solid ${COLORS.slate}`,
          background: COLORS.offwhite,
          color: COLORS.navy,
        }}
      />
      <button
        type="submit"
        disabled={disabled}
        style={{
          padding: "8px 18px",
          borderRadius: "5px",
          background: disabled ? COLORS.beige : COLORS.navy,
          color: disabled ? COLORS.navy : COLORS.offwhite,
          border: "none",
          fontWeight: "bold",
          transition: "background 0.2s",
        }}
      >
        Add Note
      </button>
    </form>
  );
};

export default NoteForm;
