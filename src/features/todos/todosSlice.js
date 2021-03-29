import {
  createSlice,
  createSelector,
  createAsyncThunk,
  createEntityAdapter
} from '@reduxjs/toolkit'
import { client } from '../../api/client'
import { StatusFilters } from '../filters/filtersSlice'

const todosAdapter = createEntityAdapter()


const initialState = todosAdapter.getInitialState({
  status: 'idle', // or: 'loading', 'succeeded', 'failed'
})

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
      // Use an adapter reducer function to remove a todo by ID
      todoDeleted: todosAdapter.removeOne,
      todoCompleteAll(state) {
        Object.values(state.entities).forEach(todo => {
          state.entities[todo.id].completed = true
        })
      },
      todoClearCompleted(state) {
        const completedIds = Object.values(state.entities)
        .filter(todo => todo.completed)
        .map(todo => todo.id)
        // Use an adapter function as a "mutating" update helper
        todosAdapter.removeMany(state, completedIds)
      },
    },
    extraReducers: builder => {
      builder
        .addCase(fetchTodos.pending, (state) => {
          state.status = 'loading'
        })
        .addCase(fetchTodos.fulfilled, (state, action) => {
          // Use adapter function inside a reducer to add initial todos
          todosAdapter.setAll(state, action.payload)
          state.status = 'idle'
        })
        // Use another adapter function as a reducer to add a todo
        .addCase(saveNewTodo.fulfilled, todosAdapter.addOne)
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

export const {
  selectAll: selectTodos,
  selectById: selectTodoById,
} = todosAdapter.getSelectors(state => state.todos)

export const selectTodosStatusValue = state => state.todos.status

export const selectTodosEntities = state => state.todos.entities

export const selectTodosStatus = createSelector(
  selectTodosStatusValue,
  status => status
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

export default todosSlice.reducer
