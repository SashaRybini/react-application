import { useEffect, useMemo, useState } from "react"
import { messagesService } from "../../config/service-config"
import MessageType from "../../model/MessageType"
import Message from "../common/Message"
import { Box, Button, Paper, TextField } from "@mui/material"
import { filterMessages } from "../../service/ChatRoomProcess"

type Props = {
    clientFrom: string,
    clientTo: string
}

export type Request = {
    sent: boolean,
    received: boolean,
    dateFrom: Date,
    dateTo: Date,
    includeToAll: boolean
}

const Correspondence: React.FC<Props> = ({ clientFrom, clientTo }) => {

    const [request, setRequest] = useState<Request>({ sent: false, received: false, dateFrom: new Date('1900-01-01'), dateTo: new Date(), includeToAll: false })

    const [messagesDb, setMessages] = useState()
    useEffect(() => {
        fetchMessages()
    }, [])
    async function fetchMessages() {
        const messagesStr = await messagesService.getPrivateMessages(clientFrom, clientTo)
        setMessages(JSON.parse(messagesStr))
    }

    const messages: MessageType[] = useMemo(() => filterMessages(request, messagesDb, clientFrom, clientTo), [request])

    function handleSent() {
        const requestCopy = { ...request }
        requestCopy.sent = !request.sent
        setRequest(requestCopy)
    }
    function handleReceived() {
        const requestCopy = { ...request }
        requestCopy.received = !request.received
        setRequest(requestCopy)
    }
    function handleInclude() {
        const requestCopy = { ...request }
        requestCopy.includeToAll = !request.includeToAll
        setRequest(requestCopy)
    }
    function handleDateFrom(event: any) {
        const date = event.target.value
        const requestCopy = { ...request }
        requestCopy.dateFrom = new Date(date)
        setRequest(requestCopy)
    }
    function handleDateTo(event: any) {
        const date = event.target.value
        const requestCopy = { ...request }
        requestCopy.dateTo = new Date(date)
        setRequest(requestCopy)
    }

    return <Box>
        <Button
            onClick={() => handleSent()}
            variant="contained"
            style={{ backgroundColor: request.sent ? 'green' : 'lightblue', color: 'white' }}
        >
            sent
        </Button>
        <Button
            onClick={() => handleReceived()}
            variant="contained"
            style={{ backgroundColor: request.received ? 'green' : 'lightblue', color: 'white' }}
        >
            received
        </Button>
        <Button
            onClick={() => handleInclude()}
            variant="contained"
            style={{ backgroundColor: request.includeToAll ? 'green' : 'lightblue', color: 'white' }}
        >
            include to all
        </Button>
        <TextField
            size="small"
            type="date"
            label="Messages after"
            InputLabelProps={{
                shrink: true
            }}
            onChange={handleDateFrom}
        />
        <TextField
            size="small"
            type="date"
            label="Messages before"
            InputLabelProps={{
                shrink: true
            }}
            onChange={handleDateTo}
        />

        <Paper elevation={3} sx={{ p: 2, height: '60vh', overflowY: 'auto' }}>
            {messages.map((msg, index) => {
                return <Message key={index} message={msg} isModal={true} />
            })}
        </Paper>
    </Box>

}
export default Correspondence

