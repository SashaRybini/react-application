import { useEffect, useState } from "react";
import UserData from "../../model/UserData";
import { authService } from "../../config/service-config";
import { useSelectorAuth } from "../../redux/store";
import { Box, Button, Grid, TextField } from "@mui/material";
import { useDispatchCode, useSelectorUsers } from "../../hooks/hooks";

const Profile: React.FC = () => {
    const userData: UserData = useSelectorAuth()

    const users = useSelectorUsers()

    const initProfile: UserData = getUserProfile()
    function getUserProfile(): UserData {
        return users.filter(u => u?.email == userData?.email)[0]! as UserData
    }

    const [profile, setProfile] = useState<UserData>();

    //balagan below cuz users at first empty[]..
    useEffect(() => {
        setProfile(initProfile)
    }, [initProfile])

    const dispatch = useDispatchCode()
    function onSubmitFn(event: any) {
        event.preventDefault()
        try {
            const userData = authService.updateUserData(profile!)
            dispatch('', 'updated')
        } catch (error: any) {
            dispatch(error, '')
        }
    }

    function handlerName(event: any) {
        const name = event.target.value;
        const profileCopy = { ...profile };
        profileCopy.name = name;
        setProfile(profileCopy as UserData);
    }
    function handlerAddress(event: any) {
        const address = event.target.value;
        const profileCopy = { ...profile };
        profileCopy.address = address;
        setProfile(profileCopy as UserData);
    }
    function handlerPhone(event: any) {
        const phone = event.target.value;
        const profileCopy = { ...profile };
        profileCopy.phone = phone;
        setProfile(profileCopy as UserData);
    }

    function isFullFilled(): boolean {
        return initProfile?.address != '' && initProfile?.phone != '' &&
            initProfile?.name != ''
    }

    return <Box>
        {profile && <Box className={"center-style"}>
            <Box sx={{ marginTop: { sm: "5vh" } }}>
                <form onSubmit={onSubmitFn} >
                    <Grid container spacing={4} justifyContent="center">
                        <Grid item xs={8} sm={5} >
                            <TextField type="text"
                                fullWidth label="Email"
                                disabled={true}
                                value={profile.email}
                            />
                        </Grid>
                        <Grid item xs={8} sm={5} >
                            <TextField type="text"
                                // required={!isNameFilled}
                                fullWidth label="Name"
                                disabled={initProfile!.name != ''}
                                onChange={handlerName}
                                value={profile.name}
                            />
                        </Grid>
                        <Grid item xs={8} sm={5} >
                            <TextField type="tel"
                                // required={initProfile!.phone == ''}
                                fullWidth label="Phone"
                                disabled={initProfile!.phone != ''}
                                onChange={handlerPhone}
                                value={profile.phone}
                            />
                        </Grid>
                        <Grid item xs={8} sm={5} >
                            <TextField type="text"
                                // required={initProfile!.address == ''}
                                fullWidth label="Address"
                                disabled={initProfile!.address != ''}
                                onChange={handlerAddress}
                                value={profile.address}
                            />
                        </Grid>
                    </Grid>
                    <Box sx={{ marginTop: { xs: "10vh", sm: "5vh" }, textAlign: "center" }}>
                        {!isFullFilled() && <Button type="submit" >Submit</Button>}
                    </Box>
                </form>
            </Box>
        </Box>}
    </Box>
}
export default Profile