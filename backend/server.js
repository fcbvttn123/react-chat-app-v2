require("dotenv").config()
const express = require("express")

const app = express()

// Middleware
app.use(express.json())

app.get("/", (req, res) => {
  res.json({ test: "Hello World" })
})

app.listen(process.env.PORT, () => {
  console.log(`Listening for request on port ${process.env.PORT}`)
})
