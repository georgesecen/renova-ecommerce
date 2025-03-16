import './imageOption.css'

function ImageOption(props) {
    return (
        <div className='image-option' onClick={props.clickEvent}>
            <img src={props.imageUrl} alt=""></img>
        </div>
    );
}

export default ImageOption;