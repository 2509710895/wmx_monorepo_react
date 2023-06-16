import { FC, useMemo } from "react";
import useTableColumns from "../../components/TableBuilder";
import { Table } from "antd";
import useDrawer from "../../hooks/useDrawer";
import { ProductDetailDrawerProps } from "../../components/ProductDetailDrawer";

const ProductList: FC = () => {

    const tableColumns = [
        {
            title: '产品名称',
            dataIndex: 'productName',
            key: 'productName',
            cell:'productName'
        },
        {
            title: '预计收益率',
            dataIndex: 'yieldRate',
            key: 'yieldRate',
            cell:'yieldRate'
        },
        {
            title: '生效时间',
            dataIndex: 'effectTime',
            key: 'effectTime',
        },
        {
            title: '存款期限/天',
            dataIndex: 'period',
            key: 'period',
            cell:'period'
        }
    ];

    const dataSource = [
        {
            product_id: 1,
            productName: '定期存款',
            yieldRate: '0.05',
            effectTime: '2021-01-01',
            period: '30',
            periodUnit: '天',
            buyed: 100,
            amount: 1000,
        },
        {
            product_id: 2,
            productName: '定期存款',
            yieldRate: '0.05',
            effectTime: '2021-01-01',
            period: '30',
            periodUnit: '天',
            buyed: 100,
            amount: 1000,
        },
        {
            product_id: 3,
            productName: '定期存款',
            yieldRate: '0.05',
            effectTime: '2021-01-01',
            period: '30',
            periodUnit: '天',
            buyed: 100,
            amount: 1000,
        },
    ];

    const drawer = useDrawer<ProductDetailDrawerProps>('product-detail-drawer');

    const columnsDeps = useMemo(() => {
        return {
            productName: {
                drawer,
            },
            buyed: {},
        };
    }, [drawer]);

    const columns = useTableColumns(tableColumns, columnsDeps);



    return (
        <div>
            <h1>ProductList</h1>
            <Table
                columns={columns}
                dataSource={dataSource}
                rowKey="product_id"
            />
        </div>
    );
};

export default ProductList;