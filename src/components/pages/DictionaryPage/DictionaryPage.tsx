import { Col, Row } from 'antd';
import { FC } from 'React';
import { Dictionary } from '../../organism/Dictionary';

export const DictionaryPage: FC = () => (
	<Row>
		<Col span={14} offset={5}>
			<Dictionary />
		</Col>
	</Row>
);
