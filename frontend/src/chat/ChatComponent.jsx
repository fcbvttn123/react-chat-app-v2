import {
  Chat,
  Channel,
  ChannelList,
  Window,
  ChannelHeader,
  MessageList,
  MessageInput,
  Thread,
  useCreateChatClient,
} from "stream-chat-react"
import "stream-chat-react/dist/css/v2/index.css"

export function ChatComponent({ clientData }) {
  const client = useCreateChatClient(clientData)
  const filters = {
    members: { $in: [clientData.userData.username] },
    type: "messaging",
  }
  const options = { presence: true, state: true }
  const sort = { last_message_at: -1 }
  if (!client) return <div>Loading...</div>
  return (
    <Chat client={client}>
      <ChannelList sort={sort} filters={filters} options={options} />
      <Channel>
        <Window>
          <ChannelHeader />
          <MessageList />
          <MessageInput />
        </Window>
        <Thread />
      </Channel>
    </Chat>
  )
}
