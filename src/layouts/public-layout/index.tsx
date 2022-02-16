import { FC } from 'react';

import { Layout } from 'antd';
import { Header } from '../../components/organism/Header';
const { Content } = Layout;

export const AppPublicLayout: FC = ({children}) => {
	return (
		<Layout className='layout'>
			<Header />
			<Content className='page__layout layout__min-height'>
				<div>{children}</div>
			</Content>
		</Layout>
	);
};
