import React, { Component } from "react";
import bg1 from "../assets/bg1.jpg";
import { Card, CardBody, CardText, CardTitle, Button } from "reactstrap";
import Header from "../components/Header";

export class OrgDashboard extends Component {
    render() {
        return (
            <>
                <Header {...this.props} />
                <div className="container orgdash">
                    <h2>Welcome, xyz</h2>
                    <br />
                    {/* <div className="row" style={{width:'100%'}}>
                    <img src={bg1}/>
                </div> */}

                    <div className="row">
                        <div className="col-md-4">
                            <Card>
                                <CardBody>
                                    <CardTitle>Number of employees</CardTitle>
                                    <CardText>12</CardText>
                                </CardBody>
                            </Card>
                        </div>
                        <div className="col-md-4">
                            <Card>
                                <CardBody>
                                    <CardTitle>Number of employees</CardTitle>
                                    <CardText>12</CardText>
                                </CardBody>
                            </Card>
                        </div>
                        <div className="col-md-4">
                            <Card>
                                <CardBody>
                                    <CardTitle>Number of employees</CardTitle>
                                    <CardText>12</CardText>
                                </CardBody>
                            </Card>
                        </div>
                    </div>

                    <div
                        className="row"
                        style={{ marginLeft: "12.5%", marginRight: "12.5%" }}
                    >
                        <div className="col-md-6">
                            <Card>
                                <CardBody>
                                    <CardTitle>Add an employee</CardTitle>
                                    <CardText style={{ textAlign: "left" }}>
                                        <ul>
                                            <li>
                                                Add your employee giving
                                                relevant details.
                                            </li>
                                            <li>
                                                An email is sent to the added
                                                employee with username and
                                                password.
                                            </li>
                                            <li>
                                                Employee can sign in with given
                                                credentials.
                                            </li>
                                        </ul>
                                        <Button
                                            style={{
                                                backgroundColor: "#1976d2",
                                                display: "block",
                                                margin: "auto",
                                                color: "white",
                                            }}
                                        >
                                            Add your employee
                                        </Button>
                                    </CardText>
                                </CardBody>
                            </Card>
                        </div>

                        <div className="col-md-6">
                            <br />
                            <Button
                                style={{
                                    backgroundColor: "#1976d2",
                                    width: "75%",
                                    display: "block",
                                    margin: "auto",
                                    color: "white",
                                }}
                            >
                                View/Modify Employees
                            </Button>
                            <br />
                            <Button
                                style={{
                                    backgroundColor: "#1976d2",
                                    width: "75%",
                                    display: "block",
                                    margin: "auto",
                                    color: "white",
                                }}
                            >
                                Make an announcement
                            </Button>
                            <br />
                            <Button
                                style={{
                                    backgroundColor: "#1976d2",
                                    width: "75%",
                                    display: "block",
                                    margin: "auto",
                                    color: "white",
                                }}
                            >
                                Onboarding portal
                            </Button>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default OrgDashboard;
