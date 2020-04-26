import React, { Component } from "react";
import "./styles/App.css";
import { BrowserRouter, Route } from "react-router-dom";
import Navbar from "./components/NavBar";
import Search from "./components/Search";
import About from "./components/About";
import News from "./components/News";
import Wills from "./components/Wills";
import Profile from "./components/admin/Profile";
import Testators from "./components/Testators";
import Places from "./components/Places";
import Will from "./components/Will";
import Home from "./components/Home";
import Articles from "./components/Articles";
import LogRegister from "./components/admin/LogRegister";
import MySpace from "./components/admin/MySpace";
import Manage from "./components/cms/Manage";
import Compare from "./components/Compare";
import Testator from "./components/Testator";
import Place from "./components/Place";
import Unit from "./components/Unit";
import Units from "./components/Units";
import ConfigMail from "./components/cms/ConfigMail";
import Explore from "./components/Explore";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

import { StylesProvider } from "@material-ui/core";

import { createMuiTheme } from "@material-ui/core/styles";
import { MuiThemeProvider } from "@material-ui/core/styles";

import "./styles/NavBar.css";
import "./styles/NoticeDisplay.css";
import "./styles/Notices.css";
import "./styles/Footer.css";
import "./styles/Articles.css";
import "./styles/Compare.css";
import "./styles/Explore.css";
import "./styles/Home.css";
import "./styles/Testator.css";
import "./styles/Search.css";
import "./styles/DataSearch.css";
import "./styles/DateFilter.css";
import "./styles/TextSearch.css";
import "./styles/ResultWills.css";
import "./styles/Results.css";
import "./styles/Menu.css";
import "./styles/Cms.css";
import "./styles/NewPost.css";
import "./styles/LogRegister.css";
import "./styles/WillCompare.css";
import "./styles/Compare.css";
import "./styles/Responsive.css";
import "./styles/Contact.css";

import LostPassWord from "./components/admin/LostPassWord";
import ResetMDP from "./components/admin/ResetMDP";
import "./styles/LostPassWord.css";
import "./styles/ResetMDP.css";
import MyFavoritesCart from "./components/cms/MyFavoritesCart";

const theme = createMuiTheme({
  palette: {
    primary: {
      light: "#8094B1",
      main: "#2E5D81",
    },
    secondary: {
      light: "#8DB2C2",
      main: "#1F8299",
    },
    error: {
      main: "#B91918",
    },
    warning: {
      main: "#EC6607",
    },
    danger: {
      main: "#BE1622",
    },
    info: {
      main: "#008ECF",
    },
    success: {
      main: "#009640",
    },
    grey: {
      100: "#f5f5f5",
      200: "#F0F0F0",
      300: "#DADAD9",
      400: "#C6C6C5",
      500: "#9D9C9C",
      600: "#6F6F6E",
    },
  },

  typography: {
    fontFamily: "Fira Sans",

    htmlFontSize: 15,

    fontWeightRegular: 400,
    fontWeightMedium: 600,
    fontWeightBold: 700,

    h1: {
      fontSize: "1.4rem",
      fontWeight: "500",
      letterSpacing: "0em",
    },

    h2: {
      fontFamily: "Fira Sans",
      fontSize: "1.2rem",
      fontWeight: "600",
      lineHeight: "1.333",
      letterSpacing: "0em",
    },

    h3: {
      fontSize: "1.067rem",
      fontWeight: "500",
      lineHeight: "1.067",
      letterSpacing: "0em",
    },

    h4: {
      fontSize: "1rem",
      fontWeight: "500",
      letterSpacing: "0em",
    },

    h5: {
      fontSize: "0.933rem",
      fontWeight: "600",
      lineHeight: "1.067",
      letterSpacing: "0em",
    },
  },

  overrides: {
    MuiTooltip: {
      tooltip: {
        fontSize: "0.9rem",
        fontWeight: "fontWeightRegular",
        color: "black",
        backgroundColor: "#C7D7E1",
      },
    },

    MuiCssBaseline: {
      "@global": {
        "*, *::before, *::after": {
          transition: "none !important",
          animation: "none !important",
        },
      },
    },
  },

  props: {
    // Name of the component ⚛️
    MuiButtonBase: {
      // The properties to apply
      disableRipple: true, // No more ripple, on the whole application 💣!
    },
  },
});

class App extends Component {
  render() {
    return (
      <BrowserRouter basename="/testaments-de-poilus">
        <MuiThemeProvider theme={theme}>
          <div className="App">
            <StylesProvider injectFirst>
              <Navbar />
              <div className="mainContainer">
                <Route exact path="/" component={Home} />
                <Route exact path="/accueil" component={Home} />
                <Route exact path="/recherche" component={Search} />
                <Route path="/news" component={News} />
                <Route path="/articles" component={Articles} />
                <Route path="/apropos" component={About} />
                <Route exact path="/testaments" component={Wills} />
                <Route exact path="/testateurs" component={Testators} />
                <Route exact path="/places" component={Places} />
                <Route exact path="/armees" component={Units} />
                <Route path="/testament" component={Will} />
                <Route path="/testateur" component={Testator} />
                <Route path="/place" component={Place} />
                <Route path="/armee" component={Unit} />
                <Route path="/home" component={Home} />
                <Route exact path="/login" component={LogRegister} />
                <Route exact path="/espace" component={MySpace} />
                <Route exact path="/espace/profile" component={Profile} />
                <Route
                  exact
                  path="/espace/panier"
                  component={MyFavoritesCart}
                />
                <Route path="/espace/cms" component={Manage} />
                <Route exact path="/espace/config" component={ConfigMail} />
                <Route path="/compare" component={Compare} />
                <Route exact path="/explore" component={Explore} />
                <Route exact path="/contact" component={Contact} />
                <Route exact path="/lostPassWord" component={LostPassWord} />
                <Route path="/reinitialiserMDP" component={ResetMDP} />
              </div>
              <Footer />
            </StylesProvider>
          </div>
        </MuiThemeProvider>
      </BrowserRouter>
    );
  }
}

export default App;
