enum ActionType {
  ADD_TODO = "ADD_TODO",
  DELETE_TODO = "DELETE_TODO"
}

interface Action {
  type: ActionType;
  text: string;
}

const initialState: string[] = [];

const todos = (state = initialState, action: Action): string[] => {
  switch (action.type) {
    case 'ADD_TODO':
      return [...state, action.text]
    default:
      return state
  }
}

export default todos;