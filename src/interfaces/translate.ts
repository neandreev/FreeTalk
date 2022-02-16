export interface ICardTranslateReq {
	title: string;
	isFetching: boolean;
	onTranslateRequest: (word: string) => void;
}

export interface ITranslateFormValues {
	TranslateRequest: string;
}

export interface ICardTranslateRes {
	ru: string;
	en: string;
	imageURL: string;
	onAddWordToDictionary: ({ru,en}: {ru:string, en:string}) => void;
}

export interface ITranslateResponse {
	text: string;
	translate: string;
}
