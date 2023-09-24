import UserData from "../../model/UserData"
import { useSelectorAuth } from "../../redux/store"
import ChatRoomAdmin from "./ChatRoomAdmin"
import ChatRoomUser from "./ChatRoomUser"

const ChatRoom: React.FC = () => {
    const userData: UserData = useSelectorAuth()
    return userData && userData.role === 'admin' ? <ChatRoomAdmin /> : <ChatRoomUser />
}
export default ChatRoom