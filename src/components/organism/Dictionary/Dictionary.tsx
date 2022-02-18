import _ from 'lodash';
import firebase from 'firebase';
import plural from "plural-ru";
import { FC, Key, MouseEventHandler } from 'react';
import { Button, Checkbox, Popconfirm, Space, Table } from 'antd';

import { IWord } from '../../../interfaces/word';
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

import "./Dictionary.css";
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import localizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.locale('ru');
dayjs.extend(localizedFormat);

const getWordsAmountPlural = (count: number) => plural(count, "%d слово", "%d слова", "%d слов");

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

	const onFilter = (value: string | number | boolean, record: IWord) =>
		record.category.indexOf(value as string) === 0;

	const handleRemoveWord = (wordKey: Key) => {
		const word = _.find(words, { id: wordKey }) as IWord;
		const wordsUpdate = { wordId: word.id, userId: user.uid };
		deleteWord(wordsUpdate);
	};

	const handleUpdateWord = (wordKey: Key, wordData: Partial<IWord>) => {
		const word = _.find(words, { id: wordKey }) as IWord;
		const wordsUpdate = { wordId: word.id, userId: user.uid, word: wordData };
		updateWord(wordsUpdate);
	}

	const handleLearnWord = (wordKey: Key, fixLearn?: boolean) => {
		const word = _.find(words, { id: wordKey }) as IWord;
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

	const columns: ColumnsType<IWord> = [
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
			render: (text: string, record: IWord) => (
				<WordCategory record={record} handleUpdateWord={handleUpdateWord} />
			),
		},
		{
			title: 'Кол-во повторений',
			dataIndex: 'completedTrains',
			width: '110px',
			key: 'completedTrains',
			sortDirections: ['descend', 'ascend'],
			sorter: (a, b) => a.completedTrains - b.completedTrains,
		},
		{
			title: 'Следующее повторение',
			key: 'timeToTrain',
			width: '150px',
			render: (text: string, record: IWord) => {
				const timeToTrainFormat = dayjs(record.timeToTrain).format("DD-MM-YYYY");

				const availableForTraining = record.timeToTrain < Date.now();
				
				return (
					!availableForTraining
					? <span>{timeToTrainFormat}</span>
					: <span style={{ color: '#4bb450' }}>{timeToTrainFormat}</span>
				)
			},
			sorter: (a, b) => a.timeToTrain - b.timeToTrain,
		},
		{
			title: 'Изучено',
			className: 'ant-table-checkbox-cell',
			key: 'isLearned',
			width: '40px',
			render: (text: string, record: IWord) => (
				<Checkbox
					checked={record.isLearned}
					onClick={() => handleLearnWord(record.id)}
				/>
			),
		},
		{
			key: 'actions',
			render: (text: string, record: IWord) => (
				<Button onClick={() => handleRemoveWord(record.id)}>Удалить</Button>
			),
		},
	];

	const rowSelection: TableRowSelection<IWord> = {
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
			{
				selectedRowKeys.length > 0
				&& <span>Вы выбрали {getWordsAmountPlural(selectedRowKeys.length)}</span>
			}
		</Space>
	);

	return (
		<div className="dictionary">
			<Table
				title={tableTitle}
				loading={isLoading}
				rowKey='id'
				rowSelection={rowSelection}
				dataSource={words}
				columns={columns}
			/>
		</div>
	);
};
