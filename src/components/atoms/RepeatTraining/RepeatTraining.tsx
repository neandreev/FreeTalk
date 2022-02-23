import { FC } from 'react';

import { Button, Space } from 'antd';

interface IRepeatTraining {
	isCompleted: boolean;
	handleReset: () => void;
}

export const RepeatTraining: FC<IRepeatTraining> = (props) => (
	<>
		{props.isCompleted ? (
			<Space>
				<span>Вы можете начать тренировку заново</span>
				<Button className='app-btn _green' onClick={props.handleReset}>
					Вернуться к тренировке
				</Button>
			</Space>
		) : null}
	</>
);
