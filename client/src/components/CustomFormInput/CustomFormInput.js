import React from 'react'
import "./customFormInput.css"

/**
 * Custom form input component which displays label on top of text or number input.
 * @param {string} type Type you want the input to be. (number or text)
 * @param {string} inputName Name used for name attribute of input, so form can grab input information.
 * @param {string} text Text to use as label for input.
 * @param {string|number} defaultValue Value to be in input by default.
 * @param {number} min Minimum value allowed if input is of number type.
 * @param {number} max Maximum value allowed if input is of number type.
 * @returns {React.JSX.Element} CustomFormInput React component.
 */
const CustomFormInput = ({type, inputName, text, defaultValue, min, max}) => {
  return (
    <div className='custom-form-input'>
        <label htmlFor={inputName}>{text}</label>
        <input 
          required // Every input is required by default
          defaultValue={defaultValue} 
          autoComplete={"off"} 
          name={inputName} 
          id={inputName} 
          type={type} 
          min={min}
          max={max}
        />
    </div>
  )
}

export default CustomFormInput