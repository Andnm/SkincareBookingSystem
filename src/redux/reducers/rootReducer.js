import { combineReducers } from "redux";
import userReducer from "./userReducer";
import globalReducer from "./globalReducer";

const rootReducer = combineReducers({
  user: userReducer,
  global: globalReducer,
});

export default rootReducer;
