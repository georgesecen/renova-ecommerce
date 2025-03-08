import {React, useEffect, useState, useRef} from 'react'
import "./admin.css"
import OrdersTable from '../../components/OrdersTable/OrdersTable'
import ImageForm from '../../components/ProductsTable/ImageForm/ImageForm'
import Toasts from '../../components/Toasts/Toasts'

const Admin = () => {

  const [key, setKey] = useState(true)

  // To get the Toasts component function to add new toasts
  const toastsRef = useRef()
  function displayNotification(title, message, type = ""){
    toastsRef.current.addToast(title, message, type)
  }

  // // Get key for admin routes
  // useEffect(() => {

  //   // Store key in session storage for better security
  //   sessionStorage.removeItem("key")
  //   sessionStorage.setItem("key", prompt("Key:"))
  //   setKey(true)
  // }, [])

  return (
    <div>
      <h1>Admin Page</h1>
      <Toasts ref={toastsRef} />

      {/* To make sure key is set before rendering components */}
      {/* {key && <OrdersTable displayNotification={displayNotification} />} */}
      <ImageForm productImages={["26.jpg", "27.jpg"]} show={true}/>

    </div>
  )
}

export default Admin