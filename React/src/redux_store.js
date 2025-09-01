import { createStore } from 'redux';
const intialState = {
    default_refresh_time: 1000
  }
  
  function globalReducer (state = intialState, action){
    switch (action.type){
      case 'default refresh time':
        return {...state,default_refresh_time:action.payload}
      case 'login_id':
        return {...state, login_id:action.payload}
      default: 
        return state;
    }
  }
  
  const store = createStore(globalReducer);

  export default store;