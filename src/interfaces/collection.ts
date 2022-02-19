import { IWord } from './word';

export interface ICollection {
	id: string;
	title: string;
	coverUrl: string;
	words: Array<IWord>;
}
