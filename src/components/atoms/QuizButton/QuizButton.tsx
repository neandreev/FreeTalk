import _ from 'lodash';

import { FC, MouseEventHandler, useEffect, useState } from 'react';

import {
	answerQuestion,
	selectTraining,
} from '../../../features/training/trainingSlice';
import { useAppDispatch, useAppSelector } from '../../../hooks';

import { ITrainingWord } from '../../../interfaces/trainingWord';

import style from './QuizButton.module.css';

interface QuizButtonProps {
	wordId: string;
	type: 'correct' | 'wrong';
}

export const QuizButton: FC<QuizButtonProps> = (props) => {
	const [isClicked, setIsClicked] = useState(false);

	const dispatch = useAppDispatch();
	const { trainingWords, currentQuestionId } = useAppSelector(selectTraining);

	const word = _.find(trainingWords, { id: props.wordId }) as ITrainingWord;
	const isAnsweredCorrectly = props.type !== 'wrong';
	const clickedButtonClasses = isAnsweredCorrectly
		? style.quizButton_correct
		: style.quizButton_wrong;

	const handleButtonClick: MouseEventHandler<HTMLDivElement> = (e) => {
		e.preventDefault();

		const answer = { wordId: props.wordId, isAnsweredCorrectly };
		dispatch(answerQuestion(answer));
		setIsClicked(true);
	};

	useEffect(() => {
		return () => {
			setIsClicked(false);
		};
	}, [currentQuestionId]);

	return (
		<>
			{!isClicked ? (
				<div
					data-quizbutton
					className={style.quizButton}
					onClick={handleButtonClick}
				>
					{word.translation}
				</div>
			) : (
				<div
					data-quizbutton
					className={`${style.quizButton} ${clickedButtonClasses}`}
				>
					{word.translation}
				</div>
			)}
		</>
	);
};
