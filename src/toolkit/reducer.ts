import { combineReducers } from "redux"
import { commonApi } from "./common.api"
// reducers
import commonReducer from "./common/common.slice"


const rootReducer = combineReducers({
  [commonApi.reducerPath]: commonApi.reducer,
  
  common: commonReducer,
})

export default rootReducer
