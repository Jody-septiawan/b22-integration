import { Button, Modal } from "react-bootstrap";

import "bootstrap/dist/css/bootstrap.min.css";

const FormModal = (props) => {
  const { title, show, handleClose, children } = props;

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FormModal;
