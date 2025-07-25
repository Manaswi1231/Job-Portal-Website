// src/component/MessagePopup.js

import React from "react";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import Fade from "@material-ui/core/Fade"; // ✅ Use a safe transition

const Alert = (props) => <MuiAlert elevation={6} variant="filled" {...props} />;

const MessagePopup = ({ open, handleClose, severity, message }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      TransitionComponent={Fade} // ✅ Use Fade instead of default Grow
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert onClose={handleClose} severity={severity}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default MessagePopup;
