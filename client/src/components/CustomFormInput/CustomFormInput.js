import React from 'react'
import "./customFormInput.css"

const CustomFormInput = ({type, inputName, text}) => {
  return (
    <div className='custom-form-input'>
        <label htmlFor={inputName}>{text}</label>
        <input autoComplete={"off"} name={inputName} id={inputName} type={type} />
    </div>
  )
}

export default CustomFormInput