import Axios from "axios";
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
    FormTex,
    Spinner,
} from "reactstrap";
import { AuthContext } from "../Context/auth";

export class LoginModal extends Component {
    static contextType = AuthContext;
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            loader: false,
        };
    }

    handleLogChange = (event) => {
        const target = event.target;
        const name = target.name;
        const value = target.value;
        this.setState({
            [name]: value,
        });
    };

    onLogSubmit = (e) => {
        e.preventDefault();
        this.setState({ loader: true });

        const params = {
            email: this.state.email,
            password: this.state.password,
        };
        Axios.post(`/org/login-organization`, params)
            .then((result) => {
                this.context.setData(result.data.user);
                this.context.setToken(result.data.token);
                this.context.setUserId(result.data.userId);
                this.context.setType("Organization");
                localStorage.setItem("heaserToken", result.data.token);
                localStorage.setItem("userId", result.data.userId);
                localStorage.setItem("heaserType", "Organization");
                this.setState({ loader: false });
                this.props.toggleLogModal();
                this.props.history.push("/organization");
            })
            .catch((err) => {
                console.log(err);
            });
    };

    render() {
        return (
            <div>
                <Modal
                    isOpen={this.props.isLogModalOpen}
                    toggle={this.props.toggleLogModal}
                >
                    <ModalHeader toggle={this.props.toggleLogModal}>
                        Login
                    </ModalHeader>
                    <ModalBody>
                        <Form>
                            <FormGroup>
                                <Label for="exampleEmail">
                                    Organization Email
                                </Label>
                                <Input
                                    type="email"
                                    name="email"
                                    id="exampleEmail"
                                    placeholder="Enter your email"
                                    onChange={this.handleLogChange}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="examplePassword">Password</Label>
                                <Input
                                    type="password"
                                    name="password"
                                    id="examplePassword"
                                    placeholder="Enter your password"
                                    onChange={this.handleLogChange}
                                />
                            </FormGroup>
                        </Form>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={this.onLogSubmit}>Login</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

export default LoginModal;
