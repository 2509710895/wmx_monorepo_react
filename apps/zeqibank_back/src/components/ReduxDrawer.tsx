import { Drawer } from 'antd';
import React, { useEffect } from 'react';
import useDrawer from '../hooks/useDrawer';

export interface ReduxDrawerProps {
    open: boolean;
    id: string | number;
}

const ReduxDrawer: React.FC<{ name: string }> = (props) => {

    const {
        name
    } = props;


    const drawer = useDrawer<ReduxDrawerProps>(name);

    const { id, open, close } = drawer;


    useEffect(() => {
    }, [open]);

    return (
        <Drawer
            title={`产品详情`}
            placement="right"
            closable={false}
            width={720}
            open={open}
            destroyOnClose={true}
            onClose={() => {
                close();
            }}
        >
            redux drawer
            <div>id:{id}</div>
        </Drawer>
    );
};

export default React.memo(ReduxDrawer);