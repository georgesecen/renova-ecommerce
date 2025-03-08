import React, { useState } from 'react'
import "./imageForm.css"
import { adminProductsService } from '../../../services/products';
import Modal from 'react-bootstrap/Modal';


const ImageForm = ({productImages}) => {

  // Keep track of image name for image which is currently selected to be deleted
  const [imageToDelete, setImageToDelete] = useState([])

  function addImage(file){

    const data = {
      productId: 1,
      image: file
    }

    adminProductsService("add-image", data)
      .then((response) => console.log(response.data))
      .catch((error) => console.log(error))
  }
  

  return (
    <Modal dialogClassName='image-form-container' show={true} centered>
      <Modal.Body>
        <div className='image-form'>
          {
            productImages.map((image, index) => {
              return (
                <div key={index} onClick={() => setImageToDelete(image)} className={`image-container ${image === imageToDelete ? "show" : ""}`}>
                  <img src={`http://localhost:3306/static/images/${image}`} alt='product'/>
                  <button>delte</button>
                </div>
              )
            })
          }

          {/* There can only be a max of 8 images. Do not display add button if there are already 8 images. */}
          {productImages.length < 1 && <input type="file" name="myImage" accept="image/*" onChange={(event) => addImage(event.target.files[0])} />}
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default ImageForm