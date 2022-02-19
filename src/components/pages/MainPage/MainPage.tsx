import {FC} from 'react';

import {Translate} from '../../organism/Translate';
import { Typography, Col, Row } from 'antd';

const { Title } = Typography;

export const MainPage: FC = () => {
	return (
		<Row>
			<Col span={14} offset={5}>
				<Title level={3} style={{textAlign: 'center'}}>Время учить слова онлайн</Title>
				<Translate/>
			</Col>
		</Row>
	);
};