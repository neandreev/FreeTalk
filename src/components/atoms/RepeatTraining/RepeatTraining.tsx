import { FC } from 'react';

import { Button } from 'antd';

import style from './RepeatTraining.module.css';

interface IRepeatTraining {
	isCompleted: boolean;
	handleReset: () => void;
}

export const RepeatTraining: FC<IRepeatTraining> = (props) => (
	<>
		{props.isCompleted ? (
			<div className={style.repeatTraining}>
				<span>Вы можете начать тренировку заново</span>
				<Button className='app-btn _green' onClick={props.handleReset}>
					Вернуться к тренировке
				</Button>
			</div>
		) : null}
	</>
);
