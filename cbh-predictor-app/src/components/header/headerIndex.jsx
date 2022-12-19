import React from "react"
import { BiMenu } from "react-icons/bi";
import styles from "./header.module.css";

const Header = () => {
    return(
        <div className={styles.grid_container}>
            <div className={styles.menu_container}><BiMenu/></div>
            <div className={styles.text_container}>CBH Predictor Tool</div>
            <div></div>
        </div>
    )
}

export default Header