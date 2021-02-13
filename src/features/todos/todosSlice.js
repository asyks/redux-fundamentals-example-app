import { createSelector } from 'reselect'
import { client } from '../../api/client'
import { StatusFilters } from '../filters/filtersSlice'

const initialState = {
  status: 'idle', // or: 'loading', 'succeeded', 'failed'
  entities: {},
}

export default function todosReducer(state = initialState, action) {
  switch (action.type) {
    case 'todos/todoAdded': {
      const todo = action.payload
      return {
        ...state,
        entities: {...state.entities, [todo.id]: todo},
      }
    }
    case 'todos/todoToggled': {
      const todoId = action.payload
      const todo = state.entities[todoId]
      return {
        ...state,
        entities: {
          ...state.entities,
          todoId: {
            ...todo,
            completed: !todo.completed
          },
        }
      }
    }
    case 'todos/todoColorChange': {
      const { color, todoId } = action.payload
      const todo = state.entities[todoId]
      return {
        ...state,
        entities: {
          ...state.entities,
          todoId: {
            ...todo,
            color: color
          }
        }
      }
    }
    case 'todos/todoDelete': {
      const newEntities = {...state.entities}
      delete newEntities[action.payload]
      return {
        ...state,
        entities: newEntities
      }
    }
    case 'todos/todoCompleteAll': {
      const newEntities = {...state.entities}
      Object.values(newEntities).forEach(todo => {
        newEntities[todo.id] = {
          ...todo,
          completed: true
        }
      })
      return {
        ...state,
        entities: newEntities
      }
    }
    case 'todos/todoClearCompleted': {
      const newEntities = {...state.entities}
      Object.values(newEntities).forEach(todo => {
        if (todo.completed) {
          delete newEntities[todo.id]
        }
      })
      return {
        ...state,
        entities: newEntities
      }
    }
    case 'todos/todosLoading': {
      return {
        ...state,
        status: 'loading',
      }
    }
    case 'todos/todosLoaded': {
      const newEntities = {}
      action.payload.forEach(todo => {
        newEntities[todo.id] = todo
      })
      return {
        ...state,
        status: 'idle',
        entities: newEntities
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
