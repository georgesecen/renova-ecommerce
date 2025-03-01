import React from 'react'
import Spinner from 'react-bootstrap/Spinner';
import "./modalSpinner.css"

const ModalSpinner = () => {
  return (
    <div className='modal-spinner-container'>
        <Spinner animation="border" variant='light'/>
    </div>
  )
}

export default ModalSpinner