import { Input, Tag } from 'antd';
import { FC, Key, useEffect, useRef, useState } from 'react';
import { IWord } from '../../../interfaces/word';
import style from './WordCategory.module.css';

interface IWordCategory {
	record: IWord;
	handleUpdate: (wordKey: Key, wordData: Partial<IWord>) => void;
}

export const WordCategory: FC<IWordCategory> = ({ record, handleUpdate }) => {
	const [inputVisible, setInputVisible] = useState(false);
	const [inputValue, setInputValue] = useState(record.category);
	const inputRef = useRef<Input>(null);

	useEffect(() => {
		if (inputRef && inputRef.current) {
			inputRef.current.focus();
		}
	}, [inputVisible]);

	return (
		<>
			{inputVisible ? (
				<Input
					ref={inputRef}
					type='text'
					size='small'
					value={inputValue}
					className={style.wordCategory_input}
					onChange={(e) => setInputValue(e.target.value)}
					onPressEnter={() => {
						handleUpdate(record.id, { category: inputValue });
						setInputVisible(false);
					}}
				/>
			) : (
				<Tag
					onClick={() => {
						setInputVisible(true);
					}}
				>
					<span>{record.category}</span>
				</Tag>
			)}
		</>
	);
};
