import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

function ProtectedRoute() {
    const loginUser = useSelector((state) => state.user);
    const location = useLocation();

    if (!loginUser?.userid) {
        return <Navigate to="/memberLogin" replace state={{ from: location.pathname }} />;
    }

    return <Outlet />;
}

export default ProtectedRoute;
