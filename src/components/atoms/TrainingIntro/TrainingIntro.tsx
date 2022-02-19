import { FC, MouseEventHandler } from 'react';

import { Spin, Button } from 'antd';

interface ITrainingIntro {
	isDataPrepared: boolean;
	isTrainingAvailable: boolean;
	handleStart: MouseEventHandler;
}

export const TrainingIntro: FC<ITrainingIntro> = (props) => (
	<div>
		<h2>Тренировка</h2>
		{props.isDataPrepared ? (
			props.isTrainingAvailable ? (
				<div>Вы можете начать тренировку</div>
			) : (
				<div>
					Вы не можете начать тренировку, так как у вас недостаточно доступных для
					повторения слов в словаре (менее 10 штук)
				</div>
			)
		) : (
			<Spin />
		)}

		<Button type='primary' onClick={props.handleStart} disabled={!props.isTrainingAvailable}>
			Начать тренировку
		</Button>
	</div>
);
