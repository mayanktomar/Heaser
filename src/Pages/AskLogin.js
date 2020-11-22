import React, { Component } from "react";
import { Button, Row, Col } from "reactstrap";
import vector1 from "../assets/vector1.svg";
import RegisterModal from "../components/RegisterModal";
import LoginModal from "../components/LoginModal";
import Header from "../components/Header";
import EmployeeLoginModal from "../components/EmployeeLogin";

export class AskLogin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOrgModalOpen: false,
            isEmpModalOpen: false,
        };
    }

    toggleOrgModal = () => {
        this.setState({
            isOrgModalOpen: !this.state.isOrgModalOpen,
        });
    };

    toggleEmpModal = () => {
        this.setState({
            isEmpModalOpen: !this.state.isEmpModalOpen,
        });
    };

    render() {
        return (
            <div>
                <Header {...this.props} />
                <div class="container loginhead">
                    <div class="row">
                        <div class="col-md-6">
                            <h1 style={{ width: "80%", fontFamily: "Roboto" }}>
                                Explore new way of work
                            </h1>
                            <p style={{ fontSize: 17, fontFamily: "Roboto" }}>
                                Login/Signup to continue
                            </p>
                            <br />
                            <Button
                                style={{
                                    backgroundColor: "#1976d2",
                                    width: "75%",
                                    color: "white",
                                }}
                                onClick={this.toggleOrgModal}
                            >
                                Organization Login
                            </Button>
                            <br />
                            <br />

                            <Button
                                style={{
                                    backgroundColor: "#1976d2",
                                    width: "75%",
                                    color: "white",
                                }}
                                onClick={this.toggleEmpModal}
                            >
                                Employee Login
                            </Button>
                        </div>
                        <div class="col-md-6" style={{ paddingBottom: 30 }}>
                            <img src={vector1} />
                        </div>
                    </div>
                </div>
                <RegisterModal
                    {...this.props}
                    isOrgModalOpen={this.state.isOrgModalOpen}
                    toggleOrgModal={this.toggleOrgModal}
                />
                <EmployeeLoginModal
                    {...this.props}
                    isEmpModalOpen={this.state.isEmpModalOpen}
                    toggleEmpModal={this.toggleEmpModal}
                />
            </div>
        );
    }
}

export default AskLogin;
