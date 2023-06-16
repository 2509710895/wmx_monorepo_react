import { FC, ReactNode, useRef } from 'react';
import dayjs from 'dayjs';
import './index.less';

const Workcalendar:FC = () => {

    const columns = [
        {
            title: '用户',
            dataIndex: 'user',
            key: 'user',
            width: 80,
            height: 20,
            fixed: 'left',
        },
        {
            title: '2023.05.01',
            date: '2023-05-01',
            dataIndex: 'sun',
            key: 'sun',
            width: 80,
            height: 20,
        },
        {
            title: '2023.05.02',
            date: '2023-05-02',
            dataIndex: 'mon',
            key: 'mon',
            width: 80,
            height: 20,
        },
        {
            title: '2023.05.03',
            date: '2023-05-03',
            dataIndex: 'tue',
            key: 'tue',
            width: 80,
            height: 20,
        },
        {
            title: '2023.05.04',
            date: '2023-05-04',
            dataIndex: 'wed',
            key: 'wed',
            width: 80,
            height: 20,
        },
        {
            title: '2023.05.05',
            date: '2023-05-05',
            dataIndex: 'thu',
            key: 'thu',
            width: 80,
            height: 20,
        },
        {
            title: '2023.05.06',
            date: '2023-05-06',
            dataIndex: 'fri',
            key: 'fri',
            width: 80,
            height: 20,
        },
        {
            title: '2023.05.07',
            date: '2023-05-07',
            dataIndex: 'sat',
            key: 'sat',
            width: 80,
            height: 20,
        }
    ]

    const data:{[key:string]:any}[] = [
        {
            id: 1,
            user: 'wmx',
            calendar:[
                {title: '任务一', startTime: '2023-05-01', endTime: '2023-05-01'},
            ]
        },
        {
            id: 2,
            user: 'gwj',
            calendar:[
                {title: '任务三', startTime: '2023-05-03', endTime: '2023-05-03'},
            ]
        },
        {
            id: 3,
            user: 'lsp',
            calendar:[
                {title: '任务二', startTime: '2023-05-02', endTime: '2023-05-02'},
            ]
        }
    ]
    const userColumns = columns.filter(item => item.fixed);
    const dayColumns = columns.filter(item => item.date);

    // 拖拽开始时，鼠标的位置
    let startX = 0;
    let startY = 0;

    // 拖拽开始时，滚动的位置
    let startLeft = 0;
    let startTop = 0;
    // 容器DOM
    const containerRef = useRef<HTMLDivElement>(null);
    // 格子的宽度和高度
    const cellWidth = 200;
    const cellHeight = 70;
    // 任务条的宽度为所占格子的总宽度 - 20
    const barWidth = cellWidth * 1 - 20;
    const barHeight = 30;

    // 距离左上的距离 top:35,left:10
    const cellTop = cellHeight / 2;
    const cellLeft = 10; 
    // 任务条间隔为 5px
    const barMargin = 5;

    const baseDate = dayColumns[0].date;

    const renderItem = ()=>{
        let baseTop = 0;
        // let baseLeft = 0;

        // 左边固定列头 和 内容 宽度不限 高度与右边内容一致


        const items:ReactNode[] = data.reduce((pre:ReactNode[], cur) => {
            // 遍历每个用户的日程
            // 找出当前行中任务最多的一天，取其高度 基础高度为 fix 列的格子的高度暂定为 70
            let rowHeight = cellHeight;
            const dateTasks:{ [key:string]:number } = {}
            dayColumns.forEach(column => {
                const { date } = column;
                dateTasks[(date as string)] = 0;
            })
            // 遍历每个任务
            const eles = cur.calendar.map((calendar: { title: any; startTime: any; endTime: any; }) => {
                const { title, startTime, endTime } = calendar;

                // 循环每个任务的开始时间和结束时间，在对应的日期+1 30px
                let day=dayjs(startTime).isBefore(dayjs(baseDate)) ? dayjs(baseDate) : dayjs(startTime)
                // 距离基准天的天数 * cellWidth + cellLeft
                const left = day.diff(dayjs(baseDate), 'day') * cellWidth + cellLeft;
                const width = barWidth * (dayjs(endTime).diff(day, 'day') + 1); 
                let end=dayjs(endTime).set('hour', 23).set('minute', 59).set('second', 59)
                let tasksNum = 0;
                for(; day.isBefore(end); day=day.add(1, 'day')){
                    let date = day.format('YYYY-MM-DD');
                    dateTasks[date] += 1;
                    if(dateTasks[date] > tasksNum){
                        tasksNum = dateTasks[date];
                    }
                }

                const top = baseTop + cellTop + (tasksNum - 1) * (barHeight + barMargin);                
                return (
                    <div
                        className='calendar-bar-item'
                        style={{
                            width: `${width}px`,
                            height: `${barHeight}px`,
                            left: `${left}px`,
                            top: `${top}px`,
                            // backgroundColor: 'red',
                        }}
                        draggable={true}
                        onDragStart={(e) => {
                            // 拖动开始前，设置透明度
                            console.log("start", e);
                            const target = e.target as HTMLElement;
                            target.style.opacity = '0.1';

                            const { clientX, clientY } = e;
                            startX = clientX;
                            startY = clientY;

                            const { scrollLeft, scrollTop } = containerRef.current!;
                            startLeft = scrollLeft;
                            startTop = scrollTop;
                        }}
                        onDragEnd={(e) => {
                            // 拖动结束时，判断操作是否正常：日程条的 全部 是否进入该行
                            // 不是不做处理
                            // 是则改变 state 从而重新渲染
                            console.log("end", e);
                            const target = e.target as HTMLElement;
                            target.style.opacity = '1';

                            const { clientX, clientY } = e;
                            const { offsetLeft, offsetTop } = target;
                            const { scrollLeft, scrollTop } = containerRef.current!;

                            const moveX = clientX - startX + scrollLeft - startLeft;
                            const moveY = clientY - startY + scrollTop - startTop;

                            target.style.left = `${offsetLeft + moveX}px`;
                            target.style.top = `${offsetTop + moveY}px`;
                        }}
                    >
                        <div className='left-resize'
                            style={{
                                height: '100%',
                                width: '5px',
                                backgroundColor: 'pink',
                            }}
                            onMouseDown={(e) => {
                                // 左边的拖动需要考虑到 position
                                const target = e.target as HTMLElement;
                                const parent = target.parentNode as HTMLElement;
                                if (!parent) return
                                console.log("left down", e, parent.clientWidth);
                                e.preventDefault();
                                const clientX = e.clientX;
                                const originWidth = parent.clientWidth;
                                const originLeft = parent.offsetLeft;
                                document.onmousemove = (e) => {
                                    const moveX = e.clientX - clientX;
                                    const left = originLeft + moveX;
                                    const width = originWidth - moveX;
                                    parent.style.left = left + 'px';
                                    parent.style.width = width + 'px';
                                    // console.log("left move", e);
                                }
                                document.onmouseup = (e) => {
                                    console.log("left up", e);
                                    e.preventDefault();
                                    document.onmousemove = null;
                                }
                            }}
                        >
                        </div>
                        <div className='right-resize'
                            style={{
                                height: '100%',
                                width: '5px',
                                backgroundColor: 'pink',
                            }}
                            onMouseDown={(e) => {
                                // 右边的拖动逻辑不牵涉 position
                                const target = e.target as HTMLElement;
                                const parent = target.parentNode as HTMLElement;
                                if (!parent) return
                                console.log("right down", e, parent.clientWidth);
                                e.preventDefault();
                                const clientX = e.clientX;
                                const originWidth = parent.clientWidth;
                                document.onmousemove = (e) => {
                                    const moveX = e.clientX - clientX;
                                    const width = originWidth + moveX;
                                    parent.style.width = width + 'px';
                                    // console.log("right move",e);
                                }
                                document.onmouseup = (e) => {
                                    console.log("right up", e);
                                    e.preventDefault();
                                    document.onmousemove = null;
                                }
                            }}
                        >
                        </div>
                        <div
                            style={{
                                width: '100%',
                                height: '100%',
                                backgroundColor: 'red',
                            }}
                        >{title}</div>
                    </div>
                )
            })
            const max = Math.max(...Object.values(dateTasks));
            max && (rowHeight = rowHeight + max * 30 + (max - 1) * barMargin);
            baseTop = baseTop + rowHeight ;
            return pre.concat(eles);
        },[] as ReactNode[])

        return items;
    }

    return (
        <div>
            <h1>Workcalendar</h1>
            <div className='work-calendar-content'
                ref={containerRef}
            >   
                <table>
                    <thead>
                        <tr>
                            <th className='border sticky' style={{
                                width: '31px',
                            }}>用户</th>
                            <th className='border' style={{
                                width: '31px',
                            }}>周一</th>
                            <th className='border'>周二</th>
                            <th className='border'>周三</th>
                            <th className='border'>周四</th>
                            <th className='border'>周五</th>
                            <th className='border'>周六</th>
                            <th className='border'>周日</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td  className='border sticky'>hhh</td>
                            <td  className='border'>1</td>
                            <td  className='border'>2</td>
                            <td  className='border'>
                                <div className='calendar-cell'
                                    style={{
                                        height: '100px',
                                        backgroundColor: 'pink',
                                    }}
                                >
                                </div>
                            </td>
                            <td  className='border'>4</td>
                            <td  className='border'>5</td>
                            <td  className='border'>6</td>
                            <td  className='border'>7</td>
                        </tr>
                    </tbody>
                </table>
                {/* <div className='calendar-right-content'
                    onMouseLeave={() => {
                        document.onmousemove = null;
                    }}
                > */}
                    {/* <div className='calendar-bar' style={{
                        top: `${25}px`,
                        left: `${40}px`,
                    }}
                    >
                        {
                            renderItem()
                        }
                    </div> */}
                {/* </div> */}
            </div>
        </div>
    );
};


export default Workcalendar;