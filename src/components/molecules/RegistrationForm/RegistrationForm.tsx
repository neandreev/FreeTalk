import { FC, useCallback, useEffect } from 'react';
import { useAuth } from '../../../hooks';

import { Form, Input, Button } from 'antd';

interface IRegFormData {
	email: string;
	password: string;
	confirm: string;
}

interface IRegistrationForm {
	onSuccess: () => void;
}

export const RegistrationForm: FC<IRegistrationForm> = ({ onSuccess }) => {
	const [form] = Form.useForm();
	const auth = useAuth();
	const { signup } = auth!;

	const onFinish = useCallback((values: IRegFormData) => {
		signup(values.email, values.password).then(() => onSuccess());
	}, []);

	useEffect(() => {
		form.resetFields();
	});

	return (
		<Form
			form={form}
			name='register'
			labelCol={{
				span: 9,
			}}
			wrapperCol={{
				span: 15,
			}}
			onFinish={onFinish}
			autoComplete='off'
			initialValues={{
				email: '',
				prefix: '7',
			}}
		>
			<Form.Item
				name='email'
				label='E-mail'
				rules={[
					{
						type: 'email',
						required: true,
						message: 'Пожалуйста, введите e-mail!',
					},
				]}
			>
				<Input />
			</Form.Item>
			<Form.Item
				name='password'
				label='Пароль'
				rules={[
					{
						required: true,
						message: 'Пожалуйста, введите пароль!',
					},
				]}
				hasFeedback
			>
				<Input.Password />
			</Form.Item>
			<Form.Item
				name='confirm'
				label='Подтвердите пароль'
				dependencies={['password']}
				hasFeedback
				rules={[
					{
						required: true,
						message: 'Пожалуйста, подтвердите пароль!',
					},
					({ getFieldValue }) => ({
						validator(_, value) {
							if (!value || getFieldValue('password') === value) {
								return Promise.resolve();
							}
							return Promise.reject(
								new Error('Пароли не совпадают. Повторите попытку.')
							);
						},
					}),
				]}
			>
				<Input.Password />
			</Form.Item>

			<Form.Item
				wrapperCol={{
					offset: 9,
					span: 15,
				}}
			>
				<Button type='primary' htmlType='submit'>
					Регистрация
				</Button>
			</Form.Item>
		</Form>
	);
};
