import React, { Component } from "react";
import axios from "axios";
import {
    Spinner,
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Form,
    FormGroup,
    Input,
    Label,
} from "reactstrap";
import Header from "../components/Header";
import { AuthContext } from "../Context/auth";

export class WelcomeKit extends Component {
    static contextType = AuthContext;
    constructor(props) {
        super(props);
        this.state = {
            employees: [],
            loading: true,
            isCreateModalOpen: false,
            isUpdateModalOpen: false,
            id: "",
            empname: "",
            item: "",
            status: "",
            orgid: "",
            welcomeKit: [],
        };
    }

    componentDidMount = () => {
        let data = localStorage.getItem("heaserData");
        data = JSON.parse(data);

        axios
            .get(`/welcome/get-organization-welcome/${data._id}`)
            .then((response) => {
                this.setState({
                    employees: response.data.data,
                    loading: false,
                });
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    toggleCreateModal = () => {
        this.setState({
            isCreateModalOpen: !this.state.isCreateModalOpen,
        });
    };

    toggleUpdateModal = () => {
        this.setState({
            isUpdateModalOpen: !this.state.isUpdateModalOpen,
        });
    };

    handleInputChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({
            [name]: value,
        });
    };
    onCreate = async () => {
        axios
            .post("/welcome/create-welcome-kit", {
                employee: this.state.id,
                organization: this.context.userId,
                status: this.state.status,
                type: this.state.item,
            })
            .then((response) => {
                const data = [...this.state.employees];
                data.push({ ...response.data.data });
                this.setState({ employees: data });
                this.toggleCreateModal();
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    onUpdate = () => {
        axios
            .put(`/welcome/update-welcome-kit/${this.state.id}`, {
                is_delivered: this.state.status === "Delivered" ? true : false,
                status: this.state.status,
            })
            .then((response) => {
                const data = [...this.state.employees];
                const idx = data.findIndex(
                    (item) => item._id === this.state.id
                );
                data[idx].status = this.state.status;
                this.setState({ employees: data });
                this.toggleUpdateModal();
            })
            .catch(function (error) {
                console.log(error);
            });
    };
    render() {
        const displaylist = this.state.employees.map((e) => {
            return (
                <div>
                    <div className="row" style={{ margin: "0px" }}>
                        <div className="col-md-2">
                            <p
                                style={{
                                    color: "#1976d2",
                                    cursor: "pointer",
                                }}
                                onClick={() => {
                                    this.props.history.push(
                                        `/employee/${e._id}`
                                    );
                                }}
                            >
                                {e.employee.name}
                            </p>
                        </div>
                        <div className="col-md-2">
                            <p>{e.status}</p>
                        </div>
                        <div className="col-md-2">
                            <p>{e.type}</p>
                        </div>
                        <div className="col-md-3">
                            <Button
                                id={e.employee._id}
                                style={{
                                    backgroundColor: "#1976d2",
                                    color: "white",
                                }}
                                onClick={async () => {
                                    await this.setState({
                                        id: e.employee._id,
                                    });
                                    this.toggleCreateModal();
                                }}
                            >
                                Create
                            </Button>
                        </div>

                        <div className="col-md-3">
                            <Button
                                id={e._id}
                                style={{
                                    backgroundColor: "#1976d2",
                                    color: "white",
                                }}
                                onClick={async () => {
                                    await this.setState({
                                        id: e._id,
                                    });
                                    this.toggleUpdateModal();
                                }}
                            >
                                Update
                            </Button>
                        </div>
                    </div>
                    <hr style={{ border: "1px dotted black" }} />
                </div>
            );
        });
        const displaycheck =
            this.state.employees.length === 0 ? (
                <p>You have no registered employees..!!</p>
            ) : (
                displaylist
            );
        const display =
            this.state.loading === true ? (
                <Spinner color="info" />
            ) : (
                displaycheck
            );

        return (
            <>
                <Header />
                <div className="container empview">
                    <Modal
                        isOpen={this.state.isCreateModalOpen}
                        toggle={this.toggleCreateModal}
                    >
                        <ModalHeader toggle={this.toggleCreateModal}>
                            Create welcome kit
                        </ModalHeader>

                        <ModalBody>
                            <Form>
                                <FormGroup>
                                    <Label>Item</Label>
                                    <Input
                                        type="text"
                                        name="item"
                                        onChange={this.handleInputChange}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="exampleSelect">Status</Label>
                                    <Input
                                        type="select"
                                        name="status"
                                        id="exampleSelect"
                                        onChange={this.handleInputChange}
                                    >
                                        <option>-</option>
                                        <option>Processing</option>
                                        <option>In transit</option>
                                        <option>Delivered</option>
                                    </Input>
                                </FormGroup>
                            </Form>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onClick={this.onCreate}>
                                Submit
                            </Button>{" "}
                        </ModalFooter>
                    </Modal>

                    <Modal
                        isOpen={this.state.isUpdateModalOpen}
                        toggle={this.toggleUpdateModal}
                    >
                        <ModalHeader toggle={this.toggleUpdateModal}>
                            Update status
                        </ModalHeader>

                        <ModalBody>
                            <Form>
                                <FormGroup>
                                    <Label for="exampleSelect">Status</Label>
                                    <Input
                                        type="select"
                                        name="status"
                                        id="exampleSelect"
                                        onChange={this.handleInputChange}
                                    >
                                        <option>-</option>
                                        <option>Processing</option>
                                        <option>In transit</option>
                                        <option>Delivered</option>
                                    </Input>
                                </FormGroup>
                            </Form>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onClick={this.onUpdate}>
                                Submit
                            </Button>{" "}
                        </ModalFooter>
                    </Modal>

                    <h2>Onboarding Portal</h2>
                    <div className="row" style={{ margin: "0px" }}>
                        <div className="col-md-2">
                            <p style={{ fontWeight: "bold" }}>Name</p>
                        </div>
                        <div className="col-md-2">
                            <p style={{ fontWeight: "bold" }}>Item</p>
                        </div>
                        <div className="col-md-2">
                            <p style={{ fontWeight: "bold" }}>Status</p>
                        </div>
                    </div>
                    {display}
                </div>
            </>
        );
    }
}

export default WelcomeKit;
