// middleware imports
import express from "express"
import cors from "cors"

// middleware injection function
const useMiddleware = (app) => {
    app.use(express.json())
    app.use(cors())
}

export default useMiddleware