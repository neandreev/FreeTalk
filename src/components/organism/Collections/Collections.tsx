import { FC, useEffect, useState } from 'react';
import { useAppDispatch } from '../../../hooks';

import { CollectionCard } from '../../molecules/CollectionCard';

import { Pagination, message, Row, Col } from 'antd';

import { getCollectionsAsync } from '../../../api/collectionsAPI';

import { ICollection } from '../../../interfaces/collection';

import styles from './Collections.module.css';

interface IPagination {
	limit: number;
	index: number;
	total?: number;
}

export const Collections: FC = () => {
	const dispatch = useAppDispatch();
	const [collections, setCollections] = useState<Array<ICollection>>([]);
	const [pagination, setPagination] = useState<IPagination>({
		limit: 2,
		index: 1,
		total: 0,
	});

	useEffect(() => {
		dispatch(getCollectionsAsync())
			.then((res) => {
				const data = res as Array<ICollection>;
				setPagination({
					...pagination,
					total: data.length,
				});

				setCollections(
					data
						.slice(
							(pagination.index - 1) * pagination.limit,
							(pagination.index - 1) * pagination.limit + pagination.limit
						)
						.map((item) => {
							return { ...item };
						})
				);
			})
			.catch((e) => {
				message.error(e);
			});
	}, [dispatch, pagination.index]);

	const handleChangePagination = (page: number, pageSize: number) => {
		setPagination({
			...pagination,
			index: page,
			limit: pageSize,
		});
	};

	return (
		<div className='page'>
			<Row justify='center'>
				<Col>
					<h1 className='page__title'>Collections of words for the dictionary</h1>
				</Col>
			</Row>
			<Row justify='center' gutter={16}>
				{collections.map((item) => (
					<Col span={6} key={item.id}>
						<CollectionCard
							id={item.id}
							title={item.title}
							coverUrl={item.coverUrl}
							words={item.words}
						/>
					</Col>
				))}
			</Row>
			<Row justify='center' className={styles.pagination}>
				<Col>
					<Pagination
						total={pagination.total}
						pageSize={pagination.limit}
						current={pagination.index}
						onChange={handleChangePagination}
					/>
				</Col>
			</Row>
		</div>
	);
};
