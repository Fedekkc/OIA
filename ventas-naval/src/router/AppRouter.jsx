import { Route, Routes } from 'react-router-dom';
import Nav from '../Navigation/Nav';
import {
	HomePage,
	DashboardPage,
	LoginPage,
	RegisterPage,
} from '../components/pages';
import { PrivateRoute } from './PrivateRoute';
import Products from '../Products/Product';
import PersonalVentas from '../PersonalVentas/PersonalVentas';


export const AppRouter = ({ query, handleInputChange, result }) => {
	return (
		<>
			<Routes>
				<Route 
          path='/' 
          element={<Nav query={query} handleInputChange={handleInputChange} />}
        >
					<Route 
            index 
            element={
              <>
                
                <Products result={result} />
              </>
            } 
          />
					<Route path='login' element={<LoginPage />} />
					<Route path='register' element={<RegisterPage />} />
					<Route
						path='dashboard'
						element={
							<PrivateRoute>
								<DashboardPage />
							</PrivateRoute>
						}
					/>
					<Route path='personal_ventas' element={<PersonalVentas />} />
				</Route>
			</Routes>
		</>
	);
};
