import { FC } from 'react';
import { Link } from 'react-router-dom';

import { ICollection } from '../../../interfaces/collection';

import { Card } from 'antd';
import styles from './CollectionCard.module.css';

export const CollectionCard: FC<ICollection> = ({ id, title, coverUrl }) => {
	return (
		<Card
			cover={<img alt={title} src={coverUrl} className={styles.cardImg} />}
		>
			<div className={styles.info}>
				<span>{ title }</span>
				<Link to={`/collection-detail/${id}`}>Изучить слова</Link>
			</div>
		</Card>
	);
};
