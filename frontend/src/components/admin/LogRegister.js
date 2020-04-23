import React from "react";
import Login from "./Login";
import Register from "./Register";
import { AppBar, Tabs, Tab, Typography, Box } from "@material-ui/core";
import SwipeableViews from "react-swipeable-views";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import PropTypes from "prop-types";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`
  };
}

const useStyles = makeStyles(theme => ({
  avatar: {
    marginLeft: "auto",
    marginRight: "auto",
    marginBottom: theme.spacing(3),
  }
}));

export default function LogRegister() {
  const classes = useStyles();
  const theme = useTheme();

  const [value, setValue] = React.useState(1);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = index => {
    setValue(index);
  };

  return !localStorage.usertoken ? (
    <div className="loginRegister cms">
      <Box display="flex" justifyContent="center">
        <i className="text-secondaryLight fas fa-3x fa-user-lock"></i>
      </Box>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          variant="fullWidth"
          aria-label="full width tabs example"
          className="text-white fontWeightBold tabsLoginRegister"
        >
          <Tab label="Inscription" {...a11yProps(0)} />
          <Tab label="Connexion" {...a11yProps(1)} />
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
          <Register />
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          <Login />
        </TabPanel>
      </SwipeableViews>
    </div>
  ) : (
    <div className="text-align-center"> Vous êtes connecté</div>
  );
}
