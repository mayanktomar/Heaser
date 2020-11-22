import React from 'react';
import { Component } from 'react';
import {ChatService} from './index';

class Test extends Component{
    constructor(props){
        super(props);
        this.state={
            members :[],
            messages:[]
        }
    }

    getGroupMembers = (members) => {
        console.log(members);
        this.setState({members:members});
    };

    componentDidMount(){
        ChatService.userIsOnline("5faae504221c8d1b57ba653d");       //employee Id
        ChatService.getOrganizationMembers("5faa343ba6321b0017f7816d");         //organization id
        ChatService.onOrganizationMembers(this.getGroupMembers);
    }

    componentWillUnmount(){
        ChatService.userIsOffline("5faae504221c8d1b57ba653d");  //employee Id
    }

    joinHandler = (input) => {
        console.log(input);
    }

    getMessages = async (messages) => {
        console.log(messages);
        this.setState({ messages: messages });
    }

    getNewMessages = (messages) => {
        let chats = [...this.state.messages];

        const filtered_data = chats.findIndex((item) => {
            return messages.createdAt === item.createdAt && messages.text === item.text;
        });
        if (filtered_data !== -1) {
            return;
        }
        else {
            chats.push(messages);
        }
        this.setState({ messages: chats });
    }

    currentDetails = async(roomId)=>{
        ChatService.getChatHistory(this.getMessages);
        await ChatService.newMessages(this.getNewMessages);
    }

    startChat = ()=>{
        this.setState({messages:[]});
        let roomIdOrg = "5faa343ba6321b0017f7816d";        //organization id
        let roomIdIndi = `5faae504221c8d1b57ba653d`+"|"+`5fac0af5bdc5ae4014b913e0`

        ChatService.join({
            roomId: roomIdIndi,
            joinType:"employee"
        });
        ChatService.onJoined(this.joinHandler);
        this.currentDetails(roomIdIndi);
    }

    sendMessage = ()=>{
        const loadOrg = {
            from:"5faae504221c8d1b57ba653d",    //sender emp
            to:"5faa343ba6321b0017f7816d",      //reciever group
            msg:"hey there",
            roomId:"5faa343ba6321b0017f7816d",  //group id
            type:"Organization"
        }

        const loadIndi = {
            from:"5faae504221c8d1b57ba653d",    //sender emp
            to:"5fac0af5bdc5ae4014b913e0",      //reciever emp
            msg:"hey there",
            roomId:`5faae504221c8d1b57ba653d`+"|"+`5fac0af5bdc5ae4014b913e0`,  //sender|reciever
            type:"Employee"
        }


        ChatService.createMessage(loadIndi,()=>{
            console.log("message sent");
        })
    }

    render(){
        return (
            <>
                <h1>Hey</h1>
                <button onClick={this.startChat}>Start Chat</button>
                <button onClick={this.sendMessage}>Send Message</button>
            </>
        )
    }
}

export default Test;