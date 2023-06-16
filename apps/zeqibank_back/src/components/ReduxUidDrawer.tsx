import { Button, Drawer } from 'antd';
import React, { useEffect } from 'react';
import useDrawer from '../hooks/useDrawer';
import { ReduxDrawerProps } from './ReduxDrawer';
import ReduxDrawer from './ReduxDrawer';

export interface ReduxUidDrawerProps {
    open: boolean;
    uid: string | number;
}

const ReduxUidDrawer: React.FC<{ name: string }> = (props) => {

    const {
        name
    } = props;

    const drawer = useDrawer<ReduxUidDrawerProps>(name);

    const { uid, open, close } = drawer;

    const reduxDrawer = useDrawer<ReduxDrawerProps>('redux-drawer');
    const reduxDrawer2 = useDrawer<ReduxDrawerProps>('redux-drawer-2');

    useEffect(() => {
    }, [open]);

    return (
        <Drawer
            title={`redux uid drawer`}
            placement="right"
            closable={false}
            width={720}
            open={open}
            destroyOnClose={true}
            onClose={() => {
                close();
            }}
        >   
            redux uid drawer
            <div>uid:{uid}</div>
            <Button onClick={() => {
                reduxDrawer.show({ open: true, id: 111 });
            }}>打开 reduxDrawer</Button>
            <Button onClick={() => {
                reduxDrawer2.show({ open: true, id: 222 });
            }}>打开 reduxDrawer2</Button>
            <ReduxDrawer name="redux-drawer-2" />
        </Drawer>
    );
};

export default React.memo(ReduxUidDrawer);