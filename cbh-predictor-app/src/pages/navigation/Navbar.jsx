import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BiLogOut, BiMenu, BiX } from "react-icons/bi";
import { IconContext } from "react-icons";
import { NavbarData } from "./NavbarData";
import "./Navbar.css"
import authService from "../../services/auth.service";

function Navbar() {
    const [sidebar, setSidebar] = useState(false)

    const showSidebar = () => setSidebar(!sidebar)
    const navigate = useNavigate()

    const LogOut = () => {
        authService.logout()
        navigate(0)
    }

    return(
        <>
            <IconContext.Provider value={{color: "green"}}>
                <div className="navbar">
                    <Link to="#" className="menu_bars">
                        <BiMenu onClick={showSidebar}/>
                    </Link>
                </div>
                <nav className={sidebar ? "nav_menu active" : "nav_menu"}>
                    <ul className="nav_menu_items" onClick={showSidebar}>
                        <li className="navbar_toggle">
                            <Link to="#" className="menu_bars">
                                <BiX/>
                            </Link>
                            <Link to="#" className="logout">
                                <BiLogOut onClick={LogOut}/>
                            </Link>
                        </li>
                        {NavbarData.map((item, index) => {
                            return (
                                <li key={index} className={item.cName}>
                                    {item.path !== "" ? (
                                        <Link to={item.path} reloadDocument={true}>
                                            {item.icon}
                                            <span>{item.title}</span>
                                        </Link>
                                    ) : (
                                        <>
                                            {item.icon}
                                            <span>{item.title}</span>
                                        </>
                                    )}
                                </li>
                            )
                        })}
                    </ul>
                </nav>
            </IconContext.Provider>
        </>
    )
}

export default Navbar