import React, { useState } from 'react';
import {
    TextField, Button, Grid, Box, Typography, Container, CssBaseline, Avatar
} from '@mui/material';
import UserData from '../../model/UserData';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

type Props = {
    submitFn: (newUser: UserData) => void
}

const initialUser: UserData = {
    username: '', email: '', role: 'user', password: ''
}

const RegistrationForm: React.FC<Props> = ({ submitFn }) => {
    const [userData, setUserData] = useState(initialUser);

    const handleChange = (event: any) => {
        const { name, value } = event.target
        setUserData((prevData) => ({
            ...prevData,
            [name]: value,
        }))
    }

    function onSubmitFn(event: any) {
        event.preventDefault();
        submitFn(userData);
        event.target.reset();
    }

    return <Box sx={{ marginTop: { sm: "1vh" } }}>
        <form onSubmit={onSubmitFn} >
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5" style={{ marginBottom: 12 }}>
                        Sign up
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={4} md={12}>
                            <TextField
                                label="Name"
                                name="username"
                                fullWidth
                                required
                                value={userData.username}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4} md={12}>
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
                        <Grid item xs={12} sm={4} md={12}>
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
                        <Grid item xs={12} sm={4} md={12}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                            >
                                sign up
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </form>
    </Box>
}

export default RegistrationForm;