import React, { useState, useEffect, Component } from "react";
import "./chat.scss";
import { AuthContext, useAuthContext } from "../../Context/auth";
import moment from "moment";
import Header from "../../components/Header";
import { ChatService } from "../../chat/index";
import ChatImage from "../../assets/chat1.svg";

export default class Chat extends Component {
    static contextType = AuthContext;
    constructor(props) {
        super(props);
        this.state = {
            members: [],
            selectedMember: null,
            chatMessages: [],
            filtered: [],
            chatType: null,
            message: "",
        };
    }

    getGroupMembers = (members) => {
        this.setState({ members: members, filtered: members });
    };

    async componentDidMount() {
        const data = await localStorage.getItem("heaserData");
        const userData = JSON.parse(data);
        const userId = await localStorage.getItem("userId");
        const type = await localStorage.getItem("heaserType");
        if (type === "employee") {
            ChatService.userIsOnline(userId); //emp id
        }
        if (type === "employee") {
            ChatService.getOrganizationMembers(userData.organization); //organization id
        } else {
            ChatService.getOrganizationMembers(userId);
        }
        ChatService.onOrganizationMembers(this.getGroupMembers);
    }

    componentWillUnmount() {
        if (this.context.type === "employee")
            ChatService.userIsOffline(this.context.userId);
    }

    searchHandler = (e) => {
        let currentList = [];
        let newList = [];
        if (e.target.value !== "") {
            currentList = this.state.members;
            newList = currentList.filter((item) => {
                const lc = item.name.toLowerCase();
                const filter = e.target.value.toLowerCase();
                return lc.includes(filter);
            });
        } else {
            newList = this.state.members;
        }
        this.setState({ filtered: newList });
    };

    joinHandler = (input) => {
        // console.log(input);
    };

    getMessages = (message) => {
        this.setState({ chatMessages: message });
    };

    getNewMessages = async (message) => {
        const chats = [...this.state.chatMessages];
        const filtered_data = chats.filter((item) => {
            return (
                message.text === item.text &&
                moment(message.createdAt).format("YYYY-MM-DD HH:mm:ss") ===
                    moment(item.createdAt).format("YYYY-MM-DD HH:mm:ss")
            );
        });
        if (filtered_data.length > 0) {
            return;
        } else {
            chats.push(message);
        }
        this.setState({ chatMessages: chats });
    };

    messageHandler = async () => {
        ChatService.getChatHistory(this.getMessages);
        await ChatService.newMessages(this.getNewMessages);
    };

    handleMemberSelect = async (item) => {
        this.setState({ selectedMember: item, chatType: item.type });
        let roomIdOrg = item._id; //organization id
        let roomIdIndi = this.context.userId + "|" + item._id; //sender|reciever

        let roomId = item.type === "organization" ? roomIdOrg : roomIdIndi;
        ChatService.join({
            roomId: roomId,
            joinType: item.type,
        });

        ChatService.onJoined(this.joinHandler);
        this.messageHandler();
    };

    handleSend = (e) => {
        e.preventDefault();
        const loadOrg = {
            from: this.context.userId, //sender emp
            to: this.state.selectedMember._id, //reciever group
            msg: this.state.message,
            roomId: this.state.selectedMember._id, //group id
            type: this.state.chatType,
        };

        const loadIndi = {
            from: this.context.userId, //sender emp
            to: this.state.selectedMember._id, //reciever emp
            msg: this.state.message,
            roomId: this.context.userId + "|" + this.state.selectedMember._id, //sender|reciever
            type: this.state.chatType,
        };

        const params =
            this.state.chatType === "organization" ? loadOrg : loadIndi;
        const chats = [...this.state.chatMessages];
        chats.push({ ...params, text: this.state.message });
        this.setState({ chatMessages: chats, message: "" });
        ChatService.createMessage(params, () => {
            console.log("message sent");
        });
    };

    render() {
        const styles = {
            image: {
                height: 350,
                width: 350,
            },
        };

        return (
            <>
                <Header {...this.props} />
                <div class="chat-container clearfix">
                    <div class="people-list" id="people-list">
                        <div class="search">
                            <input
                                type="text"
                                placeholder="Search"
                                onChange={this.searchHandler}
                            />
                            <i class="fa fa-search"></i>
                        </div>
                        <ul class="list">
                            <li
                                class="clearfix"
                                onClick={() => {
                                    this.handleMemberSelect({
                                        name: "Organization Workspace",
                                        _id:
                                            this.context.type === "organization"
                                                ? this.context.userId
                                                : this.context.data
                                                      .organization,
                                        type: "organization",
                                    });
                                }}
                            >
                                <img
                                    src="https://cdn.pixabay.com/photo/2015/03/04/22/35/head-659652_1280.png"
                                    alt="avatar"
                                    style={{
                                        height: 60,
                                        width: 60,
                                        borderRadius: 50,
                                    }}
                                />
                                <div class="about">
                                    <div class="name">
                                        {"Organization Group"}
                                    </div>
                                    <div class="status">
                                        <i class="fa fa-circle online"></i>{" "}
                                        {this.state.members.length} members
                                    </div>
                                </div>
                            </li>
                            {this.state.filtered.map((item) => {
                                return (
                                    <li
                                        key={item._id}
                                        class="clearfix"
                                        onClick={() => {
                                            this.handleMemberSelect({
                                                ...item,
                                                type: "employee",
                                            });
                                        }}
                                    >
                                        <img
                                            src="https://cdn.pixabay.com/photo/2015/03/04/22/35/head-659652_1280.png"
                                            alt="avatar"
                                            style={{
                                                height: 60,
                                                width: 60,
                                                borderRadius: 50,
                                            }}
                                        />
                                        <div class="about">
                                            <div class="name">{item.name}</div>
                                            <div class="status">
                                                <i class="fa fa-circle online"></i>{" "}
                                                {item.lastSeen}
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                    {this.state.selectedMember ? (
                        <div class="chat">
                            <div class="chat-header clearfix">
                                <img
                                    src="https://cdn.pixabay.com/photo/2015/03/04/22/35/head-659652_1280.png"
                                    alt="avatar"
                                    style={{
                                        height: 60,
                                        width: 60,
                                        borderRadius: 50,
                                    }}
                                />

                                <div class="chat-about">
                                    <div class="chat-with">
                                        Chat with{" "}
                                        {this.state.selectedMember.name}
                                    </div>
                                    <div class="chat-num-messages">
                                        already {this.state.chatMessages.length}{" "}
                                        messages
                                    </div>
                                </div>
                                <i class="fa fa-star"></i>
                            </div>

                            <div class="chat-history">
                                <ul>
                                    {this.state.chatMessages.map((item) => {
                                        return item.from ===
                                            this.context.userId ? (
                                            <li
                                                class="clearfix"
                                                key={item._id}
                                                style={{
                                                    listStyleType: "none",
                                                }}
                                            >
                                                <div class="message-data align-right">
                                                    <span class="message-data-time">
                                                        {moment(
                                                            item.createdAt
                                                        ).format(
                                                            "DD-MM-YYYY hh:ss"
                                                        )}
                                                    </span>{" "}
                                                    &nbsp; &nbsp;
                                                    <span class="message-data-name">
                                                        {item.from}
                                                    </span>{" "}
                                                    <i class="fa fa-circle me"></i>
                                                </div>
                                                <div class="message other-message float-right">
                                                    {item.text}
                                                </div>
                                            </li>
                                        ) : (
                                            <li
                                                style={{
                                                    listStyleType: "none",
                                                }}
                                                key={item._id}
                                            >
                                                <div class="message-data">
                                                    <span class="message-data-name">
                                                        <i class="fa fa-circle online"></i>{" "}
                                                        {item.from}
                                                    </span>
                                                    <span class="message-data-time">
                                                        {moment(
                                                            item.createdAt
                                                        ).format(
                                                            "DD-MM-YYYY hh:ss"
                                                        )}
                                                    </span>
                                                </div>
                                                <div class="message my-message">
                                                    {item.text}
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>

                            <div class="chat-message clearfix">
                                <textarea
                                    name="message-to-send"
                                    id="message-to-send"
                                    placeholder="Type your message"
                                    rows="3"
                                    value={this.state.message}
                                    onChange={(e) => {
                                        this.setState({
                                            message: e.target.value,
                                        });
                                    }}
                                ></textarea>
                                <i class="fa fa-file-o"></i> &nbsp;&nbsp;&nbsp;
                                <i class="fa fa-file-image-o"></i>
                                <button onClick={this.handleSend}>Send</button>
                            </div>
                        </div>
                    ) : (
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                paddingTop: 100,
                            }}
                        >
                            <h4 style={{ color: "grey" }}>
                                Select a Chat to continue
                            </h4>
                            <img src={ChatImage} style={styles.image} />
                        </div>
                    )}
                </div>
            </>
        );
    }
}
