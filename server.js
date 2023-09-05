import express, { application } from "express"
import { dbConnect, addChatRoom } from "./db/db.js"


const app = express()
const port = 3005

app.get("/", (req, res) => {
    res.send("Hello, World!")
    addChatRoom("test")

})


const start = async () => {
    await dbConnect()
    app.listen(port, async () => {
        console.log(`App listening on port: ${port}`)
    })
}
start()

