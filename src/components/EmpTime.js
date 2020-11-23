import React, { Component } from "react";
import { Button } from "reactstrap";
import queryString from "query-string";
import Axios from "axios";

class EmpTime extends Component {
    constructor(props) {
        super(props);
        this.state = {
            code: "",
            access_token: "",
            type: null,
            refresh_token: "",
        };
    }

    componentDidMount() {
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
            Axios.get(`/wakatime/get-projects/${access_code}`)
                .then((result) => {
                    console.log(result.data);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }

    render() {
        return this.state.type !== "first" ? (
            <Button
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
        ) : null;
    }
}

export default EmpTime;
