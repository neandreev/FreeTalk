import { FC, useCallback } from 'react';

import { Card } from 'antd';

import { ICardTranslateRes } from '../../../interfaces/translate';

import { FileAddOutlined } from '@ant-design/icons';

import './CardTranslateRes.css'

export const CardTranslateRes: FC<ICardTranslateRes> = (
	{ word, onAddWordToDictionary }
) => {
	const handleAddWordToDictionary = useCallback(() => {
		onAddWordToDictionary && onAddWordToDictionary(word);
	}, [onAddWordToDictionary]);

	return (
		<Card
			className='card-translate-res'
			cover={<img className='card-cover' alt={word.translation} src={word.imageURL} />}
			actions={[
				<FileAddOutlined key='add' onClick={handleAddWordToDictionary} />]}
		>
			<p>EN: {word.translation}</p>
			<p>RU: {word.word}</p>
		</Card>
	);
};
