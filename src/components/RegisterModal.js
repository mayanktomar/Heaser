import React, { Component } from "react";
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Form,
    FormGroup,
    Label,
    Input,
    Spinner,
    Nav,
    NavItem,
    NavLink,
    TabContent,
    TabPane,
} from "reactstrap";
import axios from "axios";
import classnames from "classnames";
import LoginModal from "./LoginModal";

export class RegisterModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            email: "",
            website: [],
            phone: "",
            address: "",
            country: "",
            pincode: "",
            rolestring: "",
            roles: [],
            loader: false,
            isAlertOpen: false,
            activeTab: "1",
        };
    }

    toggleTabs = (tab) => {
        if (this.state.activeTab !== tab) {
            this.setState({ activeTab: tab });
        }
    };

    handleRegChange = (event) => {
        const target = event.target;
        const name = target.name;
        const value = target.value;
        this.setState({
            [name]: value,
        });
    };

    onRegSubmit = () => {
        this.setState({ loader: true });
        const rolesarray = this.state.rolestring.split(",");
        axios
            .post("org/create-organization", {
                name: this.state.name,
                roles: rolesarray,
                address: this.state.address,
                country: this.state.country,
                pincode: this.state.pincode,
                phone: this.state.phone,
                email: this.state.email,
                website: this.state.website,
            })
            .then((response) => {
                this.setState({ loader: false, activeTab: "1" });
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    toggleAlert = () => {
        this.setState({
            isAlertOpen: !this.state.isAlertOpen,
        });
    };
    render() {
        return (
            <div>
                <Modal
                    isOpen={this.props.isOrgModalOpen}
                    toggle={this.props.toggleOrgModal}
                >
                    <ModalHeader toggle={this.props.toggleOrgModal}>
                        Organization
                    </ModalHeader>
                    <ModalBody>
                        <Nav tabs>
                            <NavItem>
                                <NavLink
                                    className={classnames({
                                        active: this.state.activeTab === "1",
                                    })}
                                    onClick={() => {
                                        this.toggleTabs("1");
                                    }}
                                >
                                    Login
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                    className={classnames({
                                        active: this.state.activeTab === "2",
                                    })}
                                    onClick={() => {
                                        this.toggleTabs("2");
                                    }}
                                >
                                    Sign Up
                                </NavLink>
                            </NavItem>
                        </Nav>
                        <TabContent activeTab={this.state.activeTab}>
                            <TabPane tabId="1">
                                <LoginModal
                                    {...this.props}
                                    toggleOrgModal={this.props.toggleOrgModal}
                                />
                            </TabPane>
                            <TabPane tabId="2">
                                <Form style={{ marginTop: 20 }}>
                                    <FormGroup>
                                        <Label for="exampleText">Name</Label>
                                        <Input
                                            type="text"
                                            name="name"
                                            id="exampleText"
                                            placeholder="name of organization"
                                            onChange={this.handleRegChange}
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="exampleEmail">Email</Label>
                                        <Input
                                            type="email"
                                            name="email"
                                            id="exampleEmail"
                                            placeholder="email of organization"
                                            onChange={this.handleRegChange}
                                        />
                                    </FormGroup>

                                    <FormGroup>
                                        <Label for="exampleText">Website</Label>
                                        <Input
                                            type="text"
                                            name="website"
                                            id="exampleText"
                                            placeholder="Website of organization"
                                            onChange={this.handleRegChange}
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="exampleText">
                                            Contact Number
                                        </Label>
                                        <Input
                                            type="text"
                                            name="phone"
                                            id="exampleText"
                                            placeholder="Contact number"
                                            onChange={this.handleRegChange}
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="exampleText">Address</Label>
                                        <Input
                                            type="text"
                                            name="address"
                                            id="exampleText"
                                            placeholder="Address"
                                            onChange={this.handleRegChange}
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="exampleText">Country</Label>
                                        <Input
                                            type="text"
                                            name="country"
                                            id="exampleText"
                                            placeholder="Country"
                                            onChange={this.handleRegChange}
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="exampleText">Pincode</Label>
                                        <Input
                                            type="text"
                                            name="pincode"
                                            id="exampleText"
                                            placeholder="Pincode"
                                            onChange={this.handleRegChange}
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="exampleText">
                                            Roles (heirarchy wise from top to
                                            bottom separated with ','
                                        </Label>
                                        <Input
                                            type="text"
                                            name="rolestring"
                                            id="exampleText"
                                            placeholder="Eg: employee,manager,senior manager,executive"
                                            onChange={this.handleRegChange}
                                        />
                                    </FormGroup>
                                </Form>
                                <ModalFooter>
                                    <Button onClick={this.onRegSubmit}>
                                        {this.state.loader ? (
                                            <Spinner />
                                        ) : (
                                            "Register"
                                        )}{" "}
                                    </Button>
                                </ModalFooter>
                            </TabPane>
                        </TabContent>
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}

export default RegisterModal;
