import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
    showDrawer,
    closeDrawer,
    setDrawerProps,
    DrawerControllerProps,
} from "../store/drawerController";
import { useCallback, useMemo } from "react";

function useDrawer<T extends DrawerControllerProps>(name: string) {
    // 获取 dispatch 方法
    const dispatch = useAppDispatch();

    // 从 store 中获取 drawerController 的 state
    const drawerController = useAppSelector((state) => state.drawerController);
    // 从 state 中获取指定 drawer 的 props
    const drawer = (drawerController[name] as T);

    // 定义 showDrawer、closeDrawer、setDrawerProps 方法
    const show = useCallback((props: T) => {
        dispatch(showDrawer({ name, props }));
    },[name,dispatch]);

    const close = useCallback(() => {
        dispatch(closeDrawer({ name }));
    },[name,dispatch]);

    const setProps = useCallback((props: T) => {
        dispatch(setDrawerProps({ name, props }));
    },[name,dispatch]);

    // 返回该 drawer 的 props 和控制方法
    return useMemo(()=>{
        return { ...drawer, show, close, setProps };
    },[drawer,show,close,setProps]);
}

export default useDrawer;