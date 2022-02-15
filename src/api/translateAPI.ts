import _ from 'lodash';

const API_KEY = process.env.REACT_APP_TRANSLATE_API_KEY as string;

interface IResponse {
	ru: string;
	en: string;
}

class ResponseWrapper {
	word: string;
	translation: string;
	category: string;
	isLearned: boolean;
	timeToTrain: number;
	completedTrains: number;

	constructor({ ru, en }: IResponse) {
		this.word = _.capitalize(ru);
		this.translation = _.capitalize(en);
		this.category = 'Default';
		this.isLearned = false;
		this.timeToTrain = Date.now();
		this.completedTrains = 0;
	}
}

class TranslateAPI {
	readonly API_KEY: string;

	constructor(API_KEY: string) {
		this.API_KEY = API_KEY;
	}

	getTranslate = (from: string, to: string, word: string) => {
		return fetch(
			`https://reactmarathon-api.netlify.app/api/translate?text=${word}&lang=${from}-${to}`,
			{
				headers: {
					Authorization: this.API_KEY,
				},
			}
		);
	};

	getTranslateRuToEn = async (word: string) => {
		const response = await this.getTranslate('ru', 'en', word);
		const body = await response.json();
		return { ...new ResponseWrapper({ ru: word, en: body.translate }) };
	};

	getTranslateEnToRu = async (word: string) => {
		const response = await this.getTranslate('en', 'ru', word);
		const body = await response.json();
		return { ...new ResponseWrapper({ ru: body.translate, en: word }) };
	};
}

export const translateAPI = new TranslateAPI(API_KEY);
