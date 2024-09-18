require("dotenv").config()
const express = require("express")
const authRoutes = require("./routes/auth")

const app = express()

// Middleware
app.use(express.json())

app.use("/api/auth", authRoutes)

app.listen(process.env.PORT, () => {
  console.log(`Listening for request on port ${process.env.PORT}`)
})

// Git Test