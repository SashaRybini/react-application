import { Card, CardContent, Typography } from "@mui/material"
import UserData from "../../model/UserData"

type Props = {
    userInfo: UserData
}
const UserInfoCard: React.FC<Props> = ({ userInfo }) => {
    return <Card>
        {userInfo && <CardContent>
            <Typography>
                Name: {userInfo.name}
            </Typography>
            <Typography>
                Email: {userInfo.email}
            </Typography>
            <Typography>
                Phone: {userInfo.phone}
            </Typography>
            <Typography>
                Address: {userInfo.address}
            </Typography>
        </CardContent>}
    </Card>
}
export default UserInfoCard