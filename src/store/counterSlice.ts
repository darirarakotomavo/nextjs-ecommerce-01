import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Définir l'état initial du compteur
interface CounterState {
  value: number;
}

const initialState: CounterState = {
  value: 0,
};

// Créer le slice Redux
const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1; // Augmente le compteur de 1
    },
    decrement: (state) => {
      state.value -= 1; // Diminue le compteur de 1
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload; // Augmente selon une valeur donnée
    },
  },
});

// Exporter les actions
export const { increment, decrement, incrementByAmount } = counterSlice.actions;

// Exporter le reducer par défaut
export default counterSlice.reducer;
