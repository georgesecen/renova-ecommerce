import React, { useState } from 'react'
import { adminProductsService } from '../../../services/products';
import "./imageForm.css"
import Modal from 'react-bootstrap/Modal';
const trashIcon = require("../../../assets/icons/trash.png")
const imageUploadIcon = require("../../../assets/icons/image-upload.png")


const ImageForm = ({
  show,
  setShow,
  setLoading,
  setLoadProducts,
  product,
  displayNotification
}) => {

  // Keep track of image name for image which is currently selected to be deleted
  const [imageToDelete, setImageToDelete] = useState()

  // If there is no selected product yet
  if (product === null) return 

  // Get product details
  const {id: productId, image: images} = product ?? {}

  // Get all image urls for product
  const productImages = images.map(image => image.image_url)

  // Function adds an image to product
  function addImage(file){
    setLoading(true)
    const data = {
      productId: productId,
      image: file
    }
    adminProductsService("add-image", data)
      .then((response) => displayNotification("Add Image", response.data.message))
      .catch((error) => displayNotification("Add Image", `${error}`, "danger"))
      .finally(() => {setLoading(false); setLoadProducts(true)})  
  }

  // Function removes image from product
  function removeImage(){
    setLoading(true)
    const data = {
      fileName: imageToDelete
    }
    adminProductsService("remove-image", data)
      .then((response) => displayNotification("Remove Image", response.data.message))
      .catch((error) => displayNotification("Remove Image", `${error}`, "danger"))
      .finally(() => {setLoading(false); setLoadProducts(true)})  
  }

  return (
    <Modal dialogClassName="modal-90w" show={show} onHide={() => setShow(false)} centered>
      <Modal.Header closeButton>
            <Modal.Title>Edit Images</Modal.Title>
      </Modal.Header>
      <Modal.Body className='modal-body'>
        <div className='image-form'>
          {
            productImages.map((image, index) => {
              return (
                <div key={index} onClick={() => setImageToDelete(imageToDelete === image ? null : image)} className={`image-container ${imageToDelete === image ? "show" : ""}`}>
                  <img src={`http://localhost:3306/static/images/${image}`} alt='product'/>

                  {/* Image delete button */}
                  <button onClick={(event) => {
                    event.stopPropagation() // To prevent unshowing the image delete class
                    removeImage()
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