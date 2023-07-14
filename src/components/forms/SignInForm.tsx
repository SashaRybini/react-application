import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import LoginData from '../../model/LoginData';
import { Alert, Grid, Modal, Snackbar } from '@mui/material';
import { useState } from 'react';
import RegisterForm from './RegisterForm';
import UserData from '../../model/UserData';
import { authService } from '../../config/service-config';

const defaultTheme = createTheme();

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

type Props = {
    loginSubmitFn: (loginData: LoginData) => void
    registerSubmitFn: (newUser: UserData) => void
}

const SignInForm: React.FC<Props> = ({ loginSubmitFn, registerSubmitFn }) => {

    const handleSubmitSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const email: string = data.get('email')! as string
        const password: string = data.get('password')! as string
        const res = await loginSubmitFn({ email, password })
    };

    function googleSubmit() {
        loginSubmitFn({ email: 'GOOGLE', password: '' })
    }

    const [openRegisterModal, setOpenRegisterModal] = useState(false)
    const handleSubmitRegister = (newUser: UserData) => {
        setOpenRegisterModal(false)
        registerSubmitFn(newUser)
    }

    return (
        <ThemeProvider theme={defaultTheme}>
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
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <Box
                        component="form"
                        onSubmit={handleSubmitSignIn}
                        noValidate sx={{ mt: 1 }}
                    >
                        <Grid container justifyContent={'center'} spacing={3}>
                            <Grid item xs={12} sm={6} md={12}>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    autoFocus
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={12}>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={12} >
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2 }}
                                >
                                    Sign In
                                </Button>
                            </Grid>

                            <Grid item xs={12} sm={6} md={12}>
                                <Box style={{ display: 'flex', justifyContent: 'center' }}>
                                    <Button
                                        onClick={() => setOpenRegisterModal(true)}
                                        style={{ border: 'solid' }}
                                        sx={{ mt: 2.5, mb: 2 }}
                                    >
                                        Sign Up
                                    </Button>
                                </Box>


                            </Grid>


                            <Grid item xs={12} sm={6} md={12}>
                                <Box style={{ display: 'flex', justifyContent: 'center' }}>
                                    <Button

                                        onClick={googleSubmit}
                                        sx={{ mt: 1, mb: 2 }}
                                    >
                                        Sign In With Google
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
            <Modal
                open={openRegisterModal}
                onClose={() => setOpenRegisterModal(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <RegisterForm submitFn={handleSubmitRegister}/>
                </Box>
            </Modal>
        </ThemeProvider>
    );
}
export default SignInForm