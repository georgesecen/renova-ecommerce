import React, { useState, useEffect } from 'react'
import { adminProductCategoriesService } from '../../services/productCategories'

const CategoriesTable = ({ displayNotification }) => {

  const [categories, setCategories] = useState([])
  const [loadCategories, setLoadCategories] = useState(true) // When set to true will trigger reload of products

  // Get product categories
  useEffect(() => {
      if (loadCategories){
        adminProductCategoriesService("index")
          .then((response) => setCategories(response.data.data))
          .catch((error) => displayNotification("Get", `${error}`, "danger"))
          .finally(() => setLoadCategories(false))   
      }  
  }, [loadCategories])

  console.log(categories)


  return (
    <div>CategoriesTable</div>
  )
}

export default CategoriesTable