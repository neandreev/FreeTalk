import { FC } from 'react';

import { Translate } from '../../organism/Translate';

import styles from './MainPage.module.css';

export const MainPage: FC = () => {
	return (
		<div>
			<h1 className={`page__title ${styles.title}`}>Время учить слова онлайн</h1>
			<Translate />
		</div>
	);
};