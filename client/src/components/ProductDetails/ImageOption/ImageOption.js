import './imageOption.css'

function ImageOption(props) {
    return (
        <div className='image-option' onClick={props.clickEvent}>
            <img
                src={props.imageUrl}
                alt=""
            />
        </div>
    );
}

export default ImageOption;