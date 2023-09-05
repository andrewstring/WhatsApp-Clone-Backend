import mongoose from "mongoose"
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

const addMessage = async () => {
    const message = new Message({
        chatRoom: objectId("5"),
        sender: "John",
        received: true,
        timeSent: Date("friday")
    })
}

export { dbConnect, addChatRoom, addMessage }
