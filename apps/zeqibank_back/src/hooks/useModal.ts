import { useCallback, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
    showModal,
    closeModal,
    setModalProps,
} from "../store/modalController";


function useModal(name: string){
    const dispatch = useAppDispatch();
    const modalController = useAppSelector((state) => state.modalController);

    const modal = (modalController[name]);

    const show = useCallback((props: any) => {
        dispatch(showModal({ name, props }));
    },[name,dispatch]);

    const close = useCallback(() => {
        dispatch(closeModal({ name }));
    },[name,dispatch]);

    const setProps = useCallback((props: any) => {
        dispatch(setModalProps({ name, props }));
    },[name,dispatch]);

    return useMemo(()=>{
        return { ...modal, show, close, setProps };
    },[modal,show,close,setProps]);

}

export default useModal;