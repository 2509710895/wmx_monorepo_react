import { Button, DatePicker, Form, Input, Modal, Select, TimePicker } from 'antd';
import { FC, memo, useEffect } from 'react';
import useModal from '../../../hooks/useModal';
import { useForm } from 'antd/es/form/Form';
import dayjs from 'dayjs';
// import 'dayjs/locale/zh-cn';
// import locale from 'antd/es/date-picker/locale/zh_CN';

export interface AddModalProps {
}

const AddModal: FC<{ name: string }> = (props) => {

    const {
        name
    } = props;

    const modal = useModal(name);

    const {
        data,
        addTask,
        open,
        close
    } = modal;

    const options = open && data.map((item: { user: any; id: any; }) => {
        return {
            label: item.user,
            value: item.id
        }
    });

    useEffect(() => {
        if (open) {
            console.log("wmx modal",data);
        }
    }, [open]);

    const [form] = useForm();

    const formConfig = {
        form_id:"login_form",
        config:{

        },
        btns: {
            submitText: "新增",
            resetText: "重置",
        }
    }

    return (
        <Modal
            title={`新增任务`}
            open={open}
            // width={800}
            onOk={() => {
                close();
            }}
            onCancel={() => {
                close();
            }}
            footer={null}
        >
            {/* <FormBuilder formConfig={formConfig} form={form} /> */}
            <Form
                // labelCol={{ span: 8 }}
                // wrapperCol={{ span: 16 }}
                layout='vertical'
                onFinish={(values) => {
                    //{ taskId: '6', title: '任务六', startTime: '2023-05-06', endTime: '2023-05-06' },
                    const { title, user, task_time:[startTime, endTime] } = values;
                    // console.log("wmx values",title,user,startTime.format("YYYY-MM-DD"),endTime.format("YYYY-MM-DD"));
                    addTask(user,{
                        taskId: `add_${dayjs().valueOf()}`, 
                        title,
                        startTime:startTime.format("YYYY-MM-DD"),
                        endTime:endTime.format("YYYY-MM-DD") 
                    })
                    close();
                }}

            >
                <Form.Item
                    label="任务名称"
                    name="title"
                    rules={[{ required: true, message: '请输入任务名称' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="用户"
                    name="user"
                    rules={[{ required: true, message: '请输入用户' }]}
                >
                    <Select options={options} />
                </Form.Item>
                <Form.Item
                    label="任务时间"
                    name="task_time"
                    rules={[{ required: true, message: '请输入任务时间' }]}
                >
                    <DatePicker.RangePicker showTime />
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" htmlType="submit" style={{marginRight: "12px"}}>
                        {`新增`}
                    </Button>
                    <Button onClick={() => {close()}}>
                        {`取消`}
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default memo(AddModal);
