import { FC } from 'react';

import { AppRoutes } from './routes';

import { Header } from './components/organism/Header';
import { Footer } from './components/organism/Footer';
import { Layout } from 'antd';

import './styles/page.css';

const { Content } = Layout;

export const App: FC = () => {
	return (
		<Layout className='layout'>
			<Header />
			<Content className='content container'>
				<AppRoutes />
			</Content>
			<Footer />
		</Layout>
	);
};
