import React from "react";
import axios from "axios";
//import "./styles.css";


import NavBar from "./components/NavBar";
import CommunityPage from "./components/CommunityPage";

function App() {
  return (
    <div>
      <NavBar></NavBar>
      <CommunityPage></CommunityPage>
    </div>
  );
}

export default App;
