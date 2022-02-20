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

import styles from './Translate.module.css';

interface ITranslateFormData {
	TranslateDirection: string,
	TranslateRequest: string,
}

interface ITranslateData {
	fromLang: string,
	toLang: string,
	word: string,
}

interface ITranslate {
	onStartTranslate: () => void
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

export const Translate: FC <ITranslate>= ({onStartTranslate}) => {
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

		if (checkDuplicateWords(word.translation, word.word, data)) {
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
			return !!data.find((element) => element.translation === ru);
		}
	};


	const getMainTranslate: TGetMainTranslate = async ({ fromLang, toLang, word }) => {
		const response = await translateAPI.getTranslate(fromLang, toLang, word, signal);

		if (!!response.translation && !!response.word) {
			try {
				const imageURL = await findImageAPI.getImage(response.word, signal);
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

			try {
				translate = await translateAPI.getTranslate('en', 'ru', word, signal);
				if (!!translate.translation && !!translate.word) {
					imageURL = await findImageAPI.getImage(translate.word, signal);
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

		const addWords: string[] = await findHyponemesAPI.getHyponemes(word.word, signal);

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

			onStartTranslate && onStartTranslate();

			setTranslateError(false);
			setIsLoading(true);
			setTranslateResponse(null);
			setAddWordsError(false);
			setAddWords([]);
			setAddWordsError(false);
			setIsLoadingAdd(true);

			getTranslate(fromLang, toLang, TranslateRequest);
		},
		[isLoading, isLoadingAdd]);


	useEffect(() => {
		return () => {
			controller.abort();
		};
	},[])

	return (
		<div className={styles.wrapper}>
			<TranslateReqForm
				onSubmitForm={handleSubmitTranslateReqForm}
				disabled={disabledForm}
			/>
			<div className={styles.mainTranslate}>
				{
					isLoading &&
					(
						<div className={styles.loading}>
							<h3 className={styles.title}>Ищем перевод ...</h3>
							<Spin className={styles.spin} size='large'/>
						</div>
					)
				}
				{
					translateError &&
					(
						<div className={styles.translateError}>
							<h3 className={styles.title}>Сожалеем, перевод не найден</h3>
							<Empty description={false}/>
						</div>
					)
				}
				{
					translateResponse &&
					(<div className={styles.mainTranslateBody}>
						<h3 className={styles.title}>Ваше слово:</h3>
						<CardTranslateRes
							word={translateResponse}
							onAddWordToDictionary={handleAddWordToDictionary}
						/>
					</div>)
				}
			</div>

			<div className={styles.addTranslate}>
				{
					isLoadingAdd &&
					(
						<div className={styles.loading}>
							<h3 className={styles.title}>Ищем дополнительные слова ...</h3>
							<Spin className={styles.spin} size='large'/>
						</div>
					)
				}
				{
					addWordsError &&
					(
						<div className={styles.translateError}>
							<h3 className={styles.title}>Сожалеем, похожие слова не найдены</h3>
							<Empty description={false}/>
						</div>
					)
				}
				{
					!disabledForm &&
					!addWordsError &&
					!!addWords.length	&&
					<h3 className={styles.title}>Посмотрите похожие слова:</h3>
				}
				<div className={styles.wordsWrapper}>
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
