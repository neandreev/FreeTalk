import { FC, useEffect, useState } from 'react';

import { Quiz } from '../Quiz';

import { useAppDispatch, useAuth } from '../../../hooks';
import {
	setQuestions,
	setTrainingWords,
} from '../../../features/training/trainingSlice';

import { useGetUserWordsByUidQuery } from '../../../features/database/users';

import _ from 'lodash';
import firebase from 'firebase';

import { ITrainingWord } from '../../../interfaces/trainingWord';
import { IQuestion } from '../../../interfaces/question';

const generateQuestions = (words: ITrainingWord[]) => {
	const questions = words.map((word) => {
		const correctAnswerId = word.id;
		const wrongAnswersIds = _.shuffle(words)
			.map((word) => word.id)
			.filter((wordId) => wordId !== correctAnswerId)
			.slice(0, 3);

		const question: IQuestion = {
			wasAnswered: false,
			wasAnsweredCorrectly: null,
			correctAnswerId,
			wrongAnswersIds,
		};

		return question;
	});

	return questions;
};

const selectWordsForTraining = (words: ITrainingWord[]) => {
	const availableWordsForTraining = words.filter((word) => {
		const timestamp = Date.now();
		return word.timeToTrain <= timestamp;
		/*
		  Здесь в случае тренировки конкретной категории слов из роута будет браться
		  название категории и производиться фильтр;
		  что-то вроде: /training/{id коллекции}
		  или через search params: /training?collectionId={id коллекции}
		*/
	});

	const shuffledWords = _.shuffle(availableWordsForTraining);
	const wordsForTraining = shuffledWords.slice(0, 10);

	return wordsForTraining;
};

export const Training: FC = (props) => {
	const auth = useAuth();
	const user = auth!.user as firebase.User;
	const { data: words, error, isLoading } = useGetUserWordsByUidQuery(user.uid);
	const dispatch = useAppDispatch();
	const [dataPrepared, setDataPrepared] = useState(false);

	useEffect(() => {
		if (!isLoading) {
			const wordsForTraining = selectWordsForTraining(words!);
			const questions = generateQuestions(wordsForTraining);
			dispatch(setTrainingWords(wordsForTraining));
			dispatch(setQuestions(questions));
			setDataPrepared(true);
		}
	}, [isLoading]);

	return <>{!isLoading && dataPrepared ? <Quiz /> : <span>loading</span>}</>;
};
