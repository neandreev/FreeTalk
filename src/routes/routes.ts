import { Translate } from "../components/organism/Translate";
import { Collections } from "../components/organism/Collections";
import { DetailCollection } from "../components/organism/DetailCollection";
import { TrainingPage } from "../components/pages/TrainingPage";
import { DictionaryPage } from "../components/pages/DictionaryPage";
import { NotFoundPage } from "../components/pages/NotFoundPage";

export const routes = [
  {
    path: '/',
    component: Translate,
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
    component: Collections,
    name: 'collections',
    isProtected: true
  },
  {
    path: '/collection-detail/:id',
    component: DetailCollection,
    name: 'collection-detail',
    isProtected: true
  },
	{
		path: 'dictionary',
		component: DictionaryPage,
		name: 'dictionary',
		isProtected: true,
	},
	{
		path: '*',
		component: NotFoundPage,
		name: 'not-found',
		isProtected: false
	}
];