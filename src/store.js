import { createStore, applyMiddleware } from 'redux'
import rootReducer from './reducer'
import { composeWithDevTools } from 'redux-devtools-extension'
import { delayedMessageMiddleware } from './exampleAddons/middleware'

const composedEnhancer = composeWithDevTools (
  applyMiddleware(delayedMessageMiddleware)
)

const store = createStore(rootReducer, undefined, composedEnhancer)
export default store
