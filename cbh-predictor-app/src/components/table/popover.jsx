import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import styles from "./table.module.css"

const PopoverButton = (props) => {
  function handleSubmit(asc) {
    props.applySort("ORDER BY " + props.col + " " + asc)
  }

  return(
    <OverlayTrigger trigger="click" placement="bottom" rootClose="true" overlay={
      <Popover id="popover-basic">
        <Popover.Body>
          <button className={styles.order_button} onClick={() => handleSubmit("ASC")}>Asc</button>
          <button className={styles.order_button} onClick={() => handleSubmit("DESC")}>Desc</button>
        </Popover.Body>
      </Popover>
      }>
      <button className={styles.header_button}>{props.text}</button>
    </OverlayTrigger>
  )
};

export default PopoverButton;
