import { createStore, applyMiddleware } from 'redux'
import rootReducer from './reducer'
import { alwaysReturnHelloMiddleware } from './exampleAddons/middleware'

const middlewareEnhancer = applyMiddleware(alwaysReturnHelloMiddleware)
const store = createStore(rootReducer, undefined, middlewareEnhancer)
export default store
