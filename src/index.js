import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import {Provider} from "react-redux";
import store from './redux/store';
import {getService} from "./content/httpService/httpService";
import {fetchTodos} from "./redux/reducer/taskReducer";
import { ApiProvider } from "@reduxjs/toolkit/query/react";
//import {taskListApi} from './redux/slice/taskSlice';
import { productsApi } from "./redux/slice/taskSlice";
const cache = new InMemoryCache();
//import { Provider } from 'react-redux'
//import { applyMiddleware, createStore, compose } from 'redux';


//import store from './redux/store';

const client = new ApolloClient({
  cache: cache,
  uri: 'https://api.github.com/graphql',
  headers: {
    authorization: `Bearer ${
        process.env.REACT_APP_GITHUB_PERSONAL_ACCESS_TOKEN
    }`,
  },
});

/*const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>

    </React.StrictMode>
);*/
//store.dispatch(fetchTodos())



ReactDOM.render(
    <React.StrictMode>
        <ApolloProvider client={client} >
          <Provider store={store}>
            <App/>
          </Provider>
        </ApolloProvider>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
