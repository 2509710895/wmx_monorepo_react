import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../index";

// state 类型定义
interface ModalControllerState {
    // modal 名称
    [key: string]: any
}

// 将所有 modal 的状态存储在一个 state 对象中
const initialState: ModalControllerState = {
}

export const modalControllerSlice = createSlice({
    name: "modalController",
    initialState,
    reducers: {
        // 打开 modal
        showModal: (state, action) => {
            const { name, props } = action.payload
            console.log("wmx showModal", name, props);
            
            return { 
                ...state, 
                [name]: { ...state[name], ...props } 
            }
        },
        // 关闭 modal
        closeModal: (state, action) => {
            const { name } = action.payload
            return { 
                ...state, 
                [name]: { ...state[name], open: false } 
            }
        },
        // 设置开启的 modal 的 props
        setModalProps: (state, action) => {
            const { name, props } = action.payload
            return {
                ...state,
                [name]: { ...state[name], ...props }
            }
        }
    },
})

// 导出 action
export const { showModal, closeModal, setModalProps } = modalControllerSlice.actions
// 导出 selector
export const selectModalController = (state: RootState) => state.modalController
// 导出 reducer
export default modalControllerSlice.reducer