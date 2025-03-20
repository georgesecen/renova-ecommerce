import React from 'react'

/**
 * Custom radio component which displays text next to radio input.
 * @param {string} color Color of radio input. Components background will be a lighter version of color. Must be a hex value. (#ffffff)
 * @param {string} text Text to use as label next to radio.
 * @param {string} value Value of the radio button.
 * @param {string} inputName Name used for name attribute of input, so form can grab radio information.
 * @param {string} defaultChecked True if radio is to be selected by default, otherwise false.
 * @returns {React.JSX.Element} RadioButton React component.
 */
const RadioButton = ({ color, text, inputName, defaultChecked, value }) => {
  return (
    <label className='custom-input' style={{backgroundColor: `${color}30`}}>
        <input value={value} defaultChecked={defaultChecked} name={inputName} type='radio' style={{accentColor: color, borderColor: color}}/>
        <span>{text}</span>
    </label>
  )
}

export default RadioButton