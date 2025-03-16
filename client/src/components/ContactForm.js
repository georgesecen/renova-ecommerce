import '../styles/contactForm.css';
import FormModal from "./FormModal";
import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import { Input } from "./Input";
import { Button } from "./Button";
import Spinner from '../components/Spinner';


export default function ContactForm() {
    // State for form fields
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        message: ''
    });

    const [isLoading, setIsLoading] = useState(false);

    const [serverMessage, setServerMessage] = useState("");

    // State for validation messages
    const [validated, setValidated] = useState(false);
    // State form validation
    const [errors, setErrors] = useState({
        firstName: '',
        lastName: '',
        email: '',
        message: ''
    });

    // State to manage modal visibility
    const [showModal, setShowModal] = useState(false);

    // Handle form field changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const validateForm = () => {
        const newErrors = {};
        // First name validation
        if (!formData.firstName) {
            newErrors.firstName = 'First name is required';
        } else if(formData.firstName.length < 3) {
            newErrors.firstName = 'First name must be at least 3 characters long';
        }
        // Last name validation
        if (!formData.lastName) {
            newErrors.lastName = 'Last name is required';
        } else if(formData.lastName.length < 3) {
            newErrors.lastName = 'Last name must be at least 3 characters long';
        }
        // Email validation
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email address is invalid';
        }
        // Textarea validation
        if(!formData.message) {
            newErrors.message = 'Message is required';
            console.log(formData.message.length)
        } else if(formData.message.length < 10) {
            newErrors.message = 'Comment is not long enough';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Return true if no errors
    };
    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.currentTarget;

        if (validateForm()) {
            setIsLoading(true);
            const response = await fetch("http://localhost:3306/api/send-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    to: formData.email,
                    subject: `Message from ${formData.firstName} ${formData.lastName}`,
                    text: formData.message,
                }),
            });

            const data = await response.json();
            setServerMessage(data.message);
            setShowModal(true);
            setFormData({ firstName: '', lastName: '', email: '', message: '' });
            setIsLoading(false);
        } else {
            console.log("Form has errors");
        }

    };
    return (
        <div>
            <Form className="contact-form" noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group controlId="formFirstName">
                    <Input type={"text"} placeHolder={"first name"} name={"firstName"} value={formData.firstName} onChange={handleChange} />
                    <span className={`${errors.firstName ? '' : 'hidden'}`}>{errors.firstName}</span>
                </Form.Group>
                <Form.Group controlId="formLastName">
                    <Input type={"text"} placeHolder={"Last Name"} name={"lastName"} value={formData.lastName} onChange={handleChange}  />
                    <span className={`${errors.lastName ? '' : 'hidden'}`}>{errors.lastName}</span>
                   
                </Form.Group>

                <Form.Group controlId="formEmail">
                    <Input type={"email"} placeHolder={"email"} name={"email"} value={formData.email} onChange={handleChange} />
                    <span className={`${errors.email ? '' : 'hidden'}`}>{errors.email}</span>
                </Form.Group>
                <Form.Group controlId="formTextarea">
                    <textarea placeholder='message' name='message' rows='5' value={formData.message}
                        onChange={handleChange} className='textarea'>{formData.message}</textarea>
                    <span className={`${errors.message ? '' : 'hidden'}`}>{errors.message}</span>
                </Form.Group>

                <Button type={"submit"}>contact us</Button>
                {isLoading ? <Spinner/> : <p>{serverMessage}</p>}
            </Form>
        </div>
    );
}