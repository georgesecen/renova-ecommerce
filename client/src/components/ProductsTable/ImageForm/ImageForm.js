import React from 'react'
import { adminProductsService } from '../../../services/products';


const ImageForm = () => {

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
    <div>

        <input type="file" name="myImage" accept="image/*" onChange={(event) => addImage(event.target.files[0])} />


    </div>
  )
}

export default ImageForm