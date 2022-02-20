import { FC } from 'react';

import { Card } from 'antd';

import styles from './Description.module.css';
import './Description.css';

export const Description: FC = () => {
	return (
		<div className={styles.description}>
			<h3 className={`page__title ${styles.title}`}>Изучайте английский вместе с FreeTalk</h3>
			<div className={styles.cardsWrapper}>
				<Card
					cover={<img className='card-cover' alt='translate'
											src='https://englex.ru/app/uploads/books-in-english-1.png' />}
					className={`card-description ${styles.card}`}
				>
					<h3 className={styles.cardTitle}>Расширенный перевод</h3>
					<p className={styles.cardDescription}>Подберем похожие слова дополнительно к основному переводу.</p>
				</Card>
				<Card
					cover={<img className='card-cover' alt='dictionary'
											src='https://englex.ru/app/uploads/how-to-choose-english-dictionary.png' />}
					className={`card-description ${styles.card}`}
				>
					<h3 className={styles.cardTitle}>Онлайн словарь</h3>
					<p className={styles.cardDescription}>Персональный словарь всегда с вами и доступен с любого устройства.</p>
				</Card>
				<Card
					cover={<img className='card-cover' alt='training'
											src='https://englex.ru/app/uploads/english-for-trainers-and-athletes.png' />}
					className={`card-description ${styles.card}`}
				>
					<h3 className={styles.cardTitle}>Тренировки</h3>
					<p className={styles.cardDescription}>Поможем вам быстро выучить новые слова и повторить старые.</p>
				</Card>
				<Card
					cover={<img className='card-cover' alt='collections'
											src='https://englex.ru/app/uploads/surround-yourself-with-english.png' />}
					className={`card-description ${styles.card}`}
				>
					<h3 className={styles.cardTitle}>Коллекции</h3>
					<p className={styles.cardDescription}>Мы собрали для вас слова по темам и регулярно их обновляем.</p>
				</Card>
			</div>
		</div>
	);
};