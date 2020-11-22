import React, { Component } from "react";
import {
    Modal,
    ModalHeader,
    ModalBody,
    Badge,
    ListGroup,
    ListGroupItem,
    ListGroupItemHeading,
} from "reactstrap";

class NotificationModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
        };
    }

    render() {
        return (
            <Modal
                isOpen={this.props.isNotModalOpen}
                toggle={this.props.toggleNotModal}
            >
                <ModalHeader toggle={this.props.toggleNotModal}>
                    Notifications{" "}
                    <Badge color="secondary">{this.props.data.length}</Badge>
                </ModalHeader>
                <ModalBody>
                    <ListGroup>
                        {this.props.data.map((item) => {
                            return (
                                <ListGroupItem
                                    style={{ cursor: "pointer" }}
                                    onClick={() => {
                                        this.props.history.push(
                                            "/" + item.operation.toLowerCase()
                                        );
                                    }}
                                >
                                    <ListGroupItemHeading>{`${item.message}`}</ListGroupItemHeading>
                                </ListGroupItem>
                            );
                        })}
                    </ListGroup>
                </ModalBody>
            </Modal>
        );
    }
}

export default NotificationModal;
