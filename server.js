// express imports
import express from "express"

import * as fs from "fs"

// library imports
import multer from "multer"

// config import
import { port, dbUri as uri } from "./config.js"

// bodyParser import
import bodyParser from "body-parser"

// db imports
import {
    dbConnect, addChatRoom, addMessage, getAllMessages,
    getAllChatRooms, createAccount, loginAccount,
    getAccount
} from "./db/db.js"

// dirname filename import
import { fileURLToPath } from "url"
import { dirname } from "path"

// middleware import
import useMiddleware from "./middleware.js"


const jsonParser = bodyParser.json()

// dirname filename setup
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// multer upload config
const imageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./images")
    },
    filename: (req, file, cb) => {
        cb(null, `${file.originalname}`)
    }
})
const imageUpload = multer({storage: imageStorage})

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

// update chatroom
app.put("/chatroom/update", imageUpload.single("picture"), async (req, res) => {
    try {
        // const file = await req.file
        // await fs.unlink(`./images/${file.name}`)

    } catch (e) {
        console.log(e)
        res.status(500).json({message: "Error updating chat room"})
    }
})

app.post("/chatroom/newimage", async (req, res) => {

})


// create new message in specific chatroom
app.post("/message/new", async (req, res) => {
    
    try {
        const messageId = await addMessage(
            req.body.chatRoomId,
            req.body.messageContent,
            req.body.attachment
        )
        res.send({
            message: "Message added",
            id: messageId
        })
    } catch (e) {
        res.status(500).json("Error creating new message")
    }
    
})

app.post("/message/newimage", imageUpload.single("attachment"), async(req,res) => {
    try {
        const upload = fs.readFile(`${__dirname}${req.file.path}`)
        console.log(`Uploading image to ${__dirname}${req.file.path}`)
        if (!upload) {
            res.status(500).json("Error uplading image")
        }
        res.send({message: "Successfully uploaded image"})


    } catch (e) {
        res.status(500).json("Error uplading image")
    }
})

app.get("/message/getimage/:id", async(req,res,next) => {
    try {
        const id = req.params.id
        res.sendFile(`images/${id}.jpeg`, {root: __dirname}, (err) => {
            next(err)
        })
    } catch (e) {
        res.status(500).json("Error retrieving file")
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

// update account
app.put("account/update", async (req, res) => {
    try {

    } catch (e) {
        res.status(500).json({message: "Error updating account"})
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

app.post("/account/get", async (req,res) => {
    try {
        const credentials = await getAccount(req.body.id)
        if (credentials) {
            res.send({
                message: "Account Found",
                account: credentials
            })
        } else {
            res.send({
                message: "No Account Found"
            })
        }

    } catch (e) {
        res.status(500).json("Error getting account")
    }
})

// start backend server
const start = async () => {
    try {
        await dbConnect()
        app.listen(port, async () => {
            console.log(`Directory path: ${__dirname}`)
            console.log(`App listening on port: ${port}`)
        })
    } catch (e) {
        console.error(e)
    }
    
}
start()

