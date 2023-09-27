// mongoose import
import mongoose from "mongoose"
// schema model imports
import { ChatRoom, Message, Account } from "./models.js"
// config import
import { dbUri as uri } from "../config.js"

// connect to database
const dbConnect = async () => {
    try {
        // Connect to mongodb cluster
        await mongoose.connect(uri)
    } catch (e) {
        console.error(e)
    }
}

// returns true if chat room name doesn't already exist
// returns false if chat room name already exists
const addChatRoom = async (name, id, additionalMemberIds) => {
    const account = await Account.findOne({_id: new mongoose.Types.ObjectId(id)})
    const chatExists = Boolean(await ChatRoom.findOne({name: name, members: account}))

    if (!chatExists) {
        // create new chatroom if chatroom does not exist
        const chatRoom = new ChatRoom({
            name: name,
            lastMessageDate: new Date(),
            members: [account._id, ...additionalMemberIds]
        })
        await chatRoom.save()
        return true
    }
    return false
}

// returns true if additional members are added to chat
// returns false if chatroom does not exist
const addAdditionalMembersToChatRoom = async (chatId, additionalMemberIds) => {
    const additionalMembers = await getAdditionalMembers(additionalMemberIds)
    const chat = await ChatRoom.findOne({_id: chatId})

    if (chat) {
        chat.members = [...chat.members, ...additionalMembers]
        await chat.save()
        return true
    }
    return false
}

const getAdditionalMembers = async (additionalMemberIds) => {
    const members = await additionalMemberIds.map(async id => {
        const member = await Account.findOne({_id: new mongoose.Types.ObjectId(id)})
        if (member) {
            return member
        }
        return null
    })
    members = members.reduce(member => member)
    return members
}

const addMessage = async (chatRoomId, messageContent) => {
    const currentTime = new Date()

    const account = await Account.findOne({_id: new mongoose.Types.ObjectId(messageContent.sender)})

    const chatRoom = await ChatRoom.findOneAndUpdate({
        _id: new mongoose.Types.ObjectId(chatRoomId)
    },
    { "lastMessageDate": currentTime },
    { new: true })
    const message = new Message({
        chatRoom: chatRoom._id,
        content: messageContent.content,
        sender: new mongoose.Types.ObjectId(messageContent.sender),
        senderName: account.firstName,
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
    try {
        const account = await Account.findOne({_id: new mongoose.Types.ObjectId(accountId)})
        if (account._id) {
            const chatRooms = await ChatRoom.find({members: account._id})
            return chatRooms
        }
        return null
    } catch (e) {
        console.log(e)
    }
    
}

/*
Return account when username and email do not exist
Return 1 when username exists
Return 2 when email exists
Return 3 when both username and email exist
*/
const createAccount = async ({firstName,username,email,password}) => {
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
        firstName: firstName,
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
    account._id = account._id.toString()
    return account
}

/*
Return account when correct credentials
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
    credentials._id = credentials._id.toString()
    return credentials
}

const getAccount = async (id) => {
    const credentials = await Account.findOne({ _id: id })
    if (Boolean(credentials)) {
        return credentials
    }
    return null
}

export {
    dbConnect,
    addChatRoom,
    addMessage,
    getAllMessages,
    getAllChatRooms,
    createAccount,
    loginAccount,
    getAccount
}
