import { FC, ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import dayjs from 'dayjs';
import { cloneDeep } from 'lodash';
import { Button, Card, Modal, Switch, Tag, } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { classname } from '../../utils/classname';
import { isNotWorkDay } from './utils';
import AddModal from './addModal';
import useModal from '../../hooks/useModal';

import './index.less';
/*
    1. 任务条的改变日期
        超过一个格子的长度，就算占一个格子 ✅
        限定最小宽度 ✅
        限定最大宽度 ✅
    2. 任务条的拖拽 ✅
    3. 任务条的删除 ✅
        右键出现工具框，点击删除 
    4. 任务条的复制
        右键出现工具框，点击复制 
    5. 任务条的新增 ✅
        添加一个新增按钮，点击后弹出一个弹窗，选择用户编辑任务
    6. 未完全展示的任务条的 UI
        不做基本偏移，不可拖拽，不可改变日期 ✅
    7. 非工作日的隐藏 ✅
        非工作日： 节假日 或 周六、周日且不是调休日
    8. 编辑回溯 ✅
*/

interface UserColumnProps {
    title: string;
    dataIndex: string;
    key: string;
    fixed: string;
}

interface DayColumnProps {
    title: string;
    date: string;
    key: string;
}

type ColumnProps = UserColumnProps | DayColumnProps

type dateType = string | dayjs.Dayjs;

interface CalendarProps {
    taskId: string;
    title: string;
    start?: number;
    end?: number;
    pre?: number;
    isRealStart?: boolean;
    isRealEnd?: boolean;
    realDuration?: number;
    startTime: string;
    endTime: string;
}

interface CalendarDataProps {
    id: string;
    user: string;
    calendars: CalendarProps[];
}

interface WorkcalendarProps {
    columns: ColumnProps[];
    data: CalendarDataProps[];
    changeData: (data: CalendarDataProps[]) => void;
    renderItem?: (item: CalendarProps & {isRealStart:boolean,isRealEnd:boolean}) => ReactNode;
    dayRender?: (item: DayColumnProps) => ReactNode;
}

const getDateGap = (start: dateType, end: dateType, hideNotWorkDay: boolean) => {
    const startTime = dayjs(start);
    const endTime = dayjs(end);
    if (hideNotWorkDay) {
        let gap = endTime.diff(startTime, 'day');
        for (let i = 0, days = gap; i <= days; i++) {
            const date = startTime.add(i, 'day');
            if (isNotWorkDay(date)) {
                gap--;
            }
        }
        return gap;
    }
    return endTime.diff(startTime, 'day');
}

const defaultRenderItem = (item: CalendarProps & {isRealStart:boolean,isRealEnd:boolean}) => {
    const { title, isRealStart, isRealEnd } = item;

    return (
        <Tag 
            className={classname("calendar-bar-item",{
                "calendar-bar-item-notStart": !isRealStart,
                "calendar-bar-item-notEnd": !isRealEnd,
            })}
            // bordered={false} 
            color="blue"
        >{title}</Tag>
    )
}

const defaultDayRender = (item: DayColumnProps) => {
    const { title } = item;
    return (
        <div className="calendar-head-cell-child">
            {title}
        </div>
    )
}

interface DefaultConfig {
    columns: ColumnProps[];
    data: CalendarDataProps[];
    renderItem?: (item: CalendarProps & {isRealStart:boolean,isRealEnd:boolean}) => ReactNode;
    dayRender?: (item: DayColumnProps) => ReactNode;
    onChange?: ()=>void;
    onMove?: ()=>void;
    contextMenu?:{
        copy:boolean;
        onCopy:() => void;
        delete:boolean;
        onDelete:() => void;
    }
    contextMenuRender?: () => ReactNode;
}

/*
    原则：通过鼠标移动结束的位置，来计算任务条执行操作后的left和width，再计算任务的start和end，再计算任务的开始时间和结束时间
*/

const Workcalendar: FC<WorkcalendarProps> = (props) => {

    const { 
        columns,
        data,
        changeData,
        renderItem = defaultRenderItem,
        dayRender = defaultDayRender,
        ...rest
    } = props;

    const [hideNotWorkDay, setHideNotWorkDay] = useState(false);

    const addModal = useModal('work-calendar-add-modal');

    const [editing, setEditing] = useState(false);
    const [originData, setOriginData] = useState<any[]>([]);
    const [changeStack, setChangeStack] = useState<any[]>([]);
    const [changeTasks, setChangeTasks] = useState<any[]>([]);

    console.log('wmx rollback',changeStack);

    const rollback = () => {
        if (changeStack.length > 0) {
            const change = changeStack.pop();
            const { type, old, new:newTask } = change;
            const { id:oldId, calendar:oldCalendar } = old;
            const { id:newId, calendar:newCalendar } = newTask;
            if (type === 'change') {
                const newData = data.map((item:CalendarDataProps) => {
                    if (item.id === newId) {
                        item.calendars.splice(
                            item.calendars.findIndex((calendar:CalendarProps) => calendar.taskId === newCalendar.taskId),
                            1,
                            oldCalendar,
                        )
                    }
                    return item;
                })
                changeData(newData);
            } else if (type === 'add') {
                // TODO: 未完成
            } else if (type === 'delete') {
                const newData = data.map((item:CalendarDataProps) => {
                    if (item.id === oldId) {
                        item.calendars.push(oldCalendar);
                    }
                    return item;
                })
                changeData(newData);
            } else if (type === 'copy') {
                const newData = data.map((item:CalendarDataProps) => {
                    if (item.id === newId) {
                        item.calendars = item.calendars.filter((calendar:CalendarProps) => calendar.taskId !== newCalendar.taskId);
                    }
                    return item;
                })
                changeData(newData);
            } else if (type === 'move') {
                // 先删除 newId 的 newCalendar，再添加 oldId 的 oldCalendar
                const preChange = changeStack.pop();
                const { old } = preChange;
                const { id:preOldId, calendar:preOldCalendar } = old;
                const newData = data.map((item:CalendarDataProps) => {
                    if (item.id === newId) {
                        item.calendars = item.calendars.filter((calendar:CalendarProps) => calendar.taskId !== newCalendar.taskId);
                    }
                    if (item.id === preOldId) {
                        item.calendars.push(preOldCalendar);
                    }
                    return item;
                })
                console.log('wmx newData', newData);
                changeData(newData);
            }

        }
    }

    const addTask = (id:string,taskInfo:CalendarProps) => {
        console.log('addTask', id, taskInfo);
        let newData = cloneDeep(data);
        newData = newData.map((item:CalendarDataProps) => {
            if (item.id === id) {
                // item.calendars.push(taskInfo);
                item.calendars = [...item.calendars, taskInfo];
            }
            return item;
        })
        console.log("newData", newData);
        changeData(newData);
    }

    const changeTask = (id:string, taskId:string, direction:string,days:number) => {
        console.log('changeTask', id, taskId, direction,days);
        
        const newData = data.map((item: CalendarDataProps, itemIndex: number) => {
            if (item.id === id) {
                const newCalendars = item.calendars.map((calendar: CalendarProps, calendarIndex: number) => {
                    if (calendar.taskId === taskId) {
                        let { startTime, endTime, start=0, end=0 } = formatData[itemIndex].calendars[calendarIndex]; 
                        if (direction === 'left') {
                            if(days < 0) {
                                start = start + days;
                                startTime = dayColumns[start].date;
                                // let oldStartTime = dayjs(startTime);
                                // startTime = dayjs(startTime).subtract(-days, 'day').format('YYYY-MM-DD');
                                // if (hideNotWorkDay){
                                //     for(let i = 1; i <= -days; i++) {
                                //         if(isNotWorkDay(oldStartTime.subtract(i, 'day'))) {
                                //             startTime = dayjs(startTime).subtract(1, 'day').format('YYYY-MM-DD');
                                //         }
                                //     }
                                // }
                            }else if (days > 0) {
                                start = start + days;
                                startTime = dayColumns[start].date;
                                // let oldStartTime = dayjs(startTime);
                                // startTime = oldStartTime.add(days, 'day').format('YYYY-MM-DD');
                                // if (hideNotWorkDay){
                                //     for(let i = 1; i <= days; i++) {
                                //         if(isNotWorkDay(oldStartTime.add(i, 'day'))) {
                                //             startTime = dayjs(startTime).add(1, 'day').format('YYYY-MM-DD');
                                //         }
                                //     }
                                // }
                            }
                            const newCalendar = { ...calendar, startTime };
                            // 将变化推入栈中
                            const change = {
                                type: 'change',
                                old: { calendar, id },
                                new: { calendar: newCalendar, id },
                            }
                            setChangeStack([...changeStack, change]);
                            return newCalendar
                        } else if (direction === 'right') {
                            if(days < 0) {
                                end = end + days;
                                endTime = dayColumns[end].date;
                                // let oldEndTime = dayjs(endTime);
                                // endTime = oldEndTime.subtract(-days, 'day').format('YYYY-MM-DD');
                                // if (hideNotWorkDay){
                                //     for(let i = 1; i <= -days; i++) {
                                //         if(isNotWorkDay(oldEndTime.subtract(i, 'day'))) {
                                //             endTime = dayjs(endTime).subtract(1, 'day').format('YYYY-MM-DD');
                                //         }
                                //     }
                                // }
                            }else if (days > 0) {
                                // days 可真实反应出移动的列数 然后通过列数找到对应的日期 将日期赋值给 endTime
                                end = end + days;
                                endTime = dayColumns[end].date;
                                // let oldEndTime = dayjs(endTime);
                                // endTime = oldEndTime.add(days, 'day').format('YYYY-MM-DD');
                                // if (hideNotWorkDay){
                                //     for(let i = 1; i <= days; i++) {
                                //         if(isNotWorkDay(oldEndTime.add(i, 'day'))) {
                                //             endTime = dayjs(endTime).add(1, 'day').format('YYYY-MM-DD');
                                //         }
                                //     }
                                // }
                            }
                            const newCalendar = { ...calendar, endTime };
                            // 将变化推入栈中
                            const change = {
                                type: 'change',
                                old: { calendar, id },
                                new: { calendar: newCalendar, id },
                            }
                            setChangeStack([...changeStack, change]);
                            return newCalendar
                        }
                    }
                    return calendar;
                })
                // console.log('wmx newCalendars', newCalendars);
                return {
                    ...item,
                    calendars: newCalendars
                }
            }
            return item;
        })
        console.log("newData", newData);
        changeData(newData);
    }

    const deleteTask = (id:string, taskId:string) => {
        console.log('deleteTask', id, taskId);
        let deletedTask:CalendarProps | null = null;
        const newData = data.map((item:CalendarDataProps) => {
            if (id === item.id) {
                const newCalendars = item.calendars.filter((calendar:CalendarProps) => {
                    if (calendar.taskId === taskId) {
                        deletedTask = calendar;
                        return false;
                    }
                    return true;
                })
                return {
                    ...item,
                    calendars: newCalendars
                }
            }
            return item;
        })
        console.log("newData", newData);
        // 将变化推入栈中
        const change = {
            type: 'delete',
            old: { calendar: deletedTask, id },
            new: { calendar: null, id }
        }
        const newChangeStack = [...changeStack, change];
        setChangeStack(newChangeStack);
        changeData(newData);
        return ([newData,newChangeStack,deletedTask] as [CalendarDataProps[],any[],CalendarProps | null]);
    }
                        
    const moveTask = (
        data:CalendarDataProps[], 
        deletedTask:CalendarProps, 
        userIndex:number, 
        changedStart:number, 
        changedEnd:number,
        newChangeStack:any[]
    ) => {
        console.log('moveTask', changedStart, changedEnd, userIndex, deletedTask);
        const newData = data.map((item:CalendarDataProps, index:number) => {
            if (index === userIndex) {
                const { 
                    start = 0, 
                    end = 0, 
                    startTime, 
                    endTime 
                } = deletedTask;
                const realGap = dayjs(endTime).diff(dayjs(startTime), 'day');
                changedEnd = changedStart + realGap;
                if (hideNotWorkDay) {
                    // 期间有一天是非工作日，就减少一天
                    let newStartTime = dayColumns[changedStart].date;
                    for(let i = 0; i <= realGap; i++) {
                        if(isNotWorkDay(dayjs(newStartTime).add(i, 'day'))) {
                            changedEnd = changedEnd - 1;
                        }
                    }
                }
                let newStartTime = dayColumns[changedStart].date;
                let newEndTime = dayjs(newStartTime).add(realGap, 'day').format('YYYY-MM-DD');
                const newCalendar = {
                    ...deletedTask,
                    start: changedStart,
                    end: changedEnd,
                    startTime: newStartTime,
                    endTime: newEndTime,
                }
                item.calendars.push(newCalendar);
                const change = {
                    type: 'move',
                    old: { calendar: null, id: item.id },
                    new: { calendar: newCalendar, id: item.id }
                }
                newChangeStack.push(change);
                setChangeStack(newChangeStack);
            }
            return item;
        })
        console.log("newData", newData);
        changeData(newData);
    }

    const copyTask = (id:string, taskInfo:CalendarProps) => {
        console.log('copyTask');
        const newData = data.map((item:CalendarDataProps) => {
            if (item.id === id) {
                const newCalendar = { ...taskInfo, taskId: `copy-${dayjs().valueOf()}` };
                item.calendars.push(newCalendar);
                const change = {
                    type: 'copy',
                    old: { calendar: null, id },
                    new: { calendar: newCalendar, id }
                }
                setChangeStack([...changeStack, change]);
            }
            return item;
        })
        console.log("newData", newData);
        changeData(newData);
    }

    // 格子的宽度
    const cellWidth = 200;
    // 格子的初始高度 一个任务条的高度为 30
    const cellHeight = 70;

    // 任务条的宽度为所占格子的总宽度 - 20
    // const barWidth = cellWidth * 1 - 20;
    // 任务条的高度为 30
    const barHeight = 30;

    // 距离左上的距离 top:35,left:10
    const cellTop = cellHeight / 2;
    const cellLeft = 10;
    // 任务条间隔为 5px
    const barMargin = 5;

    // const [barsOffsetLeft, setBarsOffsetLeft] = useState(0);
    // 任务条画布的偏移量
    const [barsOffsetTop, setBarsOffsetTop] = useState(0);

    // 工具框是否展示
    const [contextMenuVisible, setContextMenuVisible] = useState(false);
    // 工具框的位置
    const [contextMenuPosition, setContextMenuPosition] = useState({x:0,y:0});
    // 选中的任务
    const [selectedTask, setSelectedTask] = useState<{id:string,taskId:string,taskInfo:CalendarProps}>({id:'',taskId:'',taskInfo:{}} as {id:string,taskId:string,taskInfo:CalendarProps});


    // 容器DOM
    const containerRef = useRef<HTMLDivElement>(null);
    // 头部DOM
    const headerRef = useRef<HTMLDivElement>(null);
    // 设置偏移量
    useEffect(() => {
        if (headerRef.current) {
            setBarsOffsetTop(headerRef.current.clientHeight);
        }
    }, [])
    
    // 用于渲染表头，并区分固定列和日期列
    const userColumns = useMemo(()=>{
        return (columns.filter(item => (item as UserColumnProps).fixed) as UserColumnProps[])
    },[columns])
    const dayColumns = useMemo(() => {
        const filterFn = hideNotWorkDay ? (item: DayColumnProps) => (item).date && !isNotWorkDay(item.date) : (item: DayColumnProps) => item.date;
        return (columns.filter(item => filterFn(item as DayColumnProps)) as DayColumnProps[])
    }, [columns,hideNotWorkDay]);

    // 规定 最小左偏移量 和 最大左偏移量+宽度
    const minLeft = 10;
    const maxWidth = cellWidth * dayColumns.length - 10;
    // 基准天 和 最后一天
    const baseDate = dayColumns[0].date;
    const lastDate = dayColumns[dayColumns.length - 1].date;
    console.log("wmx", baseDate, lastDate);
    

    // 拖拽开始时，鼠标的位置
    let startX = 0;
    let startY = 0;

    // 拖拽开始时，滚动的位置
    let startLeft = 0;
    let startTop = 0;

    // 需要计算出主体每行的高度 规范数据结构 baseDate，start：1，end：2 pre：0 用于计算任务条的位置与宽度
    const [rowHeights, formatData] = useMemo(() => {
        const rowHeights: any[] = [];
        let baseTop = 0;
        const formatData = data.map(item => {
            const { calendars } = item;
            let rowHeight = cellHeight;
            const dateTasks: number[] = new Array(dayColumns.length).fill(0);

            const newCalendars = calendars.reduce((preArr:CalendarProps[],calendar: CalendarProps) => {
                const { startTime, endTime } = calendar;
                // beginTime 是日程在表格中的开始时间 startTime 是日程的开始时间
                let beginTime = dayjs(startTime);
                let finishTime = dayjs(endTime);
                // TODO
                let realDuration = finishTime.diff(beginTime, 'day') + 1;
                if (hideNotWorkDay) {
                    // 判断开始时间到结束时间之间有多少个非工作日
                    let notWorkDayCount = 0;
                    let tempTime = beginTime;
                    while (tempTime.isBefore(finishTime)) {
                        if (isNotWorkDay(beginTime)) {
                            notWorkDayCount++;
                        }
                        tempTime = tempTime.add(1, 'day');
                    }
                    realDuration -= notWorkDayCount;
                }

                let isRealStart = true
                let isRealEnd = true
                // 如果日程的开始时间在基准时间之前，那么开始时间就是基准时间
                if (beginTime.isBefore(dayjs(baseDate))) {
                    beginTime = dayjs(baseDate);
                    isRealStart = false;
                }
                if(hideNotWorkDay && isNotWorkDay(beginTime)){
                    isRealStart = false;
                    while(isNotWorkDay(beginTime)){
                        beginTime = beginTime.add(1,'day');
                    }
                }
                // 如果日程的结束时间在最后一天之后，那么结束时间就是最后一天
                if (finishTime.isAfter(dayjs(lastDate))) {
                    finishTime = dayjs(lastDate);
                    isRealEnd = false;
                }
                if(hideNotWorkDay && isNotWorkDay(finishTime)){
                    isRealEnd = false;
                    while(isNotWorkDay(finishTime)){
                        finishTime = finishTime.subtract(1,'day');
                    }
                }
                // 需要判断每一天是否是工作日 start与end取的都是展示出来天数
                // const start = beginTime.diff(dayjs(baseDate), 'day');
                // const end = finishTime.diff(dayjs(baseDate), 'day');
                const start = getDateGap(dayjs(baseDate), beginTime, hideNotWorkDay);
                const end = getDateGap(dayjs(baseDate), finishTime, hideNotWorkDay);

                if (end < start) return preArr;

                // 计算出当前行的高度
                const pre = Math.max(...dateTasks.slice(start,end+1));
                for (let i = start; i <= end; i++) {
                    dateTasks[i] = pre+1;
                }
                preArr.push({
                    ...calendar,
                    start,
                    end,
                    pre,
                    isRealStart,
                    isRealEnd,
                    realDuration,
                })
                return preArr;
            },([] as CalendarProps[]))

            // dateTasks 中存了一个人每一天的任务数
            // 找出最大的任务数，计算出当前行的高度
            const maxTask = Math.max(...dateTasks);
            rowHeight = maxTask * (barHeight + barMargin) + cellHeight - barMargin;
            rowHeights.push({ height: rowHeight, top: baseTop });
            baseTop += rowHeight;
            return {
                ...item,
                calendars: newCalendars,
            }
        })
        return [rowHeights, formatData];
    }, [data, dayColumns,hideNotWorkDay])

    console.log("wmx layout", rowHeights, formatData, headerRef.current?.clientHeight);

    const showCancelConfirm = () => {
        Modal.confirm({
            title: '您确定要取消修改吗？',
            icon: <ExclamationCircleOutlined/>,
            okText: '确定',
            cancelText: '取消',
            onOk() {
                changeData(originData)
                setChangeStack([]);
                setChangeTasks([]);
                setEditing(false);
            },
            onCancel() {
            },
        });
    }

    return (
        <>
        <Card className='work-calendar-container' bordered={false}>
            {/* <h1>Workcalendar</h1> */}
            <div className='work-calendar-tooltips'>
                <div className='work-calendar-tooltips-left'>
                    <div className='work-calendar-tooltips-left-title'>工作日历</div>
                </div>
                <div className='work-calendar-tooltips-right'>
                    <div className='work-calendar-tooltips-right-hide'>
                        隐藏非工作日：
                        <Switch size='small' checked={hideNotWorkDay} onChange={(checked)=>{
                            console.log("wmx setHideNotWorkDay",checked);
                            setHideNotWorkDay(checked);
                        }} />
                    </div>
                    <Button 
                        size='small' 
                        type='primary'
                        style={{
                            marginRight: 12,
                        }}
                        onClick={()=>{
                            setOriginData(data);
                            setEditing(true);
                        }}
                    >编辑</Button>
                    <Button 
                        disabled={ !editing }
                        size='small' 
                        style={!editing ? {marginRight: 12} : {
                            marginRight: 12,
                            color: '#389e0d',
                            borderColor: '#389e0d',
                        }}
                        onClick={()=>{
                            
                        }}
                    >保存</Button>
                    <Button 
                        disabled={ !editing || !changeStack.length }
                        size='small' 
                        // type='primary'
                        danger
                        style={{
                            marginRight: 12,
                        }}
                        onClick={()=>{
                            rollback()
                        }}
                    >回退</Button>
                    <Button 
                        disabled={ !editing }
                        size='small' 
                        style={{
                            marginRight: 12,
                        }}
                        onClick={showCancelConfirm}
                    >取消</Button>
                    <Button 
                        size='small' 
                        type='primary'
                        onClick={()=>{
                            addModal.show({open: true,data,addTask})
                        }}
                    >新增</Button>
                </div>
                
            </div>
            <div className='work-calendar-content'
                ref={containerRef}
                onDragOver={(e) => {
                    e.preventDefault();
                }}
            >
                <div ref={headerRef} className='calendar-head'>
                    <div className='calendar-head-line'>
                        {/* 头map */}
                        {/* {
                            columns.map(item => {
                                const { key, fixed} = (item as UserColumnProps);
                                return (
                                    <div key={key} className='calendar-head-cell'
                                        style={{
                                            width: fixed === 'left' ? 100 : cellWidth,
                                            left: fixed === 'left' ? 0 : undefined,
                                            zIndex: fixed === 'left' ? 99 : 98,
                                            top: '1px',
                                            backgroundColor: fixed === 'left' ? '#fff' : '#fafafa',
                                        }}
                                    >
                                        {fixed === 'left' ? defaultDayRender(item as DayColumnProps) : dayRender(item as DayColumnProps)}
                                    </div>
                                )
                            })
                        } */}
                        {
                            userColumns.map(item => {
                                const { key } = item;
                                return (
                                    <div key={key} className='calendar-head-cell'
                                        style={{
                                            width: 100,
                                            left: 0,
                                            zIndex: 99,
                                            backgroundColor: '#fff',
                                        }}
                                    >
                                        {defaultDayRender(item as unknown as DayColumnProps)}
                                    </div>
                                )
                            })
                        }
                        {
                            dayColumns.map(item => {
                                const { key } = item;
                                return (
                                    <div key={key} className='calendar-head-cell'
                                        style={{
                                            width: cellWidth,
                                            left: undefined,
                                            zIndex: 98,
                                            backgroundColor: '#fafafa',
                                        }}
                                    >
                                        {dayRender(item)}
                                    </div>
                                )
                            })
                        }
                        {/* <div className='calendar-head-cell'></div> */}
                    </div>
                </div>
                <div className='calendar-body'>
                    {/* 有多少个用户 map 多少 */}
                    {
                        formatData.map((item: any, index) => {
                            return (
                                <div key={item.id} className='calendar-body-line'
                                    style={{
                                        height: rowHeights[index].height,
                                    }}
                                >
                                    {
                                        userColumns.map((column: any) => {
                                            return (
                                                <div key={column.dataIndex} className='calendar-left-cell background'
                                                    style={{
                                                        width: 100,
                                                        position: 'sticky',
                                                        left: column.fixed === 'left' ? 0 : undefined,
                                                        zIndex: 99,
                                                    }}
                                                >
                                                    <div className='calendar-left-cell-child'>
                                                        {item[column.dataIndex]}
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                    {
                                        dayColumns.map((item: any) => {
                                            return (
                                                <div key={item.date} className='calendar-body-cell background'
                                                    style={{
                                                        width: cellWidth,
                                                    }}
                                                ></div>
                                            )
                                        })
                                    }
                                </div>
                            )
                        })
                    }
                </div>
                <div className='calendar-bars' style={{
                    top: barsOffsetTop + 'px',
                    width: maxWidth+ 'px',
                    height: rowHeights[rowHeights.length-1].top + rowHeights[rowHeights.length-1].height + 'px',
                }}
                    onDragOver={(e) => {
                        e.preventDefault();
                    }}
                    onClick={() => {
                        console.log("click");
                        if(contextMenuVisible){
                            setContextMenuVisible(false);
                        }
                    }}
                >
                    {
                        formatData.reduce((pre: any, item: any, index: number) => {
                            const eles: any[] = []
                            const { calendars } = item;
                            calendars.forEach((task: any) => {
                                const { start, end, pre, isRealStart, isRealEnd } = task;
                                // const left = start * cellWidth + (isRealStart ? cellLeft : 0);
                                // const width = (end - start + 1) * cellWidth - (isRealStart ? 10 : 0) - (isRealEnd ? 10 : 0);
                                const left = start * cellWidth + cellLeft;
                                const width = (end - start + 1) * cellWidth - 20;
                                const top = rowHeights[index].top + pre * (barHeight + barMargin) + cellTop;
                                if (!isRealStart || !isRealEnd) {
                                    const { realDuration } = task;
                                    eles.push(
                                        <div key={`fake_${task.taskId}`} className='calendar-bar'
                                            id={`${task.taskId}`}
                                            style={{
                                                left:"0px",
                                                width: realDuration * cellWidth - 20,
                                                top:"-9999px",
                                                height: barHeight,
                                            }}
                                        >
                                            <div className='calendar-bar-title'>{renderItem({...task,isRealStart:true,isRealEnd:true})}</div>
                                        </div>
                                    )
                                }
                                eles.push(
                                    <div key={task.taskId} className='calendar-bar'
                                        style={{
                                            left,
                                            width,
                                            top,
                                            height: barHeight,
                                        }}
                                        onContextMenu={(e) => {
                                            e.preventDefault();
                                            const { offsetX, offsetY } = e.nativeEvent;
                                            const target = e.target as HTMLElement;
                                            const { offsetLeft, offsetTop } = target;
                                            console.log("right click", e, offsetX, offsetY);
                                            const x = left + offsetX + offsetLeft;
                                            let y = offsetTop;
                                            const row = rowHeights[rowHeights.length-1];
                                            const maxHeight = row.height + row.top;
                                            if(top + barHeight + 10 + 70 <= maxHeight){
                                                y = top + barHeight + 10;
                                            }else{
                                                y = top - 70 - 10;
                                                if(y < 0){
                                                    y = top + barHeight + 10;
                                                }
                                            }
                                            setContextMenuVisible(true);
                                            setContextMenuPosition({
                                                x,
                                                y,
                                            })
                                            // 设置一个 selectedTaskId 用于右键菜单的操作
                                            setSelectedTask({
                                                id:item.id, 
                                                taskId: task.taskId,
                                                taskInfo: {
                                                    ...task,
                                                }
                                            });
                                        }}
                                        draggable={ editing }
                                        onDragStart={(e) => {
                                            // 拖动开始前，设置透明度
                                            // 记录鼠标位置 和 滚动位置 通过计算得到偏移量 即新的 left 和 top 已确定任务条的最终位置
                                            // 未展示完全的任务条，需要设置一个假的任务条，用于拖动时的展示 
                                            // 过于右的情况通过 left 可解决；过于左的情况 left 必定小于 0 需要判断 left + width 来确定
                                            console.log("start", e);
                                            if(!isRealEnd || !isRealStart){
                                                console.log("wmx",);
                                                let { offsetX, offsetY } = e.nativeEvent;
                                                const fakeTarget = document.getElementById(`${task.taskId}`);
                                                if (!isRealStart) {
                                                    const { realDuration } = task;
                                                    offsetX += (realDuration - (end - start) - 1) * cellWidth; 
                                                    console.log("wmx !isRealStart",end,start,realDuration);
                                                }
                                                e.dataTransfer.setDragImage(fakeTarget!, offsetX, offsetY)
                                            }

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

                                            let left = offsetLeft + moveX;
                                            if (!isRealStart) {
                                                const { realDuration } = task;
                                                left -= (realDuration - (end - start) - 1) * cellWidth;
                                            }

                                            const top = offsetTop + moveY;

                                            const userIndex = rowHeights.findIndex((item: any) => {
                                                const { top: rowTop, height: rowHeight } = item;
                                                if (top >= rowTop && (top + barHeight) <= rowTop + rowHeight) {
                                                    // 进入该行
                                                    return true;
                                                }
                                                return false;
                                            })
                                            if (userIndex === -1) return;
                                            const cellNum = end - start;
                                            let changedStart = Math.floor((left) / cellWidth);
                                            let changedEnd = changedStart + cellNum;
                                            // 过于左，以 baseDate 为开始
                                            if (left < 0) {
                                                // changedStart = 0;
                                                // changedEnd = changedStart + cellNum;
                                                return 
                                            }
                                            // 过于右，以 lastDate 为结束
                                            // if(left + cellWidth * (cellNum + 1) - 20 > maxWidth) {
                                            if(left > maxWidth) {
                                                // changedEnd = dayColumns.length - 1;
                                                // changedStart = changedEnd - cellNum;
                                                return 
                                            }
                                            const [newData,newChangeStack,deletedTask] = deleteTask(item.id, task.taskId);
                                            if(!newData || !deletedTask) return;
                                            moveTask(newData, deletedTask, userIndex, changedStart, changedEnd,newChangeStack);
                                            // target.style.left = `${left}px`;
                                            // target.style.top = `${top}px`;
                                        }}
                                    >
                                        {editing && isRealStart && <div className='left-resize'
                                            style={{
                                                height: '100%',
                                                width: '5px',
                                                // backgroundColor: 'pink',
                                            }}
                                            onMouseDown={(e) => {
                                                // 左改变，通过鼠标移动的距离来确定 start 的变化(+n或-n) 找到索引，通过索引找到对应的日期
                                                // 不能小于 最小宽度
                                                // 向左不能超过最大宽度 即 left >= 10
                                                // TODO: n的单位 可能只是半天甚至更小的单位

                                                // 点击下去时需要知道 目标日程的用户和任务id
                                                // 左边的拖动需要考虑到 position
                                                const target = e.target as HTMLElement;
                                                const parent = target.parentNode as HTMLElement;
                                                if (!parent) return
                                                console.log("left down", e, parent.clientWidth);
                                                e.preventDefault();
                                                const clientX = e.clientX;
                                                const { clientWidth: originWidth, offsetLeft: originLeft } = parent;
                                                document.onmousemove = (e) => {
                                                    const moveX = e.clientX - clientX;
                                                    const left = originLeft + moveX;
                                                    const width = originWidth - moveX;
                                                    if(left < minLeft) {
                                                        // 向左大于最大宽度时，不再改变
                                                        parent.style.left = 10 + 'px';
                                                        parent.style.width = width - (10 - left) + 'px';
                                                        return
                                                    }
                                                    if(width < cellWidth - 20) {
                                                        // 小于最小宽度时，不再改变
                                                        parent.style.left = originLeft + (originWidth - cellWidth + 20) + 'px';
                                                        parent.style.width = cellWidth - 20 + 'px';
                                                        return
                                                    }
                                                    parent.style.left = left + 'px';
                                                    parent.style.width = width + 'px';
                                                    // console.log("left move", e);
                                                    
                                                }
                                                document.onmouseup = (e) => {
                                                    console.log("left up", e);
                                                    e.preventDefault();
                                                    document.onmousemove = null;
                                                    document.onmouseup = null;
                                                    // change state
                                                    // 正常情况下判断改变多少格
                                                    const moveX = e.clientX - clientX;
                                                    let cellNum = moveX > 0 ? Math.floor(moveX / cellWidth) : Math.ceil(moveX / cellWidth);
                                                    if(left < minLeft) {
                                                        cellNum = Math.floor((minLeft - originLeft) / cellWidth);
                                                    }
                                                    if(originWidth - moveX < cellWidth - 20) {
                                                        cellNum = Math.ceil((originWidth - cellWidth + 20) / cellWidth);
                                                    }
                                                    if(cellNum === 0) {
                                                        parent.style.left = originLeft + 'px';
                                                        parent.style.width = originWidth + 'px';
                                                        return
                                                    }
                                                    // parent.style.left = originLeft + (cellWidth * cellNum) + 'px';
                                                    // parent.style.width = originWidth - (cellWidth * cellNum) + 'px';
                                                    changeTask(item.id, task.taskId, 'left', cellNum);
                                                }
                                            }}
                                        >
                                        </div>}
                                        {editing && isRealEnd && <div className='right-resize'
                                            style={{
                                                height: '100%',
                                                width: '5px',
                                                // backgroundColor: 'pink',
                                            }}
                                            onMouseDown={(e) => {
                                                // 右改变，通过鼠标移动的距离来确定 end 的变化(+n或-n) 找到索引，通过索引找到对应的日期
                                                // 不能小于 最小宽度
                                                // 向右不能超过最大宽度 即 left + width <= maxWidth
                                                // TODO: n的单位 可能只是半天甚至更小的单位

                                                // 右边的拖动逻辑不牵涉 position
                                                const target = e.target as HTMLElement;
                                                const parent = target.parentNode as HTMLElement;
                                                if (!parent) return
                                                console.log("right down", e, parent.clientWidth);
                                                e.preventDefault();
                                                const clientX = e.clientX;
                                                const { clientWidth: originWidth, offsetLeft: originLeft } = parent;
                                                document.onmousemove = (e) => {
                                                    const moveX = e.clientX - clientX;
                                                    const width = originWidth + moveX;
                                                    // console.log("right move",e);
                                                    // 向右大于最大宽度时，不再改变
                                                    if (originWidth + originLeft + moveX > maxWidth) {
                                                        parent.style.width = maxWidth - originLeft + 'px';
                                                        return
                                                    }
                                                    // 小于最小宽度时，不再改变
                                                    if (width < cellWidth - 20) {
                                                        parent.style.width = cellWidth - 20 + 'px';
                                                        return
                                                    }
                                                    parent.style.width = width + 'px';
                                                }
                                                document.onmouseup = (e) => {
                                                    console.log("right up", e);
                                                    e.preventDefault();
                                                    document.onmousemove = null;
                                                    document.onmouseup = null;
                                                    // change state
                                                    // 正常情况下判断改变多少格
                                                    const moveX = e.clientX - clientX;
                                                    let cellNum = moveX > 0 ? Math.floor(moveX / cellWidth) : Math.ceil(moveX / cellWidth);
                                                    if(originWidth + originLeft + moveX > maxWidth) {
                                                        // 向右大于最大宽度时，不再改变
                                                        const maxCellNum = Math.floor((maxWidth - originLeft + 20) / cellWidth);
                                                        const originCellNum = Math.floor((originWidth + 20) / cellWidth);
                                                        cellNum = maxCellNum - originCellNum;
                                                    }
                                                    if (originWidth + moveX < cellWidth - 20) {
                                                        // 小于最小宽度时，不再改变
                                                        const originCellNum = Math.floor((originWidth + 20) / cellWidth);
                                                        cellNum = 1 - originCellNum;
                                                    }
                                                    if(cellNum === 0) {
                                                        parent.style.width = originWidth + 'px';
                                                        return
                                                    }
                                                    // parent.style.width = originWidth + (cellWidth * cellNum) + 'px';
                                                    changeTask(item.id, task.taskId,"right",cellNum);
                                                }
                                            }}
                                        >
                                        </div>}
                                        <div className='calendar-bar-title'>{renderItem(task)}</div>

                                    </div>
                                )
                            })
                            return pre.concat(eles)
                        }, [])
                    }
                    <div className='context-menu-container' style={{
                        display: contextMenuVisible ? 'block' : 'none',
                        left: contextMenuPosition.x,
                        top: contextMenuPosition.y,
                        transform: `translate(-50%,0)`
                    }}>
                        <Card>
                            <div style={{ display:"flex", flexDirection:"column" }}>
                                <Button
                                    size='small' 
                                    type='primary' 
                                    style={{
                                        marginBottom: '10px'
                                    }}
                                    onClick={() => {
                                        setContextMenuVisible(false);
                                        // 直接在当前行 插入一个任务
                                        copyTask(selectedTask.id, selectedTask.taskInfo);
                                    }}
                                >
                                    复制
                                </Button>
                                <Button
                                    size='small' 
                                    danger
                                    onClick={() => {
                                        setContextMenuVisible(false);
                                        // 删除当前任务
                                        console.log("delete task", selectedTask);
                                        deleteTask(selectedTask.id, selectedTask.taskId);
                                    }}
                                >
                                    删除
                                </Button>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </Card>
        <AddModal name='work-calendar-add-modal' />
        <div
            draggable={true}
            style={{
                backgroundColor: 'red',
                width: 100,
                height: 100,
            }}
            onDragStart={(e) => {
                console.log("drag start", e);
                const { offsetX, offsetY } = e.nativeEvent;
                const fakeTarget = document.createElement('div');
                fakeTarget.style.cssText = 'position: absolute; top: -9999px; left: 0; z-index: -1;height: 100px; width: 100px;background-color: green';
                document.body.appendChild(fakeTarget);
                e.dataTransfer.setDragImage(fakeTarget, offsetX, offsetY);
            }}
        ></div>
        </>
    );
};


export default Workcalendar;