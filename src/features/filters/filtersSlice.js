export const StatusFilters = {
  All: 'all',
  Active: 'active',
  Completed: 'completed',
}

const initialState = {
  status: StatusFilters.All,
  colors: []
}

export default function filtersReducer(state = initialState, action) {
  switch (action.type) {
    case 'filters/statusFilterChanged': {
      return {
        ...state,
        status: action.payload
      }
    }
    case 'filters/colorFilterChanged': {
      const colors = new Set(...state.colors)
      if (action.payload.changeType === 'selected') {
        colors.add(action.payload.color)
      }
      else {
        colors.remove(action.payload.color)
      }
      return {
        ...state,
        colors: [...colors]
      }
    }
    default:
      return state
  }
}
