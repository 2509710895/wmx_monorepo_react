import dayjs from "dayjs";
import { Holiday, SpecialWorkdays } from "./constants";

// 判断非工作日： 节假日 或 周六、周日且不是调休日
export const isNotWorkDay = (date: string | dayjs.Dayjs,) => {
    const day = dayjs(date);
    const isWeekend = day.day() === 6 || day.day() === 0;
    const isHoliday = Holiday[day.format("YYYY-MM-DD")];
    const isSpecialWorkday = SpecialWorkdays[day.format("YYYY-MM-DD")];
    return isHoliday || (isWeekend && !isSpecialWorkday);
}
// 判断是否是周末
export const isWeekend = (date: string | dayjs.Dayjs,) => {
    const day = dayjs(date);
    return day.day() === 6 || day.day() === 0;
}
// 判断是否是节假日
export const isHoliday = (date: string | dayjs.Dayjs,) => {
    const day = dayjs(date);
    return Holiday[day.format("YYYY-MM-DD")];
}
// 判断是否是调休日
export const isSpecialWorkday = (date: string | dayjs.Dayjs,) => {
    const day = dayjs(date);
    return SpecialWorkdays[day.format("YYYY-MM-DD")];
}
// 判断是否是今天
export const isToday = (date: string | dayjs.Dayjs,) => {
    const day = dayjs(date);
    return day.isSame(dayjs(), "day");
}
// 返回星期几
export const getWeekday = (date: string | dayjs.Dayjs,) => {
    const day = dayjs(date);
    const weekday = day.day();
    const weekdayMap = ["日", "一", "二", "三", "四", "五", "六"];
    return `星期${weekdayMap[weekday]}`;
}