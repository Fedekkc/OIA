import { Navigate, useLocation } from 'react-router-dom';

export const PrivateRoute = ({ children }) => {
	const { state } = useLocation();

	return state?.token ? children : <Navigate to='/login' />;
};
