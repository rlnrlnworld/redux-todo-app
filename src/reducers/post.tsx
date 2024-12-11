enum ActionType {
  FETCH_POSTS = "FETCH_POSTS",
  DELETE_POSTS = "DELETE_POSTS"
}

interface Post {
  userId: number;
  id: number;
  title: string;
}

interface Action {
  type: ActionType;
  payload: Post[];
}

const initialState: Post[] = []; // 초기 상태 타입 지정

const posts = (state = initialState, action: Action): Post[] => {
  switch (action.type) {
    case ActionType.FETCH_POSTS:
      return [...state, ...action.payload];
    default:
      return state;
  }
};

export default posts;