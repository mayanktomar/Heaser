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
import Axios from "axios";

class NotificationModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            count: 0,
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
                    <Badge color="secondary">{this.props.count}</Badge>
                </ModalHeader>
                <ModalBody style={{ height: 500, overflowY: "scroll" }}>
                    <ListGroup>
                        {this.props.data.map((item) => {
                            return (
                                <ListGroupItem
                                    style={{ cursor: "pointer" }}
                                    onClick={() => {
                                        this.props.markNotificationSeen(
                                            item._id
                                        );
                                        this.props.history.push(
                                            "/" + item.operation.toLowerCase()
                                        );
                                    }}
                                >
                                    {item.seen ? (
                                        <ListGroupItemHeading
                                            style={{ color: "grey" }}
                                        >
                                            {item.message}
                                        </ListGroupItemHeading>
                                    ) : (
                                        <ListGroupItemHeading>{`${item.message}`}</ListGroupItemHeading>
                                    )}
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
