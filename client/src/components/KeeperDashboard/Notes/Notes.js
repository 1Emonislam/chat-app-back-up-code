import AddCircleIcon from "@mui/icons-material/AddCircle";
import ArchiveIcon from "@mui/icons-material/Archive";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import LabelIcon from "@mui/icons-material/Label";
import NoteOutlinedIcon from "@mui/icons-material/NoteOutlined";
import PushPinIcon from "@mui/icons-material/PushPin";
import { Box, IconButton, Paper, Typography } from "@mui/material";
import * as React from "react";
import { useSelector } from 'react-redux';
import fakeData from "../fakeData/fakeData";
import NoContentIcon from "../NoContentIcon/NoContentIcon";
import "./Notes.css";
import NotesInfo from "./NotesInfo";
const Notes = () => {
  const noCIcon = (
    <NoteOutlinedIcon sx={{ fontSize: "130px", color: "#ececec" }} />
  );
  const mode = useSelector(state => state?.theme?.theme)

  return (
    <>
      <Paper
        elevation={4}
        className="notes-container"
        sx={{ height: "100%", borderRadius: 2 }}
      >
        <div style={{ display: "flex" }}>
          <Typography
            component='input'
            color={mode === 'dark' ? '#9d8585' : 'black'}
            type="text"
            placeholder="Title"
            className="input1" />
          <IconButton sx={{ width: "30px", height: "30px" }}>
            <PushPinIcon
              sx={{ color: "#bebebe", fontSize: "19px", marginTop: "10px" }}
            />
          </IconButton>
        </div>
        <Typography
          color={mode === 'dark' ? '#9d8585' : 'black'}
          sx={{ background: 'none', }}
          component='textarea'
          rows="auto"
          type="text"
          placeholder="Take a note..."
          className=""
        />

        <Box className="notes-icon-container">
          {/* -- Color box component -- */}
          <IconButton>
            <CheckBoxIcon className="notes-icons" />
          </IconButton>
          <IconButton>
            <LabelIcon className="notes-icons" />
          </IconButton>
          <IconButton>
            <ArchiveIcon className="notes-icons" />
          </IconButton>
          <IconButton>
            <CancelIcon className="notes-icons" />
          </IconButton>
          <IconButton>
            <AddCircleIcon className="notes-icons" />
          </IconButton>
        </Box>
      </Paper>

      {/* --- No content icon --- */}
      {!fakeData?.length && (
        <NoContentIcon
          noCIcon={noCIcon}
          content={"Notes you add appear here"}
        />
      )}

      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {fakeData?.slice(0, 14)?.map((note, index) => (
          <NotesInfo key={index} note={note} mode={mode}></NotesInfo>
        ))}
      </div>
    </>
  );
};

export default Notes;
