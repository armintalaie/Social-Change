import React from "react";
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
import "../styles/NavBar.scss";

function NavBar({ props }) {
  return (
    <div className="navbar--wrapper">
      <Navbar className="navbar__options" color="light" light>
        <NavbarBrand href="/">MOMENTUM</NavbarBrand>
        <Nav className="navbar__items" navbar>
          <NavItem>
            <NavLink href="/community/">Communities</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/movement/">Movements</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/ambassador/">Ambassadors</NavLink>
          </NavItem>
        </Nav>
        <div className="navbar__btn">
          <Button color="primary">Sign Up</Button>
          <Button color="info">My Profile</Button>
        </div>
      </Navbar>
    </div>
  );
}

export default NavBar;
