import _ from 'lodash';
import firebase from 'firebase';
import { FC, MouseEventHandler, useEffect, useState } from 'react';

import { Quiz } from '../Quiz';
import { RepeatTraining } from '../../atoms/RepeatTraining';

import { useAuth } from '../../../hooks/useAuth';
import {
	resetTraining,
	selectTraining,
	setQuestions,
	setTrainingWords,
} from '../../../features/training/trainingSlice';
import { useAppDispatch, useAppSelector } from '../../../hooks/';
import { useGetUserWordsByUidQuery } from '../../../features/database/users';

import { IWord } from '../../../interfaces/word';
import { IQuestion } from '../../../interfaces/question';
import { TrainingIntro } from '../../atoms/TrainingIntro';

import style from './Training.module.css';
import './Training.css'
import { Col, Row } from 'antd';

const generateQuestions = (words: IWord[]) => {
	const questions = words.map((word) => {
		const correctAnswerId = word.id;
		const wrongAnswersIds = _.shuffle(words)
			.map((word) => word.id)
			.filter((wordId) => wordId !== correctAnswerId)
			.slice(0, 3);

		const question: IQuestion = {
			wasAnswered: false,
			wasAnsweredCorrectly: null,
			answerId: '',
			correctAnswerId,
			wrongAnswersIds,
		};

		return question;
	});

	return questions;
};

const selectWordsForTraining = (words: IWord[]) => {
	const availableWordsForTraining = words.filter((word) => {
		const timestamp = Date.now();
		return word.timeToTrain <= timestamp && !word.isLearned;
	});
	const shuffledWords = _.shuffle(availableWordsForTraining);
	const wordsForTraining = shuffledWords.slice(0, 10);

	return wordsForTraining;
};

export const Training: FC = (props) => {
	const auth = useAuth();
	const user = auth!.user as firebase.User;

	const dispatch = useAppDispatch();
	const { isCompleted } = useAppSelector(selectTraining);
	const { data: words, isLoading } = useGetUserWordsByUidQuery(user.uid);

	const [startTraining, setStartTraining] = useState(false);
	const [isDataPrepared, setIsDataPrepared] = useState(false);
	const [isTrainingAvailable, setIsTrainingAvailable] = useState(false);
	const [isTrainingRepeated, setIsTrainingRepeated] = useState(false);

	const handleResetTraining = () => {
		dispatch(resetTraining());
		setStartTraining(false);
		setIsDataPrepared(false);
		setIsTrainingAvailable(false);
		setIsTrainingRepeated(true);
	};

	useEffect(() => {
		if (!isLoading || isTrainingRepeated) {
			const wordsForTraining = selectWordsForTraining(words!);
			const questions = generateQuestions(wordsForTraining);

			dispatch(setTrainingWords(wordsForTraining));
			dispatch(setQuestions(questions));

			if (wordsForTraining.length >= 10) {
				setIsTrainingAvailable(true);
			}

			setIsDataPrepared(true);
			setIsTrainingRepeated(false);
		}

		return handleResetTraining;
	}, [dispatch, isLoading, isTrainingRepeated]);

	const handleStartTraining: MouseEventHandler = (e) => {
		setStartTraining(true);
	};

	return (
		<Row justify="center" align="middle">
			<Col className='training'>
			<h1 className={`page__title ${style.title}`}>Тренировка</h1>
			<hr />
			{!isLoading && isDataPrepared && startTraining ? (
				<Quiz />
			) : (
				<TrainingIntro
					isDataPrepared={isDataPrepared}
					isTrainingAvailable={isTrainingAvailable}
					handleStart={handleStartTraining}
				/>
			)}
			<RepeatTraining
				isCompleted={isCompleted}
				handleReset={handleResetTraining}
			/>
			</Col>
		</Row>
	);
};
