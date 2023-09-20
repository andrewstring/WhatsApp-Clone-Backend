const dbConfig = {
    username: "abreeze12345",
    password: "Fellow3.0!"
}
export const dbUri = `mongodb+srv://${dbConfig.username}:${dbConfig.password}@whatsapp-clone.wgf6y7c.mongodb.net/?retryWrites=true&w=majority`

export const port = process.env.PORT || 3005