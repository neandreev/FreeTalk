import _ from 'lodash';
import cn from 'classnames';
import firebase from 'firebase';
import plural from 'plural-ru';
import { FC, Key, MouseEventHandler, useEffect } from 'react';
import { Button, Checkbox, Col, Grid, Row, Space, Table } from 'antd';
import { hyphenateSync as hyphenateRuSync } from 'hyphen/ru';
import { hyphenateSync as hyphenateEnSync } from 'hyphen/en';

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

const { useBreakpoint } = Grid;

const getWordsAmountPlural = (count: number) =>
	plural(count, '%d слово', '%d слова', '%d слов');

const getWordsRepeatsPlural = (count: number) =>
	plural(count, '%d раз', '%d раза', '%d раз');

export const Dictionary: FC = () => {
	const auth = useAuth();
	const user = auth!.user as firebase.User;

	const dispatch = useAppDispatch();
	const breakpoint = useBreakpoint();
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
			render: (value: string, record: IWord) => (
				<span>{hyphenateRuSync(record.translation)}</span>
			),
			sorter: (a, b) => a.translation.localeCompare(b.translation),
		},
		{
			title: 'Перевод',
			dataIndex: 'word',
			key: 'word',
			render: (value: string, record: IWord) => (
				<span>{hyphenateEnSync(record.word)}</span>
			),
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
			showSorterTooltip: {
				title: 'Сортировать категории слов в алфавитном порядке',
			},
			sorter: (a, b) => a.category.localeCompare(b.category),
			responsive: ['md'],
		},
		{
			key: 'isLearned',
			title: 'Изучено',
			width: '30px',
			className: 'centered',
			render: (text: string, record: IWord) => (
				<Checkbox
					checked={record.isLearned}
					onClick={() => handleLearnWord(record.id)}
				/>
			),
			showSorterTooltip: {
				title: 'Сортировать слова в порядке изученности',
			},
			sorter: (a, b) => (a.isLearned === b.isLearned ? 0 : a.isLearned ? -1 : 1),
			responsive: ['md'],
		},
		{
			title: 'Повторено',
			dataIndex: 'completedTrains',
			width: '110px',
			key: 'completedTrains',
			sortDirections: ['descend', 'ascend'],
			render: (text: string, record: IWord) => {
				if (record.isLearned) return null;
				const completedTrainsStyles = cn({
					[style.green]: record.completedTrains >= 7,
				});
				return (
					<span className={completedTrainsStyles}>
						{getWordsRepeatsPlural(record.completedTrains)}
					</span>
				);
			},
			sorter: (a, b) => a.completedTrains - b.completedTrains,
			responsive: ['lg'],
		},
		{
			title: 'Доступно в тренировке',
			key: 'timeToTrain',
			width: '130px',
			render: (text: string, record: IWord) => {
				if (record.isLearned) return null;
				const timeToTrainFormat = dayjs(record.timeToTrain).format('DD-MM-YYYY');

				const isAvailableForTraining = record.timeToTrain < Date.now();
				const timeToTrainStyles = cn({
					[style.green]: isAvailableForTraining,
				});

				return <span className={timeToTrainStyles}>{timeToTrainFormat}</span>;
			},
			showSorterTooltip: {
				title: 'Сортировать слова в порядке доступности для тренировки',
			},
			sorter: (a, b) => a.timeToTrain - b.timeToTrain,
			responsive: ['lg'],
		},
		{
			key: 'actions',
			className: 'centered',
			render: (text: string, record: IWord) => (
				<DeleteOutlined className='' onClick={() => handleRemoveWord(record.id)} />
			),
			responsive: ['sm'],
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
			[style.green]: isAvailableForTraining,
		});
		const dayToTrain = (
			<span className={dayToTrainStyles}>{timeToTrainFormat}</span>
		);

		return (
			<>
				<Row justify='space-between' gutter={[8, 8]} align='middle' wrap={false}>
					<Col style={{ textAlign: 'start' }} span={12}>
						{!breakpoint.md && (
							<Space>
								<span>Категория:</span>
								<WordCategory record={record} handleUpdateWord={handleUpdateWord} />
							</Space>
						)}
					</Col>
					<Col style={{ textAlign: 'start' }} span={12}>
						{!breakpoint.md && (
							<Space>
								<span>Изучено:</span>
								<Checkbox
									checked={record.isLearned}
									onClick={() => handleLearnWord(record.id)}
								/>
							</Space>
						)}
					</Col>
				</Row>
				{record.isLearned ? null : (
					<Row justify='space-between' gutter={[8, 8]} align='middle' wrap={false}>
						<Col span={12}>
							<span>
								Кол-во повторений: {getWordsRepeatsPlural(record.completedTrains)}
							</span>
						</Col>
						<Col span={12}>
							<span>Доступно в тренировке с: {dayToTrain}</span>
						</Col>
					</Row>
				)}
			</>
		);
	};

	const tableTitle = () => (
		<Space style={{ lineHeight: 1.3 }}>
			<Button
				onClick={handleRemoveMultipleWords}
				disabled={selectedRowKeys.length === 0}
				className='app-btn _green _hover-red'
			>
				<DeleteOutlined style={{ color: 'white' }} />
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
						title={tableTitle}
						loading={isLoading}
						rowKey='id'
						expandable={{
							expandedRowRender: getExpandableInfo,
							rowExpandable: (record) =>
								((!breakpoint.lg as boolean) && !record.isLearned) ||
								(!breakpoint.md as boolean),
							showExpandColumn: !breakpoint.lg as boolean,
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
