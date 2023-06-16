import { useMemo, useState } from "react";

interface UseShowMoreProps<T> {
    data:T[],
    defaultShowCount?:number,
    defaultShowMore?:boolean,
}

export default function useShowMore<T>(props:UseShowMoreProps<T>){
    const {data, defaultShowCount = 10, defaultShowMore = false} = props;

    const [showMore, setShowMore] = useState(defaultShowMore);
    
    const showData:T[]= useMemo(()=>{
        return showMore ? data : data.slice(0, defaultShowCount);
    }, [showMore, data, defaultShowCount]);

    return {
        showData,
        showMore,
        setShowMore,
    }
}