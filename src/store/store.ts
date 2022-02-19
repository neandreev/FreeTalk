import { configureStore } from '@reduxjs/toolkit';

import { collectionReducer } from '../features/collections/collectionsSlice';
import { dictionaryReducer } from '../features/dictionary/dictionarySlice';
import {trainingReducer} from "../features/training/trainingSlice";
import {usersApi} from "../features/database/users";
import { collectionsApi } from '../services/collections';

export const store = configureStore({
  reducer: {
    collections: collectionReducer,
		dictionary: dictionaryReducer,
    training: trainingReducer,
    [usersApi.reducerPath]: usersApi.reducer,
		[collectionsApi.reducerPath]: collectionsApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(usersApi.middleware, collectionsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
