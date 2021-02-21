import { createSelector } from "reselect"

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
      let { color, changeType } = action.payload
      const colors = state.colors
      switch (changeType) {
        case 'added': {
          if (colors.includes(color)) {
            return state
          }

          return {
            ...state,
            colors: state.colors.concat(color),
          }
        }
        case 'removed': {
          return {
            ...state,
            colors: colors.filter(existingColor => existingColor !== color),
          }
        }
        default:
          return state
      }
    }
    default:
      return state
  }
}

/* Action creators */

export const colorFilterchanged = (color, changeType) => (
  { type: 'filters/colorFilterChanged', payload: { color, changeType } }
)

/* Selectors */

export const selectFiltersColorsValue = state => state.filters.colors

export const selectFiltersStatusValue = state => state.filters.status

export const selectFiltersColors = createSelector(
  selectFiltersColorsValue,
  colors => colors
)

export const selectFiltersStatus = createSelector(
  selectFiltersStatusValue,
  status => status
)
