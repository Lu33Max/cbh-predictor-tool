import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';

const popover = (
  <Popover id="popover-basic">
    <Popover.Header as="h3">Sort</Popover.Header>
    <Popover.Body>
      <Button>Asc</Button>
      <Button onClick={() => handleDesc()}>Desc</Button>
    </Popover.Body>
  </Popover>
);

function handleDesc(){
  
}

const PopoverButton = ({text}) => (
    <OverlayTrigger trigger="click" placement="bottom" overlay={popover}>
        <Button variant="success">{text}</Button>
    </OverlayTrigger>
);

export default PopoverButton;
