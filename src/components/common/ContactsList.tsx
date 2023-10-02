import { useMemo, useRef, useState } from "react"
import { authService, chatRoomService } from "../../config/service-config"
import { useSelectorContacts } from "../../hooks/hooks"
import UserData from "../../model/UserData"
import { useSelectorAuth } from "../../redux/store"
import {
    Avatar, Box, Button, List, ListItem, ListItemAvatar, ListItemText, Menu, MenuItem, MenuList, Modal, Typography
} from "@mui/material"
import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox';
import Correspondence from "../pages/Correspondence"
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AppBlockingIcon from '@mui/icons-material/AppBlocking';
import MenuIcon from '@mui/icons-material/Menu';
import { authActions } from "../../redux/slices/authSlice"
import { useDispatch } from "react-redux"

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
    
    const dispatch = useDispatch()
    // console.log(contacts.length); //вон из чата если пропал из контактов
    if (contacts.length > 0 && !contacts.some(c => c.username == username)) {
        console.log('как будто бы нету')
        authService.logout()
        dispatch(authActions.reset());
    }

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


    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const [currentContactName, setCurrentContactName] = useState('')

    return <List>{contacts.map((c, index) => {
        // const contactName = c.username
        // console.log(c.username)
        // setCurrentContactName(c.username)
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

                {getRole() == 'admin' && username != c.username && <Box>
                    <Button onClick={(event) => {
                        setAnchorEl(event.currentTarget)
                        setCurrentContactName(c.username)
                    }}>
                        <MenuIcon />
                    </Button>
                </Box>}

                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={() => setAnchorEl(null)}
                    >
                        <MenuItem onClick={() => {
                            setOpenCorrespondence(true)
                            setClientFrom(currentContactName)
                            setClientTo('')
                            setAnchorEl(null)
                        }}>
                            <VisibilityIcon />
                        </MenuItem>
                        <MenuItem onClick={() => {
                            //
                            console.log(`delete ${currentContactName}`)
                            authService.deleteUser(currentContactName)
                            setAnchorEl(null)
                        }}>
                            <DeleteOutlineIcon />
                        </MenuItem>
                        <MenuItem onClick={() => {
                            //
                            console.log(index)
                            console.log(`block ${currentContactName}`)
                            setAnchorEl(null)
                        }}>
                            <AppBlockingIcon />
                        </MenuItem>
                    </Menu>

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