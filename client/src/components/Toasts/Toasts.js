import React, { useState, useImperativeHandle } from 'react'
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import "./toasts.css"

// https://react-bootstrap.netlify.app/docs/components/toasts/
const Toasts = ({ref}) => {
  
  const [toasts, setToasts] = useState([]) // [{title: toast title, message: toast messsage, show: true/false}]

  // Function adds a toast to the toasts list and will be used by other components
  // so the other components can easily send notifications.
  function addToast(title, message, type){
    setToasts([...toasts, {title: title, message: message, show: true, type: type}])
  }

  // So other components in admin dashboard can add new toasts
  useImperativeHandle(ref, () => ({
    addToast
  }))

  // Function will automatically be called once user exits the toast or the 
  // delay runs out. Afterwards toast will be set to show = false and will
  // never be displayed again.
  function removeToast(index){
    toasts[index].show = false
    setToasts([...toasts])
  }

  return (
    <ToastContainer position='top-center'>

        {
            toasts.map(({title, message, show, type}, index) =>{
                return(
                    <Toast key={index} onClose={() => removeToast(index)} show={show} delay={4000} autohide bg={type}>
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