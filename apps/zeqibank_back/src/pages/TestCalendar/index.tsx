import { useState } from "react";

import Workcalendar, { CalendarDataProps, CalendarProps } from "../../components/WorkCalendar";
import { classname } from "../../utils/classname";
// import Gantt from "../../components/Gantt";

// import DragLineChart from "../../components/Charts/DragLineChart";
// import GanttChart from "../../components/Charts/GanttChart";

import './index.less';
import { getWeekday, isHoliday, isNotWorkDay, isSpecialWorkday, isToday, isWeekend } from "../../components/WorkCalendar/utils";
import { Button, Modal, Popover, Switch, Tag } from "antd";
import dayjs from "dayjs";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import AddModal from "./addModal";
import { cloneDeep } from "lodash";
import useModal from "../../hooks/useModal";
import SaveModal from "./saveModal";

const Testcalendar = () => {

  // const data = {
  //     data: [
  //         { id: 1, text: 'Task #1', start_date: '2019-04-15', duration: 3, progress: 0.6 },
  //         { id: 2, text: 'Task #2', start_date: '2019-04-18', duration: 10, progress: 0.4 }
  //     ],
  //     links: [
  //         { id: 1, source: 1, target: 2, type: '0' }
  //     ]
  // };

  const columns = [
    {
      title: '人员信息',
      dataIndex: 'user',
      key: 'user',
      fixed: 'left',
    },
    {
      title: '2023-05-01',
      date: '2023-05-01',
      key: '2023-05-01',
    },
    {
      title: '2023-05-02',
      date: '2023-05-02',
      key: '2023-05-02',
    },
    {
      title: '2023-05-03',
      date: '2023-05-03',
      key: '2023-05-03',
    },
    {
      title: '2023-05-04',
      date: '2023-05-04',
      key: '2023-05-04',
    },
    {
      title: '2023-05-05',
      date: '2023-05-05',
      key: '2023-05-05',
    },
    {
      title: '2023-05-06',
      date: '2023-05-06',
      key: '2023-05-06',
    },
    {
      title: '2023-05-07',
      date: '2023-05-07',
      key: '2023-05-07',
    },
    {
      title: '2023-05-08',
      date: '2023-05-08',
      key: '2023-05-08',
    },
    {
      title: '2023-05-09',
      date: '2023-05-09',
      key: '2023-05-09',
    },
    {
      title: '2023-05-10',
      date: '2023-05-10',
      key: '2023-05-10',
    },
    {
      title: '2023-05-11',
      date: '2023-05-11',
      key: '2023-05-11',
    }
  ]

  const [data, setData] = useState([
    {
      id: '1',
      user: '吴明轩',
      calendars: [
        { taskId: '1', title: '任务一', startTime: '2023-04-30', endTime: '2023-05-03' },
        { taskId: '4', title: '任务四', startTime: '2023-05-01', endTime: '2023-05-04' },
        { taskId: '5', title: '任务五', startTime: '2023-05-01', endTime: '2023-05-02' },
      ]
    },
    {
      id: '2',
      user: '张小华',
      calendars: [
        { taskId: '3', title: '任务三', startTime: '2023-05-07', endTime: '2023-05-08' },
        { taskId: '6', title: '任务六', startTime: '2023-05-06', endTime: '2023-05-06' },
      ]
    },
    {
      id: '3',
      user: '李小龙',
      calendars: [
        { taskId: '2', title: '任务二', startTime: '2023-05-06', endTime: '2023-05-07' },
        { taskId: '8', title: '任务八', startTime: '2023-05-11', endTime: '2023-05-12' },
      ]
    }
  ])

  const [editing, setEditing] = useState(false);
  const [hideNotWorkDay, setHideNotWorkDay] = useState(false);

  /*
    操作栈记录的是操作
    当点击回退时，需要将操作栈中的最后一项弹出，然后将其反向操作，然后将其添加到变更栈中
    原因：操作 更关注 数据的每一次变化 ，如果记录整个数据，数据量会很大，所以只记录操作
  */
  const [changeStack, setChangeStack] = useState<any[]>([]);
  const [originData, setOriginData] = useState<any[]>([]);
  const [changeList, setChangeList] = useState<any[]>([]);
  /*
    1. 变更列表栈记录的是整个变更列表
    当点击回退时，需要将变更列表栈中的最后一项弹出，此时获得的是数组，将数组重新赋值给变更列表
    原因：变更列表 更关注 数据编辑前后的差异 ，且一开始变更列表为空，数据量不大，所以可以直接记录整个数据

    2. 记录变更列表每条数据的变更过程
  */
  const [changeListStack, setChangeListStack] = useState<any[]>([]);

  const addModal = useModal('work-calendar-add-modal');
  const saveModal = useModal('work-calendar-save-modal');

  const addTask = (id: string, taskInfo: CalendarProps) => {
    console.log('addTask', id, taskInfo);
    let newData = cloneDeep(data);
    newData = newData.map((item: CalendarDataProps) => {
      if (item.id === id) {
        // item.calendars.push(taskInfo);
        item.calendars = [...item.calendars, taskInfo];
      }
      return item;
    })
    console.log("newData", newData);
    setData(newData);
  }

  const onMove = (
    id: string, taskId: string,
    userIndex: number,
    changedStart: number,
    changedEnd: number,
    hideNotWorkDay: any,
    dayColumns: any
    // newChangeStack:any[]
  ) => {
    console.log('onMove', changedStart, changedEnd, userIndex);
    let deletedTask = {} as CalendarProps;
    let newData = data.map((item: CalendarDataProps) => {
      if (id === item.id) {
        const newCalendars = item.calendars.filter((calendar: CalendarProps) => {
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
    // 将变化推入操作栈中
    const change = {
      type: 'delete',
      old: { calendar: deletedTask, id },
      new: { calendar: null, id }
    }
    const newChangeStack = [...changeStack, change];
    // setChangeStack(newChangeStack);

    let newTask = {} as CalendarProps;
    newData = newData.map((item: CalendarDataProps, index: number) => {
      if (index === userIndex) {
        const {
          start = 0,
          end = 0,
          startTime,
          endTime
        } = deletedTask!;
        const realGap = dayjs(endTime).diff(dayjs(startTime), 'day');
        changedEnd = changedStart + realGap;
        if (hideNotWorkDay) {
          // 期间有一天是非工作日，就减少一天
          let newStartTime = dayColumns[changedStart].date;
          for (let i = 0; i <= realGap; i++) {
            if (isNotWorkDay(dayjs(newStartTime).add(i, 'day'))) {
              changedEnd = changedEnd - 1;
            }
          }
        }
        let newStartTime = dayColumns[changedStart].date;
        let newEndTime = dayjs(newStartTime).add(realGap, 'day').format('YYYY-MM-DD');
        const newCalendar = {
          ...deletedTask!,
          start: changedStart,
          end: changedEnd,
          startTime: newStartTime,
          endTime: newEndTime,
        }
        newTask = newCalendar;
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
    // 保存目前的变更列表
    // setChangeListStack([...changeListStack, cloneDeep(changeList)]);
    // 生成最新的变更列表
    handleChangeList(
      "move",
      { ...deletedTask, id, user: data.find((item: CalendarDataProps) => item.id === id)?.user! },
      { ...newTask, id: data[userIndex].id, user: data[userIndex].user },
    );


    console.log("newData", newData);
    setData(newData);
  }

  const handleChangeList = (
    type: string,
    oldTask: CalendarProps & { id: string, user: string } | null,
    newTask: CalendarProps & { id: string, user: string } | null,
  ) => {
    if(!oldTask && !newTask) return;
    const defaultTask = {
      id: '',
      user: '',
      startTime: '',
      endTime: '',
    }
    const {
      id: preId,
      user: preUser,
      startTime: preStartTime,
      endTime: preEndTime,
    } = oldTask || defaultTask;
    const {
      id: afterId,
      user: afterUser,
      startTime: afterStartTime,
      endTime: afterEndTime,
    } = newTask || defaultTask;

    const title = oldTask?.title || newTask?.title || '';
    const taskId = oldTask?.taskId || newTask?.taskId || '';

    let newChangeFlag = false;
    const newChangeList = cloneDeep(changeList);
    for (let i = 0, len = newChangeList.length; i < len; i++) {
      const changeItem = newChangeList[i];
      if (changeItem.taskId === taskId) {
        newChangeFlag = true;
        
        if (type === 'delete' && changeItem.type === 'copy') {
          newChangeList.splice(i, 1);
          setChangeListStack([...changeListStack, cloneDeep({ ...changeItem, changeItemType: "delete" })]);
          break;
        }
        const newType = taskId.includes('copy') ? 'copy' : type;
        setChangeListStack([...changeListStack, cloneDeep({ ...changeItem, changeItemType: "change" })]);
        newChangeList[i] = {
          ...changeItem,
          type: newType,
          afterId,
          afterUser,
          afterStartTime,
          afterEndTime,
        }
        break;
      }
    }

    if (!newChangeFlag) {
      const changeItem = {
        type,
        taskId,
        title,
        preId,
        preUser,
        preStartTime,
        preEndTime,
        afterId,
        afterUser,
        afterStartTime,
        afterEndTime,
      }
      newChangeList.push(changeItem);
      setChangeListStack([...changeListStack, cloneDeep({ ...changeItem, changeItemType: "add" })]);
    }
    console.log("wmx changeList", newChangeList);
    setChangeList([...newChangeList]);
  }

  const onChange = (id: string, taskId: string, direction: string, days: number, formatData: any, dayColumns: any) => {
    console.log('onChange', id, taskId, direction, days);

    const newData = data.map((item: CalendarDataProps, itemIndex: number) => {
      if (item.id === id) {
        const newCalendars = item.calendars.map((calendar: CalendarProps, calendarIndex: number) => {
          if (calendar.taskId === taskId) {
            const oldTask = cloneDeep(calendar);
            let newTask = {} as CalendarProps;
            let { startTime, endTime, start = 0, end = 0 } = formatData[itemIndex].calendars[calendarIndex];

            let newCalendar = {} as CalendarProps;
            if (direction === 'left') {
              start = start + days;
              startTime = dayColumns[start].date;
            } else if (direction === 'right') {
              end = end + days;
              endTime = dayColumns[end].date;
            }

            newCalendar = { ...calendar, startTime, endTime };
            // 将变化推入操作栈中
            const change = {
              type: 'change',
              old: { calendar: oldTask, id },
              new: { calendar: newCalendar, id },
            }
            newTask = cloneDeep(newCalendar);
            // 保存目前的变更列表
            // setChangeListStack([...changeListStack, cloneDeep(changeList)]);
            // 生成最新的变更列表
            handleChangeList(
              "change",
              { ...oldTask, id, user: item.user },
              { ...newTask, id, user: item.user },
            );

            setChangeStack([...changeStack, change]);
            return newCalendar
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
    setData(newData);
  }

  const onCopy = (id: string, taskInfo: CalendarProps) => {
    console.log('onCopy');
    const newData = data.map((item: CalendarDataProps) => {
      if (item.id === id) {
        const newCalendar = { ...taskInfo, taskId: `copy-${dayjs().valueOf()}` };
        item.calendars.push(newCalendar);
        const change = {
          type: 'copy',
          old: { calendar: null, id },
          new: { calendar: newCalendar, id }
        }
        // 保存目前的变更列表
        // setChangeListStack([...changeListStack, cloneDeep(changeList)]);
        // 生成最新的变更列表
        handleChangeList(
          "copy",
          null,
          { ...newCalendar, id, user: item.user },
        );
        setChangeStack([...changeStack, change]);
      }
      return item;
    })
    console.log("newData", newData);
    setData(newData);
  }

  const onDelete = (id: string, taskId: string) => {
    console.log('onDelete', id, taskId);
    let deletedTask: CalendarProps | null = null;
    const newData = data.map((item: CalendarDataProps) => {
      if (id === item.id) {
        const newCalendars = item.calendars.filter((calendar: CalendarProps) => {
          if (calendar.taskId === taskId) {
            deletedTask = calendar;
            // 保存目前的变更列表
            // setChangeListStack([...changeListStack, cloneDeep(changeList)]);
            // 生成最新的变更列表
            handleChangeList(
              "delete",
              { ...calendar, id, user: item.user },
              null,
            );
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
    // 将变化推入操作栈中
    const change = {
      type: 'delete',
      old: { calendar: deletedTask, id },
      new: { calendar: null, id }
    }
    const newChangeStack = [...changeStack, change];
    setChangeStack(newChangeStack);
    setData(newData);
    // return ([newData,newChangeStack,deletedTask] as [CalendarDataProps[],any[],CalendarProps | null]);
  }

  const rollback = () => {
    // 回复的状态与 changeList 中对应的 item preId，preStartTime，preEndTime 相同，即changeList 删去该项
    if (changeStack.length > 0) {
      const change = changeStack.pop();
      const { type, old, new: newTask } = change;
      const { id: oldId, calendar: oldCalendar } = old;
      const { id: newId, calendar: newCalendar } = newTask;
      let newData = [] as CalendarDataProps[];
      if (type === 'change') {
        newData = data.map((item: CalendarDataProps) => {
          if (item.id === newId) {
            item.calendars.splice(
              item.calendars.findIndex((calendar: CalendarProps) => calendar.taskId === newCalendar.taskId),
              1,
              oldCalendar,
            )
          }
          return item;
        })
      } else if (type === 'delete') {
        newData = data.map((item: CalendarDataProps) => {
          if (item.id === oldId) {
            item.calendars.push(oldCalendar);
            // const index = changeList.findIndex((item: any) => item.taskId === oldCalendar.taskId);
            // const changeItem = cloneDeep(changeList[index]);
            // changeList[index] = {
            //   ...changeItem,
            //   type: 'change',
            //   afterId: oldId,
            //   afterUser: item.user,
            //   afterStartTime: oldCalendar.startTime,
            //   afterEndTime: oldCalendar.endTime,
            // };
            // if (changeItem.afterStartTime === changeItem.preStartTime && changeItem.afterEndTime === changeItem.preEndTime ){
            //   changeList.splice(index, 1);
            // }
            // setChangeList(changeList);
          }
          return item;
        })
      } else if (type === 'copy') {
        newData = data.map((item: CalendarDataProps) => {
          if (item.id === newId) {
            item.calendars = item.calendars.filter((calendar: CalendarProps) => calendar.taskId !== newCalendar.taskId);
          }
          return item;
        })
      } else if (type === 'move') {
        // 先删除 newId 的 newCalendar，再添加 oldId 的 oldCalendar
        const preChange = changeStack.pop();
        const { old } = preChange;
        const { id: preOldId, calendar: preOldCalendar } = old;
        newData = data.map((item: CalendarDataProps) => {
          if (item.id === newId) {
            item.calendars = item.calendars.filter((calendar: CalendarProps) => calendar.taskId !== newCalendar.taskId);
          }
          if (item.id === preOldId) {
            item.calendars.push(preOldCalendar);
          }
          return item;
        })
        console.log('wmx newData', newData);
        
      }
    
      const newChangeItem = changeListStack.pop();
      const index = changeList.findIndex((item: any) => item.taskId === newChangeItem.taskId);
      if (index !== -1) {
        const { changeItemType } = newChangeItem;
        if (changeItemType === 'change') {
          setChangeList([...changeList.slice(0, index), newChangeItem, ...changeList.slice(index + 1)])
        } else {
          setChangeList([...changeList.slice(0, index), ...changeList.slice(index + 1)])
        }
      }else{
        setChangeList([...changeList, newChangeItem]);
      }
      // setChangeList(newChangeList);
      // setChangeListStack([...changeListStack]);
      console.log('wmx newData', newData);
      setData(newData);
    }
  }

  const showCancelConfirm = () => {
    console.log('取消前', cloneDeep(originData));
    Modal.confirm({
      title: '您确定要取消修改吗？',
      icon: <ExclamationCircleOutlined />,
      okText: '确定',
      cancelText: '取消',
      onOk() {
        console.log('确认取消', cloneDeep(originData));
        setData(originData)
        setChangeStack([]);
        setChangeList([]);
        setEditing(false);
      },
      onCancel() {
      },
    });
  }

  // console.log("data", data); 
  return (
    <div>
      <Workcalendar
        editing={editing}
        hideNotWorkDay={hideNotWorkDay}
        columns={columns}
        data={data}
        changeData={setData}
        renderItem={(item) => {
          const { title, isRealStart, isRealEnd } = item;
          return (
            <Popover
              title={"任务详情"}
              content={
                <div>
                  <div>任务名称：{title}</div>
                </div>
              }
            >
              <div className={classname('calendar-item blue', {
                'calendar-item-notStart': !isRealStart,
                'calendar-item-notEnd': !isRealEnd,
              })}>
                <div className="calendar-item-child">{title}</div>
              </div>
            </Popover>
          )
        }}
        dayRender={(item) => {
          const { date } = item;

          return (
            <div className="calendar-day-child">
              {item.title}
              {isWeekend(date)
                ? (isSpecialWorkday(date)
                  ? <Tag color="green">{`工作日`}</Tag>
                  : <Tag color="red">双休日</Tag>)
                : (isHoliday(date)
                  ? <Tag color="red">{`节假日`}</Tag>
                  : <Tag>{getWeekday(date)}</Tag>)}
              {isToday(date) && <Tag color="blue">今天</Tag>}
            </div>
          )
        }}
        extraRight={
          <>
            <div className='work-calendar-tooltips-right-hide'>
              隐藏非工作日：
              <Switch size='small' checked={hideNotWorkDay} onChange={(checked) => {
                console.log("wmx setHideNotWorkDay", checked);
                setHideNotWorkDay(checked);
              }} />
            </div>
            <Button
              disabled={editing}
              size='small'
              type='primary'
              style={{
                marginRight: 12,
              }}
              onClick={() => {
                setOriginData(cloneDeep(data));
                setEditing(true);
              }}
            >编辑</Button>
            <Button
              disabled={!editing || !changeList.length}
              size='small'
              style={!editing || !changeList.length ? { marginRight: 12 } : {
                marginRight: 12,
                color: '#389e0d',
                borderColor: '#389e0d',
              }}
              onClick={() => {
                // setEditing(false);
                // setChangeStack([]);
                // console.log("wmx changeList", changeList);
                // setChangeList([]);
                const onOk = () => {
                  setEditing(false);
                  setChangeStack([]);
                  setChangeList([]);
                }
                saveModal.show({ open: true, changeList, onOk })
              }}
            >保存</Button>
            <Button
              disabled={!editing || !changeStack.length}
              size='small'
              // type='primary'
              danger
              style={{
                marginRight: 12,
              }}
              onClick={() => {
                rollback()
              }}
            >回退</Button>
            <Button
              disabled={!editing}
              size='small'
              type="primary"
              style={{
                marginRight: 12,
              }}
              onClick={showCancelConfirm}
            >取消</Button>
            <Button
              disabled={editing}
              size='small'
              type='primary'
              onClick={() => {
                addModal.show({ open: true, data, addTask })
              }}
            >新增</Button>
          </>
        }
        onChange={onChange}
        onMove={onMove}
        contextMenu={{
          hasCopyopy: true,
          hasDelete: true,
          onCopy,
          onDelete,
        }}
      />
      <AddModal name='work-calendar-add-modal' />
      <SaveModal name='work-calendar-save-modal' />
      {/* <section style={{ height: '500px' }}>
              <div>
                <div className="gantt-container" style={{
                  width: '800px',
                  height: '500px',
                }}>
                  <Gantt tasks={data} />
                </div>
              </div>
            </section> */}
      {/* <DragLineChart />
            <GanttChart /> */}
    </div>
  )
}

export default Testcalendar;