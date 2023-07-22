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
import { Divider, Grid, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import GoogleIcon from '@mui/icons-material/Google';

const defaultTheme = createTheme();

type Props = {
    loginSubmitFn: (loginData: LoginData) => void
}

const SignInForm: React.FC<Props> = ({ loginSubmitFn }) => {

    const handleSubmitSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const email: string = data.get('email') as string //!
        const password: string = data.get('password') as string //!
        loginSubmitFn({ email, password })
    };

    function googleSubmit() {
        loginSubmitFn({ email: 'GOOGLE', password: '' })
    }

    const navigate = useNavigate()

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
                                <Divider sx={{ width: "100%", fontWeight: "bold" }}>or</Divider>
                                <Box style={{ display: 'flex', justifyContent: 'center' }}>
                                    <Button
                                        onClick={googleSubmit}
                                        sx={{ mt: 1, mb: 2 }}
                                    >
                                        <GoogleIcon sx={{ marginRight: '10px' }} />
                                        Sign In With Google
                                    </Button>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={6} md={12}>
                                <Box style={{ display: 'flex', justifyContent: 'center' }}>
                                    <Link href="#" variant="body2"
                                        onClick={() => navigate('/signup')}
                                    >
                                        {"Don't have an account? Sign Up"}
                                    </Link>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}
export default SignInForm