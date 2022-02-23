import { FC } from 'react';

import { Button, Col, Row, Space } from 'antd';

import style from './RepeatTraining.module.css';

interface IRepeatTraining {
	isCompleted: boolean;
	handleReset: () => void;
}

export const RepeatTraining: FC<IRepeatTraining> = (props) => (
	<>
		{props.isCompleted ? (
			<Row justify='space-around' className={style.repeatTraining}>
				<Col />

				<Col push={2}>
					<Button className='app-btn _green' onClick={props.handleReset}>
						Вернуться к тренировке
					</Button>
				</Col>
			</Row>
		) : null}
	</>
);
