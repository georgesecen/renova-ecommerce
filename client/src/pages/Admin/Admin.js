import {React, useEffect, useState, useRef} from 'react'
import OrdersTable from '../../components/OrdersTable/OrdersTable'
import ProductsTable from '../../components/ProductsTable/ProductsTable'
import CategoriesTable from '../../components/CategoriesTable/CategoriesTable'
import StoreStatistics from '../../components/StoreStatistics/StoreStatistics'
import Toasts from '../../components/Toasts/Toasts'
import { adminProductsService } from '../../services/products'
import "./admin.css"
import "../../styles/table-cards.css"
import "../../styles/table-forms.css"
import "../../styles/custom-inputs.css"

/**
 * Complete admin dashboard for store owner. Gives the admin ability to add/delete products, product variants,
 * and categories. Fulfill orders, and view important store information such as revenue 
 * history and what products have been selling the most.
 * @returns {React.JSX.Element} Admin dashboard React component.
 */
const Admin = () => {

  const [key, setKey] = useState(false)
  const [validKey, setValidKey] = useState(false)

  // Keep track of what admin component to render based on 
  // what was last clicked in navbar (Defaults to orders table)
  const [currentComponent, setCurrentComponent] = useState("orders")

  // To get the Toasts component function to add new toasts
  const toastsRef = useRef()
  function displayNotification(title, message, type = ""){
    toastsRef.current.addToast(title, message, type)
  }

  // Get key for admin routes
  useEffect(() => {

    // Store key in session storage for better security
    sessionStorage.removeItem("key")
    sessionStorage.setItem("key", prompt("Key:"))
    setKey(true)
  }, [])

  // If user has entered key
  if (key === true){

    // Attempt to contact server via a route which requires the admin key
    adminProductsService("index")

      // If the request is successful we know the key user entered is the correct admin key
      .then(() => setValidKey(true))
      .catch(() => {})
  }


  // If no key is set or key is invalid do not attempt to render any components
  if (key === false || validKey === false) return

  return (
    <div className='admin-dashboard-container'>
      <Toasts ref={toastsRef} />

      <h1>Renova Dashboard</h1>

      <div className='admin-navigation'>
        <button className={`${currentComponent === "orders" ? "selected" : ""}`} onClick={() => setCurrentComponent("orders")}>orders</button>
        <button className={`${currentComponent === "products" ? "selected" : ""}`} onClick={() => setCurrentComponent("products")}>products</button>
        <button className={`${currentComponent === "categories" ? "selected" : ""}`} onClick={() => setCurrentComponent("categories")}>categories</button>
        <button className={`${currentComponent === "statistics" ? "selected" : ""}`} onClick={() => setCurrentComponent("statistics")}>statistics</button>
      </div>

      {/* Only display the component which is set as the current component */}
      {currentComponent === "orders" && <OrdersTable displayNotification={displayNotification} />}
      {currentComponent === "products" && <ProductsTable displayNotification={displayNotification} />}
      {currentComponent === "categories" && <CategoriesTable displayNotification={displayNotification} />}
      {currentComponent === "statistics" && <StoreStatistics displayNotification={displayNotification} />}

    </div>
  )
}

export default Admin