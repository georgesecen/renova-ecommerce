import React, { useState } from 'react'
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';

// https://react-bootstrap.netlify.app/docs/components/toasts/
const Toasts = () => {
  
  const [toasts, setToasts] = useState([{title:"test title", message:"test message", show:true}]) // [{title: toast title, message: toast messsage, show: true/false}]

  // Function adds a toast to the toasts list and will be used by other components
  // so the other components can easily send notifications.
  function addToast(title, message){
    setToasts([...toasts, {title: title, message: message, show: true}])
  }

  // Function will automatically be called once user exits the toast or the 
  // delay runs out. Afterwards toast will be set to show = false and will
  // never be displayed again.
  function removeToast(index){
    toasts[index].show = false
    setToasts([...toasts])
  }

  console.log(toasts)

  return (
    <ToastContainer position='top-center'>

        {
            toasts.map(({title, message, show}, index) =>{
                return(
                    <Toast key={index} onClose={()=>{removeToast(index)}} show={show} delay={3000} autohide>
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