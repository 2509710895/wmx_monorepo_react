import * as echarts from 'echarts';
import { useEffect, useRef } from 'react';

const DragLineChart = () => {

    const divRef = useRef<HTMLDivElement>(null);

    var symbolSize = 20;
    var data = [
        [15, 0],
        [-50, 10],
        [-56.5, 20],
        [-46.5, 30],
        [-22.1, 40]
    ];
    
    useEffect(() => {
        const myChart = echarts.init(divRef.current!);

        myChart.setOption({
            tooltip: {
                triggerOn: 'none',
                formatter: function (params: { data: number[]; }) {
                    return (
                        'X: ' +
                        params.data[0].toFixed(2) +
                        '<br />Y: ' +
                        params.data[1].toFixed(2)
                    );
                }
            },
            xAxis: { min: -100, max: 80, type: 'value', axisLine: { onZero: false } },
            yAxis: { min: -30, max: 60, type: 'value', axisLine: { onZero: false } },
            series: [
                { id: 'a', type: 'line', smooth: true, symbolSize: symbolSize, data: data }
            ]
        });
        myChart.setOption({
            graphic: echarts.util.map(data, function (item, dataIndex: any) {
                return {
                    type: 'circle',
                    position: myChart.convertToPixel('grid', item),
                    shape: { r: symbolSize / 2 },
                    invisible: true,
                    draggable: true,
                    ondrag: echarts.util.curry(onPointDragging, dataIndex),
                    onmousemove: echarts.util.curry(showTooltip, dataIndex),
                    onmouseout: echarts.util.curry(hideTooltip, dataIndex),
                    z: 100
                };
            })
        });
        window.addEventListener('resize', function () {
            myChart.setOption({
                graphic: echarts.util.map(data, function (item, dataIndex) {
                    return { position: myChart.convertToPixel('grid', item) };
                })
            });
        });
        function showTooltip(dataIndex: number) {
            myChart.dispatchAction({
                type: 'showTip',
                seriesIndex: 0,
                dataIndex: dataIndex
            });
        }
        function hideTooltip(dataIndex: number) {
            myChart.dispatchAction({ type: 'hideTip' });
        }
        function onPointDragging(this: any, dataIndex: number, dx: number, dy: number) {
            data[dataIndex] = ((myChart.convertFromPixel('grid', this.position) as unknown) as number[]);
            myChart.setOption({
                series: [
                    {
                        id: 'a',
                        data: data
                    }
                ]
            });
        }
        return () => {
            myChart.dispose();
        }
    },[])

    return (
        <div style={{
            width: '600px',
            height: '300px',
        }} ref={divRef}></div>
    )
};

export default DragLineChart;