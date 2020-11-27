import React, { Component } from "react";
import {
    Card,
    CardBody,
    CardText,
    CardTitle,
    Button,
    Form,
    FormGroup,
    Label,
    Input,
    Spinner,
} from "reactstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import emp1 from "../assets/emp1.svg";
import Header from "../components/Header";
import { AuthContext } from "../Context/auth";
import Axios from "axios";
import { TAGS } from "./Tags";

export class AddEmployee extends Component {
    static contextType = AuthContext;
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            email: "",
            gender: "",
            dob: new Date(),
            loader: false,
            tag: "",
        };
    }

    handleRegChange = (event) => {
        const target = event.target;
        const name = target.name;
        const value = target.value;
        if (name === "gender") {
            const id = target.id;
            this.setState({
                gender: id,
            });
        } else {
            this.setState({
                [name]: value,
            });
        }
    };
    handleDateChange = (date) => {
        this.setState({
            dob: date,
        });
    };
    onSubmit = () => {
        const params = {
            name: this.state.name,
            email: this.state.email,
            organization: this.context.userId,
            dob: moment(this.state.dob).format("YYYY-MM-DD"),
            gender: this.state.gender,
            tags: [this.state.tag],
        };
        this.setState({ loader: true });
        Axios.post("/employee/create-employee", params)
            .then((result) => {
                this.setState({ loader: false });
                alert("Employee added successfully!");
            })
            .catch((err) => {
                alert(err.response.data.error);
                this.setState({ loader: false });
            });
    };
    render() {
        const dropdownoptions = TAGS.map((t) => {
            return <option>{t}</option>;
        });
        return (
            <>
                <Header {...this.props} />
                <div className="container empadd">
                    <h2>Employee Addition Portal</h2>
                    <div className="row">
                        <div className="col-md-6">
                            <Card>
                                <CardBody>
                                    <CardTitle>Enter the details</CardTitle>
                                    <CardText>
                                        <Form>
                                            <FormGroup>
                                                <Label
                                                    for="exampleText"
                                                    style={{
                                                        fontWeight: "bold",
                                                    }}
                                                >
                                                    Name
                                                </Label>
                                                <Input
                                                    type="text"
                                                    name="name"
                                                    id="exampleText"
                                                    placeholder="name of employee"
                                                    onChange={
                                                        this.handleRegChange
                                                    }
                                                />
                                            </FormGroup>
                                            <FormGroup>
                                                <Label
                                                    for="exampleEmail"
                                                    style={{
                                                        fontWeight: "bold",
                                                    }}
                                                >
                                                    Email
                                                </Label>
                                                <Input
                                                    type="email"
                                                    name="email"
                                                    id="exampleEmail"
                                                    placeholder="email of employee"
                                                    onChange={
                                                        this.handleRegChange
                                                    }
                                                />
                                            </FormGroup>
                                            <FormGroup tag="fieldset">
                                                <Label
                                                    style={{
                                                        fontWeight: "bold",
                                                    }}
                                                >
                                                    Gender
                                                </Label>
                                                <FormGroup check>
                                                    <Label check>
                                                        <Input
                                                            type="radio"
                                                            name="gender"
                                                            id="M"
                                                            onChange={
                                                                this
                                                                    .handleRegChange
                                                            }
                                                        />{" "}
                                                        Male
                                                    </Label>
                                                </FormGroup>
                                                <FormGroup check>
                                                    <Label check>
                                                        <Input
                                                            type="radio"
                                                            name="gender"
                                                            id="F"
                                                            onChange={
                                                                this
                                                                    .handleRegChange
                                                            }
                                                        />{" "}
                                                        Female
                                                    </Label>
                                                </FormGroup>
                                                <FormGroup check>
                                                    <Label check>
                                                        <Input
                                                            type="radio"
                                                            name="gender"
                                                            id="O"
                                                            onChange={
                                                                this
                                                                    .handleRegChange
                                                            }
                                                        />{" "}
                                                        Other
                                                    </Label>
                                                </FormGroup>
                                            </FormGroup>
                                            <FormGroup>
                                                <Label
                                                    style={{
                                                        fontWeight: "bold",
                                                    }}
                                                >
                                                    Date Of Birth
                                                </Label>{" "}
                                                <br />
                                                <DatePicker
                                                    selected={this.state.dob}
                                                    onChange={(date) =>
                                                        this.handleDateChange(
                                                            date
                                                        )
                                                    }
                                                    minDetail="decade"
                                                />
                                            </FormGroup>
                                            <FormGroup>
                                                <Label for="exampleSelect">
                                                    Department
                                                </Label>
                                                <Input
                                                    type="select"
                                                    name="tag"
                                                    id="exampleSelect"
                                                    onChange={
                                                        this.handleRegChange
                                                    }
                                                >
                                                    <option>-</option>
                                                    {dropdownoptions}
                                                </Input>
                                            </FormGroup>
                                        </Form>
                                    </CardText>
                                    <Button
                                        style={{
                                            backgroundColor: "#1976d2",
                                            display: "block",
                                            margin: "auto",
                                            color: "white",
                                        }}
                                        onClick={this.onSubmit}
                                    >
                                        {this.state.loader ? (
                                            <Spinner />
                                        ) : (
                                            "Add your employee"
                                        )}
                                    </Button>
                                </CardBody>
                            </Card>
                        </div>

                        <div className="col-md-6">
                            <img src={emp1} alt="employees" />
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default AddEmployee;
