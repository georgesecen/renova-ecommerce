import React from 'react'
import "./imageForm.css"
import { adminProductsService } from '../../../services/products';
import Modal from 'react-bootstrap/Modal';


const ImageForm = ({productImages}) => {

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
    <Modal show={true} centered>
      <Modal.Body>
        <div className='image-form'>
          {
            productImages.map(image => {
              return (
                <img src={`http://localhost:3306/static/images/${image}`} alt='product'/>
              )
            })
          }
          <input type="file" name="myImage" accept="image/*" onChange={(event) => addImage(event.target.files[0])} />
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default ImageForm