import { configureStore, createAction } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import searchSlice from './features/search';
import titleSlice from './features/title';
import snackbarsSlice from './features/snackbars';
import authSlice, { authMiddleware } from './features/auth';
import { api } from '@/api/api';
import themeSlice from './features/theme';
import { websocketMiddleware, websocketSlice } from './features/websocket';
import newElectionsDialogSlice from './features/new-elections-dialog';

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    [websocketSlice.name]: websocketSlice.reducer,
    [searchSlice.name]: searchSlice.reducer,
    [titleSlice.name]: titleSlice.reducer,
    [snackbarsSlice.name]: snackbarsSlice.reducer,
    [authSlice.name]: authSlice.reducer,
    [themeSlice.name]: themeSlice.reducer,
    [newElectionsDialogSlice.name]: newElectionsDialogSlice.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().prepend([authMiddleware, websocketMiddleware]).concat(api.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export function getSliceActionCreator(slice: { name: string }) {
  return function <T = undefined>(name: string) {
    return createAction<T>(`${slice.name}/${name}`);
  };
}
