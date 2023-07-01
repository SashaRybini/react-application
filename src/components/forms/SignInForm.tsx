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
import InputResult from '../../model/InputResult';
import { Alert, Snackbar } from '@mui/material';
import { StatusType } from '../../model/StatusType';

const defaultTheme = createTheme();

type Props = {
    submitFn: (loginData: LoginData) => Promise<InputResult>
}

const SignInForm: React.FC<Props> = ({submitFn}) => {
    
    const message = React.useRef<string>('')
    const [open, setOpen] = React.useState(false)
    const severity = React.useRef<StatusType>('success')

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const email: string = data.get('email')! as string
        const password: string = data.get('password')! as string
        const res = await submitFn({email, password})
        message.current = res.message!
        severity.current = res.status
        message.current && setOpen(true)
    };

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
                        onSubmit={handleSubmit} 
                        noValidate sx={{ mt: 1 }}
                    >
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
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign In
                        </Button>
                    </Box>
                    <Snackbar 
                        open={open} 
                        autoHideDuration={6000} 
                        onClose={() => setOpen(false)}
                    >
                        <Alert
                            onClose={() => setOpen(false)}
                            severity={severity.current} 
                            sx={{ width: '100%' }}
                        >
                            {message.current}
                        </Alert>
                    </Snackbar>
                </Box>
            </Container>
        </ThemeProvider>
    );
}
export default SignInForm