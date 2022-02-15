import { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch } from '../../../hooks';

import { ICollection } from '../../../interfaces/collection';
import { ICollectionRow } from '../../../interfaces/collectionRow';
import { columns } from './constants';
import { getCollectionsAsync } from '../../../api/collectionsAPI';

import { Row, Col, Radio, message } from 'antd';
import { Table } from '../../molecules/Table';

const rowSelection = {
	onChange: (selectedRowKeys: React.Key[], selectedRows: ICollectionRow[]) => {
		console.log(
			`selectedRowKeys: ${selectedRowKeys}`,
			'selectedRows: ',
			selectedRows
		);
	},
	getCheckboxProps: (record: ICollectionRow) => ({
		word: record.word,
	}),
};

export const DetailCollection: FC = () => {
	const dispatch = useAppDispatch();
	const [collection, setCollection] = useState<ICollection>();
	const [dataTable, setDataTable] = useState<Array<Object>>([]);
	const [collections, setCollections] = useState<Array<ICollection>>([]);
	const params = useParams();
	const [selectionType, setSelectionType] = useState<'checkbox'>('checkbox');

	useEffect(() => {
		dispatch(getCollectionsAsync())
			.then((res) => {
				setCollections(res as Array<ICollection>);
			})
			.catch((e) => {
				message.error(e);
			});
		setCollection(
			collections.find((item) => item.id === params.id) as ICollection
		);
		const data = collection?.words.map((item) => {
			return { key: item.id, word: item.word, translate: item.translation };
		});
		if (data) {
			setDataTable(data as Array<ICollectionRow>);
		}
	}, [collections, params, collection, dispatch]);

	return (
		<div className='page'>
			<Row justify='center'>
				<Col>
					<h1 className='page__title'>{collection?.title}</h1>
				</Col>
			</Row>
			<Row justify='center'>
				<Col>
					<Radio.Group
						onChange={({ target: { value } }) => {
							setSelectionType(value);
						}}
						value={selectionType}
					></Radio.Group>
					<Table
						columns={columns}
						data={dataTable || []}
						rowSelection={{
							type: selectionType,
							...rowSelection,
						}}
					/>
				</Col>
			</Row>
		</div>
	);
};
