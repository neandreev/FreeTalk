import { FC } from 'react';

import { Card } from 'antd';

import styles from './Description.module.css';
import './Description.css';

const DESC_DATA = [
	{
		title: 'Расширенный перевод',
		description: 'Подберем похожие слова дополнительно к основному переводу.',
		imgURL: 'https://englex.ru/app/uploads/books-in-english-1.png',
		imgALT: 'translate',
	},
	{
		title: 'Онлайн словарь',
		description: 'Персональный словарь всегда с вами и доступен с любого устройства.',
		imgURL: 'https://englex.ru/app/uploads/how-to-choose-english-dictionary.png',
		imgALT: 'dictionary',
	},
	{
		title: 'Тренировки',
		description: 'Поможем вам быстро выучить новые слова и повторить старые.',
		imgURL: 'https://englex.ru/app/uploads/english-for-trainers-and-athletes.png',
		imgALT: 'training',
	},
	{
		title: 'Коллекции',
		description: 'Мы собрали для вас слова по темам и регулярно их обновляем.',
		imgURL: 'https://englex.ru/app/uploads/surround-yourself-with-english.png',
		imgALT: 'collections',
	},
]


export const Description: FC = () => {
	return (
		<div className={styles.description}>
			<h3 className={`page__title ${styles.title}`}>Изучайте английский вместе с FreeTalk</h3>
			<div className={styles.cardsWrapper}>
				{
					DESC_DATA.map((item, index) => (
						<Card
							key={index}
							hoverable
							cover={<img className='card-cover' alt={item.imgALT} src={item.imgURL} />}
							className={`card-description ${styles.card}`}
						>
							<h4 className={styles.cardTitle}>{item.title}</h4>
							<p className={styles.cardDescription}>{item.description}</p>
						</Card>
					))
				}
			</div>
		</div>
	);
};