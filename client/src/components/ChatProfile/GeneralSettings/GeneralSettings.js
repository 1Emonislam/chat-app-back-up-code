import { Paper, Typography } from "@mui/material";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import General from "./General/General";
import moment from 'moment'
const GeneralSettings = ({ mode }) => {
  const [toggleButton] = useState("settings");
  const { profile } = useSelector(state => state)
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false)
  const handleOpen = () => setOpen(true)
  return (
    <>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography
          sx={{ mb: -0.5 }}
          fontWeight={800}
          variant="h6"
          gutterBottom
          component="div"
        >
          Settings
        </Typography>
        <Typography
          variant="subtitle1"
          fontSize={14}
          gutterBottom
          component="div"
        >
          Last Update your profile: {moment(profile?.profile?.user?.updatedAt).format('MMMM Do YYYY')}
        </Typography>
      </Paper>
      {toggleButton === "settings" && <General open={open} handleClose={handleClose} handleOpen={handleOpen} mode={mode} />}
    </>
  );
};

export default GeneralSettings;
