import React, { Component } from "react";
import axios from "axios";
import {
    Spinner,
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from "reactstrap";
import Header from "../components/Header";

export class ViewEmp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            employees: [],
            loading: true,
            isModalOpen: false,
            id: "",
        };
    }

    componentDidMount = () => {
        let data = localStorage.getItem("heaserData");
        data = JSON.parse(data);
        axios
            .get("/employee/get-employees-by-org-id/" + data._id)
            .then((response) => {
                this.setState({
                    employees: response.data.data,
                    loading: false,
                });
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    toggleModal = () => {
        this.setState({
            isModalOpen: !this.state.isModalOpen,
        });
    };
    onDelete = async () => {
        // const id=event.currentTarget.id;

        await axios
            .delete("/employee/delete-employee/" + this.state.id)
            .then((response) => {
                const data = [...this.state.employees];

                const index = data.findIndex(
                    (item) => item._id === this.state.id
                );

                data.splice(index, 1);

                this.setState({
                    employees: data,
                });
            })
            .catch(function (error) {
                console.log(error);
            });

        this.toggleModal();
    };
    render() {
        const displaylist = this.state.employees.map((e) => {
            return (
                <div>
                    <div className="row" style={{ margin: "0px" }}>
                        <div className="col-md-5">
                            <p
                                style={{
                                    color: "#1976d2",
                                    cursor: "pointer",
                                }}
                                onClick={() => {
                                    this.props.history.push(
                                        `/employee/${e._id}`
                                    );
                                }}
                            >
                                {e.name}
                            </p>
                        </div>
                        <div className="col-md-4">
                            <p>{e.tags.length > 0 ? e.tags[0] : "N/A"}</p>
                        </div>
                        <div className="col-md-3">
                            <Button
                                id={e._id}
                                style={{
                                    backgroundColor: "#dc3545",
                                    color: "white",
                                }}
                                onClick={async () => {
                                    await this.setState({
                                        id: e._id,
                                    });
                                    this.toggleModal();
                                }}
                            >
                                Remove
                            </Button>
                        </div>
                    </div>
                    <hr style={{ border: "1px dotted black" }} />
                </div>
            );
        });
        const displaycheck =
            this.state.employees.length === 0 ? (
                <p>You have no registered employees..!!</p>
            ) : (
                displaylist
            );
        const display =
            this.state.loading === true ? (
                <Spinner color="info" />
            ) : (
                displaycheck
            );
        return (
            <>
                <Header {...this.props} />
                <div className="container empview">
                    <Modal
                        isOpen={this.state.isModalOpen}
                        toggle={this.toggleModal}
                    >
                        <ModalHeader toggle={this.toggleModal}>
                            Confirmation
                        </ModalHeader>
                        <ModalBody>
                            Are you sure to remove this employee?
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onClick={this.onDelete}>
                                Yes
                            </Button>{" "}
                        </ModalFooter>
                    </Modal>
                    <h2>Manage Employees</h2>
                    <div className="row" style={{ margin: "0px" }}>
                        <div className="col-md-5">
                            <p style={{ fontWeight: "bold" }}>Name</p>
                        </div>
                        <div className="col-md-4">
                            <p style={{ fontWeight: "bold" }}>Department</p>
                        </div>
                    </div>
                    {display}
                </div>
            </>
        );
    }
}

export default ViewEmp;
