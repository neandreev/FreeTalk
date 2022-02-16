import { FC, useCallback, useEffect, useState } from 'react';

import { Button, Form, Input, Select } from 'antd';

const { Option } = Select;

interface ITranslateReqForm {
	onSubmitForm: ({}:ITranslateReqFormValue) => void;
}

interface ITranslateReqFormValue {
	TranslateRequest: string;
	TranslateDirection: string
}

export const TranslateReqForm: FC<ITranslateReqForm> = ({ onSubmitForm }) => {
	const [form] = Form.useForm();
	const [directTranslate, setDirectTranslate] = useState('EN-RU');

	const onFinish = useCallback(
		(values: ITranslateReqFormValue) => {
			onSubmitForm &&
			onSubmitForm({
				TranslateDirection: values.TranslateDirection, TranslateRequest: values.TranslateRequest
			});
		},
		[onSubmitForm]
	);

	const handleChangeTranslateDirection = useCallback((value: string) => {
		setDirectTranslate(value);
	}, [])


	useEffect(() => {
		form.resetFields();
	}, [directTranslate]);

	const prefixSelector = (
		<Form.Item name='TranslateDirection' noStyle>
			<Select style={{ width: 100 }} onChange={handleChangeTranslateDirection}>
				<Option value='EN-RU'>EN-RU</Option>
				<Option value='RU-EN'>RU-EN</Option>
			</Select>
		</Form.Item>
	);

	return (
		<Form
			form={form}
			onFinish={onFinish}
			style={{ width: '100%' }}
			initialValues={{ TranslateDirection: directTranslate }}
		>
			<Form.Item name='TranslateRequest'>
				<Input
					placeholder='Введите слово ...'
					addonBefore={prefixSelector}
				/>
			</Form.Item>
			<Button htmlType='submit' />
		</Form>
	);
};