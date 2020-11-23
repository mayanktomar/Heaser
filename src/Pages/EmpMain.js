import React, { Component } from "react";
import WelcomeModal from "../components/WelcomeModal";
import EmpTasks from "../components/EmpTasks";
import { CardBody, Card } from "reactstrap";
import moment from "moment";
import EmpTodos from "../components/EmpTodos";
import Header from "../components/Header";

export class EmpMain extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isWelModalOpen: false,
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
            <>
                <Header {...this.props} />
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
                        <div className="col-md-4">
                            <EmpTasks
                                userId={"5fb51f168c4cd2001797be6e"}
                                organizationId={"5faf8c6860c04b0017a86356"}
                            />
                        </div>
                        <div className="col-md-4">
                            <EmpTodos userId={"5fb51f168c4cd2001797be6e"} />
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default EmpMain;
