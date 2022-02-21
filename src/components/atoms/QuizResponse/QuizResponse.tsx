import { FC, MouseEventHandler } from 'react';

import { AnswerInform } from '../AnswerInform';

import style from './QuizResponse.module.css';

interface IQuizResponse {
	wasAnswered: boolean;
	handleNextQuestion: MouseEventHandler;
}

export const QuizResponse: FC<IQuizResponse> = (props) => (
	<>
		{props.wasAnswered && (
			<div className={style.quizFooter}>
				<AnswerInform />
				<span className={style.quizNextWord} onClick={props.handleNextQuestion}>
					Следующее слово
				</span>
			</div>
		)}
	</>
);
