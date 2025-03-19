import React from 'react'
import "./checkbox.css"

/**
 * Custom checkbox component which displays text next to checkbox.
 * @param {funciton} onChange Function which must take in an event as a parameter and will be called when the checkbox is changed.
 * @param {string} color Color of checkbox. Components background will be a lighter version of color. Must be a hex value. (#ffffff)
 * @param {string} text Text to use as label next to checkbox.
 * @param {string} defaultChecked True if checkbox is to be checked by default, otherwise false.
 * @returns {React.JSX.Element} Checkbox React component.
 */
const Checkbox = ({ onChange, color, text, defaultChecked }) => {
  return (
    <label className='custom-checkbox' style={{backgroundColor: `${color}30`}}>
        <input defaultChecked={defaultChecked} type='checkbox' onChange={(event) => onChange(event)} style={{accentColor: color, borderColor: color}}/>
        <span>{text}</span>
    </label>
  )
}

export default Checkbox