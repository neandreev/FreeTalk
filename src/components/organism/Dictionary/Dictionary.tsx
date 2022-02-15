import _ from 'lodash';
import firebase from 'firebase';
import { FC, Key, MouseEventHandler } from 'react';
import { Button, Checkbox, Popconfirm, Space, Table, Tag } from 'antd';

import { ITrainingWord } from '../../../interfaces/trainingWord';
import { TableRowSelection } from 'antd/lib/table/interface';
import { ColumnsType } from 'antd/lib/table';
import { WordCategory } from '../../atoms/WordCategory';

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

import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import localizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.locale('ru');
dayjs.extend(localizedFormat);

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

	const handleUpdateWord = (wordKey: Key, wordData: Partial<ITrainingWord>) => {
		const word = _.find(words, { id: wordKey }) as ITrainingWord;
		const wordsUpdate = { wordId: word.id, userId: user.uid, word: wordData };
		updateWord(wordsUpdate);
	}

	const handleLearnWord = (wordKey: Key, fixLearn?: boolean) => {
		const word = _.find(words, { id: wordKey }) as ITrainingWord;
		const wordsUpdate = {
			wordId: word.id,
			userId: user.uid,
			word: { isLearned: fixLearn || !word.isLearned },
		};
		updateWord(wordsUpdate);
	};

	const handleRemoveMultipleWords = () => {
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
			render: (text: string, record: ITrainingWord) => (
				<WordCategory record={record} handleUpdate={handleUpdateWord} />
			),
		},
		{
			title: 'Кол-во повторений',
			dataIndex: 'completedTrains',
			key: 'completedTrains',
			sortDirections: ['descend', 'ascend'],
			sorter: (a, b) => a.completedTrains - b.completedTrains,
		},
		{
			title: 'Доступно для повторения с',
			key: 'timeToTrain',
			render: (text: string, record: ITrainingWord) => {
				const timeToTrainFormat = dayjs(record.timeToTrain).format("DD-MM-YYYY");

				const availableForTraining = record.timeToTrain < Date.now();
				
				return (
					!availableForTraining
					? <span>{timeToTrainFormat}</span>
					: <span>Уже!</span>
				)
			},
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

	const tableTitle = () => (
		<Space>
			<Popconfirm
				title="Вы действительно хотите удалить выбранные слова?"
				onConfirm={handleRemoveMultipleWords}
				okText="Да"
				cancelText="Нет"
			>
				<Button
					type='primary'
					disabled={selectedRowKeys.length === 0}
				>
					Удалить выбранные слова
				</Button>
			</Popconfirm>
			<Button
				type='primary'
				disabled={selectedRowKeys.length === 0}
				onClick={handleLearnMultipleWords}
			>
				Отметить выбранные слова изученными
			</Button>

		</Space>
	);

	return (
		<div>
			<Table
				title={tableTitle}
				rowKey='id'
				rowSelection={rowSelection}
				dataSource={words}
				columns={columns}
			/>
		</div>
	);
};
