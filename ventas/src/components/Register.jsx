import React, { useState } from 'react';
import styled from 'styled-components';

const RegisterForm = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const Input = styled.input`
    padding: 10px;
    margin-bottom: 10px;
    width: 300px;
`;

const Button = styled.button`
    padding: 10px 20px;
    background-color: #007bff;
    color: #fff;
    border: none;
    cursor: pointer;
`;

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
    };

    return (
        <RegisterForm onSubmit={handleSubmit}>
            <Input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit">Register</Button>
        </RegisterForm>
    );
};

export default Register;