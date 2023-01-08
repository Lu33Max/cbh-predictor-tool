import React from "react";
import Screens from "./screens/screens";
import Header from "./header/headerIndex";
import styles from "./App.module.css"

export default function App() {
  return (
    <main>
      <div className={styles.body}>
        <Screens/> 
      </div>
      <div className={styles.header}>
        <Header/>
      </div>
    </main>
  );
}
