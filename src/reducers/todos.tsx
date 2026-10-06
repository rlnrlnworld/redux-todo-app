export interface Todo {
  id: number;
  text: string;
}

type Action =
  | { type: "ADD_TODO"; text: string }
  | { type: "DELETE_TODO"; id: number };

const initialState: Todo[] = [];

let nextId = 1;

const todos = (state = initialState, action: Action): Todo[] => {
  switch (action.type) {
    case "ADD_TODO":
      return [...state, { id: nextId++, text: action.text }];
    case "DELETE_TODO":
      return state.filter((todo) => todo.id !== action.id);
    default:
      return state;
  }
};

export default todos;
