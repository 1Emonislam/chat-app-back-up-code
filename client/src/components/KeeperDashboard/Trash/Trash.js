import React from "react";
import NoContentIcon from "../NoContentIcon/NoContentIcon";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import fakeData from "../fakeData/fakeData";
import TrashInfo from "./TrashInfo";
import "./Trash.css";
import { Card } from "@mui/material";

const Trash = () => {
  const noCIcon = (
    <DeleteOutlineIcon sx={{ fontSize: "130px", color: "#ececec" }} />
  );
  return (
    <>
      <Card className="trash-empty-card">Click here empty trash </Card>

      {/* --- No content icon --- */}
      {!fakeData?.length && (
        <NoContentIcon noCIcon={noCIcon} content={"No notes in Trash"} />
      )}

      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {fakeData?.slice(0, 5)?.map((note, index) => (
          <TrashInfo key={index} note={note}></TrashInfo>
        ))}
      </div>
    </>
  );
};

export default Trash;