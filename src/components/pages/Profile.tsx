import { useEffect, useMemo, useState } from "react";
import UserData from "../../model/UserData";
import { Subscription } from "rxjs";
import { authService } from "../../config/service-config";
import { useSelectorAuth } from "../../redux/store";
import {
    Box, Button, Container, CssBaseline, Grid, TextField, ThemeProvider, Typography, createTheme
} from "@mui/material";



const Profile: React.FC = () => {
    const userData: UserData = useSelectorAuth()
    //code below TODO move to useSelectorUsers in hooks
    const [users, setUsers] = useState<UserData[]>([]);
    useEffect(() => {
        const subscription: Subscription = authService.getUsers()
            .subscribe({
                next(usersArray: UserData[]) {
                    setUsers(usersArray);
                }
            });
        return () => subscription.unsubscribe();
    }, [])

    const initProfile: UserData = getUserProfile()
    // console.log(initProfile)
    // const userProfile: UserData = users.filter(u => u?.email == userData?.email)[0]!
    // const [userProfile, setUserProfile] = useState(getUserProfile())
    function getUserProfile(): UserData {
        return users.filter(u => u?.email == userData?.email)[0]! as UserData
    }

    // const [profile, setProfile] = useState<UserData>(initProfile);
    const [profile, setProfile] = useState<UserData>();

    // console.log(profile)

    //balagan below cuz users at first empty[]
    useEffect(() => {
        setProfile(initProfile)
        
        // setIsNameFilled(initProfile?.name != '')
        // setIsPhoneFilled(initProfile?.phone != '')
        // setIsAddressFilled(initProfile?.address != '')
    }, [initProfile])

    // const [isNameFilled, setIsNameFilled] = useState(initProfile?.name != '')
    // const [isPhoneFilled, setIsPhoneFilled] = useState(initProfile?.phone != '')
    // const [isAddressFilled, setIsAddressFilled] = useState(initProfile?.address != '')
    // const [isNameFilled, setIsNameFilled] = useState(false)
    // const [isPhoneFilled, setIsPhoneFilled] = useState(false)
    // const [isAddressFilled, setIsAddressFilled] = useState(false)

    function onSubmitFn(event: any) {
        event.preventDefault()
        // console.log(profile)

        // if (profile?.name != '') {
        //     setIsNameFilled(true)
        // }

        authService.updateUserData(profile!)
        //i think we can get from form full data (i mean 'disabled' as well)
        // const data = new FormData(event.currentTarget);
        // const email: string = data.get('email') as string //!
        // const password: string = data.get('password') as string //!
        //to be handler and here call update fn in service
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