import React, { useState, useEffect } from 'react'
import { adminProductCategoriesService } from '../../services/productCategories'
import CreateCategoryForm from './CreateCategoryForm/CreateCategoryForm'
import CategoryCard from './CategoryCard/CategoryCard'
import ModalSpinner from '../ModalSpinner/ModalSpinner'

const CategoriesTable = ({ displayNotification }) => {

  const [categories, setCategories] = useState([])
  const [loadCategories, setLoadCategories] = useState(true) // When set to true will trigger reload of products

  const [selectedCategory, setSelectedCategory] = useState(null)
  const [loading, setLoading] = useState(false)

  const [showCreateCategoryForm, setShowCreateCategoryForm] = useState(false)

  // Get product categories
  useEffect(() => {
      if (loadCategories){
        adminProductCategoriesService("index")
          .then((response) => setCategories(response.data.data))
          .catch((error) => displayNotification("Get", `${error}`, "danger"))
          .finally(() => setLoadCategories(false))     
      }  
  }, [loadCategories])

  return (
    <div className='table-container'>
        {loading && <ModalSpinner />}
        
        <CreateCategoryForm
          show={showCreateCategoryForm} 
          setShow={setShowCreateCategoryForm} 
          setLoading={setLoading}
          setLoadCategories={setLoadCategories}
          displayNotification={displayNotification}
          >
        </CreateCategoryForm>

        <ul>
          {
            categories.map((category, index) => {
              return <CategoryCard
                key={index} 
                category={category} 
                >
              </CategoryCard>
            })
          }
      </ul>

    </div>
  )
}

export default CategoriesTable