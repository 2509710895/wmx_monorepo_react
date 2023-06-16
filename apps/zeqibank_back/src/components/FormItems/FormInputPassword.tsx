import { Form, Input } from "antd";
import { memo } from "react";
import { FormItemProps } from "antd/lib/form";
import { InputProps } from "antd";
import { dealRules } from "./utils";

export interface FormInputPasswordProps extends FormItemProps {
    componentProps: FormInputPasswordComponentProps
}

export interface FormInputPasswordComponentProps extends InputProps {
    
}

const FormInputPassword:React.FC<FormInputPasswordProps> = (props) => {

    const { label, name, rules=[], componentProps }=props;

    const afterRules = dealRules(rules);
    
    return (
        <Form.Item
            label={label}
            name={name}
            rules={afterRules}
        >
            <Input.Password {...componentProps} />
        </Form.Item>
    );
};

export default memo(FormInputPassword);