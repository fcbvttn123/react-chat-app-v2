const StreamChat = require("stream-chat").StreamChat
const serverClient = StreamChat.getInstance(
  process.env.STREAM_API_KEY,
  process.env.STREAM_API_SECRET
)

async function postLogin(req, res) {
  const { username, firstTimeLogIn } = req.body
  try {
    const token = serverClient.createToken(username)
    if (firstTimeLogIn) {
      await serverClient.upsertUsers([
        {
          id: username,
          role: "user",
          name: username,
        },
      ])
      console.log("User Upserted")
    } else {
      console.log("User already existed")
    }
    res.json({ username, token })
  } catch (err) {
    console.error(err)
  }
}

module.exports = {
  postLogin,
}
