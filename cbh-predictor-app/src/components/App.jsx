import React from "react";
import Screens from "./screens";
import Header from "./header/headerIndex";
import styles from "./App.module.css"

window.$activeTable = "";

export default function App() {
  return (
    <main>
      <div className={styles.header}>
        <Header/>
      </div>
      <div className={styles.body}>
        <Screens/> 
      </div>
    </main>
  );
}
