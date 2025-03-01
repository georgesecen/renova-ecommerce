import React, { useState } from 'react'
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';

// https://react-bootstrap.netlify.app/docs/components/toasts/
const Toasts = () => {
  
  const [toasts, setToasts] = useState([]) // [{title: toast title, message: toast messsage, show: true/false}]

  function addToast(title, message){
    setToasts([...toasts, {title: title, message: message}])
  }

  console.log(toasts)

  return (
    <ToastContainer position='top-center'>

        {
            toasts.map(({title, message}, index) =>{
                return(
                    <Toast key={index}>
                        <Toast.Header>
                            <strong className="me-auto">{title}</strong>
                            <small className="text-muted">just now</small>
                        </Toast.Header>
                        <Toast.Body>{message}</Toast.Body>
                    </Toast>
                )
            })  
        }
    
    </ToastContainer>
  )
}

export default Toasts