import { FC } from 'react';
import { Dictionary } from '../../organism/Dictionary';

import style from './Dictionary.module.css';

export const DictionaryPage: FC = () => (
	<div>
		<h1 className={`page__title ${style.title}`}>Словарь</h1>
		<Dictionary />
	</div>
);
