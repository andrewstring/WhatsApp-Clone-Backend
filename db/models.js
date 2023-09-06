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
    content: String,
    sender: String,
    received: Boolean,
    timeSent: Date
})
const Message = mongoose.model("Message", messageSchema)

export { ChatRoom, Message }