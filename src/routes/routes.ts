import { MainPage } from '../components/pages/MainPage';
import { CollectionsPage } from '../components/pages/CollectionsPage';
import { DetailCollectionPage } from '../components/pages/DetailCollectionPage';
import { TrainingPage } from '../components/pages/TrainingPage';
import { DictionaryPage } from '../components/pages/DictionaryPage';
import { NotFoundPage } from '../components/pages/NotFoundPage';

export const routes = [
	{
		path: '/',
		component: MainPage,
		name: 'root',
		isProtected: false
	},
	{
		path: '/training',
		component: TrainingPage,
		name: 'training',
		isProtected: true
	},
	{
		path: '/collections',
		component: CollectionsPage,
		name: 'collections',
		isProtected: true
	},
	{
		path: '/collection-detail/:id',
		component: DetailCollectionPage,
		name: 'collection-detail',
		isProtected: true
	},
	{
		path: 'dictionary',
		component: DictionaryPage,
		name: 'dictionary',
		isProtected: true
	},
	{
		path: '*',
		component: NotFoundPage,
		name: 'not-found',
		isProtected: false
	}
];