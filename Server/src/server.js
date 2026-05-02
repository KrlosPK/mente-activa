import dotenv from "dotenv"
dotenv.config()
import express from "express"
import colors from "colors"
import db from "./config/db.js"



console.log(process.env.DATABASE_URL)

const conectDB = async () => {
    try {
        await db.authenticate()
        db.sync()
        console.log(colors.bold.magenta(`conexion correcta a la base de datos`))
    } catch (error) {
        console.log(`error al conectar la base de datos ${error}`)
    }
}
conectDB()

const server = express()


export default server