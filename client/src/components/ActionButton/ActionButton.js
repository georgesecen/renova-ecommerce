import React from 'react'
import "./actionButton.css"

/**
 * Custom button component which displays text next to an icon which will indicate the purpose of the button.
 * @param {function} onClick Function which must take in an event as a parameter and will be called when button is clicked.
 * @param {string} color Color of button. Any valid css values are good to use.
 * @param {string} icon File path of icon to use in button.
 * @param {string} text Text to use in button.
 * @returns {React.JSX.Element} ActionButton React component.
 */
const ActionButton = ({ onClick, color, icon, text }) => {
  return (
    <button 
        onClick={(event)=>{

            // Run the custom on click event
            onClick(event)
        }} 
        className='action-button'
        style={{"backgroundColor": color}}
        >
        <p>{text}</p>
        <img src={icon} alt='Edit'/>
    </button>
  )
}

export default ActionButton