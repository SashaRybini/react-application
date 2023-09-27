import { useMemo, useState } from "react"
import { chatRoomService } from "../../config/service-config"
import { useSelectorContacts } from "../../hooks/hooks"
import UserData from "../../model/UserData"
import { useSelectorAuth } from "../../redux/store"
import { Avatar, Box, List, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material"

type contactType = {
    username: string,
    image: string,
    status: "online" | 'offline' | 'blocked'
}

const ContactsList: React.FC = () => {
    const userData: UserData = useSelectorAuth()
    const username = userData?.username

    const contactsDb = useSelectorContacts()

    const contacts = useMemo(() => getContacts(), [contactsDb])

    function getContacts() {
        return contactsDb.map(c => {
            const username = c.username
            let status
            if (c.isBlocked) {
                status = 'blocked'
            } else {
                status = c.isActive ? 'online' : 'offline'
            }
            const image = c.image
            return { username, status, image }
        })
    }

    return <List>{contacts.map(c => {
        return (
            <Box key={c.username}>
                <ListItem>
                    <ListItemAvatar>
                        <Avatar src={c.image} />
                    </ListItemAvatar>
                    <ListItemText
                        primary={c.username}
                        secondary={
                            <Typography
                                variant="body2"
                                color="textSecondary"
                            >
                                {c.status}
                            </Typography>
                        }
                    />
                </ListItem>
            </Box>
        )
    })}</List>
}
export default ContactsList