import { NavLink, Outlet } from "react-router-dom"

const Navigator: React.FC = () => {

    return <div>
        <nav>
            <ul className="navigator-list">
                <li className="navigator-item">
                    <NavLink to="/signin">Sign In</NavLink>
                </li>
                <li className="navigator-item">
                    <NavLink to="/signout">Sign Out</NavLink>
                </li>
            </ul>
        </nav>
        <Outlet></Outlet>
    </div>
}
export default Navigator