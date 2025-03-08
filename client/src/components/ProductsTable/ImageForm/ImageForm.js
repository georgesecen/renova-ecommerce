import React, { useState } from 'react'
import "./imageForm.css"
import { adminProductsService } from '../../../services/products';
import Modal from 'react-bootstrap/Modal';
const trashIcon = require("../../../assets/icons/trash.png")
const imageUploadIcon = require("../../../assets/icons/image-upload.png")


const ImageForm = ({productImages, productType, productIds, show, setShow}) => {

  // Keep track of image name for image which is currently selected to be deleted
  const [imageToDelete, setImageToDelete] = useState()

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
    <Modal show={show} onHide={() => setShow(false)} dialogClassName='image-form-container' centered>
      <Modal.Header closeButton>
            <Modal.Title>Edit Images</Modal.Title>
        </Modal.Header>
      <Modal.Body>
        <div className='image-form'>
          {
            productImages.map((image, index) => {
              return (
                <div key={index} onClick={() => setImageToDelete(imageToDelete === image ? null : image)} className={`image-container ${image === imageToDelete ? "show" : ""}`}>
                  <img src={`http://localhost:3306/static/images/${image}`} alt='product'/>
                  <button onClick={(event) => {
                    event.stopPropagation() // To prevent unshowing the image delete class
                    // TODO: Add delete image function
                    console.log("Deleted")
                  }}>
                    <img alt='delete' src={trashIcon}/>
                  </button>
                </div>
              )
            })
          }

          {/* There can only be a max of 8 images. Do not display add button if there are already 8 images. */}
          {productImages.length < 8 && 
            <>
              <label htmlFor='image-uploader'>
                <img alt='upload' src={imageUploadIcon}/>
                Upload Image
              </label>
              <input type="file" id='image-uploader' ccept="image/*" onChange={(event) => addImage(event.target.files[0])} />
            </>
          }
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default ImageForm