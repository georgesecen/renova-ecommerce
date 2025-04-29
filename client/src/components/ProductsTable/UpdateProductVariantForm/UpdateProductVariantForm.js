import React from 'react'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { adminProductVariantsService } from '../../../services/productVariants';
import "./updateProductVariantForm.css"
import CustomFormInput from '../../CustomFormInput/CustomFormInput';
import ActionButton from '../../ActionButton/ActionButton';
const deleteIcon = require("../../../assets/icons/delete.png")

/**
 * Form which deletes product variants and updates product variant stock quantities.
 * @param {boolean} show True if the form is to be displayed, otherwise false.
 * @param {function} setShow Function which handles displaying the form.
 * @param {function} setLoading Function which handles displaying the modal spinner.
 * @param {function} setLoadProducts Function which handles loading the products.
 * @param {object} product Product which product variants belong to.
 * @param {string} productVariantGroup Product variant group which contains product variants to update. (Color)
 * @param {function} setProductVariantGroup Function which handles selecting the product variant group.
 * @param {function} displayNotification Function which displays toast notifications.
 * @returns {React.JSX.Element} UpdateProductVariantForm React component.
 */
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
        <CustomFormInput type="number" min={0} max={10000} defaultValue={quantity} inputName={id} text={`${name} - Quantity`} />
        <ActionButton onClick={(event) => deleteProductVariant(id)} color="#C90230" icon={deleteIcon} text="Delete"/>
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

  // Gets data from form and updates all changed product variant stock quantities
  async function processFormData(){
      const form = document.getElementById("update-product-variant-form")

      // If form is invalid display what form inputs are missing to admin
      if (!form.checkValidity()){
        form.reportValidity()
        return
      }

      const formData = new FormData(form)
      const entries = Object.fromEntries(formData.entries()) // Get key value pairs (Keys being form feild names)
  
      for (const productVariant of productVariantDetails){

        // Get product variants quantity from from
        const newQuantity = Number(entries[productVariant.id])

        // If product variants quantity has been changed
        if (productVariant.quantity !== newQuantity){

            // Update product variants quantity to the new quantity
            const data = {
                productVariantId: productVariant.id,
                quantity: newQuantity
            }
            setLoading(true)
            await adminProductVariantsService("update-quantity", data)
              .then((response) => displayNotification("Update", response.data.message))
              .catch((error) => displayNotification("Update", `${error}`, "danger"))
              .finally(() => {setLoading(false); setLoadProducts(true)})  
        }
      }
  }
  
  return (
    <Modal show={show} onHide={() => {setShow(false); setProductVariantGroup(null)}} centered>
        <Modal.Header closeButton>
            <Modal.Title>Update Product Variants</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <form id='update-product-variant-form' className='table-form'>
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
            <Button variant="secondary" onClick={() => {setShow(false); setProductVariantGroup(null)}}>
                Close
            </Button>
            <Button variant="primary" onClick={() => processFormData()}>
                Save Changes
            </Button>
        </Modal.Footer>
    </Modal>
  )
}

export default UpdateProductVariantForm