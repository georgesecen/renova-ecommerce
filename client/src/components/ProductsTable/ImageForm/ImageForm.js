import React, { useState } from 'react'
import "./imageForm.css"
import { adminProductsService } from '../../../services/products';
import { adminProductVariantsService } from '../../../services/productVariants';
import Modal from 'react-bootstrap/Modal';
const trashIcon = require("../../../assets/icons/trash.png")
const imageUploadIcon = require("../../../assets/icons/image-upload.png")


const ImageForm = ({productImages, productType, productId, productVariantIds, show, setShow}) => {

  // Keep track of image name for image which is currently selected to be deleted
  const [imageToDelete, setImageToDelete] = useState()

  // Function adds image to product or product variant group
  function addImage(file){

    const data = {
      productId: productId,
      image: file
    }

    // If image form is for a product
    if (productType === 0){

      // Add image to product
      adminProductsService("add-image", data)
        .then((response) => console.log(response.data))
        .catch((error) => console.log(error))
    }

    // If image form is for product variants
    else{
      data.productVariantIds = productVariantIds

      // Add image to product variant group
      adminProductVariantsService("add-group-image", data)
        .then((response) => console.log(response.data))
        .catch((error) => console.log(error))
    }
  }

  // Function removes image from product or product variant group
  function removeImage(fileName){

    const data = {
      fileName: fileName
    }

    // If image form is for a product
    if (productType === 0){

      // Add remove product
      adminProductsService("remove-image", data)
        .then((response) => console.log(response.data))
        .catch((error) => console.log(error))
    }

    // If image form is for product variants
    else{
      data.productVariantIds = productVariantIds

      // Remove image from product variant group
      adminProductVariantsService("remove-group-image", data)
        .then((response) => console.log(response.data))
        .catch((error) => console.log(error))
    }
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
                    removeImage(imageToDelete)
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
              <input type="file" id='image-uploader' accept="image/*" onChange={(event) => addImage(event.target.files[0])} />
            </>
          }
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default ImageForm