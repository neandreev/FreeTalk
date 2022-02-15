import { FC } from 'react';
import { useAuth } from '../../../hooks';

import { Training } from '../../organism/Training';

import './TrainingPage.css';

export const TrainingPage: FC = () => {
	const auth = useAuth();

	return <div className='training-page'>{auth?.user ? <Training /> : null}</div>;
};
