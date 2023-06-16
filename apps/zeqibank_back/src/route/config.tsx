import { lazy, Suspense } from "react";
import { Navigate, RouteObject } from "react-router-dom";
import AuthGuard from "../components/AuthGuard";
import AppPage from "../pages/AppPage";
import LoginPage from "../pages/LoginPage";

// const AppPage = lazy(() => import('../pages/AppPage'));
const IndexPage = lazy(() => import('../pages/Index'));

const ProductList = lazy(() => import('../pages/ProductList'));

const TestForm = lazy(() => import('../pages/TestForm'));
const TestCalendar = lazy(() => import('../pages/TestCalendar'));
const TestDrawer = lazy(() => import('../pages/TestDrawer'));
const TestTable = lazy(() => import('../pages/TestTable'));
const AuthPage = lazy(() => import('../pages/AuthPage'));

export const RouteConfig: RouteObject[] = [
    {
        path: '/',
        element: (
            <AuthGuard>
                {/* <Suspense fallback={<div>Loading...</div>}> */}
                    <AppPage />
                {/* </Suspense> */}
            </AuthGuard>
        ),
        children: [
            {
                path: 'index',
                element: (
                    <AuthGuard>
                        <Suspense fallback={<div>Loading...</div>}>
                            <IndexPage />
                        </Suspense>
                    </AuthGuard>
                ),
                children: [
                    // children 的意思是需要用到父组件的一些内容，在父组件中使用 <Outlet /> 来渲染子组件
                ]
            },
            {
                path: 'test',
                element: <Navigate to="/test/components/calendar" />,
            },
            {
                path: 'test/components/calendar',
                element: (
                    <AuthGuard>
                        <Suspense fallback={<div>Loading...</div>}>
                            <TestCalendar />
                        </Suspense>
                    </AuthGuard>
                )
            },
            {
                path: 'test/components/drawer',
                element: (
                    <AuthGuard>
                        <Suspense fallback={<div>Loading...</div>}>
                            <TestDrawer />
                        </Suspense>
                    </AuthGuard>
                )
            },
            {
                path: 'test/components/form',
                element: (
                    <AuthGuard>
                        <Suspense fallback={<div>Loading...</div>}>
                            <TestForm />
                        </Suspense>
                    </AuthGuard>
                )
            },
            {
                path: 'test/components/table',
                element: (
                    <AuthGuard>
                        <Suspense fallback={<div>Loading...</div>}>
                            <TestTable />
                        </Suspense>
                    </AuthGuard>
                )
            },
            {
                path: 'test/auth/admin',
                element: (
                    <AuthGuard permission="admin">
                        <Suspense fallback={<div>Loading...</div>}>
                            <AuthPage />
                        </Suspense>
                    </AuthGuard>
                )
            },
            {
                path: 'business',
                element: <Navigate to="/business/product/list" />,
            },
            {
                path: 'business/product/list',
                element: (
                    <AuthGuard>
                        <Suspense fallback={<div>Loading...</div>}>
                            <ProductList />
                        </Suspense>
                    </AuthGuard>
                ),
            },
            {
                path: 'business/product/detail',
                element: <div>产品详情</div>,
            },
            {
                path: 'business/order/list',
                element: <div>订单列表</div>,
            },
        ]
    },
    {
        path: '/login',
        element: <LoginPage />,
    },
    {
        path: '*',
        element: <div>404</div>,
    }
]

export interface LinkConfigObject {
    key: string,
    label: string,
    path: string,
    children?: LinkConfigObject[]
}

export const LinkConfig: LinkConfigObject[] = [
    {
        key: 'index',
        label: '首页',
        path: '/index',
        children: []
    },
    {
        key: 'business',
        label: '业务',
        path: '/business',
        children: [
            {
                key: 'business-product',
                label: '产品',
                path: '/business/product',
                children: [
                    {
                        key: 'business-product-list',
                        label: '产品列表',
                        path: '/business/product/list',
                    }
                ]
            },
            {
                key: 'business-order',
                label: '订单',
                path: '/business/order',
                children: [
                    {
                        key: 'business-order-list',
                        label: '订单列表',
                        path: '/business/order/list',
                    },
                ]
            }
        ]
    },
    {
        key: 'test',
        label: '测试',
        path: '/test',
        children: [
            {
                key: 'test-compoents',
                label: '测试组件',
                path: '/test/components',
                children: [
                    {
                        key: 'test-compoents-calendar',
                        label: '测试日历',
                        path: '/test/components/calendar',
                    },
                    {
                        key: 'test-compoents-drawer',
                        label: '测试抽屉',
                        path: '/test/components/drawer',
                    },
                    {
                        key: 'test-compoents-form',
                        label: '测试表单',
                        path: '/test/components/form',
                    },
                    {
                        key: 'test-compoents-table',
                        label: '测试表格',
                        path: '/test/components/table',
                    },
                ]
            },
            {
                key: 'test-auth',
                label: '测试权限',
                path: '/test/auth',
                children: [
                    {
                        key: 'test-auth-admin',
                        label: '测试权限页面',
                        path: '/test/auth/admin',
                    },
                ]
            }
        ]
    }
]