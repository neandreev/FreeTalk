import { IWord } from './word';

export interface ITranslateFormValues {
	TranslateRequest: string;
}

export interface ICardTranslateRes {
	word: Omit<IWord, 'id'>;
	onAddWordToDictionary: (word: Omit<IWord, 'id'>) => void;
}

export interface ITranslateResponse {
	text: string;
	translate: string;
}
