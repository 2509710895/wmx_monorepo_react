
## 全局调用 Drawer

使用 redux 全局管理状态
{
    "drawer-name":{
        open,
        ....
    },
    "another-drawer-name":{
        open,
        ...
    }
}

const initState={}

const DrawerReducer = (state=initState,action){
    switch (action.type) {
        case "show-drawer" :
            const {name,props} = action
            return {
                ...state,
                [name]:{...props}
            }
        case "hide-drawer" :
            const {name} = action
            delete state[name]
            return {
                ...state
            }
        case "set-drawer-props" :
            const { name, props } = action
            return {
                ...state,
                [name]:{...state[name],...props}
            }
    }
}

const showDrawer=(name,props)=>{
    return {
        type:"show-drawer",
        data:{
            name,
            props
        }
    }
}

const hideDrawer=(name)=>{
    return {
        type:"hide-drawer",
        data:{
            name
        }
    }
}

const setDrawerProps=(name,props){
    return {
        type:"set-drawer-props",
        data:{
            name,
            props
        }
    }
}

# 表单渲染器
{
    username:{
        label:"用户名",
        component:"input",
        rules:[
            { required: true, message: 'Please input your username!' },
            { min: 4, message: '最少4位' },
        ]
    },
    password:{
        label:"密码",
        component:"password",
        rules:[
            { required: true, message: 'Please input your username!' },
            {
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/,
                message: '必须包含大写字母、小写字母、数字 至少8-16位',
            },
        ]
    },
    province:{
        label:"省份",
        component:"select",
    },
    city:{
        label:"城市",
        Component:"select",
    }
}
