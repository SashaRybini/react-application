import { Box, Button, Container, Grid, Paper, TextField } from "@mui/material"
import ContactsList from "../common/ContactsList"
import { useEffect, useState } from "react";
import MessageType from "../../model/MessageType";
import UserData from "../../model/UserData";
import { useSelectorAuth } from "../../redux/store";
import { getISODateStr } from "../../util/date-functions";
import { messagesService } from "../../config/service-config";
import Message from "../common/Message";

// const wsService = new WebSocketService()

const ChatRoomUser: React.FC = () => {
    const userData: UserData = useSelectorAuth()
    // initialMessage.from = userData!.username

    const [message, setMessage] = useState<MessageType>({ from: userData!.username, to: 'all', text: '', date: '' })

    // const [text, setText] = useState('')

    function handleText(event: any) {
        const text = event.target.value
        const messageCopy = { ...message }
        messageCopy.text = text
        setMessage(messageCopy)

    }

    function onSubmitFn(event: any) {
        event.preventDefault()
        message.date = getISODateStr(new Date())
        // console.log(message)

        messagesService.send(message)

        event.target.reset()
    }

    function onResetFn(event: any) {
        setMessage({ from: userData!.username, to: 'all', text: '', date: '' })
    }

    const [messages, setMessages] = useState<MessageType[]>([])

    useEffect(() => {
        const handleMessage = (event: any) => {
            const message: MessageType = JSON.parse(event.data);
            setMessages((prevMessages) => [...prevMessages, message]);
        };

        messagesService.addListener(handleMessage);
    }, []);

    return <Box>
        <Container sx={{ display: 'flex', flexDirection: 'column' }}>
            <Grid container spacing={2} sx={{ flex: 1 }}>
                <Grid item xs={2}>
                    <ContactsList />
                </Grid>
                <Grid item xs={10}>
                    <Paper elevation={3} sx={{ p: 2, height: '60vh', overflowY: 'auto' }}>
                        {messages.length > 0 && messages.map((message, index) => {
                            return <Message key={index} message={message}/>
                        })}
                    </Paper>
                </Grid>
            </Grid>
        </Container>
        <Box style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <form style={{ display: 'flex', width: '60%' }}
                onSubmit={onSubmitFn}
                onReset={onResetFn}
            >
                <TextField
                    variant="outlined"
                    fullWidth
                    placeholder="Type your message..."
                    InputProps={{ sx: { borderRadius: 0 } }}
                    value={message.text}
                    onChange={handleText}
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary" sx={{ borderRadius: 0, marginLeft: '10px' }}
                >
                    Send
                </Button>
            </form>
        </Box>
    </Box>
}
export default ChatRoomUser