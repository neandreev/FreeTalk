import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { ICollection } from '../interfaces/collection';

interface ICollectionObj {
	[id: string]: Partial<ICollection>;
}

export const collectionsApi = createApi({
	reducerPath: 'collectionsApi',
	baseQuery: fetchBaseQuery({
		baseUrl: 'https://freetalk2022-default-rtdb.firebaseio.com/',
	}),
	endpoints: (builder) => ({
		getCollections: builder.query<ICollection[], null>({
			query: () => `/collections.json`,
			transformResponse: (response: ICollectionObj) => {
				const collectionsEntries = Object.entries(response);
				const collectionsArray: ICollection[] = collectionsEntries.map(
					([id, collection]) => ({ ...collection, id } as ICollection)
				);
				return collectionsArray;
			},
		})
	})
});

export const { useGetCollectionsQuery } = collectionsApi;