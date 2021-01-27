import React from 'react'
import { useSelector, shallowEqual } from 'react-redux'

import TodoListItem from './TodoListItem'
import { selectTodoIds } from './todosSlice'

const TodoList = () => {
  const todos = useSelector(selectTodoIds, shallowEqual)

  const renderedListItems = todos.map((todoId) => {
    return <TodoListItem key={todoId} id={todoId} />
  })

  return <ul className="todo-list">{renderedListItems}</ul>
}

export default TodoList
