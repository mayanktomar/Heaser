import React, { Component } from "react";
import {
    Card,
    CardBody,
    CardText,
    CardTitle,
    Button,
    Spinner,
} from "reactstrap";
import Header from "../components/Header";
import AnnouncementModal from "../components/AnnouncementModal";
import { AuthContext } from "../Context/auth";
import moment from "moment";
import axios from "axios";
import Onboarding from "./Onboarding";

export class OrgDashboard extends Component {
    static contextType = AuthContext;
    constructor(props) {
        super(props);
        this.state = {
            isAnnounceModalOpen: false,
            datetime: new Date(),
            employees: [],
            isOnboardingModalOpen: false,
            lat: undefined,
            lon: undefined,
            city: undefined,
            temperatureC: undefined,
            temperatureF: undefined,
            icon: undefined,
            sunrise: undefined,
            sunset: undefined,
            errorMessage: undefined,
            loadingweather: true,
            new: [],
        };
    }
    getPosition = () => {
        return new Promise(function (resolve, reject) {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });
    };
    getWeather = async (latitude, longitude) => {
        const api_call = await fetch(
            `//api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${"f86adc19a202147fe436dd02e2985abb"}&units=metric`
        );
        const data = await api_call.json();
        this.setState({
            lat: latitude,
            lon: longitude,
            city: data.name,
            temperatureC: Math.round(data.main.temp),
            temperatureF: Math.round(data.main.temp * 1.8 + 32),
            icon: data.weather[0].icon,
            sunrise: moment.unix(data.sys.sunrise).format("hh:mm a"),
            sunset: moment.unix(data.sys.sunset).format("hh:mm a"),
            loadingweather: false,
        });
    };
    componentDidMount = () => {
        setInterval(() => {
            this.setState({
                datetime: new Date(),
            });
        }, 1000);

        let data = localStorage.getItem("heaserData");
        data = JSON.parse(data);

        axios
            .get("/employee/get-employess-by-org-id/" + data._id)
            .then((response) => {
                const data = response.data.data.filter(
                    (item) => item.new === true
                );
                this.setState({
                    employees: response.data.data,
                    new: data,
                });
            })
            .catch(function (error) {
                console.log(error);
            });

        this.getPosition()
            .then((position) => {
                this.getWeather(
                    position.coords.latitude,
                    position.coords.longitude
                );
            })
            .catch((err) => console.log(err.message));
    };
    toggleAnnounceModal = () => {
        this.setState({ isAnnounceModalOpen: !this.state.isAnnounceModalOpen });
    };
    toggleOnboardingModal = () => {
        this.setState({
            isOnboardingModalOpen: !this.state.isOnboardingModalOpen,
        });
    };

    render() {
        let greeting;
        if (moment(this.state.datetime).format("H") < 12) {
            greeting = "Good morning";
        } else if (moment(this.state.datetime).format("H") < 17) {
            greeting = "Good afternoon";
        } else {
            greeting = "Good evening";
        }
        return (
            <>
                <Header {...this.props} />
                <div className="container orgdash">
                    {/* <h2>{greeting }{"👋 "}{this.context.data.name}</h2>
                    <br /> */}
                    {/* <div className="row" style={{width:'100%'}}>
                    <img src={bg1}/>
                </div> */}
                    <h2>DASHBOARD</h2>
                    <div className="row">
                        <div className="col-md-12">
                            <Card className="timecard">
                                <CardBody style={{ padding: "0.5em" }}>
                                    <div
                                        className="row"
                                        style={{
                                            padding: "0px",
                                            margin: "0px",
                                        }}
                                    >
                                        <div
                                            className="col-md-9"
                                            style={{
                                                display: "flex",
                                                flexDirection: "row",
                                                justifyContent: "center",
                                                alignItems: "center",
                                            }}
                                        >
                                            <span
                                                style={{ fontWeight: "bold" }}
                                            >
                                                {greeting}{" "}
                                                {this.context.data &&
                                                    this.context.data.name}
                                                {"👋"}. It is{" "}
                                                {moment(
                                                    this.state.datetime
                                                ).format(
                                                    "MMMM Do YYYY, h:mm:ss a"
                                                )}
                                            </span>
                                        </div>
                                        <div
                                            className="col-md-3"
                                            style={{
                                                display: "flex",
                                                flexDirection: "row",
                                                justifyContent: "center",
                                                alignItems: "center",
                                            }}
                                        >
                                            {this.state.loadingweather ? (
                                                <Spinner color="info" />
                                            ) : (
                                                <>
                                                    <img
                                                        alt="icon-weather"
                                                        src={
                                                            "http://openweathermap.org/img/w/" +
                                                            this.state.icon +
                                                            ".png"
                                                        }
                                                        style={{
                                                            verticalAlign:
                                                                "top",
                                                        }}
                                                    />
                                                    <span
                                                        style={{
                                                            marginTop: "0px",
                                                            fontWeight: "bold",
                                                        }}
                                                    >
                                                        {
                                                            this.state
                                                                .temperatureC
                                                        }
                                                        °C
                                                    </span>
                                                </>
                                            )}
                                            {/* {this.state.icon?<img src={"http://openweathermap.org/img/w/"+this.state.icon+".png"} style={{verticalAlign:'top'}}/>:null}
                                    <span style={{marginTop:'0px',fontWeight:'bold'}}>{this.state.temperatureC}degrees</span> */}
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </div>

                        <div className="col-md-4">
                            <Card>
                                <CardBody>
                                    <CardTitle>Number of employees</CardTitle>
                                    <CardText>
                                        <h4 style={{ color: "#FCB529" }}>
                                            {this.state.employees.length}
                                        </h4>
                                    </CardText>
                                </CardBody>
                            </Card>
                        </div>
                        <div className="col-md-4">
                            <Card>
                                <CardBody>
                                    <CardTitle>
                                        Number of new employees
                                    </CardTitle>
                                    <CardText>
                                        <h4 style={{ color: "#A8EB2D" }}>
                                            {this.state.new.length}
                                        </h4>
                                    </CardText>
                                </CardBody>
                            </Card>
                        </div>
                        <div className="col-md-4">
                            <Card>
                                <CardBody>
                                    <CardTitle>
                                        Number of announcements
                                    </CardTitle>
                                    <CardText>
                                        <h4 style={{ color: "#F64B4E" }}>6</h4>
                                    </CardText>
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
                                            onClick={() => {
                                                this.props.history.push(
                                                    "/add-employee"
                                                );
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
                                onClick={() => {
                                    this.props.history.push("/view-employees");
                                }}
                            >
                                View/Modify Employees
                            </Button>
                            <br />
                            <Button
                                onClick={this.toggleAnnounceModal}
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
                                onClick={this.toggleOnboardingModal}
                                style={{
                                    backgroundColor: "#1976d2",
                                    width: "75%",
                                    display: "block",
                                    margin: "auto",
                                    color: "white",
                                }}
                            >
                                Upload resources
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
                                onClick={() => {
                                    this.props.history.push(
                                        "/onboarding-portal"
                                    );
                                }}
                            >
                                Onboarding Portal
                            </Button>
                        </div>
                    </div>
                </div>
                <AnnouncementModal
                    isAnnounceModalOpen={this.state.isAnnounceModalOpen}
                    toggleAnnounceModal={this.toggleAnnounceModal}
                />
                <Onboarding
                    isOnboardingModalOpen={this.state.isOnboardingModalOpen}
                    toggleOnboardingModal={this.toggleOnboardingModal}
                    employees={this.state.employees}
                />
            </>
        );
    }
}

export default OrgDashboard;
