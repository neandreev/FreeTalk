import { FC, useCallback, useState } from 'react';
import { useAuth } from '../../../hooks';
import { useAddUserWordMutation, useGetUserWordsByUidQuery }
	from '../../../features/database/users';

import { CardTranslateRes } from '../../molecules/CardTranslateRes';
import {Spin} from 'antd';

import { translateAPI } from '../../../api/translateAPI';
import { findImageAPI } from '../../../api/findImageAPI';
import firebase from 'firebase';

import { ITrainingWord } from '../../../interfaces/trainingWord';
import { TranslateReqForm } from '../../molecules/TranslateReqForm';

import { message } from 'antd';

import style from './Translate.module.css';

interface TranslateResponse {
	word: string;
	translation: string;
	category: string;
	isLearned: boolean;
	timeToTrain: number;
	completedTrains: number;
	imageURL: string;
}

export const Translate: FC = () => {
	const auth = useAuth();
	const user = auth?.user as firebase.User;
	const [addWord] = useAddUserWordMutation();
	const { data } = useGetUserWordsByUidQuery(user ? user.uid : undefined);
	const [translateResponse, setTranslateResponse] =
		useState<TranslateResponse | null>(null);
	const [isLoading, setIsLoading] = useState(false);


	const checkDuplicateWords = (
		ru: string,
		en: string,
		data: ITrainingWord[] | [] | undefined
	) => {
		if (!data || data?.length === 0) {
			return false;
		} else {
			return !!data.find((element) => element.word === ru);
		}
	};


	const handleAddWordToDictionary = useCallback(({ en, ru }: { en: string, ru: string }) => {
		if (!user) {
			message.warning('Авторизуйтесь для добавления слова в словарь');
			return;
		}

		if (checkDuplicateWords(ru, en, data)) {
			message.warning('Такое слово уже есть в словаре');
			return;
		}

		translateResponse && addWord({ word: translateResponse, userId: user.uid });

		message.success('Добавлено новое слово');
	}, [translateResponse, user]);

	const getTranslate = async (fromLang: string, toLang: string, TranslateRequest: string) => {
		setIsLoading(true);
		setTranslateResponse(null);
		const response = await translateAPI.getTranslate(fromLang, toLang, TranslateRequest);
		if (!!response.translation && !!response.word) {
			response.imageURL = await findImageAPI.getImage(response.translation);
			setTranslateResponse(response);
		} else {
			message.warning('Перевод не найден. Попробуйте другое слово');
		}
		setIsLoading(false);
	};

	const handleSubmitTranslateReqForm = useCallback(
		({ TranslateDirection, TranslateRequest }) => {
			const [fromLang, toLang] = TranslateDirection.toLowerCase().split('-');
			getTranslate(fromLang, toLang, TranslateRequest);
		},
		[]);

	return (
		<div className={style.wrapper + ' ' + 'page'}>
			<h2>Время учить слова онлайн</h2>
			<TranslateReqForm
				onSubmitForm={handleSubmitTranslateReqForm}
			/>
			<div style={{ textAlign: 'center' }}>
				{
					isLoading && <Spin size="large" />
				}
				{
					translateResponse &&
					(
						<>
							<h3>Перевод</h3>
							<CardTranslateRes
								en={translateResponse.translation}
								ru={translateResponse.word}
								imageURL={translateResponse.imageURL}
								onAddWordToDictionary={handleAddWordToDictionary}
							/>
						</>
					)
				}
			</div>
		</div>
	);
};
