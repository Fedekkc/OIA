import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
    text-align: center;
`;

const Title = styled.h2`
    margin-bottom: 1rem;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const Label = styled.label`
    margin-bottom: 0.5rem;
`;

const Input = styled.input`
    padding: 0.5rem;
    margin-bottom: 1rem;
`;

const Button = styled.button`
    padding: 0.5rem 1rem;
`;

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add your login logic here
    };

    return (
        <Container>
            <Title>Login</Title>
            <Form onSubmit={handleSubmit}>
                <Label htmlFor="username">Username:</Label>
                <Input
                    type="text"
                    id="username"
                    value={username}
                    onChange={handleUsernameChange}
                />
                <Label htmlFor="password">Password:</Label>
                <Input
                    type="password"
                    id="password"
                    value={password}
                    onChange={handlePasswordChange}
                />
                <Button type="submit">Login</Button>
            </Form>
        </Container>
    );
};

export default Login;