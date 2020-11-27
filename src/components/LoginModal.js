import Axios from "axios";
import React, { Component } from "react";
import {
    Button,
    ModalFooter,
    Form,
    FormGroup,
    Label,
    Input,
    Spinner,
    Alert,
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
            email: this.state.email,
            password: this.state.password,
        };
        Axios.post(`/org/login-organization`, params)
            .then((result) => {
                this.context.setData(result.data.user);
                this.context.setToken(result.data.token);
                this.context.setUserId(result.data.userId);
                this.context.setType("organization");
                localStorage.setItem("heaserToken", result.data.token);
                localStorage.setItem("userId", result.data.userId);
                localStorage.setItem("heaserType", "organization");
                localStorage.setItem(
                    "heaserData",
                    JSON.stringify(result.data.user)
                );
                this.setState({ loader: false });
                this.props.toggleOrgModal();
                this.props.history.push("/organization");
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
            <div style={{ marginTop: 20 }}>
                <Form>
                    <FormGroup>
                        <Label for="exampleEmail">Organization Email</Label>
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
                {this.state.error ? (
                    <Alert color="danger">{this.state.message}</Alert>
                ) : null}
                <ModalFooter>
                    <Button onClick={this.onLogSubmit}>
                        {this.state.loader ? <Spinner /> : "Login"}{" "}
                    </Button>
                </ModalFooter>
            </div>
        );
    }
}

export default LoginModal;
