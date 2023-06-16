import { lazy, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AppLayout from "../../components/Layout";
import ReduxDrawer from "../../components/ReduxDrawer";
import ReduxUidDrawer from "../../components/ReduxUidDrawer";

const ProductDetailDrawer = lazy(() => import('../../components/ProductDetailDrawer'));

const AppPage = () => {

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.pathname === '/') {
            navigate('/index');
        }
    },[]);

    return (
        <>
            <AppLayout />
            <ReduxDrawer name="redux-drawer" />
            <ReduxUidDrawer name="redux-uid-drawer" />
            <ProductDetailDrawer name='product-detail-drawer' />
        </>
    );
};

export default AppPage;