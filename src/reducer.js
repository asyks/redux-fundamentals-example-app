import { combineReducers } from 'redux'

import filtersReducer from './features/filtersSlice'
import todosReducer from './features/todosSlice'

const rootReducer = combineReducers({
  todos: todosReducer,
  filters: filtersReducer,
})

export default rootReducer
