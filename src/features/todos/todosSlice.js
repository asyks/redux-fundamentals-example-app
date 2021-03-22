import { createSlice, createSelector, createAsyncThunk } from '@reduxjs/toolkit'
import { client } from '../../api/client'
import { StatusFilters } from '../filters/filtersSlice'

const initialState = {
  status: 'idle', // or: 'loading', 'succeeded', 'failed'
  entities: {},
}

/* Thunks */

export const fetchTodos = createAsyncThunk('todos/fetchTodos', async () => {
    const response = await client.get('/fakeApi/todos')
    return response.todos
})

export const saveNewTodo = createAsyncThunk('todos/saveNewTodo', async text => {
    const initialTodo = { text }
    const response = await client.post('/fakeApi/todos', {todo: initialTodo})
    return response.todo
})

export const todosSlice = createSlice({
    name: 'todos',
    initialState,
    reducers: {
      todoToggled(state, action) {
        const todoId = action.payload
        const todo = state.entities[todoId]
        todo.completed = !todo.completed
      },
      todoColorChanged: {
        reducer(state, action) {
          const { color, todoId } = action.payload
          state.entities[todoId].color = color
        },
        prepare(todoId, color) {
          return {
            payload: { todoId, color }
          }
        }
      },
      todoDeleted(state, action) {
        delete state.entities[action.payload]
      },
      todoCompleteAll(state) {
        Object.values(state.entities).forEach(todo => {
          state.entities[todo.id].completed = true
        })
      },
      todoClearCompleted(state) {
        Object.values(state.entities).forEach(todo => {
          if (todo.completed) {
            delete state.entities[todo.id]
          }
        })
      },
    },
    extraReducers: builder => {
      builder
        .addCase(fetchTodos.pending, (state) => {
          state.status = 'loading'
        })
        .addCase(fetchTodos.fulfilled, (state, action) => {
          const newTodos = action.payload
          newTodos.forEach(todo => {
            state.entities[todo.id] = todo
          })
          state.status = 'idle'
        })
        .addCase(saveNewTodo.fulfilled, (state, action) => {
          const todo = action.payload
          state.entities[todo.id] = todo
        })
    },
  }
)

/* Action creators */
export const {
  todoToggled,
  todoColorChanged,
  todoDeleted,
  todoCompleteAll,
  todoClearCompleted,
  todosLoading,
  todosLoaded,
} = todosSlice.actions

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
