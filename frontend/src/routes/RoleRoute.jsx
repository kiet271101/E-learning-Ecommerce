import { Navigate, Outlet } from "react-router-dom";

import authService from "../services/authService";

function RoleRoute({ allowedRoles }) {

    const user = authService.getCurrentUser();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (!allowedRoles.includes(user.role)) {

        return (
            <div style={{ padding: "40px" }}>
                <h1>403 - Không có quyền truy cập</h1>

                <p>
                    Bạn không có quyền truy cập trang này.
                </p>
            </div>
        );
    }

    return <Outlet />;
}

export default RoleRoute;