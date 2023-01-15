import axiosApiInstance from '../../services/interceptor';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import Constants from '../../utilities/Constants';
import styles from "./table.module.css"

const PopoverButton = (props) => {
  function handleSubmit(asc) {
    let url

    switch (props.type) {
      case 'Bing':
        url = `${Constants.API_URL_BING_ENTRIES}/SortByColumn/${props.col}/`
        break;
      case 'Google':
        url = `${Constants.API_URL_GOOGLE_ENTRIES}/SortByColumn/${props.col}/`
        break;
      case 'Lead':
        url = `${Constants.API_URL_LEAD_ENTRIES}/SortByColumn/${props.col}/`
        break;
      case 'Order':
        url = `${Constants.API_URL_ORDER_ENTRIES}/SortByColumn/${props.col}/`
        break;
      default:
        break;
    }

    if(asc) url += "ascending"
    else url += "descending"

    getSorted(url, props)
  }

  return(
    <OverlayTrigger trigger="click" placement="bottom" rootClose="true" overlay={
      <Popover id="popover-basic">
        <Popover.Body>
          <button className={styles.order_button} onClick={() => handleSubmit(true)}>Asc</button>
          <button className={styles.order_button} onClick={() => handleSubmit(false)}>Desc</button>
        </Popover.Body>
      </Popover>
    }>
      <button className={styles.header_button}>{props.text}</button>
    </OverlayTrigger>
  )
};

async function getSorted(url, props){
  const response = await axiosApiInstance.get(url)
  if(response.status === 200){
    props.setEntries(response.data)
  }
}

export default PopoverButton;
