import {combineReducers} from '@reduxjs/toolkit'
import {tasklist} from "./reducer/taskReducer";


export const rootReducer = combineReducers({
  tasklist: tasklist || []
})
