import { createStore } from "redux";
import { Reducer } from "./reducer";
import { AppState } from "./appState";

export const store = createStore(Reducer.reduce, new AppState());