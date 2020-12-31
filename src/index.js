import store from './store'

// Log the initial state
console.log('initial.state : ', store.getState())

const unsubscribe = store.subscribe(() => {
  console.log('State after dispatch: ', store.getState())
})

store.dispatch({type: 'todos/todoAdded', payload: 'Learn about actions' })
store.dispatch({ type: 'todos/todoAdded', payload: 'Learn about reducers' })
store.dispatch({ type: 'todos/todoAdded', payload: 'Learn about stores' })

store.dispatch({ type: 'todos/todoToggled', payload: 0 })
store.dispatch({ type: 'todos/todoToggled', payload: 1 })

store.dispatch({ type: 'filters/statusFilterChanged', payload: 'Active' })

store.dispatch({
  type: 'filters/colorFilterChanged',
  payload: {color: 'red', changeType: 'selected'}
})

unsubscribe()

store.dispatch({ type: 'todos/todoAdded', payload: 'Try creating a store' })
