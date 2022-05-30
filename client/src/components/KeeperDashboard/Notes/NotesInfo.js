import ArchiveIcon from "@mui/icons-material/Archive";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PushPinIcon from "@mui/icons-material/PushPin";
import { Box, IconButton, Tooltip } from "@mui/material";
import React from "react";
import "./Notes.css";

const NotesInfo = ({ note, mode }) => {
  return (
    <div className="notes-card-style">
      <div style={{ display: "flex" }}>
        <div style={{ color: `${mode === 'dark' ? '#9d8585' : 'black'}` }}>
          <p
            style={{
              fontSize: "1em",
              fontWeight: "500",
              marginBottom: "6px",
            }}
          >
            {note?.title}
          </p>
          <p
            style={{
              fontSize: "14px",
              wordWrap: "break-word",
              marginBottom: "10px",
              fontWeight: "400",
            }}
          >
            {note?.details}
          </p>
        </div>
        <IconButton sx={{ width: "30px", height: "30px" }}>
          <PushPinIcon sx={{ color: "#bebebe", fontSize: "19px" }} />
        </IconButton>
      </div>

      <Box sx={{ display: "flex", justifyContent: "end" }}>
        {/* -- Color box component -- */}
        <Tooltip title="Pin" arrow placement="top">
          <IconButton>
            <PushPinIcon style={{ position: 'relative', top: '2px' }} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Archive" arrow placement="top">
          <IconButton>
            <ArchiveIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete" arrow placement="top">
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Edit" arrow placement="top">
          <IconButton>
            <EditIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </div>
  );
};

export default NotesInfo;
