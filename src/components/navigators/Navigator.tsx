import { useEffect } from 'react'
import { NavLink, Outlet, useLocation, useNavigate} from 'react-router-dom'
export type RouteType = {
    to: string, label: string
}
const Navigator: React.FC<{ routes: RouteType[] }> = ({routes}) => {
    const navigate = useNavigate()
    const location = useLocation()
    useEffect(() => {
        let index = routes.findIndex(r => r.to === location.pathname)
        if (index < 0) {
            index = 0
        }
        navigate(routes[index].to)
    }, [routes])
    return <div>
        <nav>
            <ul className="navigator-list">
                {routes.map(r => <li key={r.label} className="navigator-item">
                        <NavLink to={r.to}>{r.label}</NavLink>
                </li>)}
            </ul>
        </nav>
        <Outlet></Outlet>
    </div>
}
export default Navigator;