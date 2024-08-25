import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../../Hook/useForm';
import axios from 'axios';

export const LoginPage = () => {
	const navigate = useNavigate();

	const { name, email, password, onInputChange, onResetForm } = useForm({
		name: '',
		email: '',
		password: '',
	});

	const onLogin = async (e) => {
		e.preventDefault();

		try {
			// Enviar la solicitud de inicio de sesión al servidor
			const response = await axios.post('http://localhost/api/login', {
				name,
				email,
				password,
			});

			if (response.data.success) {
				navigate('/dashboard', {
					replace: true,
					state: {
						logged: true,
						name: response.data.name,
					},
				});
			} else {
				// Manejar el caso en que la autenticación falle
				alert('Usuario o contraseña incorrectos');
			}
		} catch (error) {
			console.error('Error al iniciar sesión:', error);
			alert('Hubo un problema al intentar iniciar sesión');
		}

		onResetForm();
	};

	return (
		<div className='wrapper'>
			<form onSubmit={onLogin}>
				<h1>Iniciar Sesión</h1>

				<div className='input-group'>
					<input
						type='text'
						name='name'
						id='name'
						value={name}
						onChange={onInputChange}
						required
						autoComplete='off'
					/>
					<label htmlFor='name'>Nombre:</label>
				</div>

				<div className='input-group'>
					<input
						type='email'
						name='email'
						id='email'
						value={email}
						onChange={onInputChange}
						required
						autoComplete='off'
					/>
					<label htmlFor='email'>Email:</label>
				</div>
				<div className='input-group'>
					<input
						type='password'
						name='password'
						id='password'
						value={password}
						onChange={onInputChange}
						required
						autoComplete='off'
					/>
					<label htmlFor='password'>Contraseña:</label>
				</div>

				<button>Entrar</button>
			</form>
		</div>
	);
};
