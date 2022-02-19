import { FC, useCallback } from 'react';

import { Col, Card, Button } from 'antd';

import { ICardTranslateRes } from '../../../interfaces/translate';

import style from './CardTranslateRes.module.css'
import './CardTranslateRes.css'

export const CardTranslateRes: FC<ICardTranslateRes> = (
	{ word, onAddWordToDictionary }
) => {
	const handleAddWordToDictionary = useCallback(() => {
		onAddWordToDictionary && onAddWordToDictionary(word);
	}, [onAddWordToDictionary]);

	return (
		<Col span={8}>
			<Card
				className='card-translate-res'
				cover={<img className='card-cover' alt={word.translation} src={word.imageURL} />}
			>
				<div className={style.cardBody}>
					<div className={style.cardText}>
						<p><strong>{word.translation}</strong></p>
						<p>{word.word}</p>
					</div>
					<div>
						<Button onClick={handleAddWordToDictionary}>Добавить в словарь</Button>
					</div>
				</div>
			</Card>
		</Col>
	);
};
