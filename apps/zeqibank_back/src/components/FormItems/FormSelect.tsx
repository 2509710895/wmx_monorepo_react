import { Form, Select } from "antd";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { FormItemProps } from "antd/lib/form";
import { SelectProps } from "antd";
import axios from "axios";
import { getKeys } from "../../utils/object";
import { dealRules } from "./utils";
import { lastPromise } from "../../utils/promise";

const defaultOptions = [
    { label: "城市1", value: "1" },
    { label: "城市2", value: "2" },
    { label: "城市3", value: "3" },
];

export interface FormSelectProps extends FormItemProps {
    componentProps: FormSelectComponentProps
    deps: any
}

export interface FormSelectComponentProps extends SelectProps<any> {
    url?: string
}


const FormSelect:React.FC<FormSelectProps> = (props) => {

    const [options, setOptions] = useState<{ label: string, value: string }[]>(defaultOptions);

    const { label, name, rules=[], deps, componentProps={} }=props;

    const afterRules = dealRules(rules);

    const requestOptions = useCallback(async (url: string) => {
        const res = await axios.get(url);
        return res;
    }, [])
    
    const lastRequestOptions = useMemo(() => lastPromise(requestOptions), [requestOptions]);

    useEffect(() => {
        if(!deps) return;
        const { url } = componentProps;
        const depKeys = getKeys(deps);
        if(url){
            const urlParams = depKeys.filter((key)=>deps[key]).map((key) => {
                return `${key}=${deps[key]}`
            }).join("&");
            const requestUrl = urlParams ? `${componentProps.url}?${urlParams}` : componentProps.url;
            lastRequestOptions(requestUrl).then((res:any) => {
                setOptions(res.data.data)
            })
        }
    },[deps])

    return (
        <Form.Item
            label={label}
            name={name}
            rules={afterRules}
        >
            <Select
                style={{ width: 120 }}
                options={options}
            />
        </Form.Item>
    );
};

// export default memo(TestSelect, (prevProps, nextProps) => {
//     let flag = true; // true 表示相等
//     for (let key in prevProps) {
//         if (prevProps[key] !== nextProps[key]) {
//             console.log("不相等", prevProps[key], nextProps[key]);
//             flag = false;// false 表示不相等
//             break;
//         }
//     }
//     if(flag) console.log("相等");
//     return flag;
// })

export default memo(FormSelect);