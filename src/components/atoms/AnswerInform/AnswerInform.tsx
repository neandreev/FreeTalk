import { FC } from 'react';

import { useAppSelector } from '../../../hooks';
import { selectCurrentQuestion } from '../../../features/training/trainingSlice';

export const AnswerInform: FC = () => {
	const question = useAppSelector(selectCurrentQuestion);
	const informText = question.wasAnsweredCorrectly ? 'Верно!' : 'Неверно!';

	return <span>{informText}</span>;
};
