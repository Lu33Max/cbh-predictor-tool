import { useState } from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import styles from "./graphs.module.css";

const PopoverButton = (props) => {
    const [newTerm, setNewTerm] = useState("")

    const handleChange = (e) => {
        setNewTerm(e.target.value)
    }

    const handleSubmit = () => {
        if(newTerm === ""){
            alert("Error: Input cannot be empty")
            return
        } else if(props.terms.find(e => e === newTerm)){
            alert(`Term "${newTerm}" already exists`)
            return
        }

        props.addToTerms(newTerm)
        setNewTerm("")
    }

    return(
        <OverlayTrigger trigger="click" placement="bottom" overlay={
            <Popover id="popover-basic">
                <Popover.Header as="h3">Add new term</Popover.Header>
                <Popover.Body>
                    <input className={styles.term_input} value={newTerm} name="newTerm" type="text" onChange={handleChange}/>
                    <button className={styles.submitButton} onClick={handleSubmit}>Submit</button>
                </Popover.Body>
            </Popover>
        }>
            <button className={styles.addButton}>+</button>
        </OverlayTrigger>
    )
}

export default PopoverButton;