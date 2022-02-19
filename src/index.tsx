import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router} from 'react-router-dom';
import {Provider} from 'react-redux';
import { ConfigProvider } from 'antd';
import ruRU from 'antd/lib/locale/ru_RU';

import { App } from './App';
import { store } from './store/store';

import { ProvideAuth } from './hooks/useAuth';

import 'antd/dist/antd.min.css';
import './index.css';

ReactDOM.render(
	<ProvideAuth>
		<Provider store={store}>
			<Router>
				<React.StrictMode>
					<ConfigProvider locale={ruRU}>
						<App/>
					</ConfigProvider>
				</React.StrictMode>
			</Router>
		</Provider>
	</ProvideAuth>,
	document.getElementById('root')
);
