import { FC, useState, useCallback, useEffect } from 'react';
import { useAuth } from '../../../hooks';
import { Link, useLocation } from 'react-router-dom';

import { LoginModalForm } from '../LoginModalForm';
import {ReactComponent as FreeTalk} from '../../../assets/FreeTalk.svg';
import {ReactComponent as FreeTalkMobile} from '../../../assets/FreeTalkMobile.svg';

import { Row, Col, Layout, Menu } from 'antd';

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
            <FreeTalk height='63px' widht='200px' className={style.logo}/>
            <FreeTalkMobile height='63px' widht='93px' className={style.logoMobile}/>
					</Link>
				</div>
				<div className={style.headerAction}>
					<a
					className={style.authBtn}
						type='primary'
						onClick={user ? handleSignOut : handleShowModal}>
						{user ? 'Выход' : 'Вход'}
					</a>
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
