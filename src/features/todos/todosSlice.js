import { createSelector } from 'reselect'
import { client } from '../../api/client'
import { StatusFilters } from '../filters/filtersSlice'

const initialState = []

export default function todosReducer(state = initialState, action) {
  switch (action.type) {
    case 'todos/todoAdded': {
      return [...state, action.payload]
    }
    case 'todos/todoToggled': {
      return state.map(todo => {
        console.log(todo, action.payload)
        if (todo.id !== action.payload) {
          return todo
        }

        return {
          ...todo,
          completed: !todo.completed
        }
      })
    }
    case 'todos/todoColorChange': {
      return state.map(todo => {
        if (todo.id !== action.payload.id) {
          return todo
        }

        return {
          ...todo,
          color: action.payload.color
        }
      })
    }
    case 'todos/todoDelete': {
      return state.filter(todo => todo.id !== action.payload)
    }
    case 'todos/todoCompleteAll': {
      return state.map(todo => {
        return {
          ...todo,
          completed: true
        }
      })
    }
    case 'todos/todoClearCompleted': {
      return state.filter(todo => !todo.completed)
    }
    case 'todos/todosLoaded': {
      return action.payload
    }
    default:
      return state
  }
}

export const todosLoaded = todos => ({ type: 'todos/todosLoaded', payload: todos })

export const todosAdded = todo => ({ type: 'todos/todoAdded', payload: todo })

export const fetchTodos = () => {
  return async dispatch => {
    const response = await client.get('/fakeApi/todos')
    dispatch(todosLoaded(response.todos))
  }
}

export const saveNewTodo = text => {
  return  async dispatch => {
    const initialTodo = { text }
    const response = await client.post('/fakeApi/todos', {todo: initialTodo})
    dispatch(todosAdded(response.todo))
  }
}

export const selectTodoIds = createSelector(
  state => state.todos,
  todos => todos.map(todo => todo.id),
)

export const selectTodosIdsPlain = state => state.todos.map(todo => todo.id)

export const selectFilteredTodos = createSelector(
  state => state.todos,
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

export const selectTodoById = (state, todoId) => {
  return state.todos.find(todo => todo.id === todoId)
}
