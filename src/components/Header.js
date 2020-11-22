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
    Badge,
} from "reactstrap";
import { IoMdLogOut, IoIosNotifications, IoMdShare } from "react-icons/io";
import { AuthContext } from "../Context/auth";
import Axios from "axios";
import NotificationModal from "./NotificationModal";

export class Header extends Component {
    static contextType = AuthContext;
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            isNotModalOpen: false,
            data: [],
            count: 0,
        };
    }

    toggle = () => {
        this.setState({
            isOpen: !this.state.isOpen,
        });
    };

    getEmployeeNotification = async () => {
        let data = await localStorage.getItem("userId");
        data = data === "null" ? JSON.parse(data) : data;

        if (data) {
            Axios.get(`/notification/get-employee-notification/${data}`).then(
                (result) => {
                    this.setState({
                        data: result.data.data,
                        count: result.data.data.length,
                    });
                }
            );
        }
    };

    getOrganizationNotification = async () => {
        let data = await localStorage.getItem("userId");
        data = data === "null" ? JSON.parse(data) : data;

        if (data) {
            Axios.get(
                `/notification/get-organization-notification/${data}`
            ).then((result) => {
                this.setState({
                    data: result.data.data,
                    count: result.data.data.length,
                });
            });
        }
    };

    async componentDidMount() {
        let data = await localStorage.getItem("heaserType");
        if (data === "employee") this.getEmployeeNotification();
        else this.getOrganizationNotification();
    }

    toggleNotModal = () => {
        this.setState({ isNotModalOpen: !this.state.isNotModalOpen });
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
            <>
                <div>
                    <Navbar dark expand="md">
                        <NavbarBrand
                            href={
                                this.context.token !== null &&
                                this.context.token !== "null"
                                    ? "/organization"
                                    : "/"
                            }
                            style={{ fontWeight: "bold" }}
                        >
                            HeaseR
                        </NavbarBrand>
                        <NavbarToggler onClick={this.toggle} />
                        <Collapse isOpen={this.state.isOpen} navbar>
                            <Nav className="mr-auto" navbar>
                                <NavItem>
                                    <NavLink></NavLink>
                                </NavItem>
                            </Nav>

                            {this.context.token !== null &&
                            this.context.token !== "null" ? (
                                <>
                                    <Nav navbar>
                                        <NavItem>
                                            <NavLink href="/workspace">
                                                Workspace
                                            </NavLink>
                                        </NavItem>
                                    </Nav>
                                    <Nav navbar>
                                        <NavItem>
                                            <div
                                                onClick={this.toggleNotModal}
                                                style={{
                                                    marginLeft: 20,
                                                    marginRight: 20,
                                                }}
                                            >
                                                <IoIosNotifications
                                                    style={{ color: "white" }}
                                                    size={25}
                                                />{" "}
                                                <Badge color="warning">
                                                    {this.state.count}
                                                </Badge>
                                            </div>
                                        </NavItem>
                                    </Nav>
                                    <IoMdLogOut
                                        style={{
                                            cursor: "pointer",
                                            color: "white",
                                        }}
                                        size={22}
                                        onClick={this.logoutHandler}
                                    />
                                </>
                            ) : null}
                        </Collapse>
                    </Navbar>
                </div>
                <NotificationModal
                    {...this.props}
                    data={this.state.data}
                    isNotModalOpen={this.state.isNotModalOpen}
                    toggleNotModal={this.toggleNotModal}
                />
            </>
        );
    }
}

export default Header;
