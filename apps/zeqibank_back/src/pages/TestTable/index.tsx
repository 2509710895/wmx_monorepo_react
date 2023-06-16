import { Table } from "antd";
import { useEffect, useMemo, useState } from "react";
import { ReduxDrawerProps } from "../../components/ReduxDrawer";
import useDrawer from "../../hooks/useDrawer";
import useTableColumns from "../../components/TableBuilder";
import axios from "axios";

const TestTable = () => {

    const [dataSource, setDataSource] = useState<any>([]);
    const [tableColumns, setTableColumns] = useState<any>([]);
    const [tableLoading, setTableLoading] = useState<boolean>(false);

    // 获取 drawer 的状态及操作方法 只需要 show 方法
    const reduxDrawer = useDrawer<ReduxDrawerProps>('redux-drawer');

    const columnsDeps = useMemo(() => {
        return {
            productName: {
                drawer:reduxDrawer,
            },
            buyed: {},
        };
    }, [reduxDrawer]);

    const columns = useTableColumns(tableColumns, columnsDeps);

    useEffect(() => {
        setTableLoading(true);
        Promise.all([
            axios.get('/api/getTableColumns'),
            axios.get('/api/getTableData'),
        ]).then((res) => {
            setTableColumns(res[0].data.data);
            setDataSource(res[1].data.data);
            setTableLoading(false);
        });
    }, []);

    return (
        <div>
            <Table
                loading={tableLoading}
                columns={columns}
                dataSource={dataSource}
                rowKey={(record) => record.id}
            />
        </div>
    )
}

export default TestTable;