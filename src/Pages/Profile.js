import Axios from "axios";
import React, { Component } from "react";
import {
    Card,
    CardBody,
    CardTitle,
    Button,
    Table,
    Badge,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Form,
    FormGroup,
    Label,
    Input,
} from "reactstrap";
import { AuthContext } from "../Context/auth";
import axios from "axios";
import Header from "../components/Header";
import Dummy from "../assets/dummy.jpg";
import moment from "moment";

export class Profile extends Component {
    static contextType = AuthContext;
    constructor(props) {
        super(props);
        this.state = {
            data: {
                isModalOpen: false,
            },
        };
    }

    getUserId = async () => {
        let data = await localStorage.getItem("userId");
        Axios.get(`/employee/get-specific-employee/${data}`).then((result) => {
            this.setState({
                data: result.data.employee,
            });
            console.log(result.data);
        });
    };

    componentDidMount() {
        this.getUserId();
    }

    onchange = (event) => {
        const target = event.target;
        const name = target.name;
        const value = target.value;
        console.log(name);
        this.setState({
            [name]: value,
        });
    };

    onSubmit = () => {
        const temp = {};
        if (this.state.updatedheight !== "") {
            temp["height"] = this.state.updatedheight;
        }
        if (this.state.updatedweight !== "") {
            temp["weight"] = this.state.updatedweight;
        }
        if (this.state.updatedage !== "") {
            temp["age"] = this.state.updatedage;
        }

        axios
            .put("/user/update-user/" + this.context.userId, temp)
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
        this.toggleModal();
    };

    toggleModal = () => {
        this.setState({
            isModalOpen: !this.state.isModalOpen,
        });
    };

    render() {
        let badge;
        if (this.state.data.points <= 10) {
            badge = "primary";
        } else if (
            this.state.data.points >= 10 &&
            this.state.data.points <= 30
        ) {
            badge = "info";
        } else if (
            this.state.data.points >= 31 &&
            this.state.data.points <= 60
        ) {
            badge = "success";
        } else if (
            this.state.data.points >= 60 &&
            this.state.data.points <= 85
        ) {
            badge = "warning";
        } else {
            badge = "danger";
        }
        return (
            <>
                <Header {...this.props} />
                <div style={{ height: "88vh", paddingTop: 30 }}>
                    <Modal
                        isOpen={this.state.isModalOpen}
                        toggle={this.toggleModal}
                    >
                        <ModalHeader toggle={this.toggleModal}>
                            Update Profile
                        </ModalHeader>
                        <ModalBody>
                            <Form>
                                <FormGroup>
                                    <Label for="exampleText">New weight</Label>
                                    <Input
                                        type="text"
                                        name="updatedweight"
                                        id="exampleText"
                                        onChange={this.onchange}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="exampleText">New height</Label>
                                    <Input
                                        type="text"
                                        name="updatedheight"
                                        id="exampleText"
                                        onChange={this.onchange}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="exampleText">New age</Label>
                                    <Input
                                        type="text"
                                        name="updatedage"
                                        id="exampleText"
                                        onChange={this.onchange}
                                    />
                                </FormGroup>
                            </Form>
                        </ModalBody>
                        <ModalFooter>
                            {/* <Button color="primary" onClick={toggle}>Do Something</Button>{' '}
                    <Button color="secondary" onClick={toggle}>Cancel</Button> */}
                            <Button onClick={this.onSubmit}>Update</Button>
                        </ModalFooter>
                    </Modal>
                    <div className="container profile">
                        <h1 className="headings" style={{ paddingBottom: 50 }}>
                            Profile
                        </h1>
                        <img
                            src={Dummy}
                            alt="profile"
                            style={{
                                borderRadius: 50,
                                height: 100,
                                width: 100,
                                display: "block",
                                marginLeft: "auto",
                                marginRight: "auto",
                                marginBottom: 10,
                            }}
                        />
                        <h6 style={{ textAlign: "center", fontSize: 30 }}>
                            {this.state.data.name}
                        </h6>
                        <h6 style={{ textAlign: "center", color: "grey" }}>
                            {this.state.data.email}
                        </h6>
                        <h6 style={{ textAlign: "center" }}>
                            Gender -{" "}
                            {this.state.data.gender === "M" ? "Male" : "Female"}
                        </h6>
                        <h6 style={{ textAlign: "center" }}>
                            DOB -{" "}
                            {moment(this.state.data.dob).format("DD MMM, YYYY")}
                        </h6>

                        <Button
                            style={{
                                backgroundColor: "#3e98c7",
                                color: "black",
                                display: "block",
                                margin: "auto",
                            }}
                            onClick={this.toggleModal}
                        >
                            Update Profile
                        </Button>
                        <div className="row">
                            {/* <div className="col-md-6">
                                <Card>
                                    <CardBody>
                                        <CardTitle
                                            style={{
                                                color: "#ffe02c",
                                                fontSize: 20,
                                                fontWeight: "bold",
                                            }}
                                        >
                                            Starting Weight
                                        </CardTitle>
                                        <hr />
                                        <h2>{this.state.weight[0]} Kgs</h2>
                                    </CardBody>
                                </Card>
                            </div>
                            <div className="col-md-6">
                                <Card>
                                    <CardBody>
                                        <CardTitle
                                            style={{
                                                color: "#ffe02c",
                                                fontSize: 20,
                                                fontWeight: "bold",
                                            }}
                                        >
                                            Current Weight
                                        </CardTitle>
                                        <hr />
                                        <h2>
                                            {
                                                this.state.weight[
                                                    this.state.weight.length - 1
                                                ]
                                            }{" "}
                                            Kgs
                                        </h2>
                                    </CardBody>
                                </Card>
                            </div>
                            <div className="col-md-6">
                                <Card>
                                    <CardBody>
                                        <CardTitle
                                            style={{
                                                color: "#ffe02c",
                                                fontSize: 20,
                                                fontWeight: "bold",
                                            }}
                                        >
                                            Height
                                        </CardTitle>
                                        <hr />
                                        <h2>{this.state.height[0]} feet</h2>
                                    </CardBody>
                                </Card>
                            </div>
                            <div className="col-md-6">
                                <Card>
                                    <CardBody>
                                        <CardTitle
                                            style={{
                                                color: "#ffe02c",
                                                fontSize: 20,
                                                fontWeight: "bold",
                                            }}
                                        >
                                            BMI
                                        </CardTitle>
                                        <hr />
                                        <h2>
                                            {(
                                                this.state.weight[0] /
                                                (this.state.height[0] *
                                                    this.state.height[0])
                                            ).toPrecision(4)}
                                        </h2>
                                    </CardBody>
                                </Card>
                            </div> */}
                        </div>

                        <Table>
                            {/* <tbody>
                        <tr>
                        <th scope="row">1</th>
                        <td>Name</td>
                        <td>Otto</td>
                        </tr>
                        <tr>
                        <th scope="row">2</th>
                        <td>Jacob</td>
                        <td>Thornton</td>
                        <td>@fat</td>
                        </tr>
                        <tr>
                        <th scope="row">3</th>
                        <td>Larry</td>
                        <td>the Bird</td>
                        <td>@twitter</td>
                        </tr>
                        <tr>
                        <th scope="row">3</th>
                        <td>Larry</td>
                        <td>the Bird</td>
                        <td>@twitter</td>
                        </tr>
                        
                    </tbody> */}
                        </Table>
                    </div>
                </div>
            </>
        );
    }
}

export default Profile;
