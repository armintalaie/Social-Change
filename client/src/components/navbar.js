import React, { Component } from "react";
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    NavbarText,
    Button,
} from "reactstrap";
import { Link } from "react-router-dom";

export default class NavbarLoggedIn extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Navbar color="light" light expand="md">
                    <NavbarBrand>
                        <img
                            src="https://lh3.googleusercontent.com/proxy/uGSQ0xNV8RCJ5rNkba5lb-TLSF94P3pQq2JS-athV9cvKuqnuFCEE0sVl-SKd-PzaG6ZqOgdeP7rgqEb0fMEOvKIdU4qHU0NbQCgjbwJ7zVbjeQu"
                            width="50px"
                        />
                    </NavbarBrand>
                    <NavbarToggler />
                    <Collapse navbar>
                        <Nav className="mr-auto" navbar>
                            <NavItem>
                                <NavLink href="#">Dashboard</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="#">Communities</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="#">Movements</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="#">Ambassadors</NavLink>
                            </NavItem>
                        </Nav>
                    </Collapse>
                    <Button color="primary" className="m-1">
                        Sign In
                    </Button>
                    <Button color="primary" className="m-1">
                        Sign Up
                    </Button>
                </Navbar>
            </div>
        );
    }
}
