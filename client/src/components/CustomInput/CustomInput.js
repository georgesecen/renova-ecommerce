import React from 'react'
import "./customInput.css"

const CustomInput = ({type, inputName, text}) => {
  return (
    <div className='custom-input'>
        <label htmlFor={inputName}>{text}</label>
        <input name={inputName} id={inputName} type={type} />
    </div>
  )
}

export default CustomInput