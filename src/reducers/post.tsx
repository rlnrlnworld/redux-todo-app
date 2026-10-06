export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export type FetchStatus = "idle" | "loading" | "succeeded" | "failed";

export interface PostsState {
  status: FetchStatus;
  items: Post[];
  error: string | null;
  page: number;
  total: number;
}

export const PAGE_SIZE = 20;

type Action =
  | { type: "FETCH_POSTS_REQUEST"; page: number }
  | { type: "FETCH_POSTS_SUCCESS"; payload: Post[]; page: number; total: number }
  | { type: "FETCH_POSTS_FAILURE"; error: string };

const initialState: PostsState = {
  status: "idle",
  items: [],
  error: null,
  page: 1,
  total: 0,
};

const posts = (state = initialState, action: Action): PostsState => {
  switch (action.type) {
    case "FETCH_POSTS_REQUEST":
      return { ...state, status: "loading", error: null, page: action.page };
    case "FETCH_POSTS_SUCCESS":
      return { ...state, status: "succeeded", items: action.payload, page: action.page, total: action.total, error: null };
    case "FETCH_POSTS_FAILURE":
      return { ...state, status: "failed", error: action.error };
    default:
      return state;
  }
};

export default posts;
