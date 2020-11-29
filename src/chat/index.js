const io = require("socket.io-client");
const socket = io.connect("https://heaser-backend.herokuapp.com/", {
    transports: ["websocket", "polling"],
});

const userIsOnline = (userId) => {
    socket.emit("userIsOnline", userId);
};

const userIsOffline = (userId) => {
    socket.emit("userIsOffline", userId);
};

const join = (joinParams) => {
    //joinParams has empId, orgId
    socket.emit("sendJoinRequest", joinParams);
};

const onJoined = (joinFunc) => {
    socket.on("onJoined", joinFunc);
};

const newMessages = async (getMessage) => {
    await socket.on("newMessage", getMessage);
};

const getOrganizationMembers = (groupId) => {
    socket.emit("getOrganizationMembers", groupId);
};

const onOrganizationMembers = (getGroupMembers) => {
    socket.on("onOrganizationMembers", getGroupMembers);
};

const getChatHistory = (getMessages) => {
    socket.on("getChatHistory", getMessages);
};

const createMessage = (object, cb) => {
    socket.emit("chatMessage", object, cb);
};

export const ChatService = {
    userIsOnline,
    userIsOffline,
    getOrganizationMembers,
    onOrganizationMembers,
    join,
    onJoined,
    getChatHistory,
    newMessages,
    createMessage,
};
