import _ from 'lodash';
import dayjs from 'dayjs';
import cn from 'classnames';
import firebase from 'firebase';
import { FC, useState } from 'react';

import { Card } from 'antd';

import {
	answerQuestion,
	selectCurrentQuestion,
	selectTraining,
} from '../../../features/training/trainingSlice';
import { useAuth } from '../../../hooks/useAuth';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { useUpdateUserWordMutation } from '../../../features/database/users';

import { IWord } from '../../../interfaces/word';

import style from './QuizButton.module.css';
import './QuizButton.css';

interface IQuizButton {
	wordId: string;
	isCorrect: boolean;
	placement: 'left' | 'right';
}

const fibonacci = (n: number) => {
	let a = 1;
	let b = 1;
	for (let i = 3; i <= n; i++) {
		let c = a + b;
		a = b;
		b = c;
	}
	return b;
};

const updateTimeToTrain = (timeToTrain: number, completedTrains: number) => {
	const oneDayTimestamp = 24 * 60 * 60 * 1000;
	const daysToNextTraining = fibonacci(completedTrains);
	const roundedTimeToTrain = dayjs(timeToTrain).endOf('day').valueOf();
	const newTimeToTrain =
		roundedTimeToTrain + oneDayTimestamp * daysToNextTraining;

	return newTimeToTrain;
};

export const QuizButton: FC<IQuizButton> = (props) => {
	const { wordId, isCorrect } = props;

	const auth = useAuth();
	const user = auth!.user as firebase.User;
	const [isClicked, setIsClicked] = useState(false);

	const dispatch = useAppDispatch();
	const { trainingWords } = useAppSelector(selectTraining);
	const { wasAnswered } = useAppSelector(selectCurrentQuestion);
	const [updateWord, updateData] = useUpdateUserWordMutation();

	const word = _.find(trainingWords, { id: wordId }) as IWord;

	const handleButtonClick = () => {
		if (isClicked || wasAnswered) return;
		if (isCorrect) {
			const completedTrains = word.completedTrains + 1;
			const timeToTrain = updateTimeToTrain(word.timeToTrain, completedTrains);

			const wordsUpdate = {
				wordId: wordId,
				userId: user.uid,
				word: {
					completedTrains,
					timeToTrain,
				},
			};

			updateWord(wordsUpdate);
		}

		const answer = { answerId: wordId, isAnsweredCorrectly: isCorrect };

		dispatch(answerQuestion(answer));
		setIsClicked(true);
	};

	const coverStyles = cn(style.img, { [style.blurred]: !wasAnswered });
	const cover = (
		<div className={cn(style.imgContainer, { [style.answered]: wasAnswered })}>
			<img className={coverStyles} src={word.imageURL} alt={word.translation} />
		</div>
	);

	const cardStyles = cn('quizButton', {
		quizButton_wrong: !isCorrect && isClicked,
		quizButton_correct: isCorrect && isClicked,
	});

	return (
		<Card
			hoverable
			className={cardStyles}
			cover={cover}
			onClick={handleButtonClick}
			data-quizbutton
		>
			<div>
				<div>
					<span className={style.blueTitle}>RU:</span>
					<span>{word.translation}</span>
				</div>
				<div>
					<span className={cn(style.blueTitle)}>EN:</span>
					<span className={cn(style.title, { [style.blurredTitle]: !wasAnswered })}>
						{word.word}
					</span>
				</div>
			</div>
		</Card>
	);
};
