import {
    Avatar, Button, ListItem, ListItemAvatar, ListItemText, Typography
} from "@mui/material"
import { chatRoomService, messagesService } from "../../config/service-config"
import MessageType from "../../model/MessageType"
import { useEffect, useState } from "react"
import UserData from "../../model/UserData"
import { useSelectorAuth } from "../../redux/store"
import { getDateTime, getTime } from "../../util/date-functions"
import ClearIcon from '@mui/icons-material/Clear';

type Props = {
    message: MessageType,
    isModal: boolean
}
const Message: React.FC<Props> = ({ message, isModal }) => {
    const userData: UserData = useSelectorAuth()
    const username = userData?.username

    const [image, setImage] = useState<string>('')

    useEffect(() => {
        fetchImageUrl()
    }, [message.from]) //а иначе путаются картинки
    async function fetchImageUrl() {
        const imageUrl = await chatRoomService.getImageUrl(message.from)
        setImage(imageUrl)
    }

    function getMessage() {
        //первая строка для админа, чтобы он в своем супер глазе видел кто - кому отправил
        let sender = `${message.from} to ${message.to}`
        if (message.to == username) { //&& message.from != 'all'
            sender = `${message.from} private to me`
        }
        if (message.from == username && message.to != 'all') {
            sender = `${message.from} private to ${message.to}`
        }
        return `${sender}: ${'\u00A0'.repeat(30 - sender.length)}${message.text}`
    }
    function getColor() {
        let color = ''
        if (message.from == username && message.to != 'all') {
            color = 'lightblue'
        } else if (message.to == username) {
            color = 'lightyellow'
        } else if (message.from == username && message.to == 'all') {
            color = 'whitesmoke'
        }
        return color
    }


    return <ListItem style={{ backgroundColor: getColor() }}>
        <ListItemAvatar>
            <Avatar src={image} />
        </ListItemAvatar>
        <ListItemText
            primary={getMessage()}
            secondary={
                <Typography
                    variant="body2"
                    color="textSecondary"
                >
                    {isModal ? getDateTime(new Date(message.date)) : getTime(new Date(message.date))}
                </Typography>
            }
        />

        {(message.from == username || username == 'admin') && <Button
            onClick={() => {
            messagesService.deleteMessage(message)
        }}
        >
            <ClearIcon />
        </Button>}
        
    </ListItem>
}
export default Message



