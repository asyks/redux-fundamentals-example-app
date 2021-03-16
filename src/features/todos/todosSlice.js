import { createSlice, createSelector } from '@reduxjs/toolkit'
import { client } from '../../api/client'
import { StatusFilters } from '../filters/filtersSlice'

const initialState = {
  status: 'idle', // or: 'loading', 'succeeded', 'failed'
  entities: {},
}

export const todosSlice = createSlice({
    name: 'todos',
    initialState,
    reducers: {
      todoAdded(state, action) {
        const todo = action.payload
        state.entities[todo.id] = todo
      },
      todoToggled(state, action) {
        const todoId = action.payload
        const todo = state.entities[todoId]
        todo.completed = !todo.completed
      },
      todoColorChanged(state, action) {
        const { color, todoId } = action.payload
        const todo = state.entities[todoId]
        return {
          ...state,
          entities: {
            ...state.entities,
            [todoId]: {
              ...todo,
              color: color
            },
          }
        }
      },
      todoDeleted(state, action) {
        const newEntities = {...state.entities}
        delete newEntities[action.payload]
        return {
          ...state,
          entities: newEntities
        }
      },
      todoCompleteAll(state, action) {
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
      },
      todoClearCompleted(state, action) {
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
      },
      todosLoading(state, action) {
        return {
          ...state,
          status: 'loading',
        }
      },
      todosLoaded(state, action) {
        const newEntities = {}
        action.payload.forEach(todo => {
          newEntities[todo.id] = todo
        })
        return {
          ...state,
          status: 'idle',
          entities: newEntities
        }
      },
    }
  }
)
/* Action creators */
export const { todoAdded, todoToggled } = todosSlice.actions

export const todosLoading = () => ({ type: 'todos/todosLoading' })

export const todoCompleteAll = () => ({type: 'todos/todoCompleteAll'})

export const todoClearCompleted = () => ({type: 'todos/todoClearCompleted'})

export const todosLoaded = todos => ({ type: 'todos/todosLoaded', payload: todos })

export const todoDeleted = todoId => ({type: "todos/todoDeleted", payload: todoId })

export const todoColorChanged = (todoId, color) => ({type: "todos/todoColorChanged", payload: {todoId, color }})

/* Thunks */

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

/* Selectors */

export const selectTodosStatusValue = state => state.todos.status

export const selectTodosEntities = state => state.todos.entities

export const selectTodoByIdValue = todoId => {
  return (state) => {
    return selectTodosEntities(state)[todoId]
  }
}

export const selectTodosStatus = createSelector(
  selectTodosStatusValue,
  status => status
)

export const selectTodos = createSelector(
  selectTodosEntities,
  entities => Object.values(entities)
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

export const selectTodosRemainingCount = createSelector(
  selectTodos,
  todos => {
    let uncompletedTasks = 0
    todos.forEach(todos => {
      if (!todos.compeleted) uncompletedTasks++
    })
    return uncompletedTasks
  }
)

export const selectFilteredTodoIds = createSelector(
  selectFilteredTodos,
  filteredTodos => filteredTodos.map(todo => todo.id),
)

export const selectTodoById = todoId => {
  return createSelector(
    selectTodoByIdValue(todoId),
    todo => todo
  )
}

export default todosSlice.reducer
