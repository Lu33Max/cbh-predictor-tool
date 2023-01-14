import React from "react"
import { Outlet } from "react-router-dom";
import Navbar from "../navigation/Navbar";
import styles from "./header.module.css"

import authService from "../../services/auth.service";

const Header = () => {
    const user = authService.getCurrentUser()

    return(
        <main>
            <div className={styles.body}>
                <Outlet/>
            </div>
            <div className={styles.header}>
                <div className={styles.text_container}>CBH Predictor Tool</div>
                {user && <Navbar/>}
            </div>
        </main>
    )
}

export default Header