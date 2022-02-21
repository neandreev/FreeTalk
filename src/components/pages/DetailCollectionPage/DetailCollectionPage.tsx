import { FC } from 'react';

import { useGetCollectionsQuery } from '../../../services/collections';
import { DetailCollection } from '../../organism/DetailCollection';

import { Row, Col, Spin } from 'antd';

export const DetailCollectionPage: FC = () => {
	const { data } = useGetCollectionsQuery(null);

	return (
		<div style={{ height: '100%' }}>
			{data ? (
				<DetailCollection data={data} />
			) : (
				<Row justify="center" align='middle' style={{ height: '100%' }}>
					<Col>
						<Spin size="large" />
					</Col>
				</Row>
			)
		}
		</div>
	);
};
