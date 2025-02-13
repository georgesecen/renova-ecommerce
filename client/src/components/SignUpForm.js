import "../styles/signUpForm.css";
import { useState } from "react";
import { Form } from "react-bootstrap";
import { Button } from "./Button";
import { addUser } from "../services/api";
import { Input } from "./Input";
import { Link } from "react-router";
import Spinner from '../components/Spinner';
import { v4 as uuidv4 } from 'uuid';

export default function SignUpForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
  });
  const [serverMessage, setServerMessage] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [validated, setValidated] = useState(false);

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    username: "",
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

    if (!formData.username) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 6) {
      newErrors.username = "Username must be at least 6 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        setIsLoading(true);
        const response = await addUser(formData.email, formData.password, formData.username,uuidv4());
        const data = response.data;
        setFormData({ email: "", password: "", username: "" });
        setServerMessage(data.message);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        if (err.response) {
          setServerMessage(err.response.data.error);
        } else {
          console.log(err.response.data.error); 
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
        className="signUp-form"
        validated={validated}
        noValidate
        onSubmit={handleSubmit}
      >
        <Form.Group controlId="formUsername">
          {/* <Form.Label>Username</Form.Label> */}
          {/* <Form.Control
            required
            type="text"
            placeholder="Enter username"
            name="username"
            value={formData.username}
            onChange={handleChange}
          /> */}
          <Input type={"text"} placeHolder={"username"} name={"username"} value={formData.username} onChange={handleChange} />
          {/* {errors.username && <span>{errors.username}</span>} */}
          <span className={`${errors.username ? '' : 'hidden'}`}>{errors.username}</span>
        </Form.Group>

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
          {/* {errors.email && <span className="hidden">{errors.email}</span>} */}
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
        {/* <Button variant="primary" type="submit">
          Submit
        </Button> */}
        <Button isDisabled={isLoading} type={"submit"}>sign up</Button>
        <p className="link-to-signin">ALREADY HAVE ACCOUNT? <Link className="accent" to={"/signIn"}>SIGN IN</Link></p>
        {isLoading ? <Spinner/> : <p>{serverMessage}</p>}
      </Form>
    </div>
  );
}
