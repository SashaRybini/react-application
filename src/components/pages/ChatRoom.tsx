import { Box, Button, Container, Grid, Paper, TextField } from "@mui/material"
import ContactsList from "../common/ContactsList"
import { useEffect, useState } from "react";
import MessageType from "../../model/MessageType";
import UserData from "../../model/UserData";
import { useSelectorAuth } from "../../redux/store";
import { getISODateStr } from "../../util/date-functions";
import { messagesService } from "../../config/service-config";
import Message from "../common/Message";
import { useNavigate } from "react-router-dom";

// const wsService = new WebSocketService()

const ChatRoom: React.FC = () => {
    const userData: UserData = useSelectorAuth()
    // const navigate = useNavigate()
    // useEffect(() =>{
    //     if (!userData) {
    //         navigate('/signin')
    //         // return null
    //     }
    // },[])

    // const [message, setMessage] = useState<MessageType>({ from: userData!.username, to: 'all', text: '', date: '' })
    const [message, setMessage] = useState<MessageType>({ from: userData? userData!.username : '', to: 'all', text: '', date: '' })


    function handleText(event: any) {
        const text = event.target.value
        const messageCopy = { ...message }
        messageCopy.text = text
        setMessage(messageCopy)
    }

    function handleSendTo(usernameTo: string) {
        const messageCopy = { ...message }
        messageCopy.to = usernameTo
        setMessage(messageCopy)
    }

    function onSubmitFn(event: any) {
        event.preventDefault()
        // message.date = getISODateStr(new Date()) //
        message.date = new Date().toString()
        // console.log(message)

        messagesService.send(message)

        event.target.reset()
    }

    function onResetFn(event: any) {
        setMessage({ from: userData!.username, to: message.to, text: '', date: '' })
    }

    const [messages, setMessages] = useState<MessageType[]>([])

    useEffect(() => {
        // console.log('add listener');
        if (userData) { //иначе идет реконнект без юзердаты
            if(!messagesService.isWebsocket()) { //потому что колится раньше апп я хз
                messagesService.reconnect()
            }
            messagesService.addListener(handleMessage)
        }
    }, [])
    function handleMessage(event: any) {
        const message: MessageType | any = JSON.parse(event.data)

        if (message.action == 'deleting') {
            setMessages((prevMessages) => prevMessages.filter(m => JSON.stringify(m) != JSON.stringify(message.message)))
        }

        if (message.from) { //там выше также будут сообщ о коннекте.. странно что как мессадж тайп проходит..
            setMessages((prevMessages) => [...prevMessages, message])
        }
        
    }
    

    return <Box>
        <Container sx={{ display: 'flex', flexDirection: 'column' }}>
            <Grid container spacing={2} sx={{ flex: 1 }}>
                <Grid item xs={3}>
                    <ContactsList handleSendTo={handleSendTo}/>
                </Grid>
                <Grid item xs={9}>
                    <Paper elevation={3} sx={{ p: 2, height: '60vh', overflowY: 'auto' }}>
                        {messages.length > 0 && messages.map((message, index) => {
                            return <Message key={index} message={message} isModal={false}/>
                        })}
                    </Paper>
                </Grid>
            </Grid>
        </Container>
        <Box style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', marginLeft: '75px' }}>
            <button onClick={() => handleSendTo('all')} hidden = {message.to == 'all'}>to all</button>
            <form style={{ display: 'flex', width: '60%' }}
                onSubmit={onSubmitFn}
                onReset={onResetFn}
            >   
                <TextField
                    variant="outlined"
                    type="text"
                    fullWidth
                    placeholder="Type your message..."
                    InputProps={{
                        startAdornment: 'to ' + message.to
                      }}
                    value={message.text}
                    onChange={handleText}
                />
                <Button
                    style={{borderRadius: 5}}
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
export default ChatRoom