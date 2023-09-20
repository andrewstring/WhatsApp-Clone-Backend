// express imports
import express from "express"
// config import
import { port } from "./config.js"
// db imports
import {
    dbConnect, addChatRoom, addMessage, getAllMessages,
    getAllChatRooms, createAccount, loginAccount
} from "./db/db.js"
// middleware import
import useMiddleware from "./middleware.js"

// app init
const app = express()

// middleware injection
useMiddleware(app)


// get messages from chatroom (specified by chatroom id)
app.get("/message/getFromChatRoom/:_id", async (req, res) => {
    try {
        const messages = await getAllMessages(req.params._id)
        res.send(messages)
    } catch (e) {
        res.status(500).json({message: `Error retrieving data from chat room: ${req.params._id}`})
    }
    
})

// get chatrooms for specific user (specified by user id)
app.get("/chatroom/getChatRooms/:_id", async (req, res) => {
    try {
        const chatRooms = await getAllChatRooms(req.params._id)
        res.send(chatRooms)
    } catch (e) {
        res.status(500).json({message: "Error retrieving list of chat rooms"})
    }
    
})

// create new chatroom
app.post("/chatroom/new", async (req, res) => {
    try {
        if(await addChatRoom(req.body.name, req.body.id, req.body.members)) {
            res.send("Chat Room added")
        } else {
            res.status(409).json({message: "Chat room already exists"})
        }
        
    } catch (e) {
        res.status(500).json({message: "Error creating new chat room"})
    }
    
})


// create new message in specific chatroom
app.post("/message/new", async (req, res) => {
    console.log(req.body)
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


// create new account
app.post("/account/new", async (req,res) => {
    try {
        const result = await createAccount(req.body)
        switch(result) {
            case 1:
                res.send({message: "Username exists"})
                return
            case 2:
                res.send({message: "Email exists"})
                return
            case 3:
                res.send({message: "Username and Email exist"})
                return
            default: {
                res.send({
                    message: "Account created",
                    credentials: result
                })
                return
            }
        }
    } catch (e) {
        res.status(500).json("Error creating user")
    }
})


// login to user account
app.post("/account/login", async (req,res) => {
    try {
        const result = await loginAccount(req.body)
        switch(result) {
            case 1: {
                res.send({message: "Username does not exist"})
                return
            }
            case 2: {
                res.send({message: "Incorrect credentials"})
                return
            }
            default: {
                res.send({
                    message: "Correct credentials",
                    credentials: result
                })
                return
            }
        }
    } catch (e) {
        res.status(500).json("Error logging in")
    }
})

// start backend server
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

