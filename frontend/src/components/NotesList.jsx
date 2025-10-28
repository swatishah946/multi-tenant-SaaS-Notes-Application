import React from "react";
import  COLORS  from "../theme.js";

const NotesList = ({ notes, onDelete }) => {
  return (
    <ul style={{ padding: 0, marginTop: "15px" }}>
      {notes.map((note) => (
        <li
          key={note._id}
          style={{
            background: COLORS.beige,
            color: COLORS.navy,
            marginBottom: "10px",
            borderRadius: "6px",
            padding: "11px 14px",
            listStyle: "none",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 1px 4px rgba(35, 55, 71, 0.05)",
          }}
        >
          {note.content}
          <button
            onClick={() => onDelete(note._id)}
            style={{
              background: COLORS.slate,
              color: COLORS.offwhite,
              border: "none",
              borderRadius: "4px",
              padding: "4px 12px",
              marginLeft: "10px",
              cursor: "pointer",
            }}
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
};

export default NotesList;
