import express from "express"

const useMiddleware = (app) => {
    app.use(express.json())
}

export default useMiddleware