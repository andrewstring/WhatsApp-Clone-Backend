import mongoose, { Schema } from "mongoose"

const chatRoomSchema = new Schema({
    name: String,
    lastMessage: String
})
const ChatRoom = mongoose.model("ChatRoom", chatRoomSchema)

const messageSchema = new Schema({
    chatRoom: ObjectId,
    sender: String,
    received: Boolean,
    timeSent: Date
})
const Message = mongoose.model("Message", messageSchema)

export { ChatRoom, Message }