import React, { Component } from "react";
import WelcomeModal from "./WelcomeModal";
import EmpTasks from "./EmpTasks";
import { CardBody, Card } from "reactstrap";
import moment from "moment";

export class EmpMain extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isWelModalOpen: true,
            datetime: new Date(),
        };
    }

    componentDidMount = () => {
        setInterval(() => {
            this.setState({
                datetime: new Date(),
            });
        }, 1000);
    };
    toggleWelModal = () => {
        this.setState({
            isWelModalOpen: false,
        });
    };
    render() {
        return (
            <div className="container empmain">
                <WelcomeModal
                    isWelModalOpen={this.state.isWelModalOpen}
                    toggleWelModal={this.toggleWelModal}
                />
                <div className="row">
                    <div className="col-md-12">
                        <Card className="timecard">
                            <CardBody>
                                <h6 style={{ fontWeight: "bold" }}>
                                    It is{" "}
                                    {moment(this.state.datetime).format(
                                        "MMMM Do YYYY, h:mm:ss a"
                                    )}
                                </h6>
                            </CardBody>
                        </Card>
                    </div>
                    <div className="col-md-6">
                        <EmpTasks userId={"5fb51f168c4cd2001797be6e"} />
                    </div>
                </div>
            </div>
        );
    }
}

export default EmpMain;
