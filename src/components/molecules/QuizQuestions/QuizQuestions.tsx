import _ from 'lodash';
import { FC, useMemo } from 'react';
import { Card, Space } from 'antd';

import { QuizList } from '../QuizList';
import { QuizResponse } from '../../atoms/QuizResponse';

import {
	nextQuestion,
	selectCurrentQuestion,
	selectTraining,
} from '../../../features/training/trainingSlice';
import { useAppDispatch, useAppSelector } from '../../../hooks';

import { IWord } from '../../../interfaces/word';
import { ITrainingAnswer } from '../../../interfaces/training';

import './QuizQuestions.css';

export const QuizQuestions: FC = () => {
	const dispatch = useAppDispatch();
	const { wasAnswered, correctAnswerId, wrongAnswersIds } = useAppSelector(
		selectCurrentQuestion
	);
	const { currentQuestionId, trainingWords } = useAppSelector(selectTraining);

	const correctWord = _.find(trainingWords, { id: correctAnswerId }) as IWord;
	const [wrongAnswer1, wrongAnswer2, wrongAnswer3] = wrongAnswersIds;

	const handleNextQuestionLink: React.MouseEventHandler = (e) => {
		e.preventDefault();
		dispatch(nextQuestion());
	};

	const variants: ITrainingAnswer[] = [
		{ wordId: correctAnswerId, isCorrect: true },
		{ wordId: wrongAnswer1, isCorrect: false },
		{ wordId: wrongAnswer2, isCorrect: false },
		{ wordId: wrongAnswer3, isCorrect: false },
	];

	const shuffledVariants = useMemo(
		() => _.shuffle(variants),
		[currentQuestionId]
	);

	const QuestionTitle = (
		<Space wrap>
			<span>Выберите перевод слова:</span>
			<span style={{ fontWeight: 'bold' }}>{correctWord.word}</span>
		</Space>
	);

	return (
		<Card title={QuestionTitle}>
			<QuizList variants={shuffledVariants} />
			<QuizResponse
				wasAnswered={wasAnswered}
				handleNextQuestion={handleNextQuestionLink}
			/>
		</Card>
	);
};
