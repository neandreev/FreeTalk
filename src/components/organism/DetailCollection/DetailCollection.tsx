import { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import { DetailCollectionWordCard } from '../../molecules/DetailCollectionWordCard';
import { ICollection } from '../../../interfaces/collection';
import { IPagination } from '../../../interfaces/pagination';
import { IWord } from '../../../interfaces/word';

import { Row, Col, Pagination, Button } from 'antd';

import styles from './DetailCollection.module.css';
export const DetailCollection: FC<{ data: ICollection[] }> = ({ data }) => {
	const params = useParams();
	const navigate = useNavigate();
	const [collections, setCollections] = useState<Array<ICollection>>([]);
	const [selectedCollection, setSelectedCollection] = useState<ICollection>();
	const [words, setWords] = useState<Array<IWord>>();
	const [pagination, setPagination] = useState<IPagination>({
		limit: 6,
		index: 1,
		total: 0,
	});

	useEffect(() => {
		if (data) {
			setCollections(data as Array<ICollection>);
			setSelectedCollection(
				collections.find((item) => item.id === params.id) as ICollection
			);
			setPagination({
				...pagination,
				total: selectedCollection?.words.length,
			});
			setWords(
				selectedCollection?.words
					.slice(
						(pagination.index - 1) * pagination.limit,
						(pagination.index - 1) * pagination.limit + pagination.limit
					)
					.map((item) => {
						return { ...item };
					}))
		}
	}, [collections, params, selectedCollection, data, pagination.index]);

	const handleChangePagination = (page: number, pageSize: number) => {
		setPagination({
			...pagination,
			index: page,
			limit: pageSize,
		});
	};

	const handleBack = () => {
		navigate(-1);
	};

	return (
			<>
				<Row>
					<Col span={24}>
						<h1 className={`page__title ${styles.title}`}>{selectedCollection?.title}</h1>
						<hr />
					</Col>
				</Row>
				<Row className={styles.cards} gutter={[8, 8]}>
					{words?.map((item) => (
						<Col key={item.word} xs={24} sm={12} lg={8}>
							<DetailCollectionWordCard
								id={item.id}
								word={item.word}
								translation={item.translation}
								imageURL={item.imageURL}
								category={item.category}
								completedTrains={item.completedTrains}
								isLearned={item.isLearned}
								timeToTrain={item.timeToTrain}
							/>
						</Col>
					))}
				</Row>
				<Row className={styles.pagination} justify="space-between">
					<Col style={{ marginTop: '10px' }}>
						<Pagination
							total={pagination.total}
							pageSize={pagination.limit}
							current={pagination.index}
							onChange={handleChangePagination}
							hideOnSinglePage={false}
						/>
					</Col>
					<Col style={{ marginTop: '10px' }}>
						<Button className={`app-btn ${styles.btnCollections}`} onClick={handleBack}>Вернуться к коллекциям</Button>
					</Col>
				</Row>
			</>
	);
};
