# redux-todo-app

Redux 스터디용 프로젝트입니다. 2024년 12월 11일에 학습 목적으로 만든 예제라 실서비스 코드가 아닙니다.

**Live**: https://rlnrlnworld.github.io/redux-todo-app/

## 다뤄 본 것

- `createStore` + `combineReducers`로 리듀서 분리 (counter / todos / posts)
- `react-redux`의 `Provider`, `useSelector`, `useDispatch`
- `redux-thunk`로 비동기 액션 (JSONPlaceholder posts 조회)
- 커스텀 로거 미들웨어 (`applyMiddleware`)

## 실행

```bash
npm install
npm start
```

Create React App(TypeScript 템플릿) 기반입니다.

> 2026년 10월 6일, 무엇을 연습한 프로젝트인지 보이도록 UI/UX만 추가로 다듬었습니다. Redux 학습 당시 흐름은 그대로입니다.

파비콘·앱 아이콘은 [Redux 공식 로고](https://github.com/reduxjs/redux/tree/master/logo)(MIT)를 사용했습니다.
