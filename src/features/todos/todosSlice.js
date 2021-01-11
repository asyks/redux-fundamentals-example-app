const initialState = []

function nextTodoId(todos = []) {
  const maxId = todos.reduce((maxId, todo) => Math.max(todo.id, maxId), -1)
  return maxId + 1
}

export default function todosReducer(state = initialState, action) {
  switch (action.type) {
    case 'todos/todoAdded': {
      return [
        ...state,
        {
          id: nextTodoId(state),
          text: action.payload,
          completed: false
        }
      ]
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
    default:
      return state
  }
}
