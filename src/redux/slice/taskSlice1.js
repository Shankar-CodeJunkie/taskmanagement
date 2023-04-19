import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {postService, getService, deleteService} from './../../content/httpService/httpService';


const initialState = {
  loading: false,
  tasks: []
};

export const getAllTasks = createAsyncThunk('taskList/getAllTasks', async() => {
  let data = await getService('get', '/gettasks', '');
  return data;
})

export const createTask = createAsyncThunk('taskList/createTask', async(taskObject) => {
  console.log('createSlice', taskObject)
  let data = await postService('POST', '/createtask', taskObject);
  return data;
})

export const updateTask = createAsyncThunk('taskList/updateTask', async(taskObject) => {
  console.log('create slice update', taskObject)
  let data = await postService('POST', '/updatetask', taskObject);
  return data;
})

export const deleteTask = createAsyncThunk('taskList/deleteTask', async(taskObject) => {
  console.log('create slice delete', taskObject)
  let data = await deleteService('DELETE', '/deletetask', taskObject);
  return data;
})

const taskData = createSlice({
  name: 'taskList',
  initialState : initialState,
  reducers: {},
  extraReducers: (builder => {
    builder.addCase(getAllTasks.fulfilled, (state, {payload}) => {
      state.tasks = payload;
      state.loading = true
    })
    builder.addCase(getAllTasks.pending, (state, {payload}) => {
      state.loading = false;
    })
    builder.addCase(getAllTasks.rejected, (state, {payload}) => {
      state.loading = false;
    })
    builder.addCase(createTask.fulfilled, (state, {payload}) => {
      state.tasks = payload;
      state.loading = true;
    })
    builder.addCase(createTask.pending, (state ) => {
      state.loading = false;
    })
    builder.addCase(createTask.rejected, (state ) => {
      state.loading = false;
    })
    builder.addCase(updateTask.fulfilled, (state, {payload}) => {
      state.loading = true;
      state.tasks = payload;
    })
    builder.addCase(updateTask.pending, (state) => {
      state.loading = false;
    })
    builder.addCase(updateTask.rejected, (state) => {
      state.loading = false;
    })
    builder.addCase(deleteTask.fulfilled, (state, {payload}) => {
      state.loading = true;
      state.tasks = payload;
    })
    builder.addCase(deleteTask.rejected, (state) => {
      state.loading = false;
    })
  })

})


export default taskData;

