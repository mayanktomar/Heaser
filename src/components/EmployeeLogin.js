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
    Alert,
    Spinner,
} from "reactstrap";
import { AuthContext } from "../Context/auth";

export class EmployeeLoginModal extends Component {
    static contextType = AuthContext;
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            loader: false,
            error: false,
            message: "",
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
            username: this.state.username,
            password: this.state.password,
        };

        Axios.post(`/employee/login`, params)
            .then((result) => {
                this.context.setData(result.data.user);
                this.context.setToken(result.data.token);
                this.context.setUserId(result.data.userId);
                this.context.setType("employee");
                localStorage.setItem("heaserToken", result.data.token);
                localStorage.setItem("userId", result.data.userId);
                localStorage.setItem("heaserType", "employee");
                localStorage.setItem(
                    "heaserData",
                    JSON.stringify(result.data.user)
                );
                this.setState({ loader: false });
                this.props.toggleEmpModal();
                this.props.history.push("/task");
            })
            .catch((err) => {
                this.setState({
                    error: true,
                    message: err.response.data.error,
                    loader: false,
                });
            });
    };

    render() {
        return (
            <div>
                <Modal
                    isOpen={this.props.isEmpModalOpen}
                    toggle={this.props.toggleEmpModal}
                >
                    <ModalHeader toggle={this.props.toggleEmpModal}>
                        Employee
                    </ModalHeader>
                    <ModalBody>
                        <Form>
                            <FormGroup>
                                <Label for="exampleEmail">
                                    Employee Username
                                </Label>
                                <Input
                                    type="text"
                                    name="username"
                                    id="exampleUsername"
                                    placeholder="Enter your Username"
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
                        {this.state.error ? (
                            <Alert color="danger">{this.state.message}</Alert>
                        ) : null}
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={this.onLogSubmit}>
                            {this.state.loader ? <Spinner /> : "Login"}
                        </Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

export default EmployeeLoginModal;
