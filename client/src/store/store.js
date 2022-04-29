import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import { authReducer } from './reducers/authReducers';
import { groupReducer } from './reducers/groupReducer';
import { messageNotificationPush } from './reducers/messageNotificationReducer';
import { messageReducer } from './reducers/messageReducer';
import { selectedChatReducer } from './reducers/selectedChatReducer';
import { socketReducer } from './reducers/socketReducer';
import { themeReducer } from './reducers/ThemeReducer';
import { composeWithDevTools } from 'redux-devtools-extension';
const rootReducer = combineReducers({
    theme: themeReducer,
    auth: authReducer,
    selectedChat: selectedChatReducer,
    groupData: groupReducer,
    groupMessage: messageReducer,
    socketFunc: socketReducer,
    notification: messageNotificationPush,
});
const middleware = [thunk];
const store = createStore(rootReducer, compose(
    applyMiddleware(...middleware),
    // composeWithDevTools()
))
export default store;