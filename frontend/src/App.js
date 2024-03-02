import "./App.css";
import Header from "./component/layout/Header/Header.js";
import {  Route, Routes } from "react-router-dom";
import webfont from "webfontloader";
import React from "react";
import Footer from "./component/layout/Footer/Footer.js";
import Home from "./component/Home/Home.js";

function App() {
  React.useEffect(() => {
    webfont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"],
      },
    });
  }, []);
  return (
    <div className="main-layout">
      <Header />
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
      <div>
      <Footer />
      </div>
    </div>
  );
}

export default App;
