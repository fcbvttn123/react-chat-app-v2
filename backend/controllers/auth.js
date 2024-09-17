const StreamChat = require("stream-chat").StreamChat
const serverClient = StreamChat.getInstance(
  process.env.STREAM_API_KEY,
  process.env.STREAM_API_SECRET
)

async function postLogin(req, res) {
  const { username } = req.body
  const token = serverClient.createToken(username)
  res.json({ username, token })
}

module.exports = {
  postLogin,
}
