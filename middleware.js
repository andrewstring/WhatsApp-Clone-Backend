import express from "express"
import cors from "cors"

const useMiddleware = (app) => {
    app.use(express.json())
    app.use(cors())
}

export default useMiddleware