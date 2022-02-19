import { Col, Row } from 'antd';
import { FC } from 'react';

import { Training } from '../../organism/Training';

export const TrainingPage: FC = () => (
	<Row>
		<Col span={14} offset={5}>
			<Training />
		</Col>
	</Row>
);
