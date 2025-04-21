import "../styles/signUpForm.css";
import { useState,useRef } from "react";
import { Form } from "react-bootstrap";
import { Button } from "./Button";
import { addUser } from "../services/user";
import { Input } from "./Input";
import { Link } from "react-router";
import Spinner from '../components/Spinner';
import { v4 as uuidv4 } from 'uuid';
import emailjs from '@emailjs/browser';

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

  const form = useRef();

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
        const response = await addUser(uuidv4(), formData.username, formData.email, formData.password);
        const data = response.data;
        setFormData({ email: "", password: "", username: "" });
        setServerMessage(data.message);
        setIsLoading(false);
        emailjs
      .sendForm('service_g7pqxqe', 'template_j92hw2d', form.current, {
        publicKey: 'xcxrC1TPmd1ivmMQY',
      })
      .then(
        () => {
          console.log('SUCCESS!');
        },
        (error) => {
          console.log('FAILED...', error.text);
        },
      );
      } catch (err) {
        setIsLoading(false);
        if (err.response) {
          setServerMessage(err.response.data.error);
        } else {
          console.log(err)
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
        ref={form}
        method="POST"
        className="signUp-form"
        validated={validated}
        noValidate
        onSubmit={handleSubmit}
      >
        <Form.Group controlId="formUsername">

          <Input type={"text"} placeHolder={"username"} name={"username"} value={formData.username} onChange={handleChange} />

          <span className={`${errors.username ? '' : 'hidden'}`}>{errors.username}</span>
        </Form.Group>

        <Form.Group controlId="formEmail">
          <Input type={"email"} placeHolder={"email"} name={"email"} value={formData.email} onChange={handleChange} />
          <span className={`${errors.email ? '' : 'hidden'}`}>{errors.email}</span>
        </Form.Group>

        <Form.Group controlId="formPassword">

          <Input type={"password"} placeHolder={"password"} name={"password"} value={formData.password} onChange={handleChange} />
          <span className={`${errors.password ? '' : 'hidden'}`}>{errors.password}</span>
        </Form.Group>
        <Button isDisabled={isLoading} type={"submit"}>sign up</Button>
        <p className="link-to-signin">ALREADY HAVE ACCOUNT? <Link className="accent" to={"/signIn"}>SIGN IN</Link></p>
        {isLoading ? <Spinner/> : <p>{serverMessage}</p>}
      </Form>
    </div>
  );
}