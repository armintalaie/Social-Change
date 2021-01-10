import logo from "./logo.svg";
import "./App.css";
import React from "react";
import { Component } from "react";
import { Alert } from "reactstrap";

// component imports
import Navbar from "./components/navbar";

function App() {
    return (
        <div className="App">
            <div>
                <Navbar />
                <Alert color="primary">
                    This is a primary alert — check it out!
                </Alert>
            </div>
        </div>
    );
}

export default App;
