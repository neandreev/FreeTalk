import _ from 'lodash';
import { FC } from 'react';

import { Card, Row } from 'antd';

import { useAppSelector } from '../../../hooks';
import { selectTraining } from '../../../features/training/trainingSlice';

import { WordStat } from '../../atoms/WordStat';
import { IQuestion } from '../../../interfaces/question';

import { IWord } from '../../../interfaces/word';

import './QuizStats.css';

const getWordsStats = (questions: IQuestion[], trainingWords: IWord[]) =>
	questions
		.map((question) => ({
			word: _.find(trainingWords, {
				id: question.correctAnswerId,
			}) as IWord,
			correct: question.wasAnsweredCorrectly,
		}))
		.map((stat) => (
			<WordStat key={stat.word.id} word={stat.word} correct={stat.correct!} />
		));

export const QuizStats: FC = () => {
	const { trainingWords, questions, correctAnswers, completedQuestions } =
		useAppSelector(selectTraining);

	const title = `Вы перевели ${correctAnswers} из ${completedQuestions} слов!`;

	const wordsStats = getWordsStats(questions, trainingWords);

	return (
		<Card className='quiz-stats' title={title}>
			<Row>{wordsStats}</Row>
		</Card>
	);
};
