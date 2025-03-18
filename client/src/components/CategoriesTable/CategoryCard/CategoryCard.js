import React from 'react'
import LabelValueDisplay from '../../LabelValueDisplay/LabelValueDisplay'
import { adminProductCategoriesService } from '../../../services/productCategories';
import "./categoryCard.css"

/**
 * Category card which displays all category information. Card also provides the ability to delete
 * the category in the category card.
 * @param {object} category Category to be used in this category card.
 * @param {function} setLoading Function which handles displaying the modal spinner.
 * @param {function} setLoadCategories Function which handles loading the categories.
 * @param {function} displayNotification Function which displays toast notifications.
 * @returns {React.JSX.Element} CategoryCard React component.
 */
const CategoryCard = ({ category, setLoading, setLoadCategories, displayNotification }) => {

  // Get category details
  const { id: categoryId, name } = category ?? {}

  // Function deletes category in this category card (Categories which have products will not be deleted)
  function deleteCategory(){
    setLoading(true)
    adminProductCategoriesService("delete", {categoryId: categoryId})
      .then((response) => displayNotification("Delete", response.data.message))
      .catch((error) => displayNotification("Delete", `${error}`, "danger"))
      .finally(() => {setLoading(false); setLoadCategories(true)})  
  }

  return (
    <li className='cards-container'>

      <div className='card-header-container'>
        <LabelValueDisplay labelValues={[
          ["Category ID", categoryId, 6, true],
          ["Name", name, 7, true],
          ["", <button onClick={() => deleteCategory()}>Delete Me</button>, 5, false],
        ]}></LabelValueDisplay>
      </div>

    </li>
  )
}

export default CategoryCard