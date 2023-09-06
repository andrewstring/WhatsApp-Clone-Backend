import express, { application } from "express"
import { dbConnect, addChatRoom, addMessage, getAllMessages, getAllChatRooms } from "./db/db.js"
import useMiddleware from "./middleware.js"


const app = express()
const port = 3005

// Middleware
useMiddleware(app)

app.get("/message/getFromChatRoom/:chatRoomName", async (req, res) => {
    const messages = await getAllMessages(req.params.chatRoomName)
    res.send(messages)
})

app.get("/chatroom/getChatRooms", async (req, res) => {
    const chatRooms = await getAllChatRooms()
    res.send(chatRooms)
})

app.post("/chatroom/new", async (req, res) => {
    await addChatRoom(req.body.name)
    res.send("Chat Room added")
})

app.post("/message/new", async (req, res) => {
    console.log(req.body.chatRoom)
    console.log(req.body.messageContent)
    await addMessage(
        req.body.chatRoom,
        req.body.messageContent
        )
    res.send("Message added")
})

const start = async () => {
    await dbConnect()
    app.listen(port, async () => {
        console.log(`App listening on port: ${port}`)
    })
}
start()

