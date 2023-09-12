import express, { application } from "express"
import { dbConnect, addChatRoom, addMessage, getAllMessages, getAllChatRooms } from "./db/db.js"
import useMiddleware from "./middleware.js"


const app = express()
const port = 3005

// Middleware
useMiddleware(app)

app.get("/message/getFromChatRoom/:_id", async (req, res) => {
    try {
        const messages = await getAllMessages(req.params._id)
        res.send(messages)
    } catch (e) {
        res.status(500).json({message: `Error retrieving data from chat room: ${req.params._id}`})
    }
    
})

app.get("/chatroom/getChatRooms", async (req, res) => {
    try {
        const chatRooms = await getAllChatRooms()
        res.send(chatRooms)
    } catch (e) {
        res.status(500).json({message: "Error retrieving list of chat rooms"})
    }
    
})

// Returns 409 (Conflict) status code if chat room name already exists
app.post("/chatroom/new", async (req, res) => {
    try {
        if(await addChatRoom(req.body.name)) {
            res.send("Chat Room added")
        } else {
            res.status(409).json({message: "Chat room already exists"})
        }
        
    } catch (e) {
        res.status(500).json({message: "Error creating new chat room"})
    }
    
})

app.post("/message/new", async (req, res) => {
    try {
        await addMessage(
            req.body.chatRoomId,
            req.body.messageContent
            )
        res.send("Message added")
    } catch (e) {
        res.status(500).json("Error creating new message")
    }
    
})

const start = async () => {
    try {
        await dbConnect()
        app.listen(port, async () => {
            console.log(`App listening on port: ${port}`)
        })
    } catch (e) {
        console.error(e)
    }
    
}
start()

