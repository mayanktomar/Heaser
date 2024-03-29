import React, { Component } from "react";
import axios from "axios";
import {
    Spinner,
    Card,
    CardText,
    CardBody,
    CardTitle,
    Button,
    Table,
    Modal,
    ModalBody,
    ModalHeader,
    Form,
    FormGroup,
    Label,
    Input,
    ModalFooter,
} from "reactstrap";
import { AiOutlineCheckCircle } from "react-icons/ai";
import {
    buildStyles,
    CircularProgressbarWithChildren,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { easeQuadInOut } from "d3-ease";
import AnimatedProgressProvider from "./AnimatedProgressProvider";
import moment from "moment";
import DateTimePicker from "react-datetime-picker";
import { AuthContext } from "../Context/auth";

export class EmpTodos extends Component {
    static contextType = AuthContext;
    constructor(props) {
        super(props);
        this.state = {
            todos: [],
            todoslength: 0,
            todoscomp: 0,
            loading: true,
            todoId: "",
            tasktitle: "",
            taskdesc: "",
            enddate: new Date(),
            isAllotModalOpen: false,
            checktodos: false,
        };
    }

    async componentDidMount() {
        let userId = await localStorage.getItem("userId");
        let type = await localStorage.getItem("heaserType");
        console.log(userId);
        if (type === "employee") {
            await axios
                .get("/task/get-employee-tasks/" + userId)
                .then((response) => {
                    this.setState({
                        todos: response.data.tasks,
                        loading: false,
                    });
                    this.findProgress();
                })
                .catch(function (error) {
                    console.log(error);
                });

            await this.state.todos.map((t) => {
                if (
                    t.from._id === t.to &&
                    moment(t.endDate).format("YYYY-MM-DD") ===
                        moment(new Date()).format("YYYY-MM-DD")
                ) {
                    this.setState({
                        todoslength: this.state.todoslength + 1,
                    });
                }
                if (
                    t.from._id === t.to &&
                    t.isCompleted === true &&
                    moment(t.endDate).format("YYYY-MM-DD") ===
                        moment(new Date()).format("YYYY-MM-DD")
                ) {
                    this.setState({
                        todoscomp: this.state.todoscomp + 1,
                    });
                }
            });
        }
    }

    toggleAllotModal = () => {
        this.setState({
            isAllotModalOpen: !this.state.isAllotModalOpen,
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
    onEndDateChange = (enddate) => this.setState({ enddate });

    onSubmit = async () => {
        await axios
            .post("/task/create-task", {
                from: this.context.userId,
                to: this.context.userId,
                heading: this.state.tasktitle,
                description: this.state.taskdesc,
                startDate: moment(new Date()).format("YYYY-MM-DD H:mm"),
                endDate: moment(this.state.enddate).format("YYYY-MM-DD H:mm"),
            })
            .then((response) => {
                const data = [...this.state.todos];
                data.push({
                    _id: response.data.task._id,
                    from: {
                        _id: this.context.userId,
                    },
                    to: this.context.userId,
                    heading: this.state.tasktitle,
                    description: this.state.taskdesc,
                    startDate: moment(new Date()).format("YYYY-MM-DD H:mm"),
                    endDate: moment(this.state.enddate).format(
                        "YYYY-MM-DD H:mm"
                    ),
                    isCompleted: false,
                });
                this.setState({
                    todos: data,
                    todoslength: this.state.todoslength + 1,
                });
            })

            .catch(function (error) {
                alert("error");
            });
        this.toggleAllotModal();
    };

    onDelete = async (event) => {
        const id = event.currentTarget.id;
        await axios
            .put("/task/mark-task-as-completed/" + id)
            .then((response) => {
                const data = [...this.state.todos];

                const index = data.findIndex((item) => item._id === id);

                data.splice(index, 1);

                this.setState({
                    todos: data,
                    todoscomp: this.state.todoscomp + 1,
                });
            })
            .catch(function (error) {
                alert("error");
            });
    };

    render() {
        const displaytasks = this.state.todos.map((t) => {
            if (
                t.from._id === t.to &&
                t.isCompleted === false &&
                moment(t.endDate).format("YYYY-MM-DD") ===
                    moment(new Date()).format("YYYY-MM-DD")
            ) {
                return (
                    <tr>
                        <td>{t.heading}</td>

                        <td>
                            <Button
                                id={t._id}
                                style={{
                                    background: "transparent",
                                    paddingTop: "0px",
                                    color: "black",
                                }}
                                onClick={this.onDelete}
                            >
                                <AiOutlineCheckCircle
                                    style={{ color: "green", paddingTop: 5 }}
                                />
                            </Button>
                        </td>
                    </tr>
                );
            }
            return <div></div>;
        });
        const display =
            this.state.loading === true ? (
                <Spinner color="info" />
            ) : (
                displaytasks
            );

        // const emoji=(Math.round((this.state.todoscomp/this.state.todoslength)*100<=50))?"🙂":"💪"
        let emoji;

        {
            if (
                Math.round(
                    (this.state.todoscomp / this.state.todoslength) * 100 <= 25
                )
            ) {
                emoji = "😐";
            } else if (
                Math.round(
                    (this.state.todoscomp / this.state.todoslength) * 100 <= 50
                )
            ) {
                emoji = "🙂";
            } else if (
                Math.round(
                    (this.state.todoscomp / this.state.todoslength) * 100 <= 75
                )
            ) {
                emoji = "😀";
            } else if (
                Math.round(
                    (this.state.todoscomp / this.state.todoslength) * 100 <= 99
                )
            ) {
                emoji = "😁";
            } else {
                emoji = "💪";
            }
        }
        return (
            <div className="emptodos">
                <Modal
                    isOpen={this.state.isAllotModalOpen}
                    toggle={this.toggleAllotModal}
                >
                    <ModalHeader toggle={this.toggleAllotModal}>
                        Allote task
                    </ModalHeader>
                    <ModalBody>
                        <Form>
                            <FormGroup>
                                <Label for="quantity">Task title</Label>
                                <Input
                                    type="text"
                                    name="tasktitle"
                                    id=""
                                    onChange={this.handleInputChange}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="quantity">Task description</Label>
                                <Input
                                    type="text"
                                    name="taskdesc"
                                    id=""
                                    onChange={this.handleInputChange}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label>End Time</Label>
                                {"   "}
                                <DateTimePicker
                                    onChange={this.onEndDateChange}
                                    value={this.state.enddate}
                                />
                            </FormGroup>
                        </Form>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            style={{
                                backgroundColor: "#3e98c7",
                                width: "25%",
                                color: "black",
                                display: "block",
                                margin: "auto",
                            }}
                            onClick={this.onSubmit}
                        >
                            Add
                        </Button>
                    </ModalFooter>
                </Modal>

                <AnimatedProgressProvider
                    valueStart={0}
                    valueEnd={
                        this.state.todoscomp !== this.state.todoslength
                            ? (this.state.todoscomp / this.state.todoslength) *
                              100
                            : 100
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
                                    `${
                                        this.state.todoslength !==
                                        this.state.todoscomp
                                            ? Math.round(
                                                  (this.state.todoscomp /
                                                      this.state.todoslength) *
                                                      100
                                              )
                                            : 100
                                    }%` + `${emoji}`
                                }
                                /* This is important to include, because if you're fully managing the
                                animation yourself, you'll want to disable the CSS animation. */
                                styles={buildStyles({ pathTransition: "none" })}
                            ></CircularProgressbarWithChildren>
                        );
                    }}
                </AnimatedProgressProvider>
                <br />
                <Card>
                    <CardBody>
                        <CardTitle>Your pending todos</CardTitle>
                        <CardText>
                            <Table hover>
                                <tr>
                                    <th>Todo</th>
                                    <th></th>
                                    <th></th>
                                </tr>
                                {display}
                            </Table>
                        </CardText>
                    </CardBody>
                </Card>

                <br />
                <Button
                    style={{
                        backgroundColor: "#3e98c7",
                        width: "75%",
                        color: "black",
                        display: "block",
                        margin: "auto",
                    }}
                    onClick={this.toggleAllotModal}
                >
                    Add a todo
                </Button>
            </div>
        );
    }
}

export default EmpTodos;
