import React from "react";
import Login from "./Login";
import Register from "./Register";
import { AppBar, Tabs, Tab, Typography, Box, Avatar } from "@material-ui/core";
import SwipeableViews from "react-swipeable-views";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import { LockOutlined } from "@material-ui/icons";

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
  root: {
    backgroundColor: theme.palette.background.paper,
    width: 500,
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: theme.spacing(2)
  },
  avatar: {
    marginLeft: "auto",
    marginRight: "auto",
    marginBottom: theme.spacing(5),
    backgroundColor: theme.palette.primary.main
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
    <div className={classes.root}>
      <Avatar className={classes.avatar}>
        <LockOutlined />
      </Avatar>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="full width tabs example"
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
    <div className={classes.root}> Vous êtes connecté</div>
  );
}
