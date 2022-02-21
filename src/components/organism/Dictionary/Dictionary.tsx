import _ from 'lodash';
import cn from 'classnames';
import firebase from 'firebase';
import plural from 'plural-ru';
import { FC, Key, MouseEventHandler, useEffect } from 'react';
import { Button, Checkbox, Col, Row, Space, Table } from 'antd';

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

import './Dictionary.css';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import calendar from 'dayjs/plugin/calendar';
import { DeleteOutlined } from '@ant-design/icons';

import style from './Dictionary.module.css';

dayjs.locale('ru');
dayjs.extend(localizedFormat);
dayjs.extend(calendar);

const getWordsAmountPlural = (count: number) =>
	plural(count, '%d слово', '%d слова', '%d слов');

const getWordsRepeatsPlural = (count: number) =>
	plural(count, '%d раз', '%d раза', '%d раз');

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
		dispatch(setSelectedRows(selectedRowKeys.filter((key) => key !== wordKey)));
		deleteWord(wordsUpdate);
	};

	const handleUpdateWord = (wordKey: Key, wordData: Partial<IWord>) => {
		const word = _.find(words, { id: wordKey }) as IWord;
		const wordsUpdate = { wordId: word.id, userId: user.uid, word: wordData };
		updateWord(wordsUpdate);
	};

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

	useEffect(() => {
		return () => {
			dispatch(setSelectedRows([]));
		};
	}, []);

	const columns: ColumnsType<IWord> = [
		{
			title: 'Слово',
			dataIndex: 'translation',
			key: 'translation',
			sorter: (a, b) => a.translation.localeCompare(b.translation),
		},
		{
			title: 'Перевод',
			dataIndex: 'word',
			key: 'word',
			sorter: (a, b) => a.word.localeCompare(b.word),
		},
		{
			title: 'Категория',
			dataIndex: 'category',
			width: '100px',
			filters: filterCategories,
			onFilter,
			render: (text: string, record: IWord) => (
				<WordCategory record={record} handleUpdateWord={handleUpdateWord} />
			),
			sorter: (a, b) => a.category.localeCompare(b.category),
		},
		{
			key: 'actions',
			title: 'Изучено',
			render: (text: string, record: IWord) => (
				<Space size='large'>
					<Checkbox
						checked={record.isLearned}
						onClick={() => handleLearnWord(record.id)}
					/>
					<DeleteOutlined
						className=''
						onClick={() => handleRemoveWord(record.id)}
					/>
				</Space>
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

	const getExpandableInfo = (record: IWord) => {
		const timeToTrainFormat = dayjs(record.timeToTrain).format('DD MMMM YYYY');
		const isAvailableForTraining = record.timeToTrain < Date.now();

		const dayToTrainStyles = cn({
			[style.availableForTrain]: isAvailableForTraining,
		});
		const dayToTrain = (
			<span className={dayToTrainStyles}>{timeToTrainFormat}</span>
		);

		return (
			<p className={style.expandableParagraph}>
				Слово верно повторено {getWordsRepeatsPlural(record.completedTrains)},
				доступно для тренировки с {dayToTrain}
			</p>
		);
	};

	const tableTitle = () => (
		<Space>
			<Button
				onClick={handleRemoveMultipleWords}
				disabled={selectedRowKeys.length === 0}
				className='app-btn _green'
			>
				Удалить слова
			</Button>
			<Button
				className='app-btn _green'
				disabled={selectedRowKeys.length === 0}
				onClick={handleLearnMultipleWords}
			>
				Изучить слова
			</Button>
			{selectedRowKeys.length > 0 && (
				<span>Вы выбрали {getWordsAmountPlural(selectedRowKeys.length)}</span>
			)}
		</Space>
	);

	return (
		<div className='dictionary'>
			<Row justify='center'>
				<Col lg={20} md={22} span={24}>
					<h1 className={`page__title ${style.title}`}>Словарь</h1>
					<hr />
					<Table
						bordered={true}
						title={tableTitle}
						loading={isLoading}
						rowKey='id'
						expandable={{
							expandedRowRender: getExpandableInfo,
						}}
						rowSelection={rowSelection}
						dataSource={words}
						columns={columns}
					/>
				</Col>
			</Row>
		</div>
	);
};
