import { Drawer } from 'antd';
import { FC, memo, useEffect } from 'react';
import useDrawer from '../../hooks/useDrawer';

export interface ProductDetailDrawerProps {
    open: boolean;
    product_id: number;
}

const ProductDetailDrawer: FC<{ name: string }> = (props) => {

    const {
        name
    } = props;


    const drawer = useDrawer<ProductDetailDrawerProps>(name);

    const { 
        product_id,
        open, 
        close 
    } = drawer;


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
            ProductDetailDrawer
            <div>product_id:{product_id}</div>
        </Drawer>
    );
};

export default memo(ProductDetailDrawer);