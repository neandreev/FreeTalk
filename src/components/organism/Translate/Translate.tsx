import { FC, useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../../hooks';
import { useAddUserWordMutation, useGetUserWordsByUidQuery }
	from '../../../features/database/users';

import { CardTranslateRes } from '../../molecules/CardTranslateRes';
import { Spin } from 'antd';

import { translateAPI } from '../../../api/translateAPI';
import { findImageAPI } from '../../../api/findImageAPI';
import { findHyponemesAPI } from '../../../api/findHyponemesAPI';
import firebase from 'firebase';

import { IWord } from '../../../interfaces/word';
import { TranslateReqForm } from '../../molecules/TranslateReqForm';

import { Typography, Empty, message } from 'antd';

import style from './Translate.module.css';

interface ITranslateFormData {
	TranslateDirection: string,
	TranslateRequest: string,
}

interface ITranslateData {
	fromLang: string,
	toLang: string,
	word: string,
}

type TWordWithoutID = Omit<IWord, 'id'>;

type TCheckDuplicateWords = (
	ru: string, en: string, data: IWord[] | [] | undefined
) => boolean;

type THandleAddWordToDictionary = (word: TWordWithoutID) => void;

type TGetMainTranslate = ({ fromLang, toLang, word }: ITranslateData) => Promise<TWordWithoutID>;

type TGetTranslateAddWords = (word: TWordWithoutID) => Promise<(TWordWithoutID | null)[]>;

type THandleSubmitTranslateReqForm = ({ TranslateDirection, TranslateRequest }: ITranslateFormData) => void;

const { Title } = Typography;

export const Translate: FC = () => {
	const controller = new AbortController();
	const signal = controller.signal;

	const auth = useAuth();
	const user = auth?.user as firebase.User;

	const [addWord] = useAddUserWordMutation();
	const { data } = useGetUserWordsByUidQuery(user ? user.uid : undefined);

	const [translateResponse, setTranslateResponse] = useState<TWordWithoutID | null>(null);
	const [translateError, setTranslateError] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const [addWords, setAddWords] = useState<(TWordWithoutID | null)[] | []>([]);
	const [addWordsError, setAddWordsError] = useState(false);
	const [isLoadingAdd, setIsLoadingAdd] = useState(false);

	const [disabledForm, setDisabledForm] = useState(false);


	const handleAddWordToDictionary = useCallback<THandleAddWordToDictionary>((word) => {
		if (!user) {
			message.warning('Авторизуйтесь для добавления слова в словарь');
			return;
		}

		if (checkDuplicateWords(word.word, word.translation, data)) {
			message.warning('Такое слово уже есть в словаре');
			return;
		}

		addWord({ word: word, userId: user.uid });
		message.success('Добавлено новое слово');
	}, [user, data]);


	const checkDuplicateWords: TCheckDuplicateWords = (ru, en, data) => {
		if (!data || data?.length === 0) {
			return false;
		} else {
			return !!data.find((element) => element.word === ru);
		}
	};


	const getMainTranslate: TGetMainTranslate = async ({ fromLang, toLang, word }) => {
		const response = await translateAPI.getTranslate(fromLang, toLang, word, signal);

		if (!!response.translation && !!response.word) {
			try {
				const imageURL = await findImageAPI.getImage(response.translation, signal);
				!!imageURL && (response.imageURL = imageURL);
			} catch (e) {

			}
			setTranslateResponse(response);
		} else {
			setTranslateError(true);
			message.warning('Перевод не найден. Попробуйте другое слово');
		}

		setIsLoading(false);
		return response;
	};


	const getTranslateAddWords: TGetTranslateAddWords = async (word) => {
		const getTranslatePromise = async (word: string): Promise<TWordWithoutID | null> => {
			let translate;
			let imageURL;

			setIsLoadingAdd(true)

			try {
				translate = await translateAPI.getTranslate('en', 'ru', word, signal);
				if (!!translate.translation && !!translate.word) {
					imageURL = await findImageAPI.getImage(translate.translation, signal);
					!!imageURL && (translate.imageURL = imageURL);
					return translate;
				}
			} catch (e) {
				if (!!translate?.translation && !!translate?.word) {
					return translate;
				}
				return null;
			}

			setIsLoadingAdd(false)

			return null;
		};

		const addWords: string[] = await findHyponemesAPI.getHyponemes(word.translation, signal);

		return Promise.all<TWordWithoutID | null>(addWords.map(getTranslatePromise));
	};


	const getTranslate = async (fromLang: string, toLang: string, word: string) => {
		setDisabledForm(true)

		try {
			const mainTranslate = await getMainTranslate({fromLang: fromLang, toLang: toLang, word: word});
			const addTranslate = await getTranslateAddWords(mainTranslate);

			const addTranslateLength = addTranslate.length;
			const counterNull = addTranslate.filter((item) => item === null).length;

			if (addTranslateLength === counterNull) {
				setAddWordsError(true);
			}

			setAddWords(addTranslate);
		} catch (e) {

		}

		setIsLoadingAdd(false);
		setDisabledForm(false);
	}


	const handleSubmitTranslateReqForm = useCallback<THandleSubmitTranslateReqForm>(
		({ TranslateDirection, TranslateRequest }) => {
			const [fromLang, toLang] = TranslateDirection.toLowerCase().split('-');

			setTranslateError(false);
			setIsLoading(true);
			setTranslateResponse(null);
			setAddWordsError(false);
			setAddWords([]);
			setAddWordsError(false);

			getTranslate(fromLang, toLang, TranslateRequest);
		},
		[isLoading, isLoadingAdd]);


	useEffect(() => {
		return () => {
			controller.abort();
		};
	},[])

	return (
		<div className={style.wrapper}>
			<TranslateReqForm
				onSubmitForm={handleSubmitTranslateReqForm}
				disabled={disabledForm}
			/>

			<div className={style.mainTranslate}>
				{
					isLoading &&
					(
						<div className={style.loading}>
							<Title level={5}>Ищем перевод ...</Title>
							<Spin size='large' />
						</div>
					)
				}
				{
					translateError &&
					(
						<div className={style.translateError}>
							<Title level={5}>Сожалеем, перевод не найден </Title>
							<Empty description={false}/>
						</div>
					)
				}
				{
					translateResponse &&
					(<div className={style.mainTranslateBody}>
						<Title level={5}>Ваше слово:</Title>
						<CardTranslateRes
							word={translateResponse}
							onAddWordToDictionary={handleAddWordToDictionary}
						/>
					</div>)
				}
			</div>

			<div className={style.addTranslate}>
				{
					isLoadingAdd &&
					(
						<div className={style.loading}>
							<Title level={5}>Ищем дополнительные слова ...</Title>
							<Spin size='large' />
						</div>
					)
				}
				{
					addWordsError &&
					(
						<div className={style.translateError}>
							<Title level={5}>Сожалеем, похожие слова не найдены </Title>
							<Empty description={false}/>
						</div>
					)
				}
				{
					!disabledForm &&
					!addWordsError &&
					!!addWords.length	&&
					<Title level={5}>Посмотрите похожие слова</Title>
				}
				<div className={style.wordsWrapper}>
					{
						addWords.map((item, index) => {
							if (!!item) {
								return <CardTranslateRes
									key={index}
									word={item}
									onAddWordToDictionary={handleAddWordToDictionary}
								/>;
							}
						})
					}
				</div>
			</div>
		</div>
	);
};
