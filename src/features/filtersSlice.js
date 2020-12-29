const initialState = {
  status: 'All',
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
    case 'filters/addColorFilter': {
      return {
        ...state,
        'colors': [
          ...state.colors,
          action.payload
        ]
      }
    }
    case 'filters/removeColorFilter': {
      state.colors.filter(color => {
        if (color != action.payload) {
          return color
        }
      })
    }
    default:
      return state
  }
}
