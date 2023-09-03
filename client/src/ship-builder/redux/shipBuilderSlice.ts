import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ShipDTO } from "../../game/apiModel";
import { pointMatchesToPoint } from "../../redux/activeGameSlice";

export type ShipBuilderState = {
  selectedShip?: ShipDTO;
};

export const initialState: ShipBuilderState = {};

const shipBuilderSlice = createSlice({
  initialState,
  name: "shipBuilder",
  reducers: {
    setSelectedShip: (state, action: PayloadAction<ShipDTO | undefined>) => {
      const ship = action.payload;
      const isSame = pointMatchesToPoint(state.selectedShip?.start)(
        ship?.start
      );
      if (isSame) {
        state.selectedShip = undefined;
      } else {
        state.selectedShip = action.payload;
      }
    },
    transformSelectedShip: (state, action: PayloadAction<ShipDTO>) => {
      state.selectedShip = action.payload;
    },
  },
});

export const { setSelectedShip, transformSelectedShip } =
  shipBuilderSlice.actions;

export const shipBuilderReducer = shipBuilderSlice.reducer;
