const StreamChat = require("stream-chat").StreamChat
const serverClient = StreamChat.getInstance(
  process.env.STREAM_API_KEY,
  process.env.STREAM_API_SECRET
)

async function postLogin(req, res) {
  const { username, firstTimeLogIn } = req.body
  try {
    if (firstTimeLogIn) {
      await serverClient.upsertUsers([
        {
          id: username,
          role: "user",
          name: username,
        },
      ])
    }
    const token = serverClient.createToken(username)
    res.json({ id: username, username, token })
  } catch (err) {
    console.error(err)
  }
}

module.exports = {
  postLogin,
}
