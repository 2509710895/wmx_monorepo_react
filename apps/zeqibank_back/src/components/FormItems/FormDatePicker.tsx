import { DatePicker, Form } from 'antd';
import { Rule } from 'antd/lib/form';
import { DatePickerProps } from 'antd/lib/date-picker';
import { dealRules } from './utils';
import { useEffect } from 'react';

interface FormDatePickerProps {
    label: string
    name: string
    rules?: Rule[]
    deps?: any
    componentProps?: DatePickerProps
}

const FormDatePicker: React.FC<FormDatePickerProps> = (props) => {

    const { label, name, rules = [], deps, componentProps = {} } = props;

    const afterRules = dealRules(rules);

    useEffect(() => {
        if (!deps) return;
        console.log("wmx FormDatePicker deps", deps);
    }, [deps])

    return (
        <Form.Item
            label={label}
            name={name}
            rules={afterRules}
        >
            <DatePicker {...componentProps} />
        </Form.Item>
    );
}

export default FormDatePicker;