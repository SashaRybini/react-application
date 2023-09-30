import { Avatar, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material"
import { chatRoomService } from "../../config/service-config"
import MessageType from "../../model/MessageType"
import { useEffect, useState } from "react"
import UserData from "../../model/UserData"
import { useSelectorAuth } from "../../redux/store"
import { getDateTime, getTime } from "../../util/date-functions"

type Props = {
    message: MessageType,
    isModal: boolean
}
const Message: React.FC<Props> = ({ message, isModal }) => {
    const userData: UserData = useSelectorAuth()
    const username = userData?.username

    // const image = await chatRoomService.getImageUrl(message.from)

    const [image, setImage] = useState<string | null>(null)

    useEffect(() => {
        fetchImageUrl()
    }, [])
    async function fetchImageUrl() {
        const imageUrl = await chatRoomService.getImageUrl(message.from)
        setImage(imageUrl)
    }

    function getMessage() {
        let sender = message.from
        if(message.to == username) { //&& message.from != 'all'
            sender += ' private to me'
        }
        if (message.from == username && message.to != 'all') {
            sender += ` private to ${message.to}`
        }
        return `${sender}: ${'\u00A0'.repeat(30 - sender.length)}${message.text}`
    }
    function getColor() {
        let color = ''
        if (message.from == username && message.to != 'all') {
            color = 'lightblue'
        }
        if (message.to == username) {
            color = 'lightyellow'
        }
        return color
    }


    return <ListItem style={{ backgroundColor: getColor()}}>
        <ListItemAvatar>
            {image && <Avatar src={image} />}
        </ListItemAvatar>
        {message.from && <ListItemText
            primary={getMessage()}
            secondary={
                <Typography
                    variant="body2"
                    color="textSecondary"
                >
                    {isModal ? getDateTime(new Date(message.date)) : getTime(new Date(message.date))}
                </Typography>
            }
        />}
    </ListItem>
}
export default Message



