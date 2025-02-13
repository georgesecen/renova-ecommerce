import React from 'react';
// import Button from 'react-bootstrap/Button';
import { Button } from './Button';
import Modal from 'react-bootstrap/Modal';

function ProductModal({ show, onHide, title, message, image }) {
    return (
        <Modal
            data-bs-theme="dark"
            show={show}
            onHide={onHide}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {title}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {image && <img src={image} alt="Product" style={{ width: "100%", marginBottom: "15px" }} />}
                <p>{message}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ProductModal;

