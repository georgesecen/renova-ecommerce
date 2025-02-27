import {React, useEffect} from 'react'
import "./admin.css"

const Admin = () => {

  // Get key for admin routes
  useEffect(() => {

    // Store key in session storage for better security
    sessionStorage.removeItem("key")
    sessionStorage.setItem("key", prompt("Key:"))
  })

  return (
    <div>Admin</div>
  )
}

export default Admin