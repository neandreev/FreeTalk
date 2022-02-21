import { EditOutlined } from '@ant-design/icons';
import { Input, Tag } from 'antd';
import _ from 'lodash';
import { FC, Key, useEffect, useRef, useState } from 'react';
import { IWord } from '../../../interfaces/word';
import style from './WordCategory.module.css';

interface IWordCategory {
	record: IWord;
	handleUpdateWord: (wordKey: Key, wordData: Partial<IWord>) => void;
}

export const WordCategory: FC<IWordCategory> = ({ record, handleUpdateWord }) => {
	const [inputVisible, setInputVisible] = useState(false);
	const [inputValue, setInputValue] = useState(record.category);
	const inputRef = useRef<Input>(null);

	useEffect(() => {
		if (inputRef && inputRef.current) {
			inputRef.current.focus();
		}
	}, [inputVisible]);

	const handleUpdate = () => {
		if (inputValue !== "") {
			handleUpdateWord(record.id, { category: _.capitalize(inputValue) });
		} else {
			setInputValue(record.category);
		}
		setInputVisible(false);
	}

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
					onBlur={handleUpdate}
					onPressEnter={handleUpdate}
				/>
			) : (
				<Tag
					icon={<EditOutlined style={{ color: 'var(--green)' }} />}
					className={style.wordCategory_tag}
					onClick={() => {
						setInputVisible(true);
					}}
				>
					<span>{_.capitalize(record.category)}</span>
				</Tag>
			)}
		</>
	);
};
