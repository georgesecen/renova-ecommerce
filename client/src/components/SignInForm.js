import "../styles/signInForm.css";
import { useState } from "react";
import { Form } from "react-bootstrap";
import { Button } from "./Button";
import { Link, useNavigate } from "react-router";
import { Input } from "./Input";
import { loginUser } from "../services/api";
import Spinner from '../components/Spinner';

export default function SignInForm() {
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

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email address is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (validateForm()) {
      try {
        setIsLoading(true);
        const response = await loginUser(formData.email, formData.password);
        const data = response.data;
        setFormData({ email: "", password: "" });
        setServerMessage(data.message);
        setIsLoading(false);
        // navigate("/");
        
      } catch (err) {
        setIsLoading(false);
        if (err.response) {
          setServerMessage(err.response.data.error);
        } else {
          console.log(err.message); 
        }
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
          {/* <Form.Label>Email</Form.Label> */}
          {/* <Form.Control
            required
            type="email"
            placeholder="Enter email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          /> */}
          <Input type={"email"} placeHolder={"email"} name={"email"} value={formData.email} onChange={handleChange} />
          {/* {errors.email && <span>{errors.email}</span>} */}
          <span className={`${errors.email ? '' : 'hidden'}`}>{errors.email}</span>
        </Form.Group>

        <Form.Group controlId="formPassword">
          {/* <Form.Label>Password</Form.Label> */}
          {/* <Form.Control
            required
            type="password"
            placeholder="Enter password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          /> */}
          <Input type={"password"} placeHolder={"password"} name={"password"} value={formData.password} onChange={handleChange} />
          {/* {errors.password && <span>{errors.password}</span>} */}
          <span className={`${errors.password ? '' : 'hidden'}`}>{errors.password}</span>
        </Form.Group>
        <Button isDisabled={isLoading} type={"submit"}>log in</Button>
        <p className="link-to-signup">NO ACCOUNT? <Link className="accent" to={"/signUp"}>SIGN UP</Link></p>
        {/* <Button variant="primary" type="submit">
          Submit
        </Button> */}
        {isLoading ? <Spinner/> : <p>{serverMessage}</p>}
        
      </Form>

      
      
    </div>
  );
}
