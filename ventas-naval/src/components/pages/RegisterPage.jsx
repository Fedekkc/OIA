import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../../Hook/useForm';
import styled from 'styled-components';
import axios from 'axios';

const Wrapper = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100vh;
	background-color: #f0f0f5;
`;

const Form = styled.form`
	background-color: #ffffff;
	padding: 2rem;
	border-radius: 8px;
	box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
	width: 100%;
	max-width: 400px;
`;

const Title = styled.h1`
	margin-bottom: 1.5rem;
	font-size: 2rem;
	color: #333;
	text-align: center;
`;

const InputGroup = styled.div`
	position: relative;
	margin-bottom: 1.5rem;
`;

const Input = styled.input`
	width: 100%;
	padding: 0.75rem;
	padding-left: 1rem;
	font-size: 1rem;
	border: 1px solid #ccc;
	border-radius: 4px;
	outline: none;
	transition: border-color 0.3s;

	&:focus {
		border-color: #007bff;
	}

	&:focus + label,
	&:not(:placeholder-shown) + label {
		transform: translateY(-1.5rem);
		font-size: 0.85rem;
		color: #007bff;
	}
`;

const Label = styled.label`
	position: absolute;
	left: 1rem;
	top: 50%;
	transform: translateY(-50%);
	background-color: #ffffff;
	padding: 0 0.25rem;
	transition: all 0.3s ease;
	pointer-events: none;
	color: #777;
`;

const Button = styled.button`
	width: 100%;
	padding: 0.75rem;
	font-size: 1rem;
	background-color: #007bff;
	color: #ffffff;
	border: none;
	border-radius: 4px;
	cursor: pointer;
	transition: background-color 0.3s ease;

	&:hover {
		background-color: #0056b3;
	}
`;


export const RegisterPage = () => {
	const navigate = useNavigate();

	const { name, email, password, onInputChange, onResetForm } = useForm({
		name: '',
		email: '',
		password: '',
	});

	const onRegister = async (e) => {
		e.preventDefault();

		try {
			// Enviar la solicitud de registro al servidor
			const response = await axios.post('http://localhost:5000/register', {
				name,
				email,
				password,
			});

			if (response.data.success) {
				navigate('/dashboard', {
					replace: true,
					state: {
						logged: true,
						name: response.data.name || name,
					},
				});
			} else {
				// Manejar el caso en que el registro falle
				alert('No se pudo completar el registro. Inténtalo de nuevo.');
			}
		} catch (error) {
			console.error('Error al registrarse:', error);
			alert('Hubo un problema al intentar registrarse');
		}

		onResetForm();
	};

	return (
		<Wrapper>
			<Form onSubmit={onRegister}>
				<Title>Registrarse</Title>

				<InputGroup>
					<Input
						type='text'
						name='name'
						id='name'
						value={name}
						onChange={onInputChange}
						required
						autoComplete='off'
						placeholder=" "
					/>
					<Label htmlFor='name'>Nombre:</Label>
				</InputGroup>

				<InputGroup>
					<Input
						type='email'
						name='email'
						id='email'
						value={email}
						onChange={onInputChange}
						required
						autoComplete='off'
						placeholder=" "
					/>
					<Label htmlFor='email'>Email:</Label>
				</InputGroup>

				<InputGroup>
					<Input
						type='password'
						name='password'
						id='password'
						value={password}
						onChange={onInputChange}
						required
						autoComplete='off'
						placeholder=" "
					/>
					<Label htmlFor='password'>Contraseña:</Label>
				</InputGroup>

				<Button type='submit'>Registrarse</Button>
			</Form>
		</Wrapper>
	);
};
