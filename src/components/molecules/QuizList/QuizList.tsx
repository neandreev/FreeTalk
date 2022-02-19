import { FC, useEffect } from 'react';

import {
	selectCurrentQuestion,
} from '../../../features/training/trainingSlice';
import { useAppSelector } from '../../../hooks';

import { ITrainingAnswer } from '../../../interfaces/training';
import { AnswerButtons } from '../../atoms/AnswerButtons';

interface IQuizList {
	variants: ITrainingAnswer[];
}

export const QuizList: FC<IQuizList> = ({ variants }) => {
	const { wasAnswered } = useAppSelector(selectCurrentQuestion);

	const buttonsBlockEffect = () => {
		const handleButtonEvents = (e: MouseEvent) => {
			const target = e.target as HTMLElement;

			if (target.dataset.quizbutton && wasAnswered) {
				e.stopPropagation();
			}
		};

		const quiz = document.getElementById('quiz')!;
		quiz.addEventListener('click', handleButtonEvents, true);

		return () => quiz.removeEventListener('click', handleButtonEvents, true);
	};

	useEffect(buttonsBlockEffect, [wasAnswered]);

	return (
		<div id='quiz'>
			<AnswerButtons variants={variants} />
			{/* <Progress
				size='small'
				strokeColor='#f5564a'
				success={{ strokeColor: '#4bb450', percent: correctAnswers * 10 }}
				percent={currentQuestionId * 10}
			/> */}
		</div>
	);
};
