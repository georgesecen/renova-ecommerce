import './imageOption.css'

function ImageOption(props) {
    return (
        <div className='image-option'>
            <img src={props.imageUrl} alt=""></img>
        </div>
    );
}

export default ImageOption;