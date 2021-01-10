import React, { Component } from "react";

export default class LandingPage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <div className="bg-info p-3i card">
                    <div className="float-left">hi</div>
                    <div className="float-right">
                        <h4 className="text-center text-secondary">
                            Welcome to Momentum
                        </h4>
                        <h2 className="text-center w-3">
                            Anyone has the power to create momentum
                        </h2>
                    </div>
                </div>
            </div>
        );
    }
}
