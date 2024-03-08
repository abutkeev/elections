import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const initialState = {
  showButton: false,
  showDialog: false,
};

const newElectionsDialogSlice = createSlice({
  name: 'newElectionsDialog',
  initialState,
  reducers: {
    setShowNewElectionsButton: (state, { payload }: PayloadAction<boolean>) => {
      state.showButton = payload;
    },
    setShowNewElectionsDialog: (state, { payload }: PayloadAction<boolean>) => {
      state.showDialog = payload;
    },
  },
});

export const { setShowNewElectionsButton, setShowNewElectionsDialog } = newElectionsDialogSlice.actions;

export default newElectionsDialogSlice;
