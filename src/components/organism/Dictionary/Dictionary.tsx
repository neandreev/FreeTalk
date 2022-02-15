import _ from 'lodash';
import firebase from 'firebase';
import { FC, Key, MouseEventHandler } from 'react';
import { Button, Checkbox, Table } from 'antd';

import { ITrainingWord } from '../../../interfaces/trainingWord';
import { TableRowSelection } from 'antd/lib/table/interface';
import { ColumnsType } from 'antd/lib/table';

import {
	useDeleteUserWordMutation,
	useGetUserWordsByUidQuery,
	useUpdateUserWordMutation,
} from '../../../features/database/users';
import {
	selectSelectedRows,
	setSelectedRows,
} from '../../../features/dictionary/dictionarySlice';
import { useAppDispatch, useAppSelector, useAuth } from '../../../hooks';

export const Dictionary: FC = () => {
	const auth = useAuth();
	const user = auth!.user as firebase.User;

	const dispatch = useAppDispatch();
	const selectedRowKeys = useAppSelector(selectSelectedRows);

	const { data: words, error, isLoading } = useGetUserWordsByUidQuery(user.uid);
	const [deleteWord] = useDeleteUserWordMutation();
	const [updateWord] = useUpdateUserWordMutation();

	const filterCategories = _.uniqBy(words, 'category').map((word) => ({
		text: word.category,
		value: word.category,
	}));

	const onFilter = (value: string | number | boolean, record: ITrainingWord) =>
		record.category.indexOf(value as string) === 0;

	const handleRemoveWord = (wordKey: Key) => {
		const word = _.find(words, { id: wordKey }) as ITrainingWord;
		const wordsUpdate = { wordId: word.id, userId: user.uid };
		deleteWord(wordsUpdate);
	};

	const handleLearnWord = (wordKey: Key, fixLearn?: boolean) => {
		const word = _.find(words, { id: wordKey }) as ITrainingWord;
		const wordsUpdate = {
			wordId: word.id,
			userId: user.uid,
			word: { isLearned: fixLearn || !word.isLearned },
		};
		updateWord(wordsUpdate);
	};

	const handleRemoveMultipleWords: MouseEventHandler = (e) => {
		selectedRowKeys.forEach((wordKey) => {
			handleRemoveWord(wordKey);
		});
		dispatch(setSelectedRows([]));
	};

	const handleLearnMultipleWords: MouseEventHandler = (e) => {
		selectedRowKeys.forEach((wordKey) => {
			handleLearnWord(wordKey, true);
		});
		dispatch(setSelectedRows([]));
	};

	const columns: ColumnsType<ITrainingWord> = [
		{
			title: 'Слово',
			dataIndex: 'word',
			key: 'word',
		},
		{
			title: 'Перевод',
			dataIndex: 'translation',
			key: 'translation',
		},
		{
			title: 'Категория',
			dataIndex: 'category',
			filters: filterCategories,
			onFilter,
		},
		{
			title: 'Изучено',
			key: 'isLearned',
			width: '50px',
			render: (text: string, record: ITrainingWord) => (
				<Checkbox
					checked={record.isLearned}
					onClick={() => handleLearnWord(record.id)}
				/>
			),
		},
		{
			key: 'actions',
			render: (text: string, record: ITrainingWord) => (
				<Button onClick={() => handleRemoveWord(record.id)}>Удалить</Button>
			),
		},
	];

	const rowSelection: TableRowSelection<ITrainingWord> = {
		type: 'checkbox',
		selectedRowKeys,
		onChange: (selectedRowKeys) => {
			dispatch(setSelectedRows(selectedRowKeys));
		},
	};

	return (
		<div>
			<Button
				type='primary'
				disabled={selectedRowKeys.length === 0}
				onClick={handleRemoveMultipleWords}
			>
				Удалить выбранные слова
			</Button>
			<Button
				type='primary'
				disabled={selectedRowKeys.length === 0}
				onClick={handleLearnMultipleWords}
			>
				Изучить выбранные слова
			</Button>
			<Table
				rowKey='id'
				rowSelection={rowSelection}
				dataSource={words}
				columns={columns}
			/>
		</div>
	);
};
