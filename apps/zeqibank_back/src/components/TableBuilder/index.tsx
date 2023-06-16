import { useMemo } from "react";
import { LinkCell, TextCell } from "../TableCells";

/* 封装表格
    应该增加表格的能力
    1. 表格的列应该可以配置 展示或不展示
    2. 表格的列应该可以根据权限进行 无法看到或能看到 显示隐藏
    3. 进行排序
    4. 进行筛选

*/

/* 表格操作列
    查看详情 点击名称出现详情抽屉或跳转到详情页

    1. 编辑 需要判断是否有编辑权限

    2. 删除 需要判断是否有删除权限 且需要二次确认
*/


export default function useTableColumns(tableColumns: any, deps: any) {

    const strategyRender = useMemo (() => {
        const strategy = {
            "productName": (text: any, record: any) => {
                if(!deps["productName"]) return (<TextCell value={text} />);
                const { drawer } = deps["productName"];
                const onClick = () => {
                    drawer.show({
                        open: true,
                        product_id: record.product_id,
                    });
                };
                return (
                    <LinkCell value={text} record={record} onClick={onClick} />
                )
            },
            "buyed": (_: any, record: any) => {
                return (
                    <TextCell value={`${record.buyed}/${record.amount}`} />
                )
            },
            "yieldRate": (text: any) => {
                text = (Number(text) * 100).toFixed(2);
                return (
                    <TextCell value={`${text}%`} />
                )
            },
            "period": (text: any, record: any) => {
                return (
                    <TextCell value={`${text}/${record.periodUnit}`} />
                )
            },
        }
        return strategy
    }, [deps]);


    const columns = useMemo(() => {
        const memoColums = tableColumns.map((item: any) => {
            if (item.cell) {
                const render = strategyRender[item.key as keyof typeof strategyRender];
                if (render) {
                    item.render = render;
                }
            }
            return item;
        });
        return memoColums
    }, [tableColumns, strategyRender]);

    return columns
}