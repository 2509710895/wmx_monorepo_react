import { Form, FormInstance } from "antd";
import { memo } from "react";
import FormItemsMapper, { FormItemsMapperType } from "../FormItems";
import { getKeys } from "../../utils/object";
import FormButtons from "../FormItems/FormButtons";

export interface IFormConfig {
    form_id: string;
    config:any;
    btns?: any;
}

export interface IFormItemProps {
    form:FormInstance<any>;
    formConfig: IFormConfig,
}

const FormBuilder:React.FC<IFormItemProps> = (props) => {

    const { formConfig,form } = props;

    const { form_id, config, btns } = formConfig;

    // const [form] = Form.useForm();

    const onFinish = (values: any) => {
        console.log('Success:', values);
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <Form
            name={form_id}
            form={form}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            // initialValues={{}}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
        >
            {
                getKeys(config).map((key:string) => {
                    const item = config[key];
                    const { type, name, nullValue, controlProps = {} } = item;
                    const { deps = [], pres = [], refresh = [] } = controlProps;
                    const hasDep = deps.length > 0;
                    const hasPre = pres.length > 0;
                    const hasRefresh = refresh.length > 0;
            
                    const isShouldUpdate = hasDep || hasPre || hasRefresh;
                    const shouldUpdateFn = (prevValues: any, currentValues: any) => {
                        const depChanged = hasDep && deps.some((dep: string) => {
                            return prevValues[dep] !== currentValues[dep]
                        })
                        const preChanged = hasPre && pres.some((dep: string) => {
                            return prevValues[dep] !== currentValues[dep]
                        })
                        const refreshChanged = hasRefresh && refresh.some((dep: string) => {
                            return prevValues[dep] !== currentValues[dep]
                        })
                        return depChanged || preChanged || refreshChanged;
                    }
                    const FormItem = FormItemsMapper[type as FormItemsMapperType];
            
                    if (isShouldUpdate) {
                        return (
                            <Form.Item
                                key={name}
                                noStyle
                                shouldUpdate={shouldUpdateFn}
                            >
                                {/* 没用
                                <FormUpdateItem
                                    item={item}
                                    name={name}
                                    nullValue={nullValue}
                                    hasDep={hasDep}
                                    hasPre={hasPre}
                                    deps={deps}
                                    pres={pres}
                                    FormItem={FormItem}
                                    form={form}
                                /> */
                                }
                                {({ getFieldValue, setFieldValue }) => {
                                    // 更新时，根据依赖项，控制表单项
                                    const depValues: any = {}
                                    if (hasDep) {
                                        deps.forEach((dep: string) => {
                                            depValues[dep] = getFieldValue(dep)
                                        })
                                    }
            
                                    // 更新时 根据前置项，控制是否禁用
                                    const preValues = pres.reduce((pre: any, cur: string) => {
                                        pre.push(getFieldValue(cur))
                                        return pre;
                                    }, [])
                                    const disabled = hasPre && preValues.some((pre: any) => !pre);
                                    
                                    // 更新时重置值
                                    setFieldValue(name, nullValue)
                                    
                                    // 闭包引起报错的验证方式
                                    // const depValues: any = {}
                                    // const disabled = false;
            
                                    return (
                                        <FormItem {...item} deps={depValues} disabled={disabled} />
                                    )
                                }}
                            </Form.Item>
                            // <></>
                        )
                    }else{
                        return (
                            <FormItem key={name} {...item} />
                        )
                    }
                })
            }
            {
                btns && <FormButtons btns={btns} />
            }
        </Form>
    )
}

// const FormUpdateItem:React.FC<any> = (props) => {
//     const { item, hasDep, hasPre, deps, pres, name, nullValue, FormItem, form } = props;
//     console.log('FormUpdateItem', props);
//     const { getFieldValue, setFieldValue } = form;
//     // 更新时，根据依赖项，控制表单项
//     const depValues: any = {}
//     if (hasDep) {
//         deps.forEach((dep: string) => {
//             depValues[dep] = getFieldValue(dep)
//         })
//     }

//     // 更新时 根据前置项，控制是否禁用
//     const preValues = pres.reduce((pre: any, cur: string) => {
//         pre.push(getFieldValue(cur))
//         return pre;
//     }, [])
//     const disabled = hasPre && preValues.some((pre: any) => !pre);
    
//     // 更新时重置值
//     setFieldValue(name, nullValue)
//     // 闭包引起报错的验证方式
//     // const depValues: any = {}
//     // const disabled = false;

//     return (
//         <FormItem {...item} deps={depValues} disabled={disabled} />
//     )
// }



export default memo(FormBuilder);