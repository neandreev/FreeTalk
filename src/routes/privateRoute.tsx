import { FC } from 'react';
import { Navigate } from 'react-router-dom';

import { useAuth } from '../hooks';

export const PrivateRoute: FC = ({ children }) => {
	const auth = useAuth();
	const { user } = auth!;

	if (!user) {
    return <Navigate to="/" />;
  }

  return <>{children}</>
};
