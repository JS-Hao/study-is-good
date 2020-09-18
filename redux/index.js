import { createStore, combineReducers, bindActionCreators } from "./redux";

const addTodo = () => ({ action: "ADD_TODO", text: "study redux" });

const listReducer = (state = [], action) => {
  switch (action.type) {
    case "ADD_TODO":
      return state.concat({ complete: false, text: action.text });

    default:
      return state;
  }
};

const rootReducer = combineReducers({
  list: listReducer,
});
