import { FC, useState, useCallback } from 'react';
import { useAuth } from '../../../hooks';

import { LoginModalForm } from '../LoginModalForm';
import Logo from './assets/Logo.png';

import { Layout, Menu, Button } from 'antd';

import style from './Header.module.css';

const { Header: HeaderAnt } = Layout;

export const Header: FC = () => {
	const auth = useAuth();
	const { user, signout } = auth!;
	const [isModalVisible, setIsModalVisible] = useState(false);

	const handleShowModal = useCallback(() => {
		setIsModalVisible(true);
	}, [setIsModalVisible]);

	const handleCloseModal = useCallback(() => {
		setIsModalVisible(false);
	}, [setIsModalVisible]);

	const handleSignOut = useCallback(() => {
		signout();
	}, [signout]);

	return (
		<HeaderAnt>
			<div className={style.logoWrapper}>
				<img src={Logo} alt='FreeTalk' className={style.logo} />
			</div>
			<div className={style.headerAction}>
				{user ? (
					<Button type='primary' onClick={handleSignOut}>
						Выход
					</Button>
				) : (
					<Button type='primary' onClick={handleShowModal}>
						Вход
					</Button>
				)}
			</div>
			<LoginModalForm
				isModalVisible={isModalVisible}
				handleCloseModal={handleCloseModal}
			/>
			{user && (
				<Menu theme='dark' mode='horizontal' defaultSelectedKeys={[]}>
					<Menu.Item key='1'>Словарь</Menu.Item>
					<Menu.Item key='2'>Тренировка</Menu.Item>
					<Menu.Item key='3'>Коллекции</Menu.Item>
					<Menu.Item key='4'>Статистика</Menu.Item>
				</Menu>
			)}
		</HeaderAnt>
	);
};
