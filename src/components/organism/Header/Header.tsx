import { FC, useState, useCallback, useEffect } from 'react';
import { useAuth } from '../../../hooks';
import { Link, useLocation } from 'react-router-dom';

import { LoginModalForm } from '../LoginModalForm';
import Logo from './assets/Logo.png';

import { Layout, Menu, Button } from 'antd';

import style from './Header.module.css';
import './Header.css';

const { Header: HeaderAnt } = Layout;

export const Header: FC = () => {
	const auth = useAuth();
	const { user, signout } = auth!;
	const location = useLocation();
	const patchname = location.pathname;
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [currentKeyMenu, setCurrentKeyMenu] = useState('');

	const handleShowModal = useCallback(() => {
		setIsModalVisible(true);
	}, [setIsModalVisible]);

	const handleCloseModal = useCallback(() => {
		setIsModalVisible(false);
	}, [setIsModalVisible]);

	const handleSignOut = useCallback(() => {
		signout();
	}, [signout]);

	useEffect(() => {
		if (patchname === '/') {
			setCurrentKeyMenu('')
		}
	}, [patchname])

	return (
		<HeaderAnt className={style.header}>
			<div className='container'>
				<div className={style.logoWrapper}>
					<Link to='/' >
						<img src={Logo} alt='FreeTalk' className={style.logo} />
					</Link>
				</div>
				<div className={style.headerAction}>
					<Button
						type='primary'
						className='app-btn _blue'
						onClick={user ? handleSignOut : handleShowModal}>
						{user ? 'Выход' : 'Вход'}
					</Button>
				</div>
				<LoginModalForm
					isModalVisible={isModalVisible}
					handleCloseModal={handleCloseModal}
				/>
				{user &&
						<Menu
							mode="horizontal"
							className='header-navigation'
							defaultSelectedKeys={[]}
							selectedKeys={[currentKeyMenu]}
							onClick={(e) => setCurrentKeyMenu(e.key)}
						>
							<Menu.Item className='navigation-item' key="1">
								<Link to='/dictionary'>Словарь</Link>
							</Menu.Item>
							<Menu.Item className='navigation-item' key="2">
								<Link to='/training'>Тренировка</Link>
							</Menu.Item>
							<Menu.Item className='navigation-item' key="3">
								<Link to='/collections'>Коллекции</Link>
							</Menu.Item>
						</Menu>
				}
			</div>
		</HeaderAnt>
	);
};
