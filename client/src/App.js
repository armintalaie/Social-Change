import logo from "./logo.svg";
import "./App.css";
import React from "react";
import { Component } from "react";
import { Alert } from "reactstrap";

// component imports
import Navbar from "./components/navbar";
import SignUpPage from "./components/signup";
import LandingPage from "./components/landingpage";

function App() {
    return (
        <div className="App">
            <div>
                <Navbar />
                <Alert color="primary">
                    This is a primary alert — check it out!
                </Alert>
                <SignUpPage />
                <LandingPage />
            </div>
        </div>
    );
}

export default App;
