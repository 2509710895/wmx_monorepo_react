import { Button } from "antd";
import useDrawer from "../../hooks/useDrawer";
import { ReduxDrawerProps } from "../../components/ReduxDrawer";
import { ReduxUidDrawerProps } from "../../components/ReduxUidDrawer";

const TestDrawer = () => {

    // 获取 drawer 的状态及操作方法 只需要 show 方法
    const reduxDrawer = useDrawer<ReduxDrawerProps>('redux-drawer');
    const reduxUidDrawer = useDrawer<ReduxUidDrawerProps>('redux-uid-drawer');
    const reduxDrawer2 = useDrawer<ReduxDrawerProps>('redux-drawer-2');

    return (
        <div>
            {/* 使用暴露出来的操作方法 打开对应的抽屉 */}
            <Button onClick={() => reduxDrawer.show({ open: true, id: 1 })}>打开 ReduxDrawer</Button>
            <Button onClick={() => reduxUidDrawer.show({ open: true, uid: 2 })}>打开 ReduxUidDrawer</Button>
            <Button onClick={() => reduxDrawer2.show({ open: true, id: 3 })}>打开 ReduxDrawer2</Button>
        </div>
    )
}

export default TestDrawer;