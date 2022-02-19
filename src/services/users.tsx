import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IWord } from '../interfaces/word';

interface IUpdateUserWords {
	userId: string;
	wordId: string;
	word: Partial<IWord>;
}

interface IWordsObj {
	[id: string]: Partial<IWord>;
}

export const usersApi = createApi({
	reducerPath: 'usersApi',
	baseQuery: fetchBaseQuery({
		baseUrl: 'https://freetalk2022-default-rtdb.firebaseio.com/users/',
	}),
	endpoints: (builder) => ({
		getUserWordsByUid: builder.query<IWord[], string>({
			query: (uid) => `${uid}/words.json`,
			transformResponse: (response: IWordsObj) => {
				const wordsEntries = Object.entries(response);
				const wordsArray: IWord[] = wordsEntries.map(
					([id, word]) => ({ ...word, id } as IWord)
				);

				return wordsArray;
			},
		}),
		addUserWord: builder.mutation<void, Partial<IUpdateUserWords>>({
			query: ({ word, userId }) => ({
				url: `${userId}/words.json`,
				method: 'POST',
				body: word,
			}),
		}),
		updateUserWord: builder.mutation<void, IUpdateUserWords>({
			query: ({ word, wordId, userId }) => ({
				url: `${userId}/words/${wordId}.json`,
				method: 'PATCH',
				body: word,
			}),
		}),
		deleteUserWord: builder.mutation<void, Partial<IUpdateUserWords>>({
			query: ({ userId, wordId }) => ({
				url: `${userId}/words/${wordId}.json`,
				method: 'DELETE',
			}),
		}),
	}),
});

export const {
	useGetUserWordsByUidQuery,
	useUpdateUserWordMutation,
	useAddUserWordMutation,
	useDeleteUserWordMutation,
} = usersApi;
