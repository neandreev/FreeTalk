import { FC, useCallback, useEffect } from 'react';
import { useAuth } from '../../../hooks';

import { Form, Input, Button, message } from 'antd';

import firebase from 'firebase';

import {errors} from '../../../constans/errors';

interface IAuthFormData {
	email: string;
	password: string;
}

interface IAuthorizationForm {
	onSuccess: () => void;
}

export const AuthorizationForm: FC<IAuthorizationForm> = ({ onSuccess }) => {
	const [form] = Form.useForm();
	const auth = useAuth();
	const { signin } = auth!;

	const onFinish = useCallback((values: IAuthFormData) => {
		signin(values.email, values.password)
			.then(() => onSuccess())
			.catch((error: firebase.FirebaseError) => {
				const errorMessage = errors[error.code] || error.message;
				message.error(errorMessage, 4);
			});
	}, []);


	useEffect(() => {
		form.resetFields();
	});

	return (
		<Form
			form={form}
			name='authorization'
			labelCol={{
				span: 5,
			}}
			wrapperCol={{
				span: 19,
			}}
			onFinish={onFinish}
			autoComplete='off'
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
			>
				<Input.Password />
			</Form.Item>
			<Form.Item
				wrapperCol={{
					offset: 5,
					span: 19,
				}}
			>
				<Button
					htmlType='submit'
					className='app-btn _green'
				>
					Войти
				</Button>
			</Form.Item>
		</Form>
	);
};
