const mockjs = require("mockjs");

// 用户列表
const userList = mockjs.mock({
    "data|100":[{
        name:"@cname",//随机生成中文名字
        ename:"@first",//随机生成英文名字
        "id|+1":1,//id从1开始，每次加1
        time:"@datetime",//随机生成时间
    }]
})

const getUser = {
    methods: "get",
    url:"/api/getUser",
    response:({body})=>{
        // body 是请求体
        return {
            code:200,
            msg:"success",
            data:userList.data,
        }
    }
}
// 用户列表
// 表单配置
const formConfig = {
    form_id:"login_form",
    config:{
        username:{
            name:"username",
            label:"用户名",
            type:"input",
            nullValue:"",// 空值
            rules:[
                { required: true, message: '请输入您的用户名！' },
                { min: 4, message: '最少4位' },
            ],
            componentProps:{
                placeholder:"请输入用户名",
            },
        },
        password:{
            name:"password",
            label:"密码",
            type:"password",
            nullValue:"",// 空值
            rules:[
                { required: true, message: '请输入您的密码！' },
                {
                    pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[\\da-zA-Z]{8,16}$",
                    message: '必须包含至少8-16位的大写字母、小写字母、数字',
                },
            ],
            componentProps:{
                placeholder:"请输入密码",
            },
            controlProps:{
                pres:["username"], // 组件中的数据前置的字段 选了才能选
            }
        },
        province:{
            name:"province",
            label:"省份",
            type:"select",
            nullValue:"",// 空值
            componentProps:{
                url:"/api/getProvince",
            }
        },
        city:{
            name:"city",
            label:"城市",
            type:"select",
            nullValue:"",// 空值
            componentProps:{    
                url:"/api/getCity",// 完整url /api/getCity?province=xx
            },
            controlProps:{
                deps:["province"],// 组件中的数据依赖的字段
                // pres:["province"], // 组件中的数据前置的字段 选了才能选
                // refresh:["province"],
            }
        }
    },
    btns: {
        submitText: "保存",
        resetText: "重置",
    }
}
const provinceList = [
    {
        label:"北京",
        value:"beijing",
    },
    {
        label:"上海",
        value:"shanghai",
    },
]
const cityList = {
    beijing:[
        {
            label:"朝阳区",
            value:"chaoyang",
        },
        {
            label:"海淀区",
            value:"haidian",
        },
    ],
    shanghai:[
        {
            label:"浦东新区",
            value:"pudong",
        },
        {
            label:"黄浦区",
            value:"huangpu",
        },
    ]
}

const getFormConfig =  {
    methods: "get",
    url:"/api/getFormConfig",
    response:({body})=>{
        return {
            code:200,
            mag:"success",
            data:formConfig,
        }
    }
}
const getProvince = {
    methods: "get",
    url:"/api/getProvince",
    response:({body})=>{
        return {
            code:200,
            mag:"success",
            data:provinceList,
        }
    }
}
const getCity = {
    methods: "get",
    url:"/api/getCity",
    response:(req,res)=>{
        // console.log(req);
        // 转换 query 参数
        const {province} = req.query;
        return {
            code:200,
            mag:"success",
            data:cityList[province],
        }
    }
}
// 表单配置
// 表格配置
const tableData = [
    {
        id: 1,
        productName: '产品1',
        startTime: '2020-12-12 12:12:12',
        endTime: '2020-12-12 12:12:12',
        buyed: 94,
        amount: 100,
    },
    {
        id: 2,
        productName: '产品2',
        startTime: '2020-12-12 12:12:12',
        endTime: '2020-12-12 12:12:12',
        buyed: 94,
        amount: 100,
    },
    {
        id: 3,
        productName: '产品3',
        startTime: '2020-12-12 12:12:12',
        endTime: '2020-12-12 12:12:12',
        buyed: 94,
        amount: 100,
    },
]

const getTableData = {
    methods: "get",
    url:"/api/getTableData",
    response:({body})=>{
        return {
            code:200,
            mag:"success",
            data:tableData,
        }
    }
}

const columns = [
    {
        title: '产品名称',
        dataIndex: 'productName',
        key: 'productName',
        cell:'productName'
    },
    {
        title: '秒杀开始时间',
        dataIndex: 'startTime',
        key: 'startTime',
    },
    {
        title: '秒杀结束时间',
        dataIndex: 'endTime',
        key: 'endTime',
    },
    {
        title: '已售',
        dataIndex: 'buyed',
        key: 'buyed',
        cell:'buyed'
    }
];

const getTableColumns = {
    methods: "get",
    url:"/api/getTableColumns",
    response:({body})=>{
        return {
            code:200,
            mag:"success",
            data:columns,
        }
    }
}

// 表格配置
module.exports=[
    getUser,
    getFormConfig,
    getProvince,
    getCity,
    getTableData,
    getTableColumns,
]