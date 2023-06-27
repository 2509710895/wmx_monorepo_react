import { Modal, Row, Table, Tag } from 'antd';
import { FC, memo, useEffect } from 'react';
import useModal from '../../../hooks/useModal';
import { useForm } from 'antd/es/form/Form';
import dayjs from 'dayjs';
// import 'dayjs/locale/zh-cn';
// import locale from 'antd/es/date-picker/locale/zh_CN';

export interface saveModalProps {
}

const saveModal: FC<{ name: string }> = (props) => {

    const {
        name
    } = props;

    const modal = useModal(name);

    const {
        changeList,
        onOk: onSave,
        open,
        close
    } = modal;

    useEffect(() => {
        if (open) {
            console.log("wmx modal",changeList);
        }
    }, [open]);

    const columns = [
        {
            title: '任务名称',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: '任务ID',
            dataIndex: 'taskId',
            key: 'taskId',
        },
        {
            title: '操作类型',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: '用户变更',
            key: 'user',
            render: ( _:any, record:any) => {
                return (
                    <>
                        <Tag>变更前</Tag>
                        <Row>
                            {record.preUser}
                        </Row>
                        <Tag>变更后</Tag>
                        <Row>
                            {record.afterUser}
                        </Row>
                    </>
                )
            },
        },
        {
            title: '时间变更',
            key: 'time',
            render: ( _:any, record:any) => {
                return (
                    <>
                        <Tag>变更前</Tag>
                        <Row>
                            {record.preStartTime} - {record.preEndTime}
                        </Row>
                        <Tag>变更后</Tag>
                        <Row>
                            {record.afterStartTime} - {record.afterEndTime}
                        </Row>
                    </>
                )
            },
        },
    ];

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
            title={`任务变更`}
            open={open}
            width={800}
            onOk={() => {
                onSave();
                close();
            }}
            onCancel={() => {
                close();
            }}
        >
            <Table columns={columns} dataSource={changeList} rowKey={(record)=>record.taskId}  />
        </Modal>
    );
}

export default memo(saveModal);
