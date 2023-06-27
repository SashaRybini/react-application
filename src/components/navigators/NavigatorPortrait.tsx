import Typography from "@mui/material/Typography";
import { RouteType } from "./Navigator";
import { AppBar, Box, Drawer, IconButton, List, ListItem, ListItemButton, Tab, Toolbar } from "@mui/material";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { ReactNode, useEffect, useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

const NavigatorPortrait: React.FC<{routes: RouteType[]}> = ({routes}) => {
    const navigate = useNavigate()
    const location = useLocation()
    const [open, setOpen] = useState(false)
    const [menuName, setMenuName] = useState<string>('')

    const handleDrawerOpen = () => {
        setOpen(true)
    }
    const handleDrawerClose = () => {
        setOpen(false)
    }
    function updateMenuName(menuName: string) {
        handleDrawerOpen()
        setMenuName(menuName)
    }
    useEffect(() => {
        let index = routes.findIndex(r => r.to === location.pathname)
        if (index < 0) {
            index = 0
        }
        navigate(routes[index].to)
        setMenuName(routes[index].label)
    }, [routes])
    
    return <Box mt={10}>
        <AppBar sx={{backgroundColor:"lightgray"}}>
            <Toolbar>
                <IconButton color="primary" aria-label="open drawer" edge="start" onClick={handleDrawerOpen}>
                <MenuIcon />
                </IconButton>
                <Box flexGrow={1}>
                    <Typography variant="h5" noWrap component="div" color={"black"} align="center">
                        {menuName}
                    </Typography>
                </Box>
            </Toolbar>
        </AppBar>
        <Drawer variant="persistent" anchor="left" open={open}>
            <IconButton onClick={handleDrawerClose}>
                <ChevronLeftIcon />
            </IconButton>
            <List>
                {routes.map(r => (
                    <ListItem key={r.label} disablePadding>
                        <ListItemButton>
                            <Tab component={Link} to={r.to} label={r.label} key={r.label} onClick={updateMenuName.bind(undefined, r.label)}/>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Drawer>

        <Outlet></Outlet>
    </Box>
}
export default NavigatorPortrait