import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './counter';
import drawerControllerReducer from './drawerController';
import modalControllerReducer from './modalController';

const store = configureStore({
    reducer: {
        counter: counterReducer,
        drawerController: drawerControllerReducer,
        modalController: modalControllerReducer
    }
});
// 从 store 本身推断 `RootState` 和 `AppDispatch` 类型
export type RootState = ReturnType<typeof store.getState>;
// 推断类型：{posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export default store;