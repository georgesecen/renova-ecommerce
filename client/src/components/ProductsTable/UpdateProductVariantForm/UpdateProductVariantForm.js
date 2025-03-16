import React from 'react'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
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

  console.log(productVariantDetails)
  
  return (
    <Modal show={show} onHide={() => {setShow(false); setProductVariantGroup(null)}} centered>
        <Modal.Header closeButton>
            <Modal.Title>Update Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <form id='update-product-variant-form'>
                
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