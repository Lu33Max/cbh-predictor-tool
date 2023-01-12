import React, { useEffect } from "react";

import styles from "./table.module.css"

const TableFooter = ({ range, setPage, page, slice }) => {
    useEffect(() => {
        if (slice.length < 1 && page !== 1) {
            setPage(page - 1);
        }
    }, [slice, page, setPage]);
    
    return (
        <div className={styles.tableFooter}>
            {range.map((el, index) => (
                <>
                    {(el === 1) && (
                        <>
                            <button key={index} className={`${styles.footer_button} ${page === el ? styles.activeButton : styles.inactiveButton}`} onClick={() => setPage(el)}>{el}</button>
                            {(page-4 > 1) && (
                                <label key={0}>&nbsp;. . .&nbsp;</label>
                            )}
                        </>
                    )}
                    {(el >= page-3 && el <= page +3 && el !== 1 && el !== range.length) && (
                        <button key={index} className={`${styles.footer_button} ${page === el ? styles.activeButton : styles.inactiveButton}`} onClick={() => setPage(el)}>{el}</button>
                    )}
                    {(el === range.length && range.length !== 1) && (
                        <>
                            {(page+4 < range.length) && (
                                <label key={range.length+1}>&nbsp;. . .&nbsp;</label>
                            )}
                            <button key={index} className={`${styles.footer_button} ${page === el ? styles.activeButton : styles.inactiveButton}`} onClick={() => setPage(el)}>{el}</button>
                        </>
                    )}
                </>
            ))}
        </div>
    );
};

export default TableFooter;