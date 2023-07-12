import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import NavigatorLandscape from "./NavigatorLandscape";
import NavigatorPortrait from "./NavigatorPortrait";

export type RouteType = {
    to: string, 
    label: string,
    order?: number
}

const NavigatorDispatcher: React.FC<{ routes: RouteType[] }> = ({ routes }) => {
    const theme = useTheme()
    const isPortrait = useMediaQuery(theme.breakpoints.down('sm'))
    
    return isPortrait 
        ? 
        <NavigatorPortrait routes={routes} /> 
        : 
        <NavigatorLandscape routes={routes} />
}
export default NavigatorDispatcher