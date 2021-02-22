import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { ReactComponent as TimesSolid } from './times-solid.svg'

import { availableColors, capitalize } from '../filters/colors'
import {selectTodoById, todoColorChanged, todoDeleted, todoToggled} from './todosSlice'

const TodoListItem = ({ id }) => {
  const todo = useSelector(selectTodoById(id))
  const { text, completed, color } = todo

  const dispatch = useDispatch()

  const handleDelete = () => {
    dispatch(todoDeleted(id))
  }

  const handleCompletedChanged = () => {
    dispatch(todoToggled(id))
  }

  const handleColorChanged = (e) => {
    dispatch(todoColorChanged(id, e.target.value))
  }

  const colorOptions = availableColors.map((c) => (
    <option key={c} value={c}>
      {capitalize(c)}
    </option>
  ))

  return (
    <li>
      <div className="view">
        <div className="segment label">
          <input
            className="toggle"
            type="checkbox"
            checked={completed}
            onChange={handleCompletedChanged}
          />
          <div className="todo-text">{text}</div>
        </div>
        <div className="segment buttons">
          <select
            className="colorPicker"
            value={color}
            style={{ color }}
            onChange={handleColorChanged}
          >
            <option value=""></option>
            {colorOptions}
          </select>
          <button className="destroy" onClick={handleDelete}>
            <TimesSolid />
          </button>
        </div>
      </div>
    </li>
  )
}

export default TodoListItem
