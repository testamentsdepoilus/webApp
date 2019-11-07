import React from "react";
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

function App() {
  return (
    <BrowserRouter basename="/testaments-de-poilus">
      <div className="App">
        <Navbar />
        <Route exact path="/" component={Search} />
        <Route exact path="/search" component={Search} />
        <Route path="/news" component={News} />
        <Route path="/articles" component={Articles} />
        <Route exact path="/about" component={About} />
        <Route exact path="/wills" component={Wills} />
        <Route exact path="/profile" component={Profile} />
        <Route exact path="/testators" component={Testators} />
        <Route exact path="/places" component={Places} />
        <Route path="/will" component={Will} />
        <Route path="/home" component={Home} />
        <Route exact path="/login" component={LogRegister} />
        <Route path="/espace" component={MySpace} />
      </div>
    </BrowserRouter>
  );
}

export default App;
