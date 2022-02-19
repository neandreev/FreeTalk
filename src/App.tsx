import { FC } from 'react';

import { AppRoutes } from './routes';

import { Layout } from 'antd';
import { Header } from './components/organism/Header';
import './styles/page.css';
import { Footer } from './components/organism/Footer';

const { Content } = Layout;

export const App: FC = () => {
	return (
		<Layout className='layout'>
			<div style={{ flex: '1 0 auto' }}>
				<Header />
				<Content className='content'>
					<AppRoutes/>
				</Content>
			</div>
			<Footer />
		</Layout>
	);
};
