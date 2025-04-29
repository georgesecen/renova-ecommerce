import React, { Fragment } from 'react'
import "./labelValueDisplay.css"

/**
 * Puts any amount of label value pairs in a nice format together to be displayed.
 * @param {Array<Array<string|any|number|boolean>>} labelValues Label value pairs to be displayed in the component. [label, value, labelvalue width, true to display seperator otherwise false]
 * @returns {React.JSX.Element} LabelValueDisplay React component.
 */
const LabelValueDisplay = ({labelValues}) => {
  return (
    <>
        {
            labelValues.map(([label, value, width, seperator], index) => {
                return (
                    <Fragment key={index}>
                        <div className='label-value' style={{minWidth: `${width}em`, maxWidth: `${width}em`}}>
                            <h6>{label}</h6>
                            <div>{value ? value : "N/A"}</div>
                        </div>
                        {seperator && <div className='seperator'></div>}
                    </Fragment>
                )
            })
        }
    </>
  )
}

export default LabelValueDisplay