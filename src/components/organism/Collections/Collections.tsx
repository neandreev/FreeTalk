import { FC, useEffect, useState } from 'react';

import { CollectionCard } from '../../molecules/CollectionCard';
import { ICollection } from '../../../interfaces/collection';
import { IPagination } from '../../../interfaces/pagination';

import { Pagination, Row, Col } from 'antd';
import styles from './Collections.module.css';

export const Collections: FC<{ data: ICollection[] }> = ({ data }) => {
	const [collections, setCollections] = useState<Array<ICollection>>([]);
	const [pagination, setPagination] = useState<IPagination>({
		limit: 3,
		index: 1,
		total: 0,
	});

	useEffect(() => {
			if (data) {
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
			}
	}, [data, pagination.index]);

	const handleChangePagination = (page: number, pageSize: number) => {
		setPagination({
			...pagination,
			index: page,
			limit: pageSize,
		});
	};

	return (
			<>
				<Row className={styles.cards} gutter={[16, 16]}>
					{collections.map((item) => (
						<Col xs={24} sm={12} lg={8} key={item.id}>
							<CollectionCard
								id={item.id}
								title={item.title}
								coverUrl={item.coverUrl}
								words={item.words}
							/>
						</Col>
					))}
				</Row>
				<Row className={styles.pagination}>
					<Col span={24}>
						<Pagination
							total={pagination.total}
							pageSize={pagination.limit}
							current={pagination.index}
							onChange={handleChangePagination}
							hideOnSinglePage={false}
						/>
					</Col>
				</Row>
			</>
	);
};
