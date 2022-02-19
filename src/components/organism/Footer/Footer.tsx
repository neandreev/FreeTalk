import {FC} from 'react';

import { Layout } from 'antd';

import style from './Footer.module.css';

const { Footer: FooterAnt } = Layout;

export const Footer: FC = () => {
	return <FooterAnt className={style.footer} style={{ flexShrink: '0' }}>©FreeTalk 2022</FooterAnt>;
};
