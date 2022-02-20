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
		<HeaderAnt className={style.header}>
			<div className='container'>
				<div className={style.logoWrapper}>
					<Link to='/'>
						<img src={Logo} alt='FreeTalk' className={style.logo} />
					</Link>
				</div>
				<div className={style.headerAction}>
					<Button
						type='primary'
						className='app-btn _green'
						onClick={user ? handleSignOut : handleShowModal}>
						{user ? 'Выход' : 'Вход'}
					</Button>
				</div>
				<LoginModalForm
					isModalVisible={isModalVisible}
					handleCloseModal={handleCloseModal}
				/>
				{user && (
					<nav className={style.navigation}>
						<ul className={style.menu}>
							<li>
								<Link to='/dictionary' className='app-btn _green'>
									Словарь
								</Link>
							</li>
							<li>
								<Link to='/training' className='app-btn _green'>
									Тренировка
								</Link>
							</li>
							<li>
								<Link to='/collections' className='app-btn _green'>
									Коллекции
								</Link>
							</li>
						</ul>
					</nav>
				)}
			</div>
		</HeaderAnt>
	);
};
