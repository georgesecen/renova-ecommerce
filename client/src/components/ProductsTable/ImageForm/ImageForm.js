import React, { useState } from 'react'
import { adminProductsService } from '../../../services/products';
import { adminProductVariantsService } from '../../../services/productVariants';
import "./imageForm.css"
import Modal from 'react-bootstrap/Modal';
const trashIcon = require("../../../assets/icons/trash.png")
const imageUploadIcon = require("../../../assets/icons/image-upload.png")

// Base url to get images from server
const IMAGE_BASE_URL = "http://localhost:8080/static/images/"

/**
 * Form which adds product images or product variant group images.
 * @param {boolean} show True if the form is to be displayed, otherwise false.
 * @param {function} setShow Function which handles displaying the form.
 * @param {function} setLoading Function which handles displaying the modal spinner.
 * @param {function} setLoadProducts Function which handles loading the products.
 * @param {object} product Product to add image to.
 * @param {string} productVariantGroup Product variant group to add image to. (Color)
 * @param {function} setProductVariantGroup Function which handles selecting the product variant group.
 * @param {function} displayNotification Function which displays toast notifications.
 * @returns {React.JSX.Element} ImageForm React component.
 */
const ImageForm = ({
  show,
  setShow,
  setLoading,
  setLoadProducts,
  product,
  productVariantGroup,
  setProductVariantGroup,
  displayNotification
}) => {

  // Keep track of image name for image which is currently selected to be deleted
  const [imageToDelete, setImageToDelete] = useState()

  // If there is no selected product yet
  if (product === null) return 

  // Get product details
  const {id: productId, image: images, product_variants: productVariants} = product ?? {}

  let productImages = [] // Will store product and product variant group images
  let productVariantIds = []

  // If image form is for product
  if (productVariantGroup === null){

    // Get all image urls for product
    productImages = images.map(image => image.image_url)
  }

  // If image form is for product variant group
  else{

    // Get all ids of product variants in product variant group
    productVariants.forEach(productVariant => {
      if (productVariant.color === productVariantGroup) {
        productVariantIds.push(productVariant.id)
      }
    })

    // Get all images of product variants in product variant group
    productVariants.forEach(productVariant => {

      // If product is in product variant group
      if (productVariant.color === productVariantGroup) {
        productVariant.images.forEach(image => {

          // If image is not already in the images add it (must check as products in same group share images)
          if (!(productImages.includes(image.image_url))){
            productImages.push(image.image_url)
          }
        })
      }
    });
  }
  
  // Function adds an image to product/product variant group
  function addImage(file){

    // If image is too be added to product
    if (productVariantGroup === null){
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

    // If image is too be added to product variant group
    else{
        setLoading(true)
        const data = {
          productId: productId,
          productVariantIds: productVariantIds,
          image: file
        }
        adminProductVariantsService("add-group-image", data)
          .then((response) => displayNotification("Add Image", response.data.message))
          .catch((error) => displayNotification("Add Image", `${error}`, "danger"))
          .finally(() => {setLoading(false); setLoadProducts(true)})  
    }
  }

  // Function removes image from product/product variant group
  function removeImage(){

    // If image is too be added to product
    if (productVariantGroup === null){
      setLoading(true)
      const data = {
        fileName: imageToDelete
      }
      adminProductsService("remove-image", data)
        .then((response) => displayNotification("Remove Image", response.data.message))
        .catch((error) => displayNotification("Remove Image", `${error}`, "danger"))
        .finally(() => {setLoading(false); setLoadProducts(true)})  
    }

    // If image is too be removed from product variant group
    else{
      setLoading(true)
      const data = {
        productVariantIds: productVariantIds,
        fileName: imageToDelete
      }
      adminProductVariantsService("remove-group-image", data)
        .then((response) => displayNotification("Remove Image", response.data.message))
        .catch((error) => displayNotification("Remove Image", `${error}`, "danger"))
        .finally(() => {setLoading(false); setLoadProducts(true)})  
    }
  }

  return (
    <Modal dialogClassName="modal-90w" show={show} onHide={() => {setShow(false); setProductVariantGroup(null)}} centered>
      <Modal.Header closeButton>
            <Modal.Title>Edit Images</Modal.Title>
      </Modal.Header>
      <Modal.Body className='modal-body'>
        <div className='image-form'>

          {/* Display all images for product */}
          {
            productImages.map((image, index) => {
              return (
                <div key={index} onClick={() => setImageToDelete(imageToDelete === image ? null : image)} className={`image-container ${imageToDelete === image ? "show" : ""}`}>
                  <img src={`${IMAGE_BASE_URL}${image}`} alt='product'/>

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