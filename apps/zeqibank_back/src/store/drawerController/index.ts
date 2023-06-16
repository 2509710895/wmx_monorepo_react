import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../index"
import { ReduxDrawerProps } from "../../components/ReduxDrawer"
import { ReduxUidDrawerProps } from "../../components/ReduxUidDrawer"

// drawer 需要状态控制的 props 类型
export type DrawerControllerProps = ReduxDrawerProps | ReduxUidDrawerProps | { open: boolean }

// state 类型定义，key 为 drawer 名称，value 为 drawer 的 props
interface DrawerControllerState {
    [key: string]: DrawerControllerProps
}

// 将所有 drawer 的状态存储在一个 state 对象中 
const initialState: DrawerControllerState = {
}

export const drawerControllerSlice = createSlice({
    name: "drawerController",
    initialState,
    reducers: {
        // 打开 drawer
        showDrawer: (state, action: PayloadAction<{ name: string, props: DrawerControllerProps }>) => {
            const { name, props } = action.payload
            return { 
                ...state, 
                [name]: { ...state[name], ...props } 
            }
        },
        // 关闭 drawer
        closeDrawer: (state, action: PayloadAction<{ name: string }>) => {
            const { name } = action.payload
            return { 
                ...state, 
                [name]: { ...state[name], open: false } 
            }
        },
        // 设置开启的 drawer 的 props
        setDrawerProps: (state, action: PayloadAction<{ name: string, props: DrawerControllerProps }>) => {
            const { name, props } = action.payload
            return { 
                ...state, 
                [name]: { ...state[name], ...props } 
            }
        }
    },
})

// 导出 action
export const { showDrawer, closeDrawer, setDrawerProps } = drawerControllerSlice.actions
// 导出 selector
export const selectDrawerController = (state: RootState) => state.drawerController
// 导出 reducer
export default drawerControllerSlice.reducer