import {getService} from './../../content/httpService/httpService'

const initialState = {
  tasks: []
};

export function tasklist (state = initialState, action) {
  switch (action.type) {
    case 'ADD_ITEM':
      return {
        ...state,
        tasks: [...state.tasks, action.value]
      }
    case 'GET_ITEM':
      return {
        ...state,
        tasks: action.value
      }
    default:
      return state
  }
}

export async function fetchTodos() {
  const response = await  getService('/', '/gettasks', '');
  //store.dispatch({ type: 'GET_ITEM', payload: response })
}

