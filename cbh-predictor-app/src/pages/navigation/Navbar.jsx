import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BiMenu, BiX } from "react-icons/bi";
import { IconContext } from "react-icons";
import { NavbarData } from "./NavbarData";
import "./Navbar.css"

function Navbar() {
    const [sidebar, setSidebar] = useState(false)

    const showSidebar = () => setSidebar(!sidebar)

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
                        </li>
                        {NavbarData.map((item, index) => {
                            return (
                                <li key={index} className={item.cName}>
                                    {item.path !== "" ? (
                                        <Link to={item.path}>
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