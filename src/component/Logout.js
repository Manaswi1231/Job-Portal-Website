import { useEffect, useContext } from "react";
import { Redirect } from "react-router-dom";

import { SetPopupContext } from "../App";

const Logout = (props) => {
  const setPopup = useContext(SetPopupContext);
  useEffect(() => {
    localStorage.clear();
    setPopup({
      open: true,
      severity: "success",
      message: "Logged out successfully",
    });
  }, [setPopup]);

  return <Redirect to="/login" />;
};

export default Logout;
