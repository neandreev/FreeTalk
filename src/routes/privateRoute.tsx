import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks';

import { AppPrivateLayout } from '../layouts/private-layout';

export const PrivateRoute: FC = ({ children }) => {
	const auth = useAuth();
	const navigate = useNavigate();
	const { user } = auth!;

  return (
		<>
			{user ?
				<AppPrivateLayout>{children}</AppPrivateLayout> :
				navigate('/')
			}
		</>
	);
};
