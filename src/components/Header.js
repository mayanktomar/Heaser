import React, { Component } from "react";
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    Badge,
} from "reactstrap";
import { IoMdLogOut, IoIosNotifications } from "react-icons/io";
import { AuthContext } from "../Context/auth";
import Axios from "axios";
import NotificationModal from "./NotificationModal";
import { CgProfile } from "react-icons/cg";

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

    getEmployeeNotification = async (userId) => {
        await Axios.get(
            `/notification/get-employee-notification/${userId}`
        ).then((result) => {
            const data = result.data.data.filter((item) => item.seen === false);
            this.setState({
                data: result.data.data,
                count: data.length,
            });
        });
    };

    markNotificationSeen = async (id) => {
        await Axios.put(`/notification/mark-notification-seen/${id}`).then(
            (result) => {
                const data = [...this.state.data];
                const idx = data.findIndex((item) => item._id === id);
                data[idx].seen = true;
                this.setState({ data: data, count: this.state.count - 1 });
            }
        );
    };

    getOrganizationNotification = async (userId) => {
        await Axios.get(
            `/notification/get-organization-notification/${userId}`
        ).then((result) => {
            const data = result.data.data.filter((item) => item.seen === false);
            this.setState({
                data: result.data.data,
                count: data.length,
            });
        });
    };

    async componentDidMount() {
        let data = await localStorage.getItem("heaserType");
        let userId = await localStorage.getItem("userId");
        userId = userId === "null" ? JSON.parse(userId) : userId;
        if (userId) {
            if (data == "employee") this.getEmployeeNotification(userId);
            else {
                this.getOrganizationNotification(userId);
            }
        }
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
                                    ? this.context.type === "organization"
                                        ? "/organization"
                                        : "/task"
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
                                        <NavItem
                                            onClick={() => {
                                                this.props.history.push(
                                                    "/workspace"
                                                );
                                            }}
                                        >
                                            <NavLink
                                                style={{
                                                    color: "white",
                                                    cursor: "pointer",
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                Workspace
                                            </NavLink>
                                        </NavItem>
                                        <NavItem
                                            onClick={() => {
                                                this.props.history.push(
                                                    "/leave"
                                                );
                                            }}
                                        >
                                            <NavLink
                                                style={{
                                                    color: "white",
                                                    cursor: "pointer",
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                Leave
                                            </NavLink>
                                        </NavItem>
                                        <NavItem
                                            onClick={() => {
                                                this.props.history.push(
                                                    "/announcement"
                                                );
                                            }}
                                        >
                                            <NavLink
                                                style={{
                                                    color: "white",
                                                    cursor: "pointer",
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                Announcements
                                            </NavLink>
                                        </NavItem>
                                        {this.context.type === "employee" ? (
                                            <>
                                                <NavItem
                                                    onClick={() => {
                                                        this.props.history.push(
                                                            "/personality"
                                                        );
                                                    }}
                                                >
                                                    <NavLink
                                                        style={{
                                                            color: "white",
                                                            cursor: "pointer",
                                                            fontWeight: "bold",
                                                        }}
                                                    >
                                                        Personality
                                                    </NavLink>
                                                </NavItem>
                                                <NavItem
                                                    onClick={() => {
                                                        this.props.history.push(
                                                            "/resources"
                                                        );
                                                    }}
                                                >
                                                    <NavLink
                                                        style={{
                                                            color: "white",
                                                            cursor: "pointer",
                                                            fontWeight: "bold",
                                                        }}
                                                    >
                                                        Training
                                                    </NavLink>
                                                </NavItem>

                                                <NavItem>
                                                    <div
                                                        style={{
                                                            cursor: "pointer",
                                                            color: "white",
                                                            marginTop: 7,
                                                            display: "flex",
                                                            flexDirection:
                                                                "row",
                                                            justifyContent:
                                                                "center",
                                                            marginLeft: 5,
                                                            marginRight: 5,
                                                        }}
                                                        onClick={() => {
                                                            this.props.history.push(
                                                                "/profile"
                                                            );
                                                        }}
                                                    >
                                                        <CgProfile
                                                            size={22}
                                                            style={{
                                                                marginTop: 1,
                                                            }}
                                                        />
                                                    </div>
                                                </NavItem>
                                            </>
                                        ) : null}
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
                    count={this.state.count}
                    isNotModalOpen={this.state.isNotModalOpen}
                    toggleNotModal={this.toggleNotModal}
                    markNotificationSeen={this.markNotificationSeen}
                />
            </>
        );
    }
}

export default Header;
