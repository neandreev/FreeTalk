import { FC } from 'react';

import { Layout } from 'antd';
import { Header } from '../../components/organism/Header';
import { Footer } from '../../components/organism/Footer';
const { Content } = Layout;

export const AppPrivateLayout: FC = ({children}) => {
	return (
		<Layout className='layout'>
			<Header />
			<Content className='page__layout layout__min-height'>
				<div>{children}</div>
			</Content>
			<Footer/>
		</Layout>
	);
};
