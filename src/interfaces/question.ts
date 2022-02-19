export interface IQuestion {
	wasAnswered: boolean;
	wasAnsweredCorrectly: null | boolean;
	answerId: string;
	correctAnswerId: string;
	wrongAnswersIds: string[];
}
