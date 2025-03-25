import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";

function ProtectedRoute() {
    const token = Cookies.get("token");
    if (!token) {
        return <Navigate to="/admin/login" replace />; // 🔄 Redirect đến login nếu không có token
    }

    return <Outlet />; // ✅ Nếu có token, render các route con
};

export default ProtectedRoute;