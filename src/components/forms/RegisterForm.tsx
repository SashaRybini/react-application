// import { Box, Button, Grid, TextField } from "@mui/material";
// import UserData from "../../model/UserData"
// import { useState } from "react";

// type Props = {
//     submitFn: (newUser: UserData) => void
// }

// const initialUser: UserData = {
//     email: '', role: 'user', name: '', phone: '', adress: ''
// };

// const RegisterForm: React.FC<Props> = ({submitFn}) => {

//     const [newUser, setNewUser] = useState<UserData>({email: '', role: 'user', name: '', phone: '', adress: ''});

//     function handlerName(event: any) {
//         const name = event.target.value;
//         const userCopy = { ...newUser };
//         userCopy.name = name;
//         setNewUser(userCopy)
//     }

//     async function onSubmitFn(event: any) {
//         event.preventDefault();
//         submitFn(newUser);
//         event.target.reset();
//     }
//     function onResetFn(event: any) {
//         setNewUser(initialUser);
//     }

//     return <Box sx={{ marginTop: { sm: "25vh" } }}>
//         <form onSubmit={onSubmitFn} onReset={onResetFn}>

//             <Grid item xs={8} sm={5} >
//                 <TextField type="text" required fullWidth label="Name"
//                     helperText="enter name" onChange={handlerName}
//                     value={newUser.name} />
//             </Grid>


//             <Box sx={{ marginTop: { xs: "10vh", sm: "5vh" }, textAlign: "center" }}>
//                 <Button type="submit" >Submit</Button>
//                 <Button type="reset">Reset</Button>
//             </Box>
//         </form>
//     </Box>
// }
// export default RegisterForm








import React, { useState } from 'react';
import {
    TextField, Button, Grid, Box, Typography,
} from '@mui/material';
import UserData from '../../model/UserData';

type Props = {
    submitFn: (newUser: UserData) => void
}

const initialUser: UserData = {
    email: '', role: 'user', name: '', phone: '', address: '', password: ''
}

const RegistrationForm: React.FC<Props> = ({ submitFn }) => {
    const [userData, setUserData] = useState(initialUser);

    const handleChange = (event: any) => {
        const { name, value } = event.target;
        setUserData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const onSubmitFn = (event: any) => {
        event.preventDefault();
        submitFn(userData);
    };



    return <Box sx={{ marginTop: { sm: "1vh" } }}>
        <form onSubmit={onSubmitFn} >
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography variant="h5" align="center">
                        Registration Form
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={12}>
                    <TextField
                        label="Email"
                        name="email"
                        type="email"
                        fullWidth
                        required
                        value={userData.email}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={12}>
                    <TextField
                        label="Name"
                        name="name"
                        fullWidth
                        required
                        value={userData.name}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={12}>
                    <TextField
                        label="Address"
                        name="address"
                        fullWidth
                        required
                        value={userData.address}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={12}>
                    <TextField
                        label="Phone"
                        name="phone"
                        type="tel"
                        fullWidth
                        required
                        value={userData.phone}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={12}>
                    <TextField
                        label="Password"
                        name="password"
                        type="password"
                        fullWidth
                        required
                        value={userData.password}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={12}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                    >
                        Register
                    </Button>
                </Grid>
            </Grid>
        </form>
        <Grid item xs={12} sm={6} md={12}>
            <Button
                color="primary"
                fullWidth
                onClick={() => submitFn({ email: 'GOOGLE', password: '' })}
            >
                Sign up w google
            </Button>
        </Grid>
    </Box>

}

export default RegistrationForm;
