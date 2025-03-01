import {React, useEffect, useState} from 'react'
import "./admin.css"
import OrdersTable from '../../components/OrdersTable/OrdersTable'
import Toasts from '../../components/Toasts/Toasts'

const Admin = () => {

  const [key, setKey] = useState(true)

  // Get key for admin routes
  // useEffect(() => {

  //   // Store key in session storage for better security
  //   sessionStorage.removeItem("key")
  //   sessionStorage.setItem("key", prompt("Key:"))
  //   setKey(true)
  // }, [])

  return (
    <div>
      <h1>Admin Page</h1>

      {/* Make sure key is set before rendering components */}
      {/* {key && <OrdersTable />} */}
      <Toasts />
    </div>
  )
}

export default Admin