import { Form, Input } from "antd";
import { memo } from "react";
import { FormItemProps } from "antd/lib/form";
import { InputProps } from "antd";
import { dealRules } from "./utils";

export interface FormInputProps extends FormItemProps {
    componentProps: FormInputComponentProps
}

export interface FormInputComponentProps extends InputProps {
    
}

const FormInput:React.FC<FormInputProps> = (props) => {

    const { label, name, rules=[], componentProps }=props;

    const afterRules = dealRules(rules);

    return (
        <Form.Item
            label={label}
            name={name}
            rules={afterRules}
        >
            <Input {...componentProps} />
        </Form.Item>
    );
};

export default memo(FormInput);