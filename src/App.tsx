import React, { useEffect, useState } from 'react';
import { Post, PAGE_SIZE } from './reducers/post';
import './App.css';
import reduxLogo from './redux-logo.svg';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './reducers';
import axios from 'axios';

const POSTS_URL = "https://jsonplaceholder.typicode.com/posts";
const postsPageUrl = (page: number) => `${POSTS_URL}?_page=${page}&_limit=${PAGE_SIZE}`;

// thunk: 객체 대신 함수를 dispatch. redux-thunk 미들웨어가 (dispatch, getState)를 넘겨 실행.
// 인자(page)를 받는 thunk 생성자 — 클로저로 요청 파라미터를 들고 들어감.
const fetchPosts = (page: number): any => {
  return async function fetchPostsThunk(dispatch: any) {
    dispatch({ type: "FETCH_POSTS_REQUEST", page });
    try {
      const response = await axios.get<Post[]>(postsPageUrl(page));
      const total = Number(response.headers["x-total-count"]) || response.data.length;
      dispatch({ type: "FETCH_POSTS_SUCCESS", payload: response.data, page, total });
    } catch (err) {
      const message = err instanceof Error ? err.message : "요청 실패";
      dispatch({ type: "FETCH_POSTS_FAILURE", error: message });
    }
  };
};

type Props = {
  onIncrement: () => void;
  onDecrement: () => void;
}

type StudyInfo = {
  concept: string;
  points: string[];
  actions: string[];
  file: string;
}

const STUDY: Record<string, StudyInfo> = {
  counter: {
    concept: "리듀서 기초 — (state, action) => newState",
    points: [
      "액션 타입에 따라 새 상태를 반환하는 순수 함수",
      "store.dispatch를 직접 호출해 props(onIncrement / onDecrement)로 내려줌",
      "store.subscribe(render)로 상태 변경 시 다시 렌더",
    ],
    actions: ["INCREMENT", "DECREMENT"],
    file: "src/reducers/counter.tsx",
  },
  todos: {
    concept: "combineReducers + react-redux 훅",
    points: [
      "리듀서 여러 개를 combineReducers로 합쳐 RootState 타입 추출",
      "useSelector로 상태 읽고 useDispatch로 액션 보냄",
      "spread로 추가, filter로 삭제 — 원본 배열을 바꾸지 않고 새 배열 반환 (불변성)",
    ],
    actions: ["ADD_TODO", "DELETE_TODO"],
    file: "src/reducers/todos.tsx",
  },
  posts: {
    concept: "redux-thunk — 비동기를 Redux에 넣는 법",
    points: [
      "리듀서는 순수 함수라 API 호출 불가 → 함수를 dispatch하면 thunk 미들웨어가 대신 실행",
      "REQUEST → SUCCESS | FAILURE 세 액션으로 loading / error 상태를 스토어에서 관리",
      "fetchPosts(page)처럼 인자를 받는 thunk 생성자로 페이지네이션 요청 파라미터 전달",
      "커스텀 로거 미들웨어가 모든 액션을 콘솔에 기록 (applyMiddleware)",
    ],
    actions: ["FETCH_POSTS_REQUEST", "FETCH_POSTS_SUCCESS", "FETCH_POSTS_FAILURE"],
    file: "src/reducers/post.tsx",
  },
};

type SectionProps = {
  id: string;
  title: string;
  open: boolean;
  onToggle: (id: string) => void;
  children: React.ReactNode;
}

function Section({ id, title, open, onToggle, children }: SectionProps) {
  const info = STUDY[id];
  const infoId = `${id}-info`;
  return (
    <section className="block" aria-labelledby={`${id}-title`}>
      <div className="block__head">
        <h2 id={`${id}-title`} className="block__title">{title}</h2>
        <div className="info-wrap" data-info-root>
          <button
            type="button"
            className="info-btn"
            aria-expanded={open}
            aria-controls={infoId}
            aria-label={`${title} 스터디 설명 ${open ? "닫기" : "열기"}`}
            onClick={() => onToggle(id)}
          >
            <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false">
              <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="8" cy="4.75" r="1" fill="currentColor" />
              <path d="M8 7v4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
          {open && (
            <div id={infoId} className="info" role="dialog" aria-labelledby={`${id}-title`}>
              <p className="info__concept">{info.concept}</p>
              <ul className="info__points">
                {info.points.map((pt) => <li key={pt}>{pt}</li>)}
              </ul>
              <dl className="info__meta">
                <dt>액션</dt>
                <dd>{info.actions.map((a) => <code key={a}>{a}</code>)}</dd>
                <dt>리듀서</dt>
                <dd><code>{info.file}</code></dd>
              </dl>
            </div>
          )}
        </div>
      </div>
      <div className="card">
        {children}
      </div>
    </section>
  );
}

function App({ onIncrement, onDecrement }: Props) {
  const todos = useSelector((state: RootState) => state.todos);
  const counter = useSelector((state: RootState) => state.counter);
  const posts = useSelector((state: RootState) => state.posts);
  const dispatch =  useDispatch();

  const [todoValue, setTodoValue] = useState("");
  const [openInfo, setOpenInfo] = useState<string | null>(null);
  const [openPost, setOpenPost] = useState<number | null>(null);
  const togglePost = (id: number) => setOpenPost((cur) => (cur === id ? null : id));

  const totalPages = Math.max(1, Math.ceil(posts.total / PAGE_SIZE));
  const isLoading = posts.status === "loading";
  const loadPage = (page: number) => {
    setOpenPost(null);
    dispatch(fetchPosts(page));
  };
  const toggleInfo = (id: string) => setOpenInfo((cur) => (cur === id ? null : id));

  useEffect(() => {
    if (!openInfo) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!(e.target as Element).closest("[data-info-root]")) setOpenInfo(null);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenInfo(null);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [openInfo]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTodoValue(e.target.value);
  }
  const trimmedTodo = todoValue.trim();
  const addTodo = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!trimmedTodo) return;
    dispatch({ type: "ADD_TODO", text: trimmedTodo });
    setTodoValue("");
  }
  const deleteTodo = (id: number) => dispatch({ type: "DELETE_TODO", id });

  return (
    <main className="app">
      <h1 className="app__title">
        <img className="app__logo" src={reduxLogo} alt="" width="28" height="28" />
        Redux Study
      </h1>

      <Section id="counter" title="Counter" open={openInfo === "counter"} onToggle={toggleInfo}>
        <div className="counter">
          <button type="button" className="btn" onClick={onDecrement} aria-label="감소">-</button>
          <span className="counter__value">{counter}</span>
          <button type="button" className="btn" onClick={onIncrement} aria-label="증가">+</button>
        </div>
      </Section>

      <Section id="todos" title="Todos" open={openInfo === "todos"} onToggle={toggleInfo}>
        <form className="todo-form" onSubmit={addTodo}>
          <input
            className="input"
            type="text"
            value={todoValue}
            onChange={handleChange}
            placeholder="할 일 입력"
            aria-label="할 일"
          />
          <button type="submit" className="btn btn--primary" disabled={!trimmedTodo}>추가</button>
        </form>
        {todos.length === 0 ? (
          <p className="empty">아직 할 일이 없습니다.</p>
        ) : (
          <ul className="list list--numbered">
            {todos.map((todo) => (
              <li key={todo.id}>
                <span className="list__text">{todo.text}</span>
                <button
                  type="button"
                  className="icon-btn"
                  onClick={() => deleteTodo(todo.id)}
                  aria-label={`"${todo.text}" 삭제`}
                >
                  <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false">
                    <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section id="posts" title="Posts" open={openInfo === "posts"} onToggle={toggleInfo}>
        <div className="fetch-bar">
          <a className="link" href={postsPageUrl(posts.page)} target="_blank" rel="noopener noreferrer">
            원문 보기
            <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true" focusable="false">
              <path d="M6 3h7v7M13 3L5 11" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="sr-only"> (새 창)</span>
          </a>
          <div className="fetch-bar__right">
            <span className={`status status--${posts.status}`} aria-live="polite">
              {posts.status === "idle" && "대기 중"}
              {posts.status === "loading" && "요청 중"}
              {posts.status === "succeeded" && `${posts.items.length}개 수신`}
              {posts.status === "failed" && "실패"}
            </span>
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => loadPage(posts.page)}
              disabled={isLoading}
            >
              {isLoading ? "불러오는 중…" : posts.status === "idle" ? "불러오기" : "다시 불러오기"}
            </button>
          </div>
        </div>
        {posts.status === "idle" && (
          <p className="empty">버튼을 눌러 JSONPlaceholder에서 글 목록을 가져옵니다.</p>
        )}
        {posts.status === "failed" && (
          <p className="empty empty--error">{posts.error}</p>
        )}
        {posts.items.length > 0 && (
          <ul className="list list--accordion">
            {posts.items.map((post) => {
              const expanded = openPost === post.id;
              const bodyId = `post-body-${post.id}`;
              return (
                <li key={post.id} className={expanded ? "is-open" : undefined}>
                  <button
                    type="button"
                    className="accordion__trigger"
                    aria-expanded={expanded}
                    aria-controls={bodyId}
                    onClick={() => togglePost(post.id)}
                  >
                    <span className="list__text">{post.title}</span>
                    <svg className="accordion__chevron" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false">
                      <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <div id={bodyId} className="accordion__panel" aria-hidden={!expanded}>
                    <div className="accordion__panel-inner">
                      <p className="accordion__body">{post.body}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
        {posts.total > PAGE_SIZE && (
          <nav className="pager" aria-label="페이지">
            <button
              type="button"
              className="btn"
              onClick={() => loadPage(posts.page - 1)}
              disabled={isLoading || posts.page <= 1}
            >
              이전
            </button>
            <span className="pager__info" aria-live="polite">{posts.page} / {totalPages}</span>
            <button
              type="button"
              className="btn"
              onClick={() => loadPage(posts.page + 1)}
              disabled={isLoading || posts.page >= totalPages}
            >
              다음
            </button>
          </nav>
        )}
      </Section>
    </main>
  );
}

export default App;
