import { useMemo, useState } from "react"
import { chatRoomService } from "../../config/service-config"
import { useSelectorContacts } from "../../hooks/hooks"
import UserData from "../../model/UserData"
import { useSelectorAuth } from "../../redux/store"

type contactType = {
    username: string,
    imageUrl: string,
    status: "online" | 'offline' | 'blocked'
}

const ContactsList: React.FC = () => {
    const userData: UserData = useSelectorAuth()
    const username = userData?.username

    const contactsDb = useSelectorContacts()

    const contacts = contactsDb.map(c => {
        const username = c.username
        let status
        if (c.isBlocked) {
            status = 'blocked'
        } else {
            status = c.isActive ? 'online' : 'offline'
        }
        const image = c.image
        return {username, status, image}
    })

    return <div>{contacts.map(c => JSON.stringify(c))}</div>
}
export default ContactsList