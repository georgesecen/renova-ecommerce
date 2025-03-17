import React from 'react'
import LabelValueDisplay from '../../LabelValueDisplay/LabelValueDisplay'
import "./categoryCard.css"

const CategoryCard = ({ category }) => {

  // Get category details
  const { id: categoryId, name } = category ?? {}

  return (
    <li className='cards-container'>

      <div className='card-header-container'>
        <LabelValueDisplay labelValues={[
          ["Category ID", categoryId, true],
          ["Name", name, false],
        ]}></LabelValueDisplay>
      </div>

    </li>
  )
}

export default CategoryCard