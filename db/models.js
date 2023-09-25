// mongoose imports
import mongoose, { Schema, ObjectId } from "mongoose"


// chatroom schema
// members are linked to chatroom (by Account ObjectId)
const chatRoomSchema = new Schema({
    name: String,
    picture: Buffer,
    lastMessage: {
        type: String,
        default: ""
    },
    lastMessageDate: {
        type: Date,
        default: new Date()
    },
    members: [{
        type: ObjectId,
        ref: "Account"
    }]
})
const ChatRoom = mongoose.model("ChatRoom", chatRoomSchema)


// message schema
// chatrooms are linked to message (by ChatRoom ObjectId)
const messageSchema = new Schema({
    chatRoom: {
        type: ObjectId,
        ref: "ChatRoom"
    },
    content: String,
    sender: ObjectId,
    senderName: String,
    received: Boolean,
    timeSent: Date
})
const Message = mongoose.model("Message", messageSchema)


// account schema...account schema includes accountstate schema
const accountStateSchema = new Schema({
    type: String,
    expiration: Date
})
const accountSchema = new Schema({
    firstName: String,
    username: String,
    email: String,
    password: String,
    picture: Buffer,
    state: accountStateSchema
})
const Account = mongoose.model("Account", accountSchema)

export { ChatRoom, Message, Account }