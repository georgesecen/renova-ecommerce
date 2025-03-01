import React from 'react'
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';

// https://react-bootstrap.netlify.app/docs/components/toasts/
const Toasts = () => {
  return (
    <ToastContainer>
        <Toast>
            <Toast.Header>
            <strong className="me-auto">Bootstrap</strong>
            <small className="text-muted">just now</small>
            </Toast.Header>
            <Toast.Body>See? Just like this.</Toast.Body>
        </Toast>
    </ToastContainer>
  )
}

export default Toasts