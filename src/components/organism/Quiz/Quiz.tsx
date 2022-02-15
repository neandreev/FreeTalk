import { FC } from 'react';

import { QuizStats } from '../../molecules/QuizStats';
import { QuizQuestions } from '../../molecules/QuizQuestions';

import { selectTraining } from '../../../features/training/trainingSlice';
import { useAppSelector } from '../../../hooks';

export const Quiz: FC = () => {
	const { isCompleted } = useAppSelector(selectTraining);

	return <>{!isCompleted ? <QuizQuestions /> : <QuizStats />}</>;
};
