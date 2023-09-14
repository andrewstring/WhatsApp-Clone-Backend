import mongoose, { Schema, ObjectId } from "mongoose"

const chatRoomSchema = new Schema({
    name: String,
    lastMessage: {
        type: String,
        default: ""
    },
    lastMessageDate: {
        type: Date,
        default: new Date()
    }
})
const ChatRoom = mongoose.model("ChatRoom", chatRoomSchema)

const messageSchema = new Schema({
    chatRoom: {
        type: ObjectId,
        ref: "ChatRoom"
    },
    members: [{
        type: ObjectId,
        ref: "Account"
    }],
    content: String,
    sender: String,
    received: Boolean,
    timeSent: Date
})
const Message = mongoose.model("Message", messageSchema)

const accountStateSchema = new Schema({
    type: String,
    expiration: Date
})
const accountSchema = new Schema({
    username: String,
    email: String,
    password: String,
    state: accountStateSchema
})
const Account = mongoose.model("Account", accountSchema)

export { ChatRoom, Message, Account }