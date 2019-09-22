import { createStore } from "redux";
import { Reducer } from "./reducer";

function configureStore() {
  const store = createStore(Reducer);
  return store;
}

export default configureStore;
