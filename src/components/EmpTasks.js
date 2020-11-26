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
import { FcInfo } from "react-icons/fc";
import SelectInput from "@material-ui/core/Select/SelectInput";
import {
    CircularProgressbar,
    buildStyles,
    CircularProgressbarWithChildren,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { easeQuadInOut } from "d3-ease";
import AnimatedProgressProvider from "./AnimatedProgressProvider";
import RadialSeparators from "./RadialSeparators";
import moment from "moment";
import DateTimePicker from "react-datetime-picker";
import { AuthContext } from "../Context/auth";

export class EmpTasks extends Component {
    static contextType = AuthContext;
    constructor(props) {
        super(props);
        this.state = {
            tasks: [],
            employees: [],
            enddate: new Date(),
            empname: "",
            tasktitle: "",
            taskdesc: "",
            loading: true,
            loadingDetails: true,
            isTaskModalOpen: false,
            isAllotModalOpen: false,
            taskId: "",
            taskInfo: "~##~",
            tasklength: 0,
            taskcomp: 0,
            addComment: false,
            comment: "",
        };
    }

    componentDidMount = async () => {
        let userId = localStorage.getItem("userId");
        let type = localStorage.getItem("heaserType");
        let data = localStorage.getItem("heaserData");
        data = JSON.parse(data);
        await axios
            .get("/task/get-employee-tasks/" + userId)
            .then((response) => {
                this.setState({
                    tasks: response.data.tasks,
                    loading: false,
                });
            })
            .catch(function (error) {
                console.log(error);
            });
        await this.state.tasks.map((t) => {
            if (t.from._id != t.to) {
                this.setState({
                    tasklength: this.state.tasklength + 1,
                });
            }
            if (t.from._id != t.to && t.isCompleted == true) {
                this.setState({
                    taskcomp: this.state.taskcomp + 1,
                });
            }
        });
        await axios
            .get(
                "/employee/get-employess-by-org-id/" +
                    (type == "employee" ? data.organization : userId)
            )
            .then((response) => {
                this.setState({
                    employees: response.data.data,
                });
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    toggleTaskModal = async () => {
        await this.setState({
            isTaskModalOpen: !this.state.isTaskModalOpen,
        });
    };

    toggleAllotModal = () => {
        this.setState({
            isAllotModalOpen: !this.state.isAllotModalOpen,
        });
    };

    taskInfo = async (event) => {
        const data = this.state.tasks.filter((obj) => {
            return obj._id === event.currentTarget.id;
        });
        await this.setState({
            taskInfo: data[0],
        });

        await this.toggleTaskModal();
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

    onSubmit = () => {
        const data = this.state.employees.filter((obj) => {
            return obj.name === this.state.empname;
        });
        console.log(this.state.enddate);
        const deadline = moment(this.state.enddate).toISOString();

        axios
            .post("/task/create-task", {
                from: this.context.userId,
                to: data[0]._id,
                heading: this.state.tasktitle,
                description: this.state.taskdesc,
                startDate: moment(new Date()).toISOString(),
                endDate: deadline,
            })
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                alert("error");
            });

        this.toggleAllotModal();
    };

    onDelete = async () => {
        const id = this.state.taskInfo._id;
        await axios
            .put("/task/mark-task-as-completed/" + this.state.taskInfo._id, {
                comments: this.state.comment,
            })
            .then((response) => {
                const data = [...this.state.tasks];

                const index = data.findIndex((item) => item._id === id);

               data[index].isCompleted=true;
                this.setState({
                    tasks: data,
                    taskcomp: this.state.taskcomp + 1,
                });
            })
            .catch(function (error) {
                alert("error");
            });

        this.toggleTaskModal();
    };

    render() {
        const displaytasks = this.state.tasks.map((t) => {
            if (t.from._id != t.to) {
               
                const styling =
                t.isCompleted == true
                    ? { color: "#338333" }
                    : { color: "#e2c10a" };
                return (
                    <tr>
                        
                        <td
                            onClick={() => {
                                this.props.history.push(
                                    `/employee/${t.from._id}`
                                );
                            }}
                            style={{ cursor: "pointer", color: "#1976d2" }}
                        >
                            {t.from.name}
                        </td>
                        <td style={styling}>{t.heading}</td>

                        <td>
                            <Button
                                id={t._id}
                                style={{
                                    background: "transparent",
                                    paddingTop: "0px",
                                }}
                                onClick={this.taskInfo}
                            >
                                <FcInfo />
                            </Button>
                        </td>
                        
                    </tr>
                );
            }
            return <div></div>;
        });

        const display =
            this.state.loading == true ? (
                <Spinner color="info" />
            ) : (
                displaytasks
            );

        const displayModal =
            this.state.taskInfo == "~##~" ? (
                <Spinner color="info" />
            ) : (
                <div>
                    <h5>{this.state.taskInfo.heading}</h5>
                    <h6 style={{ fontFamily: "italic" }}>
                        {this.state.taskInfo.description}
                    </h6>
                    <p>Given by : {this.state.taskInfo.from.name}</p>
                    {this.state.taskInfo.isCompleted ? (
                        <p style={{ color: "green" }}>Completed</p>
                    ) : (
                        <p style={{ color: "red" }}>Not Completed</p>
                    )}
                    <p>
                        DeadLine:{" "}
                        {moment(this.state.taskInfo.endDate).format(
                            "MMM Do ,YYYY"
                        )}
                    </p>
                    {this.state.taskInfo.comments !== "" ? (
                        <p>Comments - {this.state.taskInfo.comments}</p>
                    ) : null}
                   {this.state.taskInfo.isCompleted==false?<FormGroup check>
                        <Label check>
                            <Input
                                type="checkbox"
                                checked={this.state.addComment}
                                onClick={(e) => {
                                    this.setState({
                                        addComment: !this.state.addComment,
                                    });
                                }}
                            />{" "}
                            Add Comment
                        </Label>
                    </FormGroup>:null} 
                    {this.state.addComment==true&&this.state.taskInfo.isCompleted==false ? (
                        <FormGroup>
                            <Label for="quantity">Comments (Optional)</Label>
                            <Input
                                type="text"
                                name="comments"
                                id=""
                                onChange={(e) => {
                                    this.setState({ comment: e.target.value });
                                }}
                            />
                        </FormGroup>
                    ) : null}
                </div>
            );

        const dropdownoptions = this.state.employees.map((e) => {
            return <option>{e.name}</option>;
        });

        // const emoji=(Math.round((this.state.taskcomp/this.state.tasklength)*100<=50))?"🙂":"💪"
        let emoji;

        {
            if (
                Math.round(
                    (this.state.taskcomp / this.state.tasklength) * 100 <= 25
                )
            ) {
                emoji = "😐";
            } else if (
                Math.round(
                    (this.state.taskcomp / this.state.tasklength) * 100
                ) <= 50
            ) {
                emoji = "🙂";
            } else if (
                Math.round(
                    (this.state.taskcomp / this.state.tasklength) * 100
                ) <= 75
            ) {
                emoji = "😀";
            } else if (
                Math.round(
                    (this.state.taskcomp / this.state.tasklength) * 100
                ) <= 99
            ) {
                emoji = "😁";
            } else {
                emoji = "💪";
            }
        }
        return (
            <div className="emptask">
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
                                <Label for="exampleSelect">Employee name</Label>
                                <Input
                                    type="select"
                                    name="empname"
                                    id="exampleSelect"
                                    onChange={this.handleInputChange}
                                >
                                    {/* <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option> */}
                                    <option>-</option>
                                    {dropdownoptions}
                                </Input>
                            </FormGroup>
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

                <Modal
                    isOpen={this.state.isTaskModalOpen}
                    toggle={this.toggleTaskModal}
                >
                    <ModalHeader toggle={this.toggleTaskModal}>
                        {this.state.taskInfo.heading}
                    </ModalHeader>
                    <ModalBody>
                        {displayModal}

                       {this.state.taskInfo.isCompleted==false?<Button
                            style={{
                                backgroundColor: "#3e98c7",
                                width: "50%",
                                color: "white",
                                display: "block",
                                margin: "auto",
                            }}
                            onClick={this.onDelete}
                        >
                            Mark as completed
                        </Button>:null} 
                    </ModalBody>
                </Modal>
                <AnimatedProgressProvider
                    valueStart={0}
                    valueEnd={
                        this.state.taskcomp != 0 && this.state.tasklength != 0
                            ? (this.state.taskcomp / this.state.tasklength) *
                              100
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
                                    `${this.state.tasklength!=0?Math.round(
                                        (this.state.taskcomp /
                                            this.state.tasklength) *
                                            100
                                    ):0}%` + `${emoji}`
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
                        <CardTitle tag="h5">Your pending tasks</CardTitle>

                        <CardText>
                            <Table hover>
                                <tr>
                                    <th>From</th>
                                    <th>Task</th>
                                    <th>info</th>
                                    
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
                    Allocate a task
                </Button>
            </div>
        );
    }
}

export default EmpTasks;
