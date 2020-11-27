import React, { Component } from "react";
import empleave from "../assets/empleave.svg";
import {
    Button,
    Modal,
    ModalBody,
    ModalHeader,
    Form,
    FormGroup,
    Label,
    Input,
    Spinner,
    Card,
    CardTitle,
    CardBody,
    Table,
    CardText,
} from "reactstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import axios from "axios";
import Header from "../components/Header";
import { AuthContext } from "../Context/auth";
import { AiOutlineCheckCircle } from "react-icons/ai";

export class EmpLeave extends Component {
    static contextType = AuthContext;
    constructor(props) {
        super(props);
        this.state = {
            isModalOpen: false,
            startDate: new Date(),
            endDate: new Date(),
            reason: "",
            female_leave_reason: "",
            leaves: [],
            loading: true,
            is_female: false,
        };
    }

    componentDidMount = () => {
        let type = localStorage.getItem("heaserType");
        let userId = localStorage.getItem("userId");
        if (type === "employee") {
            axios
                .get(`/leave/get-employee-leaves/${userId}`)
                .then((response) => {
                    this.setState({
                        leaves: response.data.leaves,
                        loading: false,
                    });
                })
                .catch(function (error) {
                    console.log(error);
                });
        } else {
            axios
                .get(`/leave/get-organization-leaves/${userId}`)
                .then((response) => {
                    this.setState({
                        leaves: response.data.leaves,
                        loading: false,
                    });
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    };

    toggleModal = () => {
        this.setState({
            isModalOpen: !this.state.isModalOpen,
        });
    };

    handleStartDateChange = (date) => {
        this.setState({
            startDate: date,
        });
    };

    handleEndDateChange = (date) => {
        this.setState({
            endDate: date,
        });
    };

    handleInputChange = (event) => {
        const target = event.target;
        const name = target.name;
        const value = target.value;
        this.setState({
            [name]: value,
        });
    };

    leaveAcceptHandler = async (id) => {
        await axios
            .put("/leave/accept-leave", {
                orgId: this.context.userId,
                leaveId: id,
            })
            .then((response) => {
                const data = [...this.state.leaves];

                const index = data.findIndex((item) => item._id === id);

                data.splice(index, 1);

                this.setState({
                    leaves: data,
                });
            })
            .catch(function (error) {
                alert("error");
            });
    };

    onSubmit = () => {
        axios
            .post("/leave/create-leave", {
                employee: this.context.userId,
                startDate: moment(this.state.startDate).format("YYYY-MM-DD"),
                endDate: moment(this.state.endDate).format("YYYY-MM-DD"),
                reason: this.state.reason,
                is_female: this.state.is_female,
                female_leave_reason: this.state.female_leave_reason,
            })
            .then((response) => {
                const data = [...this.state.leaves];
                data.push({
                    employee: this.context.userId,
                    startDate: moment(this.state.startDate).format(
                        "YYYY-MM-DD"
                    ),
                    endDate: moment(this.state.endDate).format("YYYY-MM-DD"),
                    reason: this.state.reason,
                    is_female: this.state.is_female,
                    female_leave_reason: this.state.female_leave_reason,
                    _id: response.data.leave._id,
                });
                this.setState({ leaves: data });
                this.toggleModal();
            })
            .catch(function (error) {
                alert(error);
            });
    };

    render() {
        const displayleavesEmployees = this.state.leaves.map((l) => {
            const temp =
                l.accepted === true ? "Accepted" : "Waiting for approval";
            const styling =
                l.accepted === true
                    ? { color: "#338333" }
                    : { color: "#e2c10a" };
            return (
                <tr>
                    <td>{l.reason}</td>
                    <td>{moment(l.startDate).format("MMM Do YY")}</td>
                    <td>{moment(l.endDate).format("MMM Do YY")}</td>
                    {/* <td>{l.accepted==true?"Accepted":"Waiting for approval"}</td> */}
                    <td style={styling}>{temp}</td>
                </tr>
            );
        });

        const displayleavesOrg = this.state.leaves.map((l) => {
            return (
                <tr>
                    <td>{l.reason}</td>
                    <td>{moment(l.startDate).format("MMM Do YY")}</td>
                    <td>{moment(l.endDate).format("MMM Do YY")}</td>
                    {/* <td>{l.accepted==true?"Accepted":"Waiting for approval"}</td> */}
                    <td>
                        <Button
                            id={l._id}
                            style={{
                                background: "transparent",
                                paddingTop: "0px",
                            }}
                            onClick={() => {
                                this.leaveAcceptHandler(l._id);
                            }}
                        >
                            <AiOutlineCheckCircle
                                style={{ color: "green", paddingTop: 5 }}
                            />
                        </Button>
                    </td>
                </tr>
            );
        });

        const displaycheck =
            this.state.leaves.length === 0 ? (
                <p>No applied leaves</p>
            ) : this.context.userId === "employee" ? (
                displayleavesEmployees
            ) : (
                displayleavesOrg
            );

        const display =
            this.state.loading === true ? (
                <Spinner color="info" />
            ) : (
                displaycheck
            );

        return (
            <>
                <Header {...this.props} />
                <div className="container empleave">
                    <br />
                    <h2>Leave Management Portal</h2>
                    <Modal
                        isOpen={this.state.isModalOpen}
                        toggle={this.toggleModal}
                    >
                        <ModalHeader toggle={this.toggleModal}>
                            Apply for leave
                        </ModalHeader>
                        <ModalBody>
                            <Form>
                                <FormGroup>
                                    <Label for="quantity">
                                        Start Date of leave
                                    </Label>
                                    {"   "}
                                    <DatePicker
                                        selected={this.state.startDate}
                                        onChange={(date) =>
                                            this.handleStartDateChange(date)
                                        }
                                        minDetail="decade"
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="quantity">
                                        End Date of leave
                                    </Label>
                                    {"   "}
                                    <DatePicker
                                        selected={this.state.endDate}
                                        onChange={(date) =>
                                            this.handleEndDateChange(date)
                                        }
                                        minDetail="decade"
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="quantity">Reason</Label>
                                    <Input
                                        type="text"
                                        name="reason"
                                        id=""
                                        onChange={this.handleInputChange}
                                    />
                                </FormGroup>
                                <FormGroup check>
                                    <Label check>
                                        <Input
                                            type="checkbox"
                                            checked={this.state.is_female}
                                            onClick={(e) => {
                                                this.setState({
                                                    is_female: !this.state
                                                        .is_female,
                                                });
                                            }}
                                        />{" "}
                                        Is Female
                                    </Label>
                                </FormGroup>
                                {this.state.is_female ? (
                                    <FormGroup>
                                        <Label for="quantity">
                                            Special Reason for female employees
                                            (Optional)
                                        </Label>
                                        <Input
                                            type="text"
                                            name="female_leave_reason"
                                            id=""
                                            onChange={this.handleInputChange}
                                        />
                                    </FormGroup>
                                ) : null}
                            </Form>
                            <Button
                                style={{
                                    width: "50%",
                                    backgroundColor: "#1976d2",
                                    color: "white",
                                    display: "block",
                                    margin: "auto",
                                }}
                                onClick={this.onSubmit}
                            >
                                Submit
                            </Button>
                        </ModalBody>
                    </Modal>
                    <div className="row">
                        <div className="col-md-6">
                            {this.context.type === "employee" ? (
                                <>
                                    <Button
                                        style={{
                                            width: "50%",
                                            backgroundColor: "#1976d2",
                                            color: "white",
                                            display: "block",
                                            margin: "auto",
                                        }}
                                        onClick={this.toggleModal}
                                    >
                                        Apply for a leave
                                    </Button>
                                    <br /> <br />
                                    <Card>
                                        <CardBody>
                                            <CardTitle tag="h5">
                                                Requested leaves
                                            </CardTitle>
                                            <CardText>
                                                <Table hover>
                                                    <tr>
                                                        <th>Reason</th>
                                                        <th>From</th>
                                                        <th>To</th>
                                                        <th>Status</th>
                                                    </tr>
                                                    {this.state.leaves.length >
                                                    0 ? (
                                                        displayleavesEmployees
                                                    ) : (
                                                        <p
                                                            style={{
                                                                textAlign:
                                                                    "center",
                                                                marginTop: 10,
                                                                color: "grey",
                                                            }}
                                                        >
                                                            No Leaves requested
                                                        </p>
                                                    )}
                                                </Table>
                                            </CardText>
                                        </CardBody>
                                    </Card>
                                </>
                            ) : (
                                <>
                                    <Card>
                                        <CardBody>
                                            <CardTitle tag="h5">
                                                Requested leaves
                                            </CardTitle>
                                            <CardText>
                                                <Table hover>
                                                    <tr>
                                                        <th>Reason</th>
                                                        <th>From</th>
                                                        <th>To</th>
                                                        <th>Status</th>
                                                    </tr>
                                                    {this.state.leaves.length >
                                                    0 ? (
                                                        displayleavesOrg
                                                    ) : (
                                                        <p
                                                            style={{
                                                                textAlign:
                                                                    "center",
                                                                marginTop: 10,
                                                                color: "grey",
                                                            }}
                                                        >
                                                            No Leaves requested
                                                        </p>
                                                    )}
                                                </Table>
                                            </CardText>
                                        </CardBody>
                                    </Card>
                                </>
                            )}
                        </div>
                        <div className="col-md-6">
                            <img alt="empleave" src={empleave} />
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default EmpLeave;
