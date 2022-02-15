import { FC } from 'react';

import { Card, Col, Row } from 'antd';

import { useAppSelector } from '../../../hooks';
import { selectTraining } from '../../../features/training/trainingSlice';

import _ from 'lodash';

import { ITrainingWord } from '../../../interfaces/trainingWord';

import style from './QuizStats.module.css';
import './QuizStats.css';

interface IWordStat {
	word: ITrainingWord;
	correct: boolean;
}

const WordStat: FC<IWordStat> = (props) => {
	const { correct } = props;
	const wordStyle = correct ? style['correct'] : style['wrong'];

	return (
		<Col className={wordStyle} span={12}>
			<span>{props.word.word}</span>
		</Col>
	);
};

export const QuizStats: FC = () => {
	const { trainingWords, questions, correctAnswers, completedQuestions } =
		useAppSelector(selectTraining);
	const title = `Отлично! Ты правильно перевел ${correctAnswers} из ${completedQuestions} слов!`;

	const questionsWordsStats = questions
		.map((question) => ({
			word: _.find(trainingWords, {
				id: question.correctAnswerId,
			}) as ITrainingWord,
			correct: question.wasAnsweredCorrectly,
		}))
		.map((stat) => (
			<WordStat key={stat.word.id} word={stat.word} correct={stat.correct!} />
		));

	return (
		<Card className='quiz-stats' title={title}>
			<Row>{questionsWordsStats}</Row>
		</Card>
	);
};
