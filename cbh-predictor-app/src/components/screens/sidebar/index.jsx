import React from "react";
import symbol from "../../../files/cbh_symbol.png"
import logo from "../../../files/cbh_logo.png"
import styles from "./index.module.css"
import { BiHomeAlt, BiChevronRight } from "react-icons/bi";

const Sidebar = () => {
    return(
        <>
            <div className={styles.sidebar}>

                <div className={[styles.toggle, styles.open]}>
                    <i><BiChevronRight/></i>
                </div>

                <div className={styles.logo}>
                    <div className={styles.symbol}>
                        <img src={symbol} alt="CBH Symbol"/>
                    </div>
                    <div className={styles.text}>
                        <img src={logo} alt="CBH Logo"/>
                    </div>
                </div>

                <nav>
                    <div className={styles.nav_title}>
                        Navigation
                    </div>

                    <ul>
                        <li className={styles.nav_item}>
                            <i><BiHomeAlt/></i>
                            <span>Home</span>
                        </li>
                        <li className={styles.nav_item}>
                            <i></i>
                            <span>Bing Charts</span>
                        </li>
                        <li className={styles.nav_item}>
                            <i className={styles.bx_bxs_home}></i>
                            <span>Google Charts</span>
                        </li>
                        <li className={styles.nav_item}>
                            <i className={styles.bx_bxs_home}></i>
                            <span>Lead Charts</span>
                        </li>
                        <li className={styles.nav_item}>
                            <i className={styles.bx_bxs_home}></i>
                            <span>Order Charts</span>
                        </li>
                        <li className={styles.nav_item}>
                            <i className={styles.bx_bxs_home}></i>
                            <span>Table View</span>
                        </li>
                    </ul>

                    <hr/>

                    <div className={styles.nav_title}>
                        Options
                    </div>

                    <ul>
                        <li className={styles.nav_item}>
                            <i className="bx bxs-dashboard"></i>
                            <span>Language</span>
                        </li>
                        <li className={styles.nav_item}>
                            <i className="bx bxs-dashboard"></i>
                            <span>Light/Dark</span>
                        </li>
                    </ul>

                </nav>
            </div>
        </>
    )
}

export default Sidebar