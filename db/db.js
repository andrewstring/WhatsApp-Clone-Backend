import mongoose, { ObjectId } from "mongoose"
import { ChatRoom, Message } from "./models.js"

const username = "abreeze12345"
const password = "Fellow3.0!"
const uri = `mongodb+srv://${username}:${password}@whatsapp-clone.wgf6y7c.mongodb.net/?retryWrites=true&w=majority`

const dbConnect = async () => {

    try {
        // Connect to MongoDB cluster
        await mongoose.connect(uri)

        // List all databases
        console.log("MongoDB Connected")
    } catch (e) {
        console.error(e)
    }
}

const addChatRoom = async (name) => {
    const chatRoom = new ChatRoom({ name: name})
    await chatRoom.save()
}

const addMessage = async (chatRoomId, messageContent) => {
    const chatRoom = await ChatRoom.findOne({
        _id: new mongoose.Types.ObjectId(chatRoomId)
    })
    const message = new Message({
        chatRoom: chatRoom._id,
        content: messageContent.content,
        sender: messageContent.sender,
        received: messageContent.received,
        timeSent: new Date()
    })
    chatRoom.lastMessage = messageContent.content
    await message.save()
    await chatRoom.save()
}

const getAllMessages = async (chatRoomId) => {
    const chatRoom = await ChatRoom.findOne({
        _id: chatRoomId
    })
    const messages = await Message.find({
        chatRoom: chatRoom._id
    })
    return messages
}

const getAllChatRooms = async () => {
    const chatRooms = await ChatRoom.find()
    return chatRooms
}

export {
    dbConnect,
    addChatRoom,
    addMessage,
    getAllMessages,
    getAllChatRooms }
