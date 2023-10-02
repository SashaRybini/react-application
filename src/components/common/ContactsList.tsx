import { useMemo, useState } from "react"
import { chatRoomService } from "../../config/service-config"
import { useSelectorContacts } from "../../hooks/hooks"
import UserData from "../../model/UserData"
import { useSelectorAuth } from "../../redux/store"
import {
    Avatar, Box, Button, List, ListItem, ListItemAvatar, ListItemText, Modal, Typography
} from "@mui/material"
import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox';
import Correspondence from "../pages/Correspondence"
import VisibilityIcon from '@mui/icons-material/Visibility';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    height: '70%', //
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
}
function getRole() {
    const jwt = localStorage.getItem('auth-data-jwt')
    if (jwt) {
        const jwtPayloadJson = atob(jwt.split('.')[1])
        const jwtPayloadObj = JSON.parse(jwtPayloadJson)
        const role = jwtPayloadObj.role
        return role
    }
}
type contactStatus = "online" | 'offline' | 'blocked'
type contactType = {
    username: string,
    image: string,
    status: contactStatus
}

type Props = {
    handleSendTo: (usernameTo: string) => void
}

const ContactsList: React.FC<Props> = ({ handleSendTo }) => {
    const userData: UserData = useSelectorAuth()
    const username = userData?.username
    const [clientFrom, setClientFrom] = useState(username)

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

    const [openCorrespondence, setOpenCorrespondence] = useState(false)
    const [clientTo, setClientTo] = useState('')

    return <List>{contacts.map(c => {
        return <Box key={c.username}>
            <ListItem>
                <ListItemAvatar>
                    {username != c.username ? <div
                        onClick={() => {
                            setOpenCorrespondence(true)
                            setClientTo(c.username)
                        }}
                        style={{ cursor: 'pointer' }}
                    >
                        <Avatar src={c.image} />
                    </div> : <Avatar src={c.image} />}
                </ListItemAvatar>
                <ListItemText
                    primary={c.username}
                    secondary={
                        <Typography
                            variant="body2"
                            color={c.status == 'online' ? 'green' : c.status == 'blocked' ? 'red' : 'pink'}
                        >
                            {c.status}
                        </Typography>
                    }
                />
                {username != c.username && <Button
                    onClick={() => handleSendTo(c.username)}
                >
                    <ForwardToInboxIcon />
                </Button>}
                {getRole() == 'admin' && username != c.username && <Button onClick={() => {
                    setOpenCorrespondence(true)
                    setClientFrom(c.username)
                    setClientTo('') //like a null
                }}>
                    <VisibilityIcon />
                </Button>}
            </ListItem>
        </Box>
    })}
        <Modal
            open={openCorrespondence}
            onClose={() => setOpenCorrespondence(false)}
        >
            <Box sx={style}>
                <Correspondence clientFrom={clientFrom!} clientTo={clientTo} />
            </Box>
        </Modal>
    </List>
}
export default ContactsList