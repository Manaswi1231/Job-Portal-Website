import { createContext, useState } from "react";
import {
  BrowserRouter,
  Route,
  Switch, // Use Routes instead of Switch if you're on React Router v6+
} from "react-router-dom";
import { Grid, makeStyles } from "@material-ui/core";

import Welcome, { ErrorPage } from "./component/Welcome";
import Navbar from "./component/Navbar";
import Login from "./component/Login";
import Logout from "./component/Logout";
import Signup from "./component/Signup";
import Home from "./component/Home";
import Applications from "./component/Applications";
import Profile from "./component/Profile";
import CreateJobs from "./component/recruiter/CreateJobs";
import MyJobs from "./component/recruiter/MyJobs";
import JobApplications from "./component/recruiter/JobApplications";
import AcceptedApplicants from "./component/recruiter/AcceptedApplicants";
import RecruiterProfile from "./component/recruiter/Profile";
import SavedJobsPage from "./component/savedJobsPage";
import MessagePopup from "./lib/MessagePopup";

import "./App.css"; // ✅ now used

const useStyles = makeStyles(() => ({
  body: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "98vh",
    paddingTop: "64px",
    boxSizing: "border-box",
    width: "100%",
  },
}));

export const SetPopupContext = createContext();

function App() {
  const classes = useStyles();
  const [popup, setPopup] = useState({
    open: false,
    severity: "",
    message: "",
  });

  const userType = localStorage.getItem("type");

  return (
    <BrowserRouter>
      <SetPopupContext.Provider value={setPopup}>
        <Grid container direction="column">
          <Grid item xs={12}>
            <Navbar />
          </Grid>

          <Grid item className={classes.body}>
            <Switch>
              <Route exact path="/" component={Welcome} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/signup" component={Signup} />
              <Route exact path="/logout" component={Logout} />
              <Route exact path="/home" component={Home} />
              <Route exact path="/applications" component={Applications} />
              <Route
                exact
                path="/profile"
                component={
                  userType === "recruiter" ? RecruiterProfile : Profile
                }
              />
              <Route exact path="/addjob" component={CreateJobs} />
              <Route exact path="/myjobs" component={MyJobs} />
              <Route
                exact
                path="/job/applications/:jobId"
                component={JobApplications}
              />
              <Route exact path="/employees" component={AcceptedApplicants} />
              <Route exact path="/saved-jobs" component={SavedJobsPage} />
              <Route component={ErrorPage} />
            </Switch>
          </Grid>
        </Grid>

        <MessagePopup
          open={popup.open}
          setOpen={(status) =>
            setPopup({
              ...popup,
              open: status,
            })
          }
          severity={popup.severity}
          message={popup.message}
        />
      </SetPopupContext.Provider>
    </BrowserRouter>
  );
}

export default App;
