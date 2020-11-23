import Axios from "axios";
import React, { Component } from "react";
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Form,
    FormGroup,
    Label,
    Input,
} from "reactstrap";
import { AuthContext } from "../Context/auth";

export class AnnouncementModal extends Component {
    static contextType = AuthContext;
    constructor(props) {
        super(props);
        this.state = {
            heading: "",
            description: "",
            loader: false,
        };
    }

    handleLogChange = (event) => {
        const target = event.target;
        const name = target.name;
        const value = target.value;
        this.setState({
            [name]: value,
        });
    };

    onAnnouncementSubmit = (e) => {
        e.preventDefault();
        this.setState({ loader: true });

        const params = {
            heading: this.state.heading,
            description: this.state.description,
            organization: this.context.userId,
        };
        Axios.post(`/announcement/create-announcement`, params)
            .then((result) => {
                this.setState({ loader: false });
                this.props.toggleAnnounceModal();
            })
            .catch((err) => {
                console.log(err);
            });
    };

    render() {
        return (
            <div>
                <Modal
                    isOpen={this.props.isAnnounceModalOpen}
                    toggle={this.props.toggleAnnounceModal}
                >
                    <ModalHeader toggle={this.props.toggleAnnounceModal}>
                        Announcement
                    </ModalHeader>
                    <ModalBody>
                        <Form>
                            <FormGroup>
                                <Label for="exampleEmail">Heading</Label>
                                <Input
                                    type="text"
                                    name="heading"
                                    id="exampleHeading"
                                    placeholder="Enter Heading"
                                    onChange={this.handleLogChange}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="examplePassword">Description</Label>
                                <Input
                                    type="text"
                                    name="description"
                                    id="exampleDescription"
                                    placeholder="Enter Description"
                                    onChange={this.handleLogChange}
                                />
                            </FormGroup>
                        </Form>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={this.onAnnouncementSubmit}>
                            Announce
                        </Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

export default AnnouncementModal;
