import { useEffect, useState } from "react"
import { messagesService } from "../../config/service-config"
import MessageType from "../../model/MessageType"
import Message from "../common/Message"
import { Paper } from "@mui/material"

type Props = {
    clientFrom: string,
    clientTo: string
}

const Correspondence: React.FC<Props> = ({ clientFrom, clientTo }) => {

    const [messages, setMessages] = useState<MessageType[]>([])
    useEffect(() => {
        fetchMessages()
    }, [])
    async function fetchMessages() {
        const messagesStr = await messagesService.getPrivateMessages(clientFrom, clientTo)
        setMessages(JSON.parse(messagesStr))
    }

    return <Paper elevation={3} sx={{ p: 2, height: '60vh', overflowY: 'auto' }}>
        {messages.map((msg, index) => {
            return <Message message={msg} isModal={true} />
        })}

    </Paper>

}
export default Correspondence

