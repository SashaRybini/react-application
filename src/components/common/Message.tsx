import { Avatar, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material"
import { chatRoomService } from "../../config/service-config"
import MessageType from "../../model/MessageType"
import { useEffect, useState } from "react"

type Props = {
    message: MessageType
}
const Message: React.FC<Props> = ({ message }) => {

    // const image = await chatRoomService.getImageUrl(message.from)

    const [image, setImage] = useState<string | null>(null);

    useEffect(() => {
        const fetchImageUrl = async () => {
            const imageUrl = await chatRoomService.getImageUrl(message.from);
            setImage(imageUrl);
        }
        fetchImageUrl();
    }, []);


    return <ListItem >
        <ListItemAvatar>
            {image && <Avatar src={image} />}
        </ListItemAvatar>
        {message.from && <ListItemText
            primary={`${message.from}: ${'\u00A0'.repeat(30)}${message.text}`}
            secondary={
                <Typography
                    variant="body2"
                    color="textSecondary"
                >
                    {message.date}
                </Typography>
            }
        />}
    </ListItem>
}
export default Message



