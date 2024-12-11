import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { applyMiddleware, createStore, Store } from 'redux';
import rootReducer, { RootState } from './reducers';
import { Provider } from 'react-redux';
import { thunk } from 'redux-thunk';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const loggerMiddleware = (store: any) => (next: any) => (action: any) => {
  console.log("store", store);
  console.log("action", action);
  next(action);
};

const store = createStore(
  rootReducer as any, // 타입 캐스팅 적용
  applyMiddleware(thunk, loggerMiddleware)
) as Store<RootState>;

const render = () => root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App
        onIncrement={() => store.dispatch({ type: "INCREMENT"})}
        onDecrement={() => store.dispatch({ type: "DECREMENT" })}
      />
    </Provider>
  </React.StrictMode>
);

render();

store.subscribe(render);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
