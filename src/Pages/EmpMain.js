import React, { Component } from "react";
import WelcomeModal from "../components/WelcomeModal";
import EmpTasks from "../components/EmpTasks";
import { CardBody, Card, Button } from "reactstrap";
import moment from "moment";
import EmpTodos from "../components/EmpTodos";
import Header from "../components/Header";
import { BsFillChatFill } from "react-icons/bs";
import EmpTime from "../components/EmpTime";
import { AuthContext } from "../Context/auth";

export class EmpMain extends Component {
    static contextType = AuthContext;
    constructor(props) {
        super(props);
        this.state = {
            isWelModalOpen: false,
            datetime: new Date(),
            chatBotOpen: false,
        };
    }

    toggleChatBot = () => {
        this.setState({ chatBotOpen: !this.state.chatBotOpen });
    };

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
                            <EmpTasks />
                        </div>
                        <div className="col-md-4">
                            <EmpTodos />
                        </div>
                        <div className="col-md-4">
                            <EmpTime />
                        </div>
                       
                    </div>
                </div>
                {this.state.chatBotOpen ? (
                    <iframe
                        title="chatbot"
                        src="https://chatbotnlp.herokuapp.com/"
                        style={{ height: "1000px", width: "100%" }}
                    />
                ) : null}
                <Button
                    onClick={this.toggleChatBot}
                    style={{
                        height: 70,
                        width: 70,
                        borderRadius: 50,
                        position: "fixed",
                        bottom: 10,
                        right: 10,
                        backgroundColor: "#1876D2",
                    }}
                >
                    <BsFillChatFill size={30} />
                </Button>
            </>
        );
    }
}

export default EmpMain;
