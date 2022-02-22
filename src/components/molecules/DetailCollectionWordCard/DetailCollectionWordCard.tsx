import { FC, useState, useEffect } from 'react';

import firebase from 'firebase';
import { useAuth } from '../../../hooks';
import { Card, Button } from 'antd';

import { IWord } from '../../../interfaces/word';

import { useAddUserWordMutation } from '../../../services/users';
import { useGetUserWordsByUidQuery } from '../../../features/database/users';

import styles from './DetailCollectionWordCard.module.css';

export const DetailCollectionWordCard: FC<IWord> = ({ id, word, translation, imageURL, category, completedTrains, isLearned, timeToTrain  }) => {
	const auth = useAuth();
	const user = auth?.user as firebase.User;
	const { data } = useGetUserWordsByUidQuery(user ? user.uid : undefined);
	const [isAddedToDictionary, setIsAddedToDictionary] = useState<boolean>(false);
	const [addWord] = useAddUserWordMutation();

	const checkDuplicateWords = (currentWord: string) => {
		return data?.find((item) => item.word.toLowerCase() === currentWord.toLowerCase());
	}

	const handleAddToDictionary = () => {
		addWord({ word: { word, translation, imageURL, category, completedTrains, isLearned, timeToTrain: Date.now()  }, userId: user.uid });
		setIsAddedToDictionary(true);
	};

	useEffect(() => {
		if (checkDuplicateWords(word)) {
			setIsAddedToDictionary(true);
		}
	}, [checkDuplicateWords, word]);

	return (
		<div>
			<Card 
				style={{ width: '100%' }} 
				cover={
					<div style={{ overflow: "hidden", height: "200px" }}>
						<img
							alt={word}
							style={{ height: "100%", width: "100%", objectFit: "cover" }}
							src={imageURL}
						/>
					</div>
  			}>
					<div className={styles.content}>
						<div>
							<div>
								<span className={styles.title}>EN:</span>
								<span>{word}</span>
							</div>
							<div>
								<span className={styles.title}>RU:</span>
								<span>{translation}</span>
							</div>
						</div>
						<Button className='app-btn _green' disabled={isAddedToDictionary} onClick={handleAddToDictionary}>
							{ isAddedToDictionary ? 'Добавлено' : 'Добавить' }
						</Button>
					</div>
			</Card>
		</div>
	);
};
