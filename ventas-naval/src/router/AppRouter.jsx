import { Route, Routes } from 'react-router-dom';
import Nav from '../Navigation/Nav';
import {
	HomePage,
	DashboardPage,
	LoginPage,
	RegisterPage,
} from '../components/pages';
import { PrivateRoute } from './PrivateRoute';
import PersonalVentas from '../components/personalVentas';
import Cart from '../components/Cart';

import styled from 'styled-components';

const Container = styled.div`
	display: flex;
	flex-direction: row;	
`;



export const AppRouter = ({ query, handleInputChange, userRole }) => {



	return (
		<>
			<Routes>

					<Route
						index
						element={
							<>
								<DashboardPage userRole={userRole} >
								</DashboardPage>	
							</>
						}
					/>
					<Route path='login' element={<LoginPage />} />
					<Route path='register' element={<RegisterPage />} />
					<Route
						path='dashboard'
						element={

							<DashboardPage />

						}
					/>
					<Route path='personal_ventas' element={<PersonalVentas />} />

					<Route path='/cart' element={ <Cart></Cart> } />
						
			</Routes>
		</>
	);
};
