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
} from "reactstrap";
import "../styles/NavBar.scss";

function NavBar({ props }) {
  return (
    <div>
      <Navbar color="light" light expand="md">
        <Nav className="mr-auto" navbar>
          <NavbarBrand href="/">MOMENTUM</NavbarBrand>
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
      </Navbar>
    </div>
  );
}

export default NavBar;
