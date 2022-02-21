import { FC, useCallback, useState } from 'react';

import { Translate } from '../../organism/Translate';
import { Description } from '../../organism/Description';

import styles from './MainPage.module.css';

export const MainPage: FC = () => {
	const [startTranslate, setStartTranslate] = useState(false);

	const handleStartTranslate = useCallback((status: boolean) => {
		setStartTranslate(status);
	}, [])

	return (
		<div>
			<h2 className={`page__title ${styles.title}`}>Время учить слова онлайн</h2>
			<Translate onStartTranslate={handleStartTranslate}/>
			{
				!startTranslate && <Description />
			}
		</div>
	);
};
