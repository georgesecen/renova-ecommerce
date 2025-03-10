import React, { Fragment } from 'react'
import "./labelValueDisplay.css"

/**
 * Puts any amount of label value pairs in a nice format together to be displayed.
 * @param {Array<Array<string|any>>} labelValues Label value pairs to be displayed in the component. Values can also be other components.
 * @returns {React.JSX.Element} LabelValueDisplay react component.
 */
const LabelValueDisplay = ({labelValues}) => {
  return (
    <>
        {
            labelValues.map(([label, value], index) => {
                return (
                    <Fragment key={index}>
                        <div className='label-value'>
                            <h6>{label}</h6>
                            <div>{value ? value : "N/A"}</div>
                        </div>
                        <div className='seperator'></div>
                    </Fragment>
                )
            })
        }
    </>
  )
}

export default LabelValueDisplay