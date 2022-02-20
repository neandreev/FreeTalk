import { FC } from 'react';

import { Translate } from '../../organism/Translate';
import { Description } from '../../organism/Description';

import styles from './MainPage.module.css';

export const MainPage: FC = () => {
	return (
		<div>
			<h1 className={`page__title ${styles.title}`}>Время учить слова онлайн</h1>
			<Translate />
			<Description />
		</div>
	);
};
