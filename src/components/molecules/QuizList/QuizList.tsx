import { FC } from 'react';

import { ITrainingAnswer } from '../../../interfaces/training';
import { AnswerButtons } from '../../atoms/AnswerButtons';

interface IQuizList {
	variants: ITrainingAnswer[];
}

export const QuizList: FC<IQuizList> = ({ variants }) => {
	return (
		<div id='quiz'>
			<AnswerButtons variants={variants} />
		</div>
	);
};
