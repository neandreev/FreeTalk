import { FC } from 'react';

import { useGetCollectionsQuery } from '../../../services/collections';

import { Collections } from '../../organism/Collections/Collections';

import { Row, Col, Spin } from 'antd';
import styles from './CollectionsPage.module.css';

export const CollectionsPage: FC = () => {
	const { data } = useGetCollectionsQuery(null);

	return (
		<div style={{ height: '100%' }}>
			{data ? (
				<>
					<Row>
						<Col span={24}>
							<h1 className={`page__title ${styles.title}`}>Предлагаемые коллекции</h1>
							<hr />
						</Col>
					</Row>
					<Collections data={data} />
				</>
			) : (
				<div className={styles.wrapSpinner}>
					<Spin size="large" />
				</div>
			)
		}
		</div>
	);
};
