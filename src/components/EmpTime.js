import React, { Component } from "react";
import {
    Button,
    Spinner,
    Card,
    CardBody,
    CardText,
    CardTitle,
    Table,
} from "reactstrap";
import queryString from "query-string";
import Axios from "axios";
import {
    buildStyles,
    CircularProgressbarWithChildren,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { easeQuadInOut } from "d3-ease";
import AnimatedProgressProvider from "./AnimatedProgressProvider";
import moment from "moment";

class EmpTime extends Component {
    constructor(props) {
        super(props);
        this.state = {
            code: "",
            access_token: "",
            type: null,
            refresh_token: "",
            result: [],
            totalDuration: 0,
            projects: [],
            durations: [],
            loadingDurations: true,
            userTime: "",
            timeExist: false,
            timeId: "",
        };
    }

    componentDidMount = async () => {
        let stor = localStorage.getItem("heaserWakatime");
        this.setState({ type: stor });
        let access_code = localStorage.getItem("heaserWakatimeAccess");
        let refresh_code = localStorage.getItem("heaserWakatimeRefresh");
        if (access_code === null) {
            const data = window.location.search;
            const parsed = queryString.parse(data);
            this.setState({ code: parsed.code });
            if (refresh_code === null) {
                Axios.post(`/wakatime/main-wakatime`, {
                    code: parsed.code,
                    type: "first",
                })
                    .then((result) => {
                        localStorage.setItem(
                            "heaserWakatimeAccess",
                            result.data.access_token
                        );
                        localStorage.setItem(
                            "heaserWakatimeRefresh",
                            result.data.refresh_token
                        );
                        this.setState({
                            access_token: result.data.access_token,
                            refresh_token: result.data.refresh_token,
                        });
                        window.location.reload();
                    })
                    .catch((err) => {
                        localStorage.removeItem("heaserWakatimeAccess");
                        localStorage.removeItem("heaserWakatimeRefresh");
                        this.setState({
                            type: null,
                            access_token: "",
                            refresh_token: "",
                        });
                        console.log(err);
                    });
            } else {
                Axios.post(`/wakatime/main-wakatime`, {
                    code: refresh_code,
                    type: "second",
                })
                    .then((result) => {
                        localStorage.setItem(
                            "heaserWakatimeAccess",
                            result.data.access_token
                        );
                        localStorage.setItem(
                            "heaserWakatimeRefresh",
                            result.data.refresh_token
                        );
                        this.setState({
                            access_token: result.data.access_token,
                            refresh_token: result.data.refresh_token,
                        });
                    })
                    .catch((err) => {
                        localStorage.removeItem("heaserWakatimeAccess");
                        localStorage.removeItem("heaserWakatimeRefresh");
                        this.setState({
                            type: null,
                            access_token: "",
                            refresh_token: "",
                        });
                        console.log(err);
                    });
            }
        } else {
            await Axios.get(`/wakatime/get-projects/${access_code}`)
                .then((result) => {
                    this.setState({
                        result: result.data.data,
                    });
                })
                .catch((err) => {
                    console.log(err);
                });

            await this.state.result.map((r) => {
                const temp = this.state.projects;
                if (temp.indexOf(r.project) < 0) {
                    temp.push(r.project);
                }
                this.setState({
                    totalDuration:
                        (this.state.totalDuration * 60 + r.duration) / 60,
                    projects: temp,
                });
            });

            if (this.state.projects.length > 0) {
                await this.state.projects.map(async (p) => {
                    const temp = this.state.durations;
                    const temp1 = {};
                    const data = this.state.result.filter((obj) => {
                        return obj.project === p;
                    });
                    var t = 0;
                    await data.map((d) => {
                        t = t + d.duration;
                    });
                    temp1["name"] = p;
                    temp1["time"] = t;
                    temp.push(temp1);
                    this.setState({
                        durations: temp,
                    });
                    this.setState({
                        loadingDurations: false,
                    });
                });
            }

            let timedata = await localStorage.getItem("heaserData");
            timedata = JSON.parse(timedata);
            Axios.post("/time/get-employee-time/" + timedata._id, {
                day: moment(new Date()).format("YYYY-MM-DD"),
            })
                .then((response) => {
                    if (response.data.data.length > 0) {
                        this.setState({
                            userTime: response.data.data[0].total_time,
                            timeExist: true,
                            timeId: response.data.data[0]._id,
                        });
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });

            await Axios.post("/time/get-employee-time/" + timedata._id, {
                day: moment(new Date()).format("YYYY-MM-DD"),
            })
                .then((response) => {
                    if (response.data.data.length > 0) {
                        this.setState({
                            userTime: response.data.data[0].total_time,
                            timeExist: true,
                            timeId: response.data.data[0]._id,
                        });
                    }
                    console.log(response);
                })
                .catch(function (error) {
                    console.log(error);
                });

            if (this.state.timeExist == true) {
                console.log("hello");

                await Axios.put(
                    "/time/update-time-for-employee/" + this.state.timeId,
                    {
                        total_time: this.state.totalDuration,
                    }
                )
                    .then((response) => {
                        console.log(response);
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            } else {
                await Axios.post(
                    "/time/create-time-for-employee/" + timedata._id,
                    {
                        day: moment(new Date()).format("YYYY-MM-DD"),
                        total_time: this.state.totalDuration,
                    }
                )
                    .then((response) => {
                        console.log(response);
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            }
            //  this.setState({
            //      userTime:this.state.userTime+=parseInt(((this.state.runningtime/1000)/60)),
            //      isRunning:false,
            //      runningtime:0

            //  })
        }
    };

    render() {
        let emoji;

        {
            if (this.state.totalDuration < 60) {
                emoji = "😐";
            } else if (this.state.totalDuration < 120) {
                emoji = "🙂";
            } else if (this.state.totalDuration < 180) {
                emoji = "😀";
            } else if (this.state.totalDuration < 240) {
                emoji = "😁";
            } else if (this.state.totalDuration < 300) {
                emoji = "😤";
            } else {
                emoji = "💪";
            }
        }

        const displayprojects = this.state.durations.map((d) => {
            return (
                <tr>
                    <td>{d.name}</td>
                    <td>{Math.ceil(d.time / 60)}</td>
                </tr>
            );
        });
        const display =
            this.state.loadingDurations == true ? (
                <Spinner color="info" />
            ) : (
                displayprojects
            );
        return this.state.type !== "first" ? (
            <Button
                style={{
                    backgroundColor: "#1976d2",
                    color: "white",
                    display: "block",
                    margin: "auto",
                }}
                onClick={(e) => {
                    e.preventDefault();
                    this.setState({ type: "first" });
                    localStorage.setItem("heaserWakatime", "first");
                    window.location.href =
                        "https://wakatime.com/oauth/authorize?client_id=TRCp0dKnVHWPc91II89xckEd&client_secret=sec_ulgjonFt5oGcIDeDJDZvABNfoqCEoiEuoGFjFgObeT28BZCmI8EFW3K5gfvRvgBkDtFcUpDSczsUPxQZ&redirect_uri=http://localhost:3000/task&scope=read_stats,email,read_logged_time,write_logged_time,read_orgs,read_private_leaderboards,write_private_leaderboards&response_type=code&name=HeaseR";
                }}
            >
                Login to Wakatime
            </Button>
        ) : (
            <div className="emptime">
                <AnimatedProgressProvider
                    valueStart={0}
                    valueEnd={
                        this.state.totalDuration != 0
                            ? (this.state.totalDuration / 360) * 100
                            : 0
                    }
                    duration={1.4}
                    easingFunction={easeQuadInOut}
                >
                    {(value) => {
                        const roundedValue = Math.round(value);
                        return (
                            <CircularProgressbarWithChildren
                                value={value}
                                text={
                                    `${Math.ceil(this.state.totalDuration)}m` +
                                    `${emoji}`
                                }
                                styles={buildStyles({ pathTransition: "none" })}
                            ></CircularProgressbarWithChildren>
                        );
                    }}
                </AnimatedProgressProvider>

                <br />
                <Card>
                    <CardBody>
                        <CardTitle tag="h5">Your working time</CardTitle>

                        <CardText>
                            <Table hover>
                                <tr>
                                    <th>Project</th>
                                    <th>Time(mins)</th>
                                </tr>
                                {display}
                            </Table>
                        </CardText>
                    </CardBody>
                </Card>
            </div>
        );
    }
}

export default EmpTime;
