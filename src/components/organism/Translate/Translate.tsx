import { FC, useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../../hooks';
import {
	useAddUserWordMutation,
	useGetUserWordsByUidQuery,
} from '../../../features/database/users';

import { CardTranslateRes } from '../../molecules/CardTranslateRes';
import { CardTranslateReq } from '../../molecules/CardTranslateReq/';

import { Button, message } from 'antd';
import { SwapOutlined } from '@ant-design/icons';

import { translateAPI } from '../../../api/translateAPI';
import firebase from 'firebase';
import _ from 'lodash';

import { ITrainingWord } from '../../../interfaces/trainingWord';

import style from './Translate.module.css';

interface TranslateResponse {
	word: string;
	translation: string;
	category: string;
	isLearned: boolean;
	timeToTrain: number;
	completedTrains: number;
}

export const Translate: FC = () => {
	const auth = useAuth();
	const user = auth?.user as firebase.User;
	const [addWord] = useAddUserWordMutation();
	const { data } = useGetUserWordsByUidQuery(user ? user.uid : undefined);
	const [translateRequest, setTranslateRequest] = useState('');
	const [translateResponse, setTranslateResponse] =
		useState<TranslateResponse | null>(null);
	const [isFetching, setIsFetching] = useState(false);
	const [fromLang, setFromLang] = useState('RU');
	const [toLang, setToLang] = useState('EN');

	const checkDuplicateWords = (
		from: string,
		word: string,
		data: ITrainingWord[] | [] | undefined
	) => {
		if (!data || data?.length === 0) {
			return false;
		} else {
			const key = from === 'RU' ? 'word' : 'translation';
			return !!data.find((element) => element[key] === _.capitalize(word));
		}
	};

	const handleTranslateRequest = useCallback((word: string) => {
		setTranslateRequest(word);
	}, []);

	const handleAddWordToDictionary = useCallback(() => {
		if (!user) {
			message.warning('Авторизуйтесь для добавления слова в словарь');
			return;
		}

		if (checkDuplicateWords(fromLang, translateRequest, data)) {
			message.warning('Такое слово уже есть в словаре');
			return;
		}

		translateResponse && addWord({ word: translateResponse, userId: user.uid });
		message.success('Добавлено новое слово');
	}, [translateResponse, user]);

	const handleSwapLang = useCallback(() => {
		setFromLang(toLang);
		setToLang(fromLang);
		setTranslateRequest('');
		setTranslateResponse(null);
	}, [toLang, fromLang]);

	useEffect(() => {
		async function getTranslate() {
			setIsFetching(true);
			const response =
				fromLang === 'RU'
					? await translateAPI.getTranslateRuToEn(translateRequest)
					: await translateAPI.getTranslateEnToRu(translateRequest);
			setTranslateResponse(response!);
			setIsFetching(false);
		}

		translateRequest.length !== 0 && getTranslate();
	}, [translateRequest]);

	return (
		<div className={style.wrapper + ' ' + 'page'}>
			<CardTranslateReq
				title={fromLang}
				onTranslateRequest={handleTranslateRequest}
				isFetching={isFetching}
			/>
			<Button
				shape='circle'
				onClick={handleSwapLang}
				icon={<SwapOutlined />}
				size='large'
			/>
			<CardTranslateRes
				title={toLang}
				translateResponse={
					toLang === 'EN' ? translateResponse?.translation : translateResponse?.word
				}
				onAddWordToDictionary={handleAddWordToDictionary}
			/>
		</div>
	);
};
