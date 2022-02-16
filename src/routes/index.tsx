import { Routes, Route } from 'react-router-dom';

import { routes } from './routes';
import { PrivateRoute } from './privateRoute';
import { PublicRoute } from './publicRoute';

export const AppRoutes = () => {
	return (
		<Routes>
			{routes.map((route) =>
				route.isProtected ? (
					<Route
						key={route.path}
						path={route.path}
						element={
							<PrivateRoute>
								<route.component/>
							</PrivateRoute>
						}
					/>
				) : (
					<Route
						key={route.path}
						path={route.path}
						element={
							<PublicRoute>
								<route.component/>
							</PublicRoute>
						}
					/>
				)
			)}
		</Routes>
	);
};