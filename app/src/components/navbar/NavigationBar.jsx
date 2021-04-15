import React from 'react';
import {Link} from "react-router-dom";
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

const NavigationBar = () => <Navbar bg="dark" variant="dark">
  <Navbar.Brand as={Link} to="/">New Eden Analytics</Navbar.Brand>
  <Navbar.Toggle aria-controls="navbar" />
  <Navbar.Collapse id="navbar">
    <Nav>
      <Nav.Link as={Link} to="/blueprint">Blueprint Explorer</Nav.Link>
    </Nav>
  </Navbar.Collapse>
</Navbar>;

export default NavigationBar;
