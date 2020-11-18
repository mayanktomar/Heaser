import React, { Component } from 'react';
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
    NavbarText
  } from 'reactstrap';

export class Header extends Component {
    constructor(props)
    {
        super(props);
        this.state={
          isOpen:false
        }
    }

    toggle=()=>{
      this.setState({
          isOpen:!this.state.isOpen
      })
  }

    render() {
        return (
            <div>
              <Navbar dark expand="md">
              <NavbarBrand href="/">Heaser</NavbarBrand>
              <NavbarToggler onClick={this.toggle} />
              <Collapse isOpen={this.state.isOpen} navbar>
                <Nav className="mr-auto" navbar>
                  <NavItem>
                    <NavLink href="/components/">Components</NavLink>
                  </NavItem>
                 
                </Nav>
                <NavbarText>Simple Text</NavbarText>
              </Collapse>
            </Navbar>
            </div>
        )
    }
}

export default Header
