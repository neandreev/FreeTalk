import { Table } from 'antd';
import { FC } from 'React';
import { useAuth } from '../../../hooks';
import { Dictionary } from '../../organism/Dictionary';

export const DictionaryPage: FC = () => {
	const auth = useAuth();

	const placeholderColumns = [
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
		},
		{
			title: 'Изучено',
			dataIndex: 'isLearned',
			key: 'isLearned',
			width: '50px',
		},
		{
			title: '',
			dataIndex: 'action',
			key: 'action',
		},
	];

	return (
		<>
			{auth?.user ? (
				<Dictionary />
			) : (
				<Table columns={placeholderColumns} rowSelection={{ type: 'checkbox' }} />
			)}
		</>
	);
};
