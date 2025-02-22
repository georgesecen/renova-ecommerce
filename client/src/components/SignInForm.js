import "../styles/signInForm.css";
import { useState } from "react";
import { Form } from "react-bootstrap";
import { Button } from "./Button";
import { Link, useNavigate } from "react-router";
import { Input } from "./Input";
import {getCartItemQuantity, loginUser} from "../services/api";
import Spinner from '../components/Spinner';
import { useUser } from "../providers/UserContext";
import { useCart } from "../providers/CartContext";

export default function SignInForm() {
  const { login } = useUser();  // Call useUser hook inside the component
  const { updateCartQuantity } = useCart();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [validated, setValidated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [serverMessage, setServerMessage] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  function validateForm() {
    const newErrors = {};
    //if empty email
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email address is invalid";
    }
    //if empty password
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }
    //set error obj
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (validateForm()) {
      try {
        setIsLoading(true);
        setServerMessage("");
        //grab form info to log in user
        const response = await loginUser(formData.email, formData.password);
        const data = response.data;
        //grab token from response and store it
        const token = response.data.token;
        login(token); //set context
        //grab cart quantity from db
        const res = await getCartItemQuantity();
        updateCartQuantity(res) //set cartQuantity context to cart quantity from db
        //submit form and navigate to cart page
        setFormData({ email: "", password: "" });
        setServerMessage(data.message);
        setIsLoading(false);
        //TODO change to user dashboard when user dashboard page is complete
        navigate("/cart");
      } catch (err) {
        setIsLoading(false);
        if (err.response) {
          setServerMessage(err.response.data.error);
        } else {
          console.log(err.message);
        }
      } finally {
        //make sure loading always ends up being set to false
        setIsLoading(false);
      }
    } else {
      console.log("form errors");
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  }

  return (
      <div>
        <Form
            method="POST"
            className="signIn-form"
            validated={validated}
            noValidate
            onSubmit={handleSubmit}
        >
          <Form.Group controlId="formEmail">
            <Input type={"email"} placeHolder={"email"} name={"email"} value={formData.email} onChange={handleChange} />
            <span className={`${errors.email ? '' : 'hidden'}`}>{errors.email}</span>
          </Form.Group>

          <Form.Group controlId="formPassword">
            <Input type={"password"} placeHolder={"password"} name={"password"} value={formData.password} onChange={handleChange} />
            <span className={`${errors.password ? '' : 'hidden'}`}>{errors.password}</span>
          </Form.Group>
          <Button isDisabled={isLoading} type={"submit"}>log in</Button>
          <p className="link-to-signup">NO ACCOUNT? <Link className="accent" to={"/signUp"}>SIGN UP</Link></p>
          {isLoading ? <Spinner/> : serverMessage && <p>{serverMessage}</p>}

        </Form>
      </div>
  );
}
