# redux-todo-app

Redux 스터디용 프로젝트입니다. 학습 목적으로 만든 예제라 실서비스 코드가 아닙니다.

- **2024년 12월 11일** — Redux 기초 학습 (counter → todos → thunk 비동기 순서로 구현)
- **2026년 10월 6일** — 보는 사람이 무엇을 연습한 프로젝트인지 알 수 있도록 UI/UX만 추가로 다듬음

## 다뤄 본 것 (2024.12.11)

- `createStore` + `combineReducers`로 리듀서 분리 (counter / todos / posts)
- `react-redux`의 `Provider`, `useSelector`, `useDispatch`
- `redux-thunk`로 비동기 액션 (JSONPlaceholder posts 조회)
- 커스텀 로거 미들웨어 (`applyMiddleware`)

## 추가로 다듬은 것 (2026.10.06)

학습 당시 코드의 Redux 흐름은 유지하고, 그 흐름이 화면에서 드러나도록 UI/UX만 손봤습니다.

- 카드 3개(Counter / Todos / Posts) 기본 스타일, Redux 로고 파비콘
- 각 카드 제목 옆 ⓘ 버튼 → 어떤 개념을 연습했는지(액션 타입, 리듀서 파일) 팝오버로 표시
- Todos: 빈 값 추가 방지, 항목 삭제(`DELETE_TODO`)
- Posts: 자동 조회 대신 **불러오기** 버튼으로 직접 트리거 → `REQUEST / SUCCESS / FAILURE` 상태 변화가 보이도록
- Posts: 20개씩 페이지네이션(`_page`, `_limit`, `x-total-count`), 항목 펼치면 본문 표시

## 실행

```bash
npm install
npm start
```

Create React App(TypeScript 템플릿) 기반입니다.

파비콘·앱 아이콘은 [Redux 공식 로고](https://github.com/reduxjs/redux/tree/master/logo)(MIT)를 사용했습니다.
