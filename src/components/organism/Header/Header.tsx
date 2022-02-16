import { FC, useState, useCallback } from 'react';
import { useAuth } from '../../../hooks';
import { Link } from 'react-router-dom';

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
				<Link to="/">
					<img src={Logo} alt='FreeTalk' className={style.logo} />
				</Link>
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
					<Menu.Item key=''>
						<Link to="/dictionary">Словарь</Link>
					</Menu.Item>
					<Menu.Item key='2'>
						<Link to="/training">Тренировка</Link>
					</Menu.Item>
					<Menu.Item key='3'>
						<Link to="/collections">
							Коллекции
						</Link>
					</Menu.Item>
				</Menu>
			)}
		</HeaderAnt>
	);
};
