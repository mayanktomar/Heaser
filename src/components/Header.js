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
} from "reactstrap";
import { IoMdLogOut, IoIosNotifications, IoMdShare } from "react-icons/io";
import { AuthContext } from "../Context/auth";

export class Header extends Component {
    static contextType = AuthContext;
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
        };
    }

    toggle = () => {
        this.setState({
            isOpen: !this.state.isOpen,
        });
    };

    logoutHandler = () => {
        this.context.setData(null);
        localStorage.setItem("heaserToken", null);
        this.context.setToken(null);
        localStorage.setItem("userId", null);
        this.context.setUserId(null);
        localStorage.setItem("heaserType", null);
        this.context.setType(null);
        this.props.history.push("/");
    };

    render() {
        return (
            <div>
                <Navbar dark expand="md">
                    <NavbarBrand href="/">Heaser</NavbarBrand>
                    <NavbarToggler onClick={this.toggle} />
                    <Collapse isOpen={this.state.isOpen} navbar>
                        <Nav className="mr-auto" navbar>
                            <NavItem>
                                <NavLink href="/components/">
                                    Components
                                </NavLink>
                            </NavItem>
                        </Nav>
                        {/* <NavbarText>Simple Text</NavbarText> */}
                        {this.context.token !== null &&
                        this.context.token !== "null" ? (
                            <IoMdLogOut
                                style={{ cursor: "pointer", color: "white" }}
                                size={22}
                                onClick={this.logoutHandler}
                            />
                        ) : null}
                    </Collapse>
                </Navbar>
            </div>
        );
    }
}

export default Header;
