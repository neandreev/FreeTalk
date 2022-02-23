import { FC, MouseEventHandler } from 'react';

import { Spin, Button, Card, Tooltip, Row, Col } from 'antd';

import { useAppSelector } from '../../../hooks';
import { selectTraining } from '../../../features/training/trainingSlice';

import style from './TrainingIntro.module.css';
import './TrainingIntro.css';

interface ITrainingIntro {
	isDataPrepared: boolean;
	isTrainingAvailable: boolean;
	handleStart: MouseEventHandler;
}

type ITrainingStartButton = Omit<ITrainingIntro, 'isDataPrepared'>;

const TrainingStartButton: FC<ITrainingStartButton> = (props) => {
	const { trainingWords } = useAppSelector(selectTraining);
	const tooltipTitle = `Вы не можете начать тренировку, так как у вас недостаточно доступных для
	повторения слов в словаре. Доступно слов: ${trainingWords.length}. Необходимо: 10`

	return (
		<>
			{props.isTrainingAvailable ? (
				<Button
					className={'app-btn _green'}
					type='primary'
					onClick={props.handleStart}
				>
					Начать тренировку
				</Button>
			) : (
				<Tooltip
					title={tooltipTitle}
				>
					<Button className={'app-btn _green _disabled'}>Начать тренировку</Button>
				</Tooltip>
			)}
		</>
	);
};

export const TrainingIntro: FC<ITrainingIntro> = (props) => {
	return (
		<Card>
			<Row justify='center'>
				<Col className={style.col}>
					{props.isDataPrepared ? (
						<div>
							<img
								className={style.img}
								src='https://englex.ru/app/uploads/english-for-trainers-and-athletes.png'
								alt=''
							/>
						</div>
					) : (
						<Spin />
					)}
				</Col>
			</Row>
			<Row>
				<Col className={style.col}>
					<p className={`${style.description} ${style.center}`}>
						Данная тренировка основана на принципах интервального повторения:
					</p>
					<p className={style.description}>
						Вам будет предложено перевести слово из вашего словаря. В случая
						правильного перевода слово из словаря появится в следующей тренировке
						через некоторое время. Чем больше вы правильно переведете слово - тем реже
						оно будет появляться в вашей тренировке.
					</p>
				</Col>
			</Row>
			<Row justify='center'>
				<Col>
					<TrainingStartButton {...props} />
				</Col>
			</Row>
		</Card>
	);
};
