import { combineReducers } from "redux";
import counter from "./counter";
import todos from "./todos";
import posts from "./post";

// Root 리듀서 정의
const rootReducer = combineReducers({
  todos,
  counter,
  posts
});

// RootState 타입 지정
export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;