import express from "express"
import dotenv from "dotenv"
import path from "path"
import authRoutes from "./routes/auth.route.js"
import cookieParser from 'cookie-parser';
import { connectDB } from "./lib/db.js"

dotenv.config()

const app = express()
const __dirname = path.resolve()

const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(cookieParser())

//Router
app.use("/api/auth", authRoutes)
// app.use("/api/message", messageRoutes)


//Make ready for deployment
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*", (_, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
}

//Connect db
connectDB()

app.listen(PORT, () => {
    console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
})