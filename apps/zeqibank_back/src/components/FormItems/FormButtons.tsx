import { Form, Button } from "antd";
import { memo } from "react";

interface IFormButtonsProps {
    btns: {
        submitText?: string;
        resetText?: string;
    }
}

const FormButtons:React.FC<IFormButtonsProps> = (props) => {

    const { btns } = props;
    const { submitText, resetText } = btns;

    return (
        <Form.Item  wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
                { submitText ? submitText : `提交`}
            </Button>
            <Button htmlType="button" onClick={() => {}}>
                { resetText ? resetText : `重置`}
            </Button>
        </Form.Item>
    );
};

export default memo(FormButtons);