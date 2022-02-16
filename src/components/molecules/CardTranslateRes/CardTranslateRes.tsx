import { FC, useCallback } from 'react';

import { Card } from 'antd';

import { ICardTranslateRes } from '../../../interfaces/translate';

import { FileAddOutlined } from '@ant-design/icons';

export const CardTranslateRes: FC<ICardTranslateRes> = (
	{ ru, en, imageURL, onAddWordToDictionary }
) => {
	const handleAddWordToDictionary = useCallback(() => {
		onAddWordToDictionary && onAddWordToDictionary({ru: ru, en: en});
	}, [onAddWordToDictionary]);

	return (
		<Card
			style={{ width: 240 }}
			cover={<img alt={en} src={imageURL} />}
			actions={[
				<FileAddOutlined key='add' onClick={handleAddWordToDictionary} />]}
		>
			<p>EN: {en}</p>
			<p>RU: {ru}</p>
		</Card>
	);
};
