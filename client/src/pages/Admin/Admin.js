import {React, useEffect, useState, useRef} from 'react'
import OrdersTable from '../../components/OrdersTable/OrdersTable'
import ProductsTable from '../../components/ProductsTable/ProductsTable'
import CategoriesTable from '../../components/CategoriesTable/CategoriesTable'
import Toasts from '../../components/Toasts/Toasts'
import "./admin.css"
import "../../styles/table-cards.css"
import "../../styles/table-forms.css"
import "../../styles/custom-inputs.css"

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
    <div className='admin-dashboard-container'>
      <h1>Admin Page</h1>
      <Toasts ref={toastsRef} />

      {/* To make sure key is set before rendering components */}
      {/* {key && <OrdersTable displayNotification={displayNotification} />} */}
      {/* {key && <ProductsTable displayNotification={displayNotification} />} */}
      {key && <CategoriesTable displayNotification={displayNotification} />}

    </div>
  )
}

export default Admin