import store from "./redux_store";

export const updateGlobalProp = (type,newValue) => {
  store.dispatch({ 
    type: type, 
    payload: newValue 
  });
};