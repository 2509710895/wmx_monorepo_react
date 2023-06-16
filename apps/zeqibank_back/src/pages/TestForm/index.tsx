import { useEffect, useState } from "react";
import FormBuilder from "../../components/FormBuilder";
import axios from "axios";
import { Form } from "antd";

const TestForm = () => {

    const [formConfig, setFormConfig] = useState<any>({});

    const [form] = Form.useForm();

    useEffect(() => {
        axios.get('/api/getFormConfig').then((res) => {
            setFormConfig(res.data.data);
        });
    }, []);

    return (
        <div>
            <FormBuilder formConfig={formConfig} form={form} />
        </div>
    )
}

export default TestForm;