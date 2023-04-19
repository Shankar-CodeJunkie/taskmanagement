//import {configureStore, getDefaultMiddleware} from '@reduxjs/toolkit';
//import { createStore, applyMiddleware } from "redux";
import {rootReducer} from './rootReducer';
import thunkMiddleware from 'redux-thunk';
import {fetchTodos} from './reducer/taskReducer'
import { createStore, applyMiddleware, compose} from 'redux';
import { tasklist} from './reducer/taskReducer'
import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {taskListApi, reducer} from "./slice/taskSlice";
import taskData from './slice/taskSlice1'


const store = configureStore({
  reducer: taskData,
  devTools: true
})



export default store;
