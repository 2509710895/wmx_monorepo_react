import { lazy } from "react";
import "./index.less"

// import FormInput from "./FormInput";
// 输入框
const FormInput = lazy(() => import("./FormInput"));
// 密码框
const FormInputPassword = lazy(() => import("./FormInputPassword"));
// 下拉框选择器
const FormSelect = lazy(() => import("./FormSelect"));
// 日期选择器


const FormItemsMapper = {
    "input":FormInput,
    "password":FormInputPassword,
    "select":FormSelect,
};

export type FormItemsMapperType = keyof typeof FormItemsMapper;

// function FormItemMapper(type: keyof typeof FormItemsMapper) {
//     return FormItemsMapper[type];
// }

export default FormItemsMapper;