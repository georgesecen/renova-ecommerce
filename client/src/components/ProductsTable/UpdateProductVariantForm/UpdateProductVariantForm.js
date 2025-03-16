import React from 'react'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { adminProductVariantsService } from '../../../services/productVariants';
import "./updateProductVariantForm.css"


const UpdateProductVariantForm = ({
  show,
  setShow,
  setLoading,
  setLoadProducts,
  product,
  productVariantGroup,
  setProductVariantGroup,
  displayNotification
}) => {

  // If there is no selected product variant group yet
  if (productVariantGroup === null) return 

  // Get product details
  const {product_variants: productVariants} = product ?? {}

  // Get all product variant group ids, names, and stock quantities
  const productVariantDetails = [] // [{id: 5, name: hoodie blue S, quantity: 32}]
  productVariants.forEach(productVariant => {
    if (productVariant.color === productVariantGroup){
        productVariantDetails.push({
            id: productVariant.id,
            name: `${product.name} ${productVariant.color} ${productVariant.size}`,
            quantity: productVariant.stock_quantity
        })
    }
  });

  // Displays product variant information. Also contains delete and update quantity options.
  const ProductVariantFormItem = ({id, name, quantity}) => {
    return (
      <div className='product-variant-form-item'>
        <p>#{id}: {name}</p>
        Quanity: <input name={id} step={1} defaultValue={quantity} type='number' />
        <button onClick={() => deleteProductVariant(id)}>Delete</button>
      </div>
    )
  }

  // Function deletes product variant with specified id
  function deleteProductVariant(id){
    setLoading(true)

    // If product variant to delete is the last product variant remaining in group
    if (productVariantDetails.length === 1){

        // Delete product variant with its images
        adminProductVariantsService("delete-group", {productVariantIds: [id]})
          .then((response) => displayNotification("Delete", response.data.message))
          .catch((error) => displayNotification("Delete", `${error}`, "danger"))
          .finally(() => {
            setLoading(false)
            setLoadProducts(true)

            // Unshow form as there are no more product variants in group
            setShow(false)
            setProductVariantGroup(null)
          })  

    }

    // If there are other remaining product variants in the group
    else{

        // Just delete product variant
        adminProductVariantsService("delete", {productVariantId: id})
          .then((response) => displayNotification("Delete", response.data.message))
          .catch((error) => displayNotification("Delete", `${error}`, "danger"))
          .finally(() => {setLoading(false); setLoadProducts(true)})  
    }
  }
  
  return (
    <Modal show={show} onHide={() => {setShow(false); setProductVariantGroup(null)}} centered>
        <Modal.Header closeButton>
            <Modal.Title>Update Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <form id='update-product-variant-form'>
                {
                    productVariantDetails.map((productVariant, index) => {
                        return (
                            <ProductVariantFormItem
                                key={index}
                                id={productVariant.id}
                                name={productVariant.name}
                                quantity={productVariant.quantity}
                                >
                            </ProductVariantFormItem>
                        )
                    })
                }
            </form>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={() => setShow(false)}>
                Close
            </Button>
            <Button variant="primary" onClick={() => {setShow(false)}}>
                Save Changes
            </Button>
        </Modal.Footer>
    </Modal>
  )
}

export default UpdateProductVariantForm