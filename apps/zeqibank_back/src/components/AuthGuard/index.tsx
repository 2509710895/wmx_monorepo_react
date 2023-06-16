import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

interface AuthGuardProps {
    permission?: string;
    children: React.ReactNode;
}

const AuthGuard = ({ children, permission }: AuthGuardProps) => {
    const auth = useAuth();
    const { isAuthenticated, permissions } = auth;
    // const isAuthenticated = false;
    // const permissions = ['admin'];
    const navigate = useNavigate();

    useEffect(() => {
        // console.log('AuthGuard', 'useEffect');
        const { isAuthenticated } = auth;
        if (!isAuthenticated) {
            console.log('AuthGuard', 'not authenticated');
            navigate('/login');
        }
    },[auth]);
    
    if (!isAuthenticated) {
        return null;
    }

    if (permission && !permissions.includes(permission)) {
        return <div>没有{permission}权限，请联系管理员</div>;
    }
    
    return <>{children}</>;
};

export default AuthGuard;