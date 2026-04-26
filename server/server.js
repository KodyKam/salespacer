// server/server.js
import app from "./app.js"
import { connectDB } from "./config/db.js"
import cors from "cors"

app.use(cors({

  origin: [

    "https://salespacer.vercel.app",

    "https://salespacerapp.vercel.app"

  ],

  credentials: true

}))

connectDB()

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})