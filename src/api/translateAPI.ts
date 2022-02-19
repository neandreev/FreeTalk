import _ from 'lodash';

import {IWord } from '../interfaces/word';

const API_KEY = process.env.REACT_APP_TRANSLATE_API_KEY as string;

type TWordWithoutID = Omit<IWord, "id">


class TranslateAPI {
	readonly API_KEY: string;

	constructor(API_KEY: string) {
		this.API_KEY = API_KEY;
	}

	getTranslate = async (from: string, to: string, word: string, abort: AbortSignal) : Promise<TWordWithoutID>  => {
		const response = await fetch(
			`https://reactmarathon-api.netlify.app/api/translate?text=${word}&lang=${from}-${to}`,
			{
				headers: {
					Authorization: this.API_KEY,
				},
				signal: abort
			}
		);
		const body = await response.json();
		const translate: TWordWithoutID = {
			word: from === 'en' ? _.capitalize(word): _.capitalize(body.translate),
			translation: from === 'en' ? _.capitalize(body.translate): _.capitalize(word),
			category:'Общее',
			isLearned: false,
			timeToTrain: Date.now(),
			completedTrains: 0,
			imageURL: 'https://images.unsplash.com/photo-1586769852836-bc069f19e1b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMDIxNTN8MHwxfHNlYXJjaHwxfHxmaW5kfGVufDB8MHx8fDE2NDUyMDE1Nzg&ixlib=rb-1.2.1&q=80&w=1080',
		}
		return translate;
	}

}

export const translateAPI = new TranslateAPI(API_KEY);
