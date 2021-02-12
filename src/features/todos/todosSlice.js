import { createSelector } from 'reselect'
import { client } from '../../api/client'
import { StatusFilters } from '../filters/filtersSlice'

const initialState = {
  status: 'idle', // or: 'loading', 'succeeded', 'failed'
  entities: [],
}

export default function todosReducer(state = initialState, action) {
  switch (action.type) {
    case 'todos/todoAdded': {
      return {
        ...state,
        entities: [...state.entities, action.payload],
      }
    }
    case 'todos/todoToggled': {
      return {
        ...state,
        entities: state.entities.map(todo => {
          console.log(todo, action.payload)
          if (todo.id !== action.payload) {
            return todo
          }

          return {
            ...todo,
            completed: !todo.completed
          }
        }),
      }
    }
    case 'todos/todoColorChange': {
      return {
        ...state,
        entities: state.entities.map(todo => {
          if (todo.id !== action.payload.id) {
            return todo
          }

          return {
            ...todo,
            color: action.payload.color
          }
        }),
      }
    }
    case 'todos/todoDelete': {
      return {
        ...state,
        entities: state.entities.filter(todo => todo.id !== action.payload),
      }
    }
    case 'todos/todoCompleteAll': {
      return {
        ...state,
        entities: state.entities.map(todo => {
          return {
            ...todo,
            completed: true
          }
        }),
      }
    }
    case 'todos/todoClearCompleted': {
      return {
        ...state,
        entities: state.entities.filter(todo => !todo.completed),
      }
    }
    case 'todos/todosLoading': {
      return {
        ...state,
        status: 'loading',
      }
    }
    case 'todos/todosLoaded': {
      return {
        ...state,
        status: 'idle',
        entities: action.payload,
      }
    }
    default:
      return state
  }
}

export const todosLoading = () => ({ type: 'todos/todosLoading' })

export const todosLoaded = todos => ({ type: 'todos/todosLoaded', payload: todos })

export const todoAdded = todo => ({ type: 'todos/todoAdded', payload: todo })

export const fetchTodos = () => {
  return async dispatch => {
    dispatch(todosLoading())
    const response = await client.get('/fakeApi/todos')
    dispatch(todosLoaded(response.todos))
  }
}

export const saveNewTodo = text => {
  return  async dispatch => {
    const initialTodo = { text }
    const response = await client.post('/fakeApi/todos', {todo: initialTodo})
    dispatch(todoAdded(response.todo))
  }
}

export const selectTodos = state => state.todos.entities

export const selectTodoById = (state, todoId) => {
  return selectTodos(state).find(todo => todo.id === todoId)
}

export const selectTodoIds = createSelector(
  selectTodos,
  todos => todos.map(todo => todo.id),
)

export const selectFilteredTodos = createSelector(
  selectTodos,
  state => state.filters,
  (todos, filters) => {
    const { status, colors } = filters

    const showAllCompletions = status === StatusFilters.All
    const showAllColors = colors.length === 0

    if (showAllCompletions && showAllColors) {
      return todos
    }

    const completedStatus = status === StatusFilters.Completed

    return todos.filter(todo => {
      const statusMatches = showAllCompletions || todo.completed === completedStatus
      const colorMatches = showAllColors || colors.includes(todo.color)
      return statusMatches && colorMatches
    })
  }
)

export const selectFilteredTodoIds = createSelector(
  selectFilteredTodos,
  filteredTodos => filteredTodos.map(todo => todo.id),
)
