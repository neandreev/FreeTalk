import _ from 'lodash';

const API_KEY = process.env.REACT_APP_TRANSLATE_API_KEY as string;

interface IResponse {
	word: string;
	translate: string;
	from: string;
}

class ResponseWrapper {
	word: string;
	translation: string;
	category: string;
	isLearned: boolean;
	timeToTrain: number;
	completedTrains: number;
	imageURL: string;

	constructor({ word, translate, from }: IResponse) {
		this.word = from === 'ru' ? _.capitalize(word): _.capitalize(translate);
		this.translation = from === 'ru' ? _.capitalize(translate): _.capitalize(word);
		this.category = 'Default';
		this.isLearned = false;
		this.timeToTrain = Date.now();
		this.completedTrains = 0;
		this.imageURL = '';
	}
}

class TranslateAPI {
	readonly API_KEY: string;

	constructor(API_KEY: string) {
		this.API_KEY = API_KEY;
	}

	getTranslate = async (from: string, to: string, word: string) => {
		const response = await fetch(
			`https://reactmarathon-api.netlify.app/api/translate?text=${word}&lang=${from}-${to}`,
			{
				headers: {
					Authorization: this.API_KEY,
				},
			}
		);
		const body = await response.json();
		return { ...new ResponseWrapper({ word: word, translate: body.translate, from: from }) };
	};
}

export const translateAPI = new TranslateAPI(API_KEY);
