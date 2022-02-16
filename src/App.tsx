import { FC } from 'react';

import { AppRoutes } from './routes';

import './styles/page.css';

export const App: FC = () => {
	return (
		<div className="App">
			<AppRoutes/>
		</div>
	);
};
