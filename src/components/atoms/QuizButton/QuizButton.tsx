import _ from 'lodash';
import dayjs from 'dayjs';
import cn from 'classnames';
import firebase from 'firebase';
import { FC, useState } from 'react';

import { Popover } from 'antd';

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
		if (isClicked) return;
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

	const PopoverImage = (
		<div className={style.image}>
			<img src={word.imageURL} alt={word.translation} style={{ height: '200px' }} />
			<span className={style.word}>{word.word}</span>
		</div>
	);

	const clickedButtonStyles = cn([style.quizButton_picked], {
		[style.quizButton_correct]: isCorrect,
		[style.quizButton_wrong]: !isCorrect,
	});

	const buttonStyles = cn(style.quizButton, {
		[style.noHover]: wasAnswered,
		[clickedButtonStyles]: isClicked,
	});

	const Button = (
		<div data-quizbutton className={buttonStyles} onClick={handleButtonClick}>
			{word.translation}
		</div>
	);

	const popoverStyles = cn('popover', {
		popover_correct: isCorrect,
		popover_wrong: !isCorrect,
	});

	return (
		<>
			{!isClicked ? (
				Button
			) : (
				<Popover
					visible={isClicked}
					placement={props.placement}
					overlayClassName={popoverStyles}
					content={PopoverImage}
				>
					{Button}
				</Popover>
			)}
		</>
	);
};
