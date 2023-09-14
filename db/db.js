import mongoose from "mongoose"
import { ChatRoom, Message, Account } from "./models.js"

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


// Returns true if chat room name doesn't already exist
// Returns false if chat room name already exists
const addChatRoom = async (name) => {
    const chatExists = Boolean(await ChatRoom.findOne({name: name}))
    if (!chatExists) {
        const chatRoom = new ChatRoom({
            name: name,
            lastMessageDate: new Date()    
        })
        await chatRoom.save()
        return true
    }
    return false
    
}

const addMessage = async (chatRoomId, messageContent) => {
    const currentTime = new Date()

    // THIS IS NOT SHOWING IN REFRESH (FOR CHAT ORDER BY LASTMESSAGEDATE)
    const chatRoom = await ChatRoom.findOneAndUpdate({
        _id: new mongoose.Types.ObjectId(chatRoomId)
    },
    { "lastMessageDate": currentTime },
    { new: true })
    const message = new Message({
        chatRoom: chatRoom._id,
        content: messageContent.content,
        sender: messageContent.sender,
        received: messageContent.received,
        timeSent: currentTime
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

const getAllChatRooms = async (accountId) => {
    const account = await Account.findOne({_id: new mongoose.Types.ObjectId(accountId)})
    console.log(account)
    const chatRooms = await ChatRoom.find({members: account})
    return chatRooms
}

/*
Return _id when username and email do not exist
Return 1 when username exists
Return 2 when email exists
Return 3 when both username and email exist
*/
const createAccount = async ({username,email,password}) => {
    const usernameExists = Boolean(await Account.findOne({ username: username }))
    const emailExists = Boolean(await Account.findOne({ email: email }))
    if (usernameExists && emailExists) {
        return 3
    } else if (usernameExists) {
        return 1
    } else if (emailExists) {
        return 2
    }
    const account = new Account({
        username: username,
        email: email,
        password: password,
        state: {
            type: "verify",
            //TODO: Make this fiver hours after
            expiration: new Date()
        }
    })
    await account.save()
    return account._id
}

/*
Return _id when correct credentials
Return 1 when incorrect credentials
Return 2 when username does not exist
*/
const loginAccount = async ({username,password}) => {
    const usernameExists = Boolean(await Account.findOne({ username: username }))
    if (!usernameExists) return 1
    const credentials = await Account.findOne({
        username: username,
        password: password
    })
    if (!Boolean(credentials)) return 2
    return credentials._id
}

export {
    dbConnect,
    addChatRoom,
    addMessage,
    getAllMessages,
    getAllChatRooms,
    createAccount,
    loginAccount
}
