import { useState } from "react";

import Workcalendar from "../../components/WorkCalendar";
import { classname } from "../../utils/classname";
// import Gantt from "../../components/Gantt";

// import DragLineChart from "../../components/Charts/DragLineChart";
// import GanttChart from "../../components/Charts/GanttChart";

import './index.less';
import { getWeekday, isHoliday, isSpecialWorkday, isToday, isWeekend } from "../../components/WorkCalendar/utils";
import { Tag } from "antd";

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

    // console.log("data", data); 
    return (
        <div>
            <Workcalendar 
              columns={columns}
              data={data}
              changeData={setData}
              renderItem={(item) => {
                const { title, isRealStart, isRealEnd } = item;
                return (
                  <div className={classname('calendar-item blue',{
                    'calendar-item-notStart': !isRealStart,
                    'calendar-item-notEnd': !isRealEnd,
                  })}>
                    <div className="calendar-item-child">{title}</div>
                  </div>
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
            />
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